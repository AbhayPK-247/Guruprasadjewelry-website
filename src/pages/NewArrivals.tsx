import { Heart, ShoppingCart, Star, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useLikes } from "@/contexts/LikesContext";
import goldImage from "@/assets/gold-jewelry.jpg";
import diamondImage from "@/assets/diamond-jewelry.jpg";
import gemstoneImage from "@/assets/gemstone-jewelry.jpg";
import { useJewelleryItems } from "@/hooks/useJewelleryItems";
import { useEffect, useState, useCallback } from "react";
import ItemCard from "@/components/ItemCard";

const NewArrivals = () => {
  const { addToCart } = useCart();
  const { toggleLike } = useLikes();
  const [newProducts, setNewProducts] = useState([]);
  const { items, loading, calculatePrice } = useJewelleryItems();
  const isLiked = useCallback((productId: string) => useLikes().isLiked(productId), [useLikes]);

  useEffect(() => {
    // Filter items added in the last 2 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const filteredProducts = items.filter((item) => {
      const createdAt = new Date(item.created_at);
      return createdAt >= twoDaysAgo;
    });

    setNewProducts(filteredProducts);
  }, [items]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <HeroSection />

      <ProductsSection
        loading={loading}
        newProducts={newProducts}
        isLiked={isLiked}
        calculatePrice={calculatePrice}
      />

      <FeaturesSection />

      <Footer />
    </div>
  );
};

const HeroSection = () => (
  <section className="relative bg-gradient-to-br from-primary/10 via-secondary/20 to-primary/5 border-b border-border/30">
    <div className="container mx-auto px-4 py-20">
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">New Collection</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif mb-4">
          New Arrivals
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the latest additions to our exquisite jewelry collection
        </p>
      </div>
    </div>
  </section>
);

const ProductsSection = ({ loading, newProducts, isLiked, calculatePrice }: {
  loading: boolean;
  newProducts: any[];
  isLiked: (productId: string) => boolean;
  calculatePrice: (product: any) => number;
}) => (
  <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-serif mb-2">Latest Collection</h2>
        <p className="text-muted-foreground">
          {newProducts.length} new pieces
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          newProducts.map((product) => (
            <ItemCard
              key={product.id}
              item={product}
              calculatePrice={calculatePrice}
            />
          ))
        )}
      </div>
    </div>
  </main>
);

const FeaturesSection = () => (
  <div className="mt-16 grid md:grid-cols-3 gap-6">
    <div className="p-6 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg border border-border/30 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
        <Sparkles className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold mb-2">Fresh Designs</h3>
      <p className="text-sm text-muted-foreground">
        New pieces added every week to keep your style current
      </p>
    </div>
    <div className="p-6 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg border border-border/30 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
        <Star className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold mb-2">Premium Quality</h3>
      <p className="text-sm text-muted-foreground">
        Each piece is crafted with attention to detail and certified
      </p>
    </div>
    <div className="p-6 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg border border-border/30 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
        <Heart className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold mb-2">Exclusive Collection</h3>
      <p className="text-sm text-muted-foreground">
        Limited edition pieces available only for a short time
      </p>
    </div>
  </div>
);

export default NewArrivals;
