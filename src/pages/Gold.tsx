import { useState, useMemo } from "react";
import { Heart, SlidersHorizontal } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FilterDialog } from "@/components/FilterDialog";
import { CollectionHero } from "@/components/CollectionHero";
import { useCart } from "@/contexts/CartContext";
import { useLikes } from "@/contexts/LikesContext";
import { useMetalRates } from "@/contexts/MetalRatesContext";
import goldHero from "@/assets/gold-jewelry.jpg";
import ItemCard from "@/components/ItemCard";
import { useJewelleryItems } from "@/hooks/useJewelleryItems";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const karats = ["14K", "18K", "22K", "24K"];
const priceRanges = [
  { label: "Under ₹25,000", min: 0, max: 25000 },
  { label: "₹25,000 - ₹50,000", min: 25000, max: 50000 },
  { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
  { label: "Above ₹1,00,000", min: 100000, max: Infinity },
];
const types = ["Necklace", "Bracelet", "Ring", "Earring", "Bangle", "Pendant", "Chain", "Anklet", "Brooch", "Mangalsutra", "Nosepin", "Cufflink", "Tiara", "Other"];

const Gold = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedKarat, setSelectedKarat] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [sortBy, setSortBy] = useState("best");

  const { items, loading } = useJewelleryItems("Gold");
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useLikes();
  const { goldRate } = useMetalRates();

  // Price calculator using goldRate
  const calculatePrice = (item: any) => {
    if (!goldRate) return 0;
    const weight = Number(item.weight) || 0;
    const makingCharges = Number(item.making_charges) || 0;

    let karatFactor = 1.0;
    switch (item.karat) {
      case "24K": karatFactor = 1.0; break;
      case "22K": karatFactor = 0.916; break;
      case "18K": karatFactor = 0.75; break;
      case "14K": karatFactor = 0.583; break;
    }

    return Math.round(weight * goldRate * karatFactor + makingCharges);
  };

  const filterSections = [
    {
      title: "Type",
      options: types,
      selected: selectedType ? [selectedType] : [],
      onToggle: (value: string) => setSelectedType(value === selectedType ? null : value),
    },
    {
      title: "Karat",
      options: karats,
      selected: selectedKarat ? [selectedKarat] : [],
      onToggle: (value: string) => setSelectedKarat(value === selectedKarat ? null : value),
    },
    {
      title: "Price Range",
      options: priceRanges.map(r => r.label),
      selected: priceRange ? [priceRanges.find(r => r.min === priceRange.min && r.max === priceRange.max)?.label || ""] : [],
      onToggle: (label: string) => {
        const range = priceRanges.find(r => r.label === label);
        if (range) {
          setPriceRange(priceRange?.min === range.min && priceRange?.max === range.max ? null : { min: range.min, max: range.max });
        }
      },
    },
  ];

  const handleClearAll = () => {
    setSelectedType(null);
    setSelectedKarat(null);
    setPriceRange(null);
  };
  const handleApply = () => setFilterDialogOpen(false);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    if (selectedType) filtered = filtered.filter(item => item.type === selectedType);
    if (selectedKarat) filtered = filtered.filter(item => item.karat === selectedKarat);
    if (priceRange) filtered = filtered.filter(item => {
      const price = calculatePrice(item);
      return price >= priceRange.min && price <= priceRange.max;
    });

    switch (sortBy) {
      case "price-low": filtered.sort((a, b) => calculatePrice(a) - calculatePrice(b)); break;
      case "price-high": filtered.sort((a, b) => calculatePrice(b) - calculatePrice(a)); break;
      case "new": filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
    }

    return filtered;
  }, [items, selectedType, selectedKarat, priceRange, sortBy, goldRate]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <CollectionHero
          title="Gold Jewellery"
          subtitle="Experience the eternal beauty of our handcrafted gold collection"
          tagline="Luxury You Deserve"
          imageSrc={goldHero}
        />

        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-muted-foreground">
            <li><a href="/" className="hover:text-primary">Home</a></li>
            <li>/</li>
            <li className="text-foreground font-medium">Gold</li>
          </ol>
        </nav>

        <FilterDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
          filters={filterSections}
          onClearAll={handleClearAll}
          onApply={handleApply}
        />

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setFilterDialogOpen(true)}>
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <p className="text-muted-foreground">
                  {loading ? "Loading..." : `Showing ${filteredAndSortedItems.length} products`}
                </p>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best">Best Matches</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="new">New Arrivals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading && <div className="flex justify-center items-center py-20"><LoadingSpinner /></div>}

            {!loading && filteredAndSortedItems.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No gold items found.</p>
                <Button variant="outline" className="mt-4" onClick={handleClearAll}>Clear Filters</Button>
              </div>
            )}

            {!loading && filteredAndSortedItems.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredAndSortedItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={{ ...item, metal: "gold" }} // force gold for ItemCard
                    calculatePrice={() => calculatePrice(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Gold;
