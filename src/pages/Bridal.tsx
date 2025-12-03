import { useState, useMemo } from "react";
import { Heart, SlidersHorizontal } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilterDialog } from "@/components/FilterDialog";
import { CollectionHero } from "@/components/CollectionHero";
import { useCart } from "@/contexts/CartContext";
import { useLikes } from "@/contexts/LikesContext";
import bridalHero from "@/assets/bridal-collection.jpg";
import { useJewelleryItems } from "@/hooks/useJewelleryItems";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ItemCard from "@/components/ItemCard";

const priceRanges = [
  { label: "Under ₹25,000", min: 0, max: 25000 },
  { label: "₹25,000 - ₹50,000", min: 25000, max: 50000 },
  { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
  { label: "Above ₹1,00,000", min: 100000, max: Infinity },
];
const types = ["Necklace", "Bracelet", "Ring", "Earring", "Bangle", "Pendant", "Chain"];

const Bridal = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [sortBy, setSortBy] = useState("best");

  const { items, loading, calculatePrice } = useJewelleryItems("Bridal");
  const { addToCart } = useCart();
  const { toggleLike } = useLikes();
  const { isLiked } = useLikes();

  const filterSections = [
    {
      title: "Type",
      options: types,
      selected: selectedType ? [selectedType] : [],
      onToggle: (value: string) => setSelectedType(value === selectedType ? null : value),
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
    setPriceRange(null);
    setSelectedType(null);
  };

  const handleApply = () => {
    setFilterDialogOpen(false);
  };

  // Filtering and sorting logic
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];
    // Type filter (assumes item.type exists)
    if (selectedType) {
      filtered = filtered.filter((item) => item.type === selectedType);
    }
    // Price range filter
    if (priceRange) {
      filtered = filtered.filter((item) => {
        const price = calculatePrice(item);
        return price >= priceRange.min && price <= priceRange.max;
      });
    }
    // Sorting
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
        // Best matches - keep as is
        break;
    }
    return filtered;
  }, [items, selectedType, priceRange, sortBy, calculatePrice]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <CollectionHero
          title="Bridal Jewellery"
          subtitle="Discover exquisite jewellery for your special day"
          tagline="Elegance Redefined"
          imageSrc={bridalHero}
        />
        <Breadcrumb />
        <FilterDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
          filters={filterSections}
          onClearAll={handleClearAll}
          onApply={handleApply}
        />
        <div className="flex gap-6">
          <div className="flex-1">
            <Toolbar
              loading={loading}
              filteredAndSortedItems={filteredAndSortedItems}
              setFilterDialogOpen={setFilterDialogOpen}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredAndSortedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Breadcrumb = () => (
  <nav className="mb-6 text-sm">
    <ol className="flex items-center gap-2 text-muted-foreground">
      <li><a href="/" className="hover:text-primary">Home</a></li>
      <li>/</li>
      <li className="text-foreground font-medium">Bridal</li>
    </ol>
  </nav>
);

const Toolbar = ({ loading, filteredAndSortedItems, setFilterDialogOpen, sortBy, setSortBy }: {
  loading: boolean;
  filteredAndSortedItems: any[];
  setFilterDialogOpen: (open: boolean) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setFilterDialogOpen(true)}
      >
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        Filters
      </Button>
      <p className="text-muted-foreground">
        {loading ? "Loading..." : `${filteredAndSortedItems.length} results`}
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
);

export default Bridal;
