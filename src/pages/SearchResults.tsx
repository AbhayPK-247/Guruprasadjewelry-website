import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Heart } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useLikes } from "@/contexts/LikesContext";
import { useJewelleryItems } from "@/hooks/useJewelleryItems";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  
  const { items, loading, calculatePrice } = useJewelleryItems();
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useLikes();

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif mb-2">Search Results</h1>
        <p className="text-muted-foreground mb-8">
          {searchQuery ? `Showing results for "${searchQuery}"` : 'Enter a search query'}
        </p>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found for "{searchQuery}"</p>
          </div>
        )}

        {!loading && filteredItems.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-6">{filteredItems.length} products found</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredItems.map((item) => {
                const price = calculatePrice(item);
                return (
                  <Card key={item.id} className="group overflow-hidden border-border hover:shadow-luxury transition-all duration-300">
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
                      <p className="text-xs text-muted-foreground mb-2">{`${item.weight}g`}</p>
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
                          weight: item.weight,
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
