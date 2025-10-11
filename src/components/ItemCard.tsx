import React, { useState } from "react";
import { Heart, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useLikes } from "@/contexts/LikesContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMetalRates } from "@/contexts/MetalRatesContext";

interface ItemCardProps {
  item: any;
  calculatePrice: (item: any) => number;
  isAdmin?: boolean;
  handleDelete?: (itemId: string, itemName: string) => void;
  discountedMakingCharges?: number | null;
  discountPercent?: number | null;
  originalPrice?: number;
}

// Helper function to get the current metal rate from context
function getDisplayRate(itemMetal: string, goldRate: number | null, silverRate: number | null) {
  const metal = (itemMetal || "").toLowerCase();
  if (metal === "gold") return goldRate;
  if (metal === "silver") return silverRate;
  return null;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isAdmin,
  handleDelete,
  discountedMakingCharges,
  discountPercent,
  originalPrice,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useLikes();

  const { goldRate, silverRate } = useMetalRates();

  // Calculate price using global rates
  const calculatePrice = () => {
    const weight = Number(item.weight);
    const makingCharges = Number(item.making_charges);

    if (isNaN(weight) || isNaN(makingCharges)) return 0;

    let karatFactor = 1.0;
    switch (item.karat) {
      case "24K": karatFactor = 1.0; break;
      case "22K": karatFactor = 0.916; break;
      case "18K": karatFactor = 0.75; break;
      case "14K": karatFactor = 0.583; break;
    }

    const metalRate = getDisplayRate(item.metal, goldRate, silverRate);
    if (!metalRate) return 0;

    return weight * metalRate * karatFactor + makingCharges;
  };

  const discountedPrice = calculatePrice();

  return (
    <Card
      key={item.id}
      className="group overflow-hidden border-border hover:shadow-xl hover:shadow-primary/25 hover:border-primary/70 transition-all duration-300 hover:scale-[1.03]"
    >
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
        {isAdmin && handleDelete && (
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
            isLiked(item.id) ? "text-red-500" : ""
          }`}
          onClick={() =>
            toggleLike({
              product_id: item.id,
              name: item.name,
              price: discountedPrice,
              image: item.image_url || "",
              category: item.category,
            })
          }
        >
          <Heart className={`w-4 h-4 ${isLiked(item.id) ? "fill-current" : ""}`} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          onClick={() => setIsDialogOpen(true)}
        >
          <Eye className="w-4 h-4" />
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
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-primary">
            ₹{discountedPrice.toLocaleString("en-IN")}
          </span>
          {discountPercent && originalPrice && (
            <span className="text-sm text-muted-foreground line-through ml-2">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-1">
          {item.weight}g • ₹
          {getDisplayRate(item.metal, goldRate, silverRate) !== null
            ? getDisplayRate(item.metal, goldRate, silverRate)?.toLocaleString("en-IN")
            : "--"}
          /g
        </p>
        {discountPercent && (
          <div className="text-xs text-green-600 font-medium">
            You save {discountPercent}% on making charges
          </div>
        )}
        <Button
          className="w-full mt-3"
          size="sm"
          onClick={() =>
            addToCart({
              product_id: item.id,
              name: item.name,
              price: discountedPrice,
              image: item.image_url || "",
              category: item.category,
              metal: item.metal,
            })
          }
        >
          Add to Cart
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
          </DialogHeader>
          <div className="flex">
            <div className="group overflow-hidden">
              <img
                src={item.image_url || ""}
                alt={item.name}
                className="w-[400px] h-[400px] object-contain mr-4 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-2">{item.description}</p>
              <p className="text-xs text-muted-foreground mb-1">
                {item.weight}g • ₹
                {getDisplayRate(item.metal, goldRate, silverRate) !== null
                  ? getDisplayRate(item.metal, goldRate, silverRate)?.toLocaleString("en-IN")
                  : "--"}
                /g
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                Category: {item.category}
              </p>
              {item.karat && (
                <p className="text-xs text-muted-foreground mb-1">
                  Karat: {item.karat}
                </p>
              )}
              <div className="mt-4">
                <Button
                  onClick={() =>
                    addToCart({
                      product_id: item.id,
                      name: item.name,
                      price: discountedPrice,
                      image: item.image_url || "",
                      category: item.category,
                      metal: item.metal,
                    })
                  }
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ItemCard;
