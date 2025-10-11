import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingHearts from "@/components/FloatingHearts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLikes } from "@/contexts/LikesContext";
import { useCart } from "@/contexts/CartContext";

const Favorites = () => {
  const { likedItems, toggleLike } = useLikes();
  const { addToCart } = useCart();
  const [showBurst, setShowBurst] = useState(false);

  const handleAddToCart = (item: any) => {
    addToCart(item);
  };

  const handleRemove = async (item: any) => {
    setShowBurst(true);
    await toggleLike(item);
    
    // Reset burst animation after it plays
    setTimeout(() => {
      setShowBurst(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navigation />
      
      {/* Floating hearts animation */}
      <FloatingHearts count={likedItems.length} onBurst={showBurst} />
      
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/20 to-background relative z-10">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-secondary/40 via-secondary/20 to-secondary/40 border-b border-border/30">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <Heart className="w-10 h-10 text-primary fill-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Your Favorites
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your curated collection of exquisite jewelry pieces
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {likedItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-serif mb-4">No favorites yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start exploring our collections and add items you love to your favorites
              </p>
              <Link to="/collections/all">
                <Button size="lg" className="shadow-luxury hover:shadow-elevation transition-all duration-300">
                  Explore Collections
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-muted-foreground">
                  {likedItems.length} {likedItems.length === 1 ? 'item' : 'items'} in your favorites
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {likedItems.map((item) => (
                  <Card key={item.id} className="group overflow-hidden hover:shadow-elevation transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-secondary/20">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                        onClick={() => handleRemove(item)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-medium mb-1 line-clamp-1">{item.name}</h3>
                        {item.category && (
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        )}
                      </div>
                      <p className="text-lg font-semibold text-primary">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                      <Button
                        className="w-full shadow-soft hover:shadow-luxury transition-all duration-300"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
