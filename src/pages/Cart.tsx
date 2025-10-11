import { Link } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RacingCart from "@/components/RacingCart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const taxRate = 0.03; // 3% GST
  const taxAmount = totalPrice * taxRate;
  const finalTotal = totalPrice + taxAmount;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/20 to-background">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-secondary/40 via-secondary/20 to-secondary/40 border-b border-border/30">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <ShoppingCart className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Review your selected jewelry pieces
              </p>
              
              {/* Racing Cart Animation */}
              <RacingCart />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Discover our exquisite collection of jewelry pieces
              </p>
              <Link to="/collections/all">
                <Button size="lg" className="shadow-luxury hover:shadow-elevation transition-all duration-300">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif">
                    Cart Items ({cartItems.length})
                  </h2>
                  <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
                    Clear All
                  </Button>
                </div>

                {cartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-elevation transition-all duration-300">
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                      <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/20">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium mb-1">{item.name}</h3>
                            {item.category && (
                              <p className="text-sm text-muted-foreground">{item.category}</p>
                            )}
                            {item.weight && (
                              <p className="text-sm text-muted-foreground">Weight: {item.weight}</p>
                            )}
                            {item.karat && (
                              <p className="text-sm text-muted-foreground">Purity: {item.karat}</p>
                            )}
                            <p className="text-lg font-semibold text-primary">
                              ₹{item.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">
                              ₹{item.price.toLocaleString('en-IN')} each
                            </p>
                            <p className="text-lg font-semibold text-primary">
                              ₹{item.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24 shadow-elevation">
                  <h2 className="text-2xl font-serif mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>GST (3%)</span>
                      <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-primary">FREE</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary">₹{finalTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mb-4 shadow-luxury hover:shadow-elevation transition-all duration-300"
                    size="lg"
                    onClick={() => alert("Checkout is still on development!")}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Link to="/collections/all">
                    <Button variant="outline" className="w-full" size="lg">
                      Continue Shopping
                    </Button>
                  </Link>

                  <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">
                      🎁 Complimentary gift wrapping included
                      checkout is still on development!
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
