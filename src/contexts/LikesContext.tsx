import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface LikedItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

interface LikesContextType {
  likedItems: LikedItem[];
  toggleLike: (item: Omit<LikedItem, 'id'>) => Promise<void>;
  isLiked: (productId: string) => boolean;
  clearLikes: () => Promise<void>;
  isLoading: boolean;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

// Helper function to calculate price
const calculatePrice = (rate: number, weight: number, making_charges: number, karat?: string): number => {
  let karatFactor = 1.0;

  if (karat) {
    switch (karat) {
      case "24K":
        karatFactor = 1.0;
        break;
      case "22K":
        karatFactor = 0.916;
        break;
      case "18K":
        karatFactor = 0.75;
        break;
      case "14K":
        karatFactor = 0.583;
        break;
    }
  }

  return (weight * rate * karatFactor) + making_charges;
};

export const LikesProvider = ({ children }: { children: ReactNode }) => {
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLikedItems();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const { data: authSubscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setLikedItems([]); // Clear favorites on logout
      } else if (event === 'SIGNED_IN') {
        fetchLikedItems(); // Reload favorites on login
      }
    });

    return () => {
      authSubscription.subscription.unsubscribe();
    };
  }, []);

  const fetchLikedItems = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLikedItems([]);
        return;
      }

      let query = supabase
        .from('favorites')
        .select(`
          id,
          product_id,
          jewellery_items (
            id,
            name,
            image_url,
            category,
            rate,
            weight,
            making_charges,
            karat
          )
        `)
        .eq('user_id', user.id);

      const { data, error } = await query;

      if (error) throw error;

      const favorites: LikedItem[] = (data || []).map((item: any) => {
        const product = item.jewellery_items;
        const calculatedPrice = calculatePrice(
          product?.rate || 0,
          product?.weight || 0,
          product?.making_charges || 0,
          product?.karat
        );

        return {
          id: item.id,
          product_id: item.product_id,
          name: product?.name || 'Unknown',
          price: calculatedPrice,
          image: product?.image_url || '',
          category: product?.category || 'Unknown',
        };
      });

      setLikedItems(favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = async (item: Omit<LikedItem, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Please login",
          description: "You need to be logged in to add favorites",
          variant: "destructive",
        });
        return;
      }

      const isAlreadyLiked = likedItems.some((i) => i.product_id === item.product_id);

      if (isAlreadyLiked) {
        const favoriteItem = likedItems.find((i) => i.product_id === item.product_id);

        if (favoriteItem) {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('id', favoriteItem.id);

          if (error) throw error;

          // Decrement likes count in jewellery_items table
          const { data: itemData, error: fetchError } = await supabase
            .from('jewellery_items')
            .select('likes')
            .eq('id', item.product_id)
            .single();

          if (fetchError) throw fetchError;

          const currentLikes = itemData?.likes || 0;

          const { error: updateError } = await supabase
            .from('jewellery_items')
            .update({ likes: currentLikes - 1 })
            .eq('id', item.product_id);

          if (updateError) throw updateError;

          setLikedItems((prevItems) => prevItems.filter((i) => i.product_id !== item.product_id));

          toast({
            title: "Removed from favorites",
            description: `${item.name} has been removed from favorites`,
          });
        }
      } else {
        const { data, error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: item.product_id,
          })
          .select(`
            id,
            product_id,
            jewellery_items (
              id,
              name,
              image_url,
              category,
              rate,
              weight,
              making_charges,
              karat
            )
          `)
          .single();

        if (error) throw error;

        // Increment likes count in jewellery_items table
        const { data: itemData, error: fetchError } = await supabase
          .from('jewellery_items')
          .select('likes')
          .eq('id', item.product_id)
          .single();

        if (fetchError) throw fetchError;

        const currentLikes = itemData?.likes || 0;

        const { error: updateError } = await supabase
          .from('jewellery_items')
          .update({ likes: currentLikes + 1 })
          .eq('id', item.product_id);

        if (updateError) throw updateError;

        const product = data.jewellery_items as any;
        const calculatedPrice = calculatePrice(
          product?.rate || 0,
          product?.weight || 0,
          product?.making_charges || 0,
          product?.karat
        );

        const newFavorite: LikedItem = {
          id: data.id,
          product_id: item.product_id,
          name: product?.name || item.name,
          price: calculatedPrice,
          image: product?.image_url || item.image,
          category: product?.category || item.category,
        };

        setLikedItems((prevItems) => [...prevItems, newFavorite]);

        toast({
          title: "Added to favorites ❤️",
          description: `${item.name} has been added to favorites`,
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  const isLiked = (productId: string) => {
    return likedItems.some((item) => item.product_id === productId);
  };

  const clearLikes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setLikedItems([]);

      toast({
        title: "Favorites cleared",
        description: "All favorites have been removed",
      });
    } catch (error) {
      console.error('Error clearing favorites:', error);
      toast({
        title: "Error",
        description: "Failed to clear favorites",
        variant: "destructive",
      });
    }
  };

  return (
    <LikesContext.Provider value={{ likedItems, toggleLike, isLiked, clearLikes, isLoading }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error('useLikes must be used within LikesProvider');
  }
  return context;
};
