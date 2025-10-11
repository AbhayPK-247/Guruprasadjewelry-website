import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FilterDialog } from "@/components/FilterDialog";
import { CollectionHero } from "@/components/CollectionHero";
import { useCart } from "@/contexts/CartContext";
import { useLikes } from "@/contexts/LikesContext";
import { useMetalRates } from "@/contexts/MetalRatesContext";
import silverHero from "@/assets/silver-jewelry.jpg";
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
  { label: "Under ₹10,000", min: 0, max: 10000 },
  { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
  { label: "₹20,000 - ₹40,000", min: 20000, max: 40000 },
  { label: "Above ₹40,000", min: 40000, max: Infinity },
];

const categories = ["Rings", "Earrings", "Necklaces", "Bangles", "Bracelets", "Chains", "Anklets"];
const purities = ["92.5% Sterling Silver", "99.9% Fine Silver"];
const occasions = ["Wedding", "Festive", "Casual", "Office", "Party"];
const genders = ["Women", "Men", "Unisex"];

const Silver = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [selectedPurity, setSelectedPurity] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("best");

  // Fetch silver items
  const { items, loading } = useJewelleryItems("Silver");
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useLikes();

  // Pull silver rate from context
  const { silverRate } = useMetalRates();

  // Centralized price calculator using metal_rates
  const calculatePrice = (item: any) => {
    if (!silverRate) return 0;

    const weight = Number(item.weight) || 0;
    const makingCharges = Number(item.making_charges) || 0;

    // Purity factor
    let purityFactor = 1.0;
    if (item.purity?.includes("92.5")) purityFactor = 0.925;
    else if (item.purity?.includes("99.9")) purityFactor = 0.999;

    return Math.round(weight * silverRate * purityFactor + makingCharges);
  };

  // Filters
  const filterSections = [
    { title: "Category", options: categories, selected: selectedCategory ? [selectedCategory] : [], onToggle: (val: string) => setSelectedCategory(val === selectedCategory ? null : val) },
    { title: "Price Range", options: priceRanges.map(r => r.label), selected: selectedPriceRange ? [priceRanges.find(r => r.min === selectedPriceRange.min && r.max === selectedPriceRange.max)?.label || ""] : [], onToggle: (label: string) => {
        const range = priceRanges.find(r => r.label === label);
        if (range) setSelectedPriceRange(selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max ? null : { min: range.min, max: range.max });
      } 
    },
    { title: "Purity", options: purities, selected: selectedPurity ? [selectedPurity] : [], onToggle: (val: string) => setSelectedPurity(val === selectedPurity ? null : val) },
    { title: "Gender", options: genders, selected: selectedGender ? [selectedGender] : [], onToggle: (val: string) => setSelectedGender(val === selectedGender ? null : val) },
    { title: "Occasion", options: occasions, selected: selectedOccasion ? [selectedOccasion] : [], onToggle: (val: string) => setSelectedOccasion(val === selectedOccasion ? null : val) },
  ];

  const handleClearAll = () => {
    setSelectedCategory(null);
    setSelectedPriceRange(null);
    setSelectedPurity(null);
    setSelectedGender(null);
    setSelectedOccasion(null);
  };
  const handleApply = () => setFilterDialogOpen(false);

  // Filtering + sorting
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    if (selectedCategory) filtered = filtered.filter(item => item.category === selectedCategory);
    if (selectedPurity) filtered = filtered.filter(item => item.purity === selectedPurity);
    if (selectedGender) filtered = filtered.filter(item => item.gender === selectedGender);
    if (selectedOccasion) filtered = filtered.filter(item => item.occasion === selectedOccasion);
    if (selectedPriceRange) filtered = filtered.filter(item => {
      const price = calculatePrice(item);
      return price >= selectedPriceRange.min && price <= selectedPriceRange.max;
    });

    switch (sortBy) {
      case "price-low": filtered.sort((a, b) => calculatePrice(a) - calculatePrice(b)); break;
      case "price-high": filtered.sort((a, b) => calculatePrice(b) - calculatePrice(a)); break;
      case "new": filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      default: break;
    }

    return filtered;
  }, [items, selectedCategory, selectedPurity, selectedGender, selectedOccasion, selectedPriceRange, sortBy, silverRate]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <CollectionHero
          title="Silver Jewellery"
          subtitle="Discover the elegance of our sterling and fine silver collection"
          tagline="Timeless Silver Craft"
          imageSrc={silverHero}
        />

        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-muted-foreground">
            <li><a href="/" className="hover:text-primary">Home</a></li>
            <li>/</li>
            <li className="text-foreground font-medium">Silver</li>
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
                <p className="text-muted-foreground text-lg">No silver items found matching your criteria</p>
                <Button variant="outline" className="mt-4" onClick={handleClearAll}>Clear Filters</Button>
              </div>
            )}

            {!loading && filteredAndSortedItems.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredAndSortedItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={{ ...item, metal: "silver" }} // force silver for price display
                    calculatePrice={calculatePrice}
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

export default Silver;
