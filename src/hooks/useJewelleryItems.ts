import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface JewelleryItem {
  id: string;
  metal?: string;
  name: string;
  category: string;
  type?: string;
  clarity?: string | null;
  cut?: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Brilliant' | 'Emerald' | 'Princess' | 'Oval' | 'Pear' | null;
  karat?: string | null;
  weight: number;
  rate: number;
  making_charges: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  purity?: '92.5% Sterling Silver' | '99.9% Fine Silver' | null;
  gender?: string | null;
  occasion?: string | null;
  gemstone_type?: 'Ruby' | 'Emerald' | 'Sapphire' | 'Topaz' | 'Amethyst' | 'Pearl' | 'Opal' | null;
  carat_weight?: number | null;
  offers?: {
    product_id: string;
    discount_percent: number;
    discounted_making_charges: number;
  } | null;
}

export const useJewelleryItems = (
  category?: string,
  filters?: Partial<JewelleryItem>
) => {
  const [items, setItems] = useState<JewelleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalRates, setGlobalRates] = useState<{ [key: string]: number }>({
    Gold: 6000,
    Diamond: 75000,
    Silver: 80,
    Gemstone: 1500,
  });

  const filterString = useMemo(() => {
    return filters ? JSON.stringify(filters) : '';
  }, [filters]);

  useEffect(() => {
    fetchGlobalRates();
    fetchItems();
  }, [category, filterString]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("jewellery_items")
        .select(`
          *,
          offers (
            product_id,
            discount_percent,
            discounted_making_charges
          )
        `)
        .order("created_at", { ascending: false });

      if (category && category !== "All Jewellery") {
        query = query.eq("category", category);
      }

      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          if (value !== null && value !== undefined && value !== '') {
            if (Array.isArray(value)) {
              query = query.in(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        }
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      setItems((data as JewelleryItem[]) || []);
      setError(null);
      console.log("Fetched items:", data); // Add logging
    } catch (err: any) {
      console.error("Error fetching items:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalRates = async () => {
    try {
      const { data, error } = await supabase.from("metal_rates").select("*");
      if (error) throw error;

      if (data && data.length > 0) {
        const ratesMap: { [key: string]: number } = {};
        data.forEach((r) => {
          ratesMap[r.material] = r.rate;
        });
        setGlobalRates((prev) => ({ ...prev, ...ratesMap }));
      }
    } catch (err: any) {
      console.warn("Could not load global rates:", err.message);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("jewellery_items")
        .delete()
        .eq("id", itemId);

      if (deleteError) throw deleteError;

      setItems(items.filter(item => item.id !== itemId));

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });

      return true;
    } catch (err: any) {
      console.error("Error deleting item:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete item",
        variant: "destructive",
      });
      return false;
    }
  };

  const calculatePrice = (item: JewelleryItem): number => {
    let metalFactor = 1.0;

    if (item.metal?.toLowerCase() === "gold" && item.karat) {
      switch (item.karat) {
        case "24K":
          metalFactor = 1.0;
          break;
        case "22K":
          metalFactor = 0.916;
          break;
        case "18K":
          metalFactor = 0.75;
          break;
        case "14K":
          metalFactor = 0.583;
          break;
      }
    } else if (item.metal?.toLowerCase() === "silver" && item.purity) {
      if (item.purity === "92.5% Sterling Silver") {
        metalFactor = 0.925;
      }
    }


      let materialRate = 0;
  if (item.metal === "gold") {
    materialRate = globalRates["Gold"] ?? 0;
  } else if (item.metal === "silver") {
    materialRate = globalRates["Silver"] ?? 0;
  } else if (category === "diamond" || category === "gemstone") {
    // For diamond/gemstone, base it on their metal type
    materialRate = item.metal === "silver" ? globalRates["Silver"] ?? 0 : globalRates["Gold"] ?? 0;
  } else {
    // fallback if metal unknown
    materialRate = item.rate ?? 0;
  }


    let purityFactor = 1.0;

    if (item.metal?.toLowerCase() === "silver") {
      if (item.purity === "92.5% Sterling Silver") {
        purityFactor = 0.925;
      }
    }

    return item.weight * materialRate * metalFactor + item.making_charges;

    console.log("calculatePrice - item.weight:", item.weight);
    console.log("calculatePrice - materialRate:", materialRate);
    console.log("calculatePrice - metalFactor:", metalFactor);
    console.log("calculatePrice - item.making_charges:", item.making_charges);
  };

  return {
    items,
    loading,
    error,
    calculatePrice,
    refetch: fetchItems,
    deleteItem,
    globalRates,
  };
};
