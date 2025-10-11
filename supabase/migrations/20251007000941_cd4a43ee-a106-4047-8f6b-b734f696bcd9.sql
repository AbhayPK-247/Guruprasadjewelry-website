-- Fix search path for calculate_jewellery_price function
CREATE OR REPLACE FUNCTION public.calculate_jewellery_price(
  weight DECIMAL,
  rate DECIMAL,
  karat TEXT,
  making_charges DECIMAL
)
RETURNS DECIMAL
LANGUAGE plpgsql
IMMUTABLE
SECURITY INVOKER
SET search_path = ''
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