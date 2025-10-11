import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLikes } from "@/contexts/LikesContext";
import { useAdmin } from "@/contexts/AdminContext";
import { supabase } from "@/integrations/supabase/client";
import ItemCard from "@/components/ItemCard";
import { useJewelleryItems } from "@/hooks/useJewelleryItems";

const Offers = () => {
  const { addToCart } = useCart();
  const { toggleLike } = useLikes();
  const { isAdmin } = useAdmin();
  const { calculatePrice } = useJewelleryItems();

  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      setLoading(true);
      const { data } = await supabase
        .from("offers")
        .select(`
          *,
          jewellery_items (
            id,
            name,
            image_url,
            category,
            karat,
            weight,
            rate,
            making_charges,
            description
          )
        `)
        .order("created_at", { ascending: false });
      if (data) setOfferProducts(data);
      setLoading(false);
    }
    fetchOffers();
  }, []);

  const handleDeleteOffer = async (offerId: number) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    const { error } = await supabase.from("offers").delete().eq("id", offerId);
    if (!error) {
      setOfferProducts((prev) => prev.filter((o) => o.id !== offerId));
    } else {
      alert("Failed to delete offer");
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.2) 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
              <Badge className="text-xs font-medium uppercase tracking-wider bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                Exclusive Offers
              </Badge>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight">
              Limited Time <span className="text-primary">Offers</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Save big on our premium certified jewellery! Discounts applied to making charges where available.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {loading && (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        )}
        {!loading && offerProducts.length === 0 && (
          <div className="text-center py-20 text-lg text-muted-foreground">
            No offers available at the moment.
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {offerProducts.map((offer) => {
            const item = offer.jewellery_items;
            if (!item) return null;
            const discountPercent = offer.discount_percent;
            const discountedMakingCharges = Number(offer.discounted_making_charges);
            const originalMakingCharges = Number(item.making_charges);

            // -- Correct computation for offer price
            const discountedPrice =
              Number(item.rate) * Number(item.weight) + discountedMakingCharges;
            const originalPrice =
              Number(item.rate) * Number(item.weight) + originalMakingCharges;

            return (
              <ItemCard
                key={offer.id}
                item={item}
                calculatePrice={calculatePrice}
                discountedMakingCharges={discountedMakingCharges}
                discountPercent={discountPercent}
                originalPrice={originalPrice}
                isAdmin={isAdmin}
                handleDelete={() => handleDeleteOffer(offer.id)}
              />
            );
          })}
        </div>
        {/* Offer Terms */}
        <div className="mt-12 max-w-3xl mx-auto bg-muted/30 rounded-lg p-6 border border-border">
          <h3 className="font-serif text-lg font-semibold mb-3">
            Offer Terms & Conditions
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Offers valid for limited time only</li>
            <li>• Discounts applicable only to making charges</li>
            <li>• All products are BIS hallmarked and certified</li>
            <li>• Free shipping on orders above ₹25,000</li>
            <li>• Easy returns within 30 days</li>
          </ul>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Offers;
