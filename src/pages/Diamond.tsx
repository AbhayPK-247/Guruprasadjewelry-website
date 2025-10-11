import React, { useState, useMemo } from "react";
import { Heart, SlidersHorizontal } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CollectionHero } from "@/components/CollectionHero";
import diamondHero from "@/assets/diamond-jewelry.jpg";
import ItemCard from "@/components/ItemCard";
import { useCart } from "@/contexts/CartContext";
import { useLikes } from "@/contexts/LikesContext";
import { useJewelleryItems } from "@/hooks/useJewelleryItems";
import { useMetalRates } from "@/contexts/MetalRatesContext";

const Diamond = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedClarity, setSelectedClarity] = useState<string | null>(null);
  const [selectedCut, setSelectedCut] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [sortBy, setSortBy] = useState("best");

  const { items, loading, error } = useJewelleryItems("Diamond");
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useLikes();
  const { goldRate, silverRate, loading: ratesLoading } = useMetalRates();

  // Compute price for each item after metal rates are loaded
  const itemsWithPrice = useMemo(() => {
    if (ratesLoading || !goldRate || !silverRate) return [];

    return items.map(item => {
      const weight = Number(item.weight) || 0;
      const makingCharges = Number(item.making_charges) || 0;
      let karatFactor = 1;

      switch (item.karat) {
        case "24K": karatFactor = 1; break;
        case "22K": karatFactor = 0.916; break;
        case "18K": karatFactor = 0.75; break;
        case "14K": karatFactor = 0.583; break;
      }

      const metal = (item.metal || "").toLowerCase();
      const rate = metal === "gold" ? goldRate : silverRate;

      const totalPrice = weight * rate * karatFactor + makingCharges;

      return { ...item, totalPrice, perGramRate: rate };
    });
  }, [items, goldRate, silverRate, ratesLoading]);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...itemsWithPrice];
    if (selectedType) filtered = filtered.filter(i => i.type === selectedType);
    if (selectedClarity) filtered = filtered.filter(i => i.clarity === selectedClarity);
    if (selectedCut) filtered = filtered.filter(i => i.cut === selectedCut);
    if (priceRange) filtered = filtered.filter(i => i.totalPrice >= priceRange.min && i.totalPrice <= priceRange.max);

    switch (sortBy) {
      case "price-low": filtered.sort((a,b) => a.totalPrice - b.totalPrice); break;
      case "price-high": filtered.sort((a,b) => b.totalPrice - a.totalPrice); break;
      case "new": filtered.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
    }

    return filtered;
  }, [itemsWithPrice, selectedType, selectedClarity, selectedCut, priceRange, sortBy]);

  const handleClearAll = () => {
    setSelectedType(null);
    setSelectedClarity(null);
    setSelectedCut(null);
    setPriceRange(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <CollectionHero
          title="Diamond Jewellery"
          subtitle="Brilliance and elegance captured in every meticulously crafted diamond piece"
          tagline="Eternal Sparkle"
          imageSrc={diamondHero}
        />

        <div className="flex justify-between items-center gap-4 mb-6 pb-4 border-b border-border">
          <Button variant="outline" size="sm" onClick={() => setFilterDialogOpen(true)}>
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
          </Button>
          <p className="text-muted-foreground">{loading || ratesLoading ? "Loading..." : `${filteredAndSortedItems.length} results`}</p>
        </div>

        {error && <div className="text-red-500 text-center py-20">{error}</div>}
        {(loading || ratesLoading) && !error && <p className="text-center py-20">Loading items...</p>}
        {!loading && !ratesLoading && filteredAndSortedItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No diamond items found.</p>
            <Button variant="outline" className="mt-4" onClick={handleClearAll}>Clear Filters</Button>
          </div>
        )}

        {!loading && !ratesLoading && filteredAndSortedItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredAndSortedItems.map(item => (
              <ItemCard key={item.id} item={item} calculatePrice={() => item.totalPrice} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Diamond;
