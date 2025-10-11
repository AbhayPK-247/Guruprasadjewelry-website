import { useState, useMemo } from "react";
import { Heart, SlidersHorizontal, Gem } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilterDialog } from "@/components/FilterDialog";
import { CollectionHero } from "@/components/CollectionHero";
import { useCart } from "@/contexts/CartContext";
import { useLikes } from "@/contexts/LikesContext";
import gemstoneHero from "@/assets/gemstone-jewelry.jpg";
import ItemCard from "@/components/ItemCard";
import { useJewelleryItems } from "@/hooks/useJewelleryItems";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const priceRanges = [
  { label: "Under ₹50,000", min: 0, max: 50000 },
  { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
  { label: "₹1,00,000 - ₹2,00,000", min: 100000, max: 200000 },
  { label: "Above ₹2,00,000", min: 200000, max: Infinity },
];

const gemstoneTypes = ["Ruby", "Emerald", "Sapphire", "Topaz", "Amethyst", "Pearl", "Opal"];
const cuts = ["Brilliant", "Emerald", "Princess", "Oval", "Pear"];
const carats = ["0.50 - 1.00", "1.00 - 2.00", "2.00 - 3.00", "Above 3.00"];
const genders = ["Women", "Men", "Unisex"];
const occasions = ["Wedding", "Engagement", "Anniversary", "Festive", "Casual"];

const Gemstones = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [selectedGemstoneType, setSelectedGemstoneType] = useState<string | null>(null);
  const [selectedCut, setSelectedCut] = useState<string | null>(null);
  const [selectedCarat, setSelectedCarat] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("best");

  const { items, loading, calculatePrice } = useJewelleryItems("Gemstone");
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useLikes();

  const filterSections = [
    { title: "Price Range", options: priceRanges.map(r => r.label), selected: selectedPriceRange ? [priceRanges.find(r => r.min === selectedPriceRange.min && r.max === selectedPriceRange.max)?.label || ""] : [], onToggle: (label: string) => {
        const range = priceRanges.find(r => r.label === label);
        if (range) setSelectedPriceRange(selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max ? null : { min: range.min, max: range.max });
      } 
    },
    { title: "Gemstone Type", options: gemstoneTypes, selected: selectedGemstoneType ? [selectedGemstoneType] : [], onToggle: (val: string) => setSelectedGemstoneType(val === selectedGemstoneType ? null : val) },
    { title: "Cut", options: cuts, selected: selectedCut ? [selectedCut] : [], onToggle: (val: string) => setSelectedCut(val === selectedCut ? null : val) },
    { title: "Carat Weight", options: carats, selected: selectedCarat ? [selectedCarat] : [], onToggle: (val: string) => setSelectedCarat(val === selectedCarat ? null : val) },
    { title: "Gender", options: genders, selected: selectedGender ? [selectedGender] : [], onToggle: (val: string) => setSelectedGender(val === selectedGender ? null : val) },
    { title: "Occasion", options: occasions, selected: selectedOccasion ? [selectedOccasion] : [], onToggle: (val: string) => setSelectedOccasion(val === selectedOccasion ? null : val) },
  ];

  const handleClearAll = () => {
    setSelectedPriceRange(null);
    setSelectedGemstoneType(null);
    setSelectedCut(null);
    setSelectedCarat(null);
    setSelectedGender(null);
    setSelectedOccasion(null);
  };
  const handleApply = () => setFilterDialogOpen(false);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];
    
    if (selectedPriceRange) {
      filtered = filtered.filter(i => {
        const price = calculatePrice(i);
        return price >= selectedPriceRange.min && price <= selectedPriceRange.max;
      });
    }
    if (selectedGemstoneType) filtered = filtered.filter(i => i.gemstone_type === selectedGemstoneType);
    if (selectedCut) filtered = filtered.filter(i => i.cut === selectedCut);
    if (selectedCarat) {
      const [min, max] = selectedCarat.split(' - ').map(s => parseFloat(s.replace('Above ', '')));
      filtered = filtered.filter(i => {
        if (!i.carat_weight) return false;
        if (selectedCarat.includes('Above')) return i.carat_weight >= min;
        return i.carat_weight >= min && i.carat_weight <= max;
      });
    }
    if (selectedGender) filtered = filtered.filter(i => i.gender === selectedGender);
    if (selectedOccasion) filtered = filtered.filter(i => i.occasion === selectedOccasion);

    switch (sortBy) {
      case "price-low": 
        filtered.sort((a, b) => calculatePrice(a) - calculatePrice(b)); 
        break;
      case "price-high": 
        filtered.sort((a, b) => calculatePrice(b) - calculatePrice(a)); 
        break;
      case "new": 
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); 
        break;
      default: 
        break;
    }

    return filtered;
  }, [items, selectedPriceRange, selectedGemstoneType, selectedCut, selectedCarat, selectedGender, selectedOccasion, sortBy, calculatePrice]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <CollectionHero
          title="Gemstone Jewellery"
          subtitle="Vibrant colors and natural beauty harmonized in precious gemstones"
          tagline="Nature's Masterpiece"
          imageSrc={gemstoneHero}
        />

        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-muted-foreground">
            <li><a href="/" className="hover:text-primary">Home</a></li>
            <li>/</li>
            <li className="text-foreground font-medium">Gemstones</li>
          </ol>
        </nav>

        <FilterDialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen} filters={filterSections} onClearAll={handleClearAll} onApply={handleApply} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setFilterDialogOpen(true)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
            </Button>
            <p className="text-muted-foreground">{loading ? "Loading..." : `${filteredAndSortedItems.length} products`}</p>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="best">Best Matches</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="new">New Arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading && <div className="flex justify-center py-20"><LoadingSpinner /></div>}
        {!loading && filteredAndSortedItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No gemstone items found.</p>
            <Button variant="outline" className="mt-4" onClick={handleClearAll}>Clear Filters</Button>
          </div>
        )}
        {!loading && filteredAndSortedItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredAndSortedItems.map(item => {
              const price = calculatePrice(item);
              return (
                <ItemCard 
                  key={item.id}
                  item={item}
                  calculatePrice={calculatePrice}
                />
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Gemstones;
