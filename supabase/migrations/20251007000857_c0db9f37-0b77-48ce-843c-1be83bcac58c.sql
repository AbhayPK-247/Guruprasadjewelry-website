-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create jewellery_items table
CREATE TABLE public.jewellery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Gold', 'Silver', 'Diamond', 'Gemstone', 'Bridal', 'New Arrival')),
  karat TEXT,
  weight DECIMAL(10, 2) NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  making_charges DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on jewellery_items
ALTER TABLE public.jewellery_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for jewellery_items
CREATE POLICY "Anyone can view jewellery items"
  ON public.jewellery_items
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert jewellery items"
  ON public.jewellery_items
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update jewellery items"
  ON public.jewellery_items
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete jewellery items"
  ON public.jewellery_items
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Storage policies for product images
CREATE POLICY "Anyone can view product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update product images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'product-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete product images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'product-images' AND
    public.has_role(auth.uid(), 'admin')
  );

-- Create storage bucket for hero/banner images
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true);

-- Storage policies for hero images
CREATE POLICY "Anyone can view hero images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'hero-images');

CREATE POLICY "Admins can upload hero images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'hero-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update hero images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'hero-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete hero images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'hero-images' AND
    public.has_role(auth.uid(), 'admin')
  );

-- Create function to calculate final price
CREATE OR REPLACE FUNCTION public.calculate_jewellery_price(
  weight DECIMAL,
  rate DECIMAL,
  karat TEXT,
  making_charges DECIMAL
)
RETURNS DECIMAL
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  karat_factor DECIMAL;
BEGIN
  -- Calculate karat factor
  CASE karat
    WHEN '24K' THEN karat_factor := 1.0;
    WHEN '22K' THEN karat_factor := 0.916;
    WHEN '18K' THEN karat_factor := 0.75;
    WHEN '14K' THEN karat_factor := 0.583;
    ELSE karat_factor := 1.0;
  END CASE;
  
  -- Calculate final price: (Weight × Rate × KaratFactor) + MakingCharges
  RETURN ROUND((weight * rate * karat_factor) + making_charges, 2);
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_jewellery_items_updated_at
  BEFORE UPDATE ON public.jewellery_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();