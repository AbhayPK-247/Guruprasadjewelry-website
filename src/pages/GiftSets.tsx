import { useState, useMemo } from "react";
import { Heart, SlidersHorizontal, Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilterDialog } from "@/components/FilterDialog";
import { CollectionHero } from "@/components/CollectionHero";
import { useCart } from "@/contexts/CartContext";
import { useLikes } from "@/contexts/LikesContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useJewelleryItems } from "@/hooks/useJewelleryItems";
import heroImage from "@/assets/hero-banner.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GiftSets = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [searchQuery] = useState("");
  const [selectedKarat, setSelectedKarat] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [sortBy, setSortBy] = useState("best");
  
  const { items, loading, calculatePrice, deleteItem } = useJewelleryItems();
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useLikes();
  const { isAdmin } = useAdmin();

  const categories = ["All Jewellery", "Gold", "Silver", "Diamond", "Gemstone", "Bridal", "New Arrival"];
  const karats = ["14K", "18K", "22K", "24K"];
  const priceRanges = [
    { label: "Under ₹25,000", min: 0, max: 25000 },
    { label: "₹25,000 - ₹50,000", min: 25000, max: 50000 },
    { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
    { label: "Above ₹1,00,000", min: 100000, max: Infinity },
  ];
  const types = ["Necklace", "Bracelet", "Ring", "Earring", "Bangle", "Pendant", "Chain", "Anklet", "Brooch", "Mangalsutra", "Nosepin", "Cufflink", "Tiara", "Other"];

  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filterSections = [
    { 
      title: "Category", 
      options: categories,
      selected: selectedCategory ? [selectedCategory] : [],
      onToggle: (value: string) => setSelectedCategory(value === selectedCategory ? null : value)
    },
    { 
      title: "Type", 
      options: types,
      selected: selectedType ? [selectedType] : [],
      onToggle: (value: string) => setSelectedType(value === selectedType ? null : value)
    },
    { 
      title: "Karat", 
      options: karats,
      selected: selectedKarat ? [selectedKarat] : [],
      onToggle: (value: string) => setSelectedKarat(value === selectedKarat ? null : value)
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
      }
    },
  ];

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory && selectedCategory !== "All Jewellery") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedType) {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    if (selectedKarat) {
      filtered = filtered.filter((item) => item.karat === selectedKarat);
    }

    if (priceRange) {
      filtered = filtered.filter((item) => {
        const price = calculatePrice(item);
        return price >= priceRange.min && price <= priceRange.max;
      });
    }

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
  }, [items, searchQuery, selectedCategory, selectedType, selectedKarat, priceRange, sortBy, calculatePrice]);

  const handleClearAll = () => {
    setSelectedKarat(null);
    setSelectedCategory(null);
    setPriceRange(null);
    setSelectedType(null);
  };

  const handleApply = () => {
    setFilterDialogOpen(false);
  };

  const handleKaratSelect = (karat: string) => {
    setSelectedKarat(selectedKarat === karat ? null : karat);
  };

  const handleDelete = async (itemId: string, itemName: string) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      await deleteItem(itemId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <CollectionHero
          title="Gift Sets"
          subtitle="Explore our gift sets collection of exquisite jewelry crafted with precision and passion"
          tagline="Discover Timeless Elegance"
          imageSrc={heroImage}
        />

        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-muted-foreground">
            <li><a href="/" className="hover:text-primary">Home</a></li>
            <li>/</li>
            <li className="text-foreground font-medium">Gift Sets</li>
          </ol>
        </nav>

        <div className="mb-8">
          <div className="flex justify-center gap-6 overflow-x-auto pb-2">
            {[
              { karat: '14K', purity: '58.3% Pure Gold' },
              { karat: '18K', purity: '75% Pure Gold' },
              { karat: '22K', purity: '91.6% Pure Gold' },
              { karat: '24K', purity: '99.9% Pure Gold' }
            ].map((item) => (
              <Card 
                key={item.karat} 
                className={`min-w-[160px] p-6 text-center cursor-pointer hover:border-primary hover:shadow-luxury transition-all duration-300 bg-gradient-to-br from-background to-muted/30 ${
                  selectedKarat === item.karat ? 'border-primary shadow-luxury' : ''
                }`}
                onClick={() => handleKaratSelect(item.karat)}
              >
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-gold flex items-center justify-center shadow-elegant ring-2 ring-primary/20">
                  <span className="text-white font-bold text-lg">{item.karat}</span>
                </div>
                <p className="text-sm font-semibold mb-1">{item.karat}</p>
                <p className="text-xs text-muted-foreground">{item.purity}</p>
              </Card>
            ))}
          </div>
        </div>

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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFilterDialogOpen(true)}
                >
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

            {loading && (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            )}

            {!loading && filteredAndSortedItems.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No products found matching your criteria</p>
                <Button variant="outline" className="mt-4" onClick={handleClearAll}>
                  Clear Filters
                </Button>
              </div>
            )}

            {!loading && filteredAndSortedItems.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredAndSortedItems.map((item) => {
                  const price = calculatePrice(item);
                  return (
                    <Card key={item.id} className="group overflow-hidden border-border hover:shadow-xl hover:shadow-primary/25 hover:border-primary/70 transition-all duration-300 hover:scale-[1.03]">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                            <span className="text-muted-foreground text-sm">No Image</span>
                          </div>
                        )}
                        
                        {/* Admin Delete Button - Only visible to admins */}
                        {isAdmin && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white transition-colors z-10"
                            onClick={() => handleDelete(item.id, item.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors ${
                            isLiked(item.id) ? 'text-red-500' : ''
                          }`}
                          onClick={() => toggleLike({
                            product_id: item.id,
                            name: item.name,
                            price: price,
                            image: item.image_url || "",
                            category: item.category,
                          })}
                        >
                          <Heart className={`w-4 h-4 ${isLiked(item.id) ? 'fill-current' : ''}`} />
                        </Button>
                        {item.karat && (
                          <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                            {item.karat}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-1">{item.category}</p>
                        <p className="text-xs text-muted-foreground mb-2">{item.weight}g • ₹{item.rate.toLocaleString('en-IN')}/g</p>
                        <p className="font-semibold text-lg">₹{price.toLocaleString('en-IN')}</p>
                        <Button 
                          className="w-full mt-3" 
                          size="sm"
                          onClick={() => addToCart({
                            product_id: item.id,
                            name: item.name,
                            price: price,
                            image: item.image_url || "",
                            category: item.category,
                            weight: `${item.weight}g`,
                            karat: item.karat || undefined,
                          })}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GiftSets;