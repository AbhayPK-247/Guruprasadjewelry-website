import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  category?: string;
  weight?: number;
  karat?: string;
  making_charges?: number;
  rate?: number;
}

const calculatePrice = (rate: number, weight: number, making_charges: number, karat?: string): number => {
  let karatFactor = 1.0;
  if (karat) {
    switch (karat) {
      case "24K": karatFactor = 1.0; break;
      case "22K": karatFactor = 0.916; break;
      case "18K": karatFactor = 0.75; break;
      case "14K": karatFactor = 0.583; break;
    }
  }
  return (weight * rate * karatFactor) + making_charges;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'> & { category: string }) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    setTotalItems(cartItems.reduce((acc, item) => acc + item.quantity, 0));
    setTotalPrice(cartItems.reduce((acc, item) => acc + item.price, 0));
  }, [cartItems]);

  useEffect(() => {
    const { data: authSubscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setCartItems([]);
      } else if (event === 'SIGNED_IN') {
        fetchCartItems();
      }
    });
    return () => {
      authSubscription.subscription.unsubscribe();
    };
  }, []);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCartItems([]);
        return;
      }

      const { data, error } = await supabase
        .from('cart')
        .select(`
          id,
          product_id,
          quantity,
          jewellery_items (
            id,
            name,
            image_url,
            weight,
            making_charges,
            karat,
            category,
            rate
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cart: CartItem[] = (data || []).map((item: any) => {
        const product = item.jewellery_items;
        const price = calculatePrice(
          0,
          product?.weight || 0,
          product?.making_charges || 0,
          product?.karat
        );
        return {
          id: item.id,
          product_id: item.product_id,
          name: product?.name || 'Unknown',
          image: product?.image_url || '',
          quantity: item.quantity,
          price: price * item.quantity, // quantity-multiplied price
          category: product?.category,
          weight: product?.weight,
          karat: product?.karat,
          making_charges: product?.making_charges || 0,
          rate: product?.rate,
        };
      });

      setCartItems(cart);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (item: Omit<CartItem, 'id' | 'quantity' | 'category'> & { category: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please login",
          description: "You need to be logged in to add to cart",
          variant: "destructive",
        });
        return;
      }

      const existingCartItem = cartItems.find((i) => i.product_id === item.product_id);

      if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + 1;
        const unitPrice = calculatePrice(
          0,
          existingCartItem.weight || 0,
          existingCartItem.making_charges || 0,
          existingCartItem.karat
        );
        const newPrice = unitPrice * newQuantity;
        const { error } = await supabase.from('cart').update({ quantity: newQuantity }).eq('id', existingCartItem.id);
        if (error) throw error;
        setCartItems((prevItems) =>
          prevItems.map((i) =>
            i.product_id === item.product_id ? { ...i, quantity: newQuantity, price: newPrice } : i
          )
        );
      } else {
        const { data, error } = await supabase
          .from('cart')
          .insert({
            user_id: user.id,
            product_id: item.product_id,
            quantity: 1,
          })
          .select(`
            id,
            product_id,
            quantity,
            jewellery_items (
              id,
              name,
              image_url,
              rate,
              weight,
              making_charges,
              karat,
              category
            )
          `)
          .single();

        if (error) throw error;

        const product = data.jewellery_items as any;
        const unitPrice = calculatePrice(
          product?.rate || 0,
          product?.weight || 0,
          product?.making_charges || 0,
          product?.karat
        );

        const newCartItem: CartItem = {
          id: data.id,
          product_id: item.product_id,
          name: product?.name || item.name,
          image: product?.image_url || item.image,
          quantity: 1,
          price: unitPrice,
          category: product?.category || item.category,
          weight: product?.weight,
          karat: product?.karat,
          making_charges: product?.making_charges || 0,
          rate: product?.rate,
        };

        setCartItems((prevItems) => [...prevItems, newCartItem]);
      }

      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cartItemData, error: fetchError } = await supabase
        .from('cart')
        .select('quantity, jewellery_items(rate, weight, making_charges, karat)')
        .eq('id', itemId)
        .limit(1)
        .single();


      if (fetchError) throw fetchError;

      const removedQuantity = cartItemData?.quantity || 0;
      const product = cartItemData?.jewellery_items as any;
      const removedUnitPrice = calculatePrice(
        0,
        product?.weight ?? 0,
        product?.making_charges ?? 0,
        product?.karat
      );
      const removedItemPrice = removedUnitPrice * removedQuantity;

      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id)
        .eq('id', itemId);

      if (error) throw error;

      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      setTotalItems((prevTotalItems) => prevTotalItems - removedQuantity);
      setTotalPrice((prevTotalPrice) => prevTotalPrice - removedItemPrice);

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === itemId) {
            const newPrice = calculatePrice(
              0,
              item.weight || 0,
              item.making_charges || 0,
              item.karat
            ) * quantity;
            return { ...item, quantity, price: newPrice };
          }
          return item;
        })
      );

      setTotalPrice((prevTotalPrice) => {
        const updatedItem = cartItems.find((item) => item.id === itemId);
        if (updatedItem) {
          const oldPrice = updatedItem.price;
          const newPrice = calculatePrice(
            0,
            updatedItem.weight || 0,
            updatedItem.making_charges || 0,
            updatedItem.karat
          ) * quantity;
          return prevTotalPrice - oldPrice + newPrice;
        }
        return prevTotalPrice;
      });

      setTotalItems((prevTotalItems) => {
        const updatedItem = cartItems.find((item) => item.id === itemId);
        if (updatedItem) {
          return prevTotalItems + (quantity - updatedItem.quantity);
        }
        return prevTotalItems;
      });

      toast({
        title: "Cart updated",
        description: "Cart has been updated",
      });
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
      setTotalItems(0);
      setTotalPrice(0);

      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      isLoading,
      totalItems,
      totalPrice,
      updateQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

