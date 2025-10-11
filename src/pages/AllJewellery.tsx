import { useState, useMemo } from "react";
import {
  Heart,
  SlidersHorizontal,
  Trash2
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { useMetalRates } from "@/contexts/MetalRatesContext";
import { supabase } from "@/integrations/supabase/client";

// -------------------- Helpers --------------------
const getKaratFactor = (karat?: string): number => {
  switch (karat) {
    case '24K': return 1.0;
    case '22K': return 0.916;
    case '18K': return 0.75;
    case '14K': return 0.583;
    default: return 1.0;
  }
};

// Get metal rate per item
const getGlobalRate = (item, goldRate, silverRate) => {
  const metal = (item.metal || item.category || "").toLowerCase();
  if (metal === "gold") return goldRate;
  if (metal === "silver") return silverRate;
  return 0;
};

// Calculate price using weight, karat, metal rate, and making charges
const calculatePriceWithRates = (item, goldRate, silverRate) => {
  const metal = (item.metal || item.category || "").toLowerCase();
  const weight = Number(item.weight) || 0;
  const makingCharges = Number(item.making_charges) || 0;
  const karatFactor = getKaratFactor(item.karat);

  if (metal === "gold" || metal === "silver") {
    const rate = getGlobalRate(item, goldRate, silverRate);
    return Math.round(weight * rate * karatFactor + makingCharges);
  } else if (item.category === "Diamond" || item.category === "Gemstone") {
    const rate = Number(item.rate) || 0;
    return Math.round(weight * rate * karatFactor + makingCharges); // Use rate for diamonds and gemstones
  } else {
    return 0;
  }
  console.log("calculatePriceWithRates item:", item); // Add logging
  console.log("calculatePriceWithRates price:", Math.round(Number(item.price) || 0)); // Add logging
  return Math.round(Number(item.price) || 0);
};

// -------------------- Component --------------------
const AllJewellery = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [searchQuery] = useState("");
  const [selectedKarat, setSelectedKarat] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [sortBy, setSortBy] = useState("best");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { items, loading, deleteItem } = useJewelleryItems();
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useLikes();
  const { isAdmin } = useAdmin();
  const { goldRate, silverRate } = useMetalRates();

  const categories = ["All Jewellery", "Gold", "Silver", "Diamond", "Gemstone", "Bridal", "New Arrival"];
  const karats = ["14K", "18K", "22K", "24K"];
  const priceRanges = [
    { label: "Under ₹25,000", min: 0, max: 25000 },
    { label: "₹25,000 - ₹50,000", min: 25000, max: 50000 },
    { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
    { label: "Above ₹1,00,000", min: 100000, max: Infinity },
  ];
  const types = ["Necklace", "Bracelet", "Ring", "Earring", "Bangle", "Pendant", "Chain", "Anklet", "Brooch", "Mangalsutra", "Nosepin", "Cufflink", "Tiara", "Other"];

  const filterSections = [
    { title: "Category", options: categories, selected: selectedCategory ? [selectedCategory] : [], onToggle: (value: string) => setSelectedCategory(value === selectedCategory ? null : value) },
    { title: "Type", options: types, selected: selectedType ? [selectedType] : [], onToggle: (value: string) => setSelectedType(value === selectedType ? null : value) },
    { title: "Karat", options: karats, selected: selectedKarat ? [selectedKarat] : [], onToggle: (value: string) => setSelectedKarat(value === selectedKarat ? null : value) },
    { title: "Price Range", options: priceRanges.map(r => r.label), selected: priceRange ? [priceRanges.find(r => r.min === priceRange.min && r.max === priceRange.max)?.label || ""] : [], onToggle: (label: string) => {
        const range = priceRanges.find(r => r.label === label);
        if (range) setPriceRange(priceRange?.min === range.min && priceRange?.max === range.max ? null : { min: range.min, max: range.max });
      } 
    }
  ];

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    if (searchQuery) filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedCategory && selectedCategory !== "All Jewellery") filtered = filtered.filter(i => i.category === selectedCategory);
    if (selectedType) filtered = filtered.filter(i => i.type === selectedType);
    if (selectedKarat) filtered = filtered.filter(i => i.karat === selectedKarat);

    if (priceRange) filtered = filtered.filter(item => {
      const price = calculatePriceWithRates(item, goldRate, silverRate);
      return price >= priceRange.min && price <= priceRange.max;
    });

    switch (sortBy) {
      case "price-low": filtered.sort((a,b) => calculatePriceWithRates(a,goldRate,silverRate) - calculatePriceWithRates(b,goldRate,silverRate)); break;
      case "price-high": filtered.sort((a,b) => calculatePriceWithRates(b,goldRate,silverRate) - calculatePriceWithRates(a,goldRate,silverRate)); break;
      case "new": filtered.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
    }

    return filtered;
  }, [items, searchQuery, selectedCategory, selectedType, selectedKarat, priceRange, sortBy, goldRate, silverRate]);

  const handleClearAll = () => { setSelectedKarat(null); setSelectedCategory(null); setPriceRange(null); setSelectedType(null); };
  const handleApply = () => setFilterDialogOpen(false);
  const handleKaratSelect = (karat: string) => setSelectedKarat(selectedKarat === karat ? null : karat);

  // ---------- Offers ----------
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [currentOfferProduct, setCurrentOfferProduct] = useState<typeof items[0] | null>(null);
  const [offerPercent, setOfferPercent] = useState(0);

  const openOfferDialog = (product: typeof items[0]) => { setCurrentOfferProduct(product); setOfferPercent(0); setOfferDialogOpen(true); };
  const saveOffer = async () => {
    if (!currentOfferProduct) return;
    if (offerPercent < 0 || offerPercent > 100) return alert("Offer percent must be 0-100");
    const discountedMakingCharges = currentOfferProduct.making_charges * (1 - offerPercent / 100);
    const { error } = await supabase.from("offers").upsert({
      product_id: currentOfferProduct.id,
      discount_percent: offerPercent,
      discounted_making_charges: discountedMakingCharges,
      updated_at: new Date(),
    }, { onConflict: "product_id" });
    if (error) alert("Failed: "+error.message);
    else setOfferDialogOpen(false);
  };

  const handleDelete = async (id,name) => { if (window.confirm(`Delete "${name}"?`)) await deleteItem(id); };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <CollectionHero title="All Jewellery" subtitle="Explore our complete collection of exquisite jewelry crafted with precision and passion" tagline="Discover Timeless Elegance" imageSrc={heroImage} />
        <nav className="mb-6 text-sm"><ol className="flex items-center gap-2 text-muted-foreground"><li><a href="/" className="hover:text-primary">Home</a></li><li>/</li><li className="text-foreground font-medium">All Jewellery</li></ol></nav>
        <div className="mb-8 flex justify-center gap-6 overflow-x-auto pb-2">
          {karats.map(k => (
            <Card key={k} className={`min-w-[160px] p-6 text-center cursor-pointer hover:border-primary hover:shadow-luxury transition-all duration-300 ${selectedKarat===k?'border-primary shadow-luxury':''}`} onClick={()=>handleKaratSelect(k)}>
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-gold flex items-center justify-center shadow-elegant ring-2 ring-primary/20"><span className="text-white font-bold text-lg">{k}</span></div>
              <p className="text-sm font-semibold mb-1">{k}</p>
              <p className="text-xs text-muted-foreground">{getKaratFactor(k)*100}% Pure Gold</p>
            </Card>
          ))}
        </div>

        <FilterDialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen} filters={filterSections} onClearAll={handleClearAll} onApply={handleApply} />

        <div className="flex gap-6 flex-col md:flex-row">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={()=>setFilterDialogOpen(true)}><SlidersHorizontal className="w-4 h-4 mr-2"/>Filters</Button>
                <p className="text-muted-foreground">{loading ? "Loading..." : `Showing ${filteredAndSortedItems.length} products`}</p>
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

            {loading && <div className="flex justify-center items-center py-20"><LoadingSpinner /></div>}
            {!loading && filteredAndSortedItems.length===0 && <div className="text-center py-20"><p className="text-muted-foreground text-lg">No products found</p><Button variant="outline" className="mt-4" onClick={handleClearAll}>Clear Filters</Button></div>}

            {!loading && filteredAndSortedItems.length>0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredAndSortedItems.map(item=>{
                  const offer = item.offers || null;
                  const discountedMakingCharges = offer ? offer.discounted_making_charges : item.making_charges;
                  const discountedPrice = calculatePriceWithRates({...item,making_charges:discountedMakingCharges},goldRate,silverRate);
                  const originalPrice = calculatePriceWithRates(item,goldRate,silverRate);
                  return (
                    <Card key={item.id} className="group overflow-hidden border-border hover:shadow-xl hover:shadow-primary/25 hover:border-primary/70 transition-all duration-300 hover:scale-[1.03]">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50"><span className="text-muted-foreground text-sm">No Image</span></div>}
                        {isAdmin && <Button size="icon" variant="ghost" className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white transition-colors z-10" onClick={()=>handleDelete(item.id,item.name)}><Trash2 className="w-4 h-4" /></Button>}
                        <Button size="icon" variant="ghost" className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors ${isLiked(item.id)?"text-red-500":""}`} onClick={()=>toggleLike({product_id:item.id,name:item.name,price:discountedPrice,image:item.image_url||"",category:item.category})}><Heart className={`w-4 h-4 ${isLiked(item.id)?"fill-current":""}`} /></Button>
                        {isAdmin && <Button size="sm" variant="outline" className="absolute bottom-2 left-2" onClick={()=>openOfferDialog(item)}>Add Offer</Button>}
                        {item.karat && <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">{item.karat}</div>}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mb-1">{item.category}</p>
                        <p className="text-xs text-muted-foreground mb-2">{item.weight}g • ₹{item.category === "Diamond" ? "N/A" : (typeof getGlobalRate(item,goldRate,silverRate) === 'number' ? getGlobalRate(item,goldRate,silverRate).toLocaleString("en-IN") : '0')}/g</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-primary">₹{discountedPrice.toLocaleString("en-IN")}</span>
                          {offer && <span className="text-sm text-muted-foreground line-through ml-2">₹{originalPrice.toLocaleString("en-IN")}</span>}
                        </div>
                        {offer && <div className="text-xs text-green-600 font-medium">You save {offer.discount_percent}% on making charges</div>}
                        <Button className="w-full mt-3" size="sm" onClick={()=>addToCart({product_id:item.id,name:item.name,price:discountedPrice,image:item.image_url||"",category:item.category})}>Add to Cart</Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Offer Dialog */}
      <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Offer for {currentOfferProduct?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <label className="block font-semibold">Discount Percent (%)</label>
            <input type="number" min={0} max={100} value={offerPercent} onChange={(e)=>setOfferPercent(Number(e.target.value))} className="w-full border border-border rounded px-3 py-2"/>
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={()=>setOfferDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveOffer}>Save Offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AllJewellery;

