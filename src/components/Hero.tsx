import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";
import Simple3D from "./Simple3D";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* 3D Ring - Full Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Simple3D />
      </div>
      
      {/* Darker overlay for text contrast */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-black/30 via-transparent to-black/40" />
      
      {/* TEXT THROUGH RING - Top Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Ornamental Badge */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
              <span className="text-white text-xs font-medium uppercase tracking-[0.3em] px-4 py-2 border border-white/30 rounded-sm bg-black/40 backdrop-blur-sm">
                Since 2000
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
            </div>

            {/* Main Heading - THROUGH THE RING */}
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
              <span className="text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]">
                Guruprasad
              </span>
              <br />
              <span className="text-primary text-7xl md:text-8xl lg:text-9xl drop-shadow-[0_0_40px_rgba(255,215,0,0.6)]">
                Jewellers
              </span>
            </h1>

            {/* Subtitle with WHITE TEXT & BLACK BORDER */}
           {/* Subtitle with WHITE TEXT - NO BORDER */}
<p className="text-xl md:text-2xl text-white max-w-2xl mx-auto leading-relaxed font-medium"
   style={{
     textShadow: '0 5px 10px rgba(0, 0, 0, 0.8)'
   }}>
  Timeless Traditions
</p>


            {/* Subtext with WHITE TEXT & BLACK BORDER */}
            <p className="text-base md:text-lg text-white max-w-2xl mx-auto leading-relaxed"
               style={{
                 textShadow: `
                   -1px -1px 0 #000000,
                   1px -1px 0 #000000,
                   -1px 1px 0 #000000,
                   1px 1px 0 #000000,
                   0 3px 6px rgba(0, 0, 0, 0.9)
                 `
               }}>
              Experience the artistry of handcrafted gold, diamond, and gemstone jewellery. 
              Each piece is a masterpiece, celebrating heritage and elegance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/collections/all">
                <Button size="lg" className="bg-gradient-gold hover:opacity-90 text-white text-base px-8 h-12 group shadow-2xl font-medium transition-all hover:scale-105">
                  Explore Our Collections
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/schedule-visit">
                <Button size="lg" variant="outline" className="text-primary border-2 border-primary/50 bg-transparent hover:bg-white/20 hover:backdrop-blur-lg backdrop-blur-sm text-base px-8 h-12 font-medium transition-all hover:scale-105 shadow-xl hover:text-primary">
                  Schedule a Visit
                </Button>
              </Link>
            </div>

            {/* Stats with WHITE TEXT & GREY BORDERS */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-16">
              <div className="relative">
                <div className="text-4xl md:text-5xl font-serif font-bold text-white mb-2"
                     style={{
                       textShadow: `
                         -1px -1px 0 #4A4A4A,
                         1px -1px 0 #4A4A4A,
                         -1px 1px 0 #4A4A4A,
                         1px 1px 0 #4A4A4A,
                         -2px -2px 0 #4A4A4A,
                         2px -2px 0 #4A4A4A,
                         -2px 2px 0 #4A4A4A,
                         2px 2px 0 #4A4A4A,
                         0 4px 8px rgba(0, 0, 0, 0.8)
                       `
                     }}>
                  25+
                </div>
                <div className="text-sm uppercase tracking-wider text-white/80"
                     style={{
                       textShadow: `
                         -1px -1px 0 #4A4A4A,
                         1px -1px 0 #4A4A4A,
                         -1px 1px 0 #4A4A4A,
                         1px 1px 0 #4A4A4A,
                         0 2px 4px rgba(0, 0, 0, 0.7)
                       `
                     }}>
                  Years of Excellence
                </div>
              </div>
              <div className="relative border-x border-white/30">
                <div className="text-4xl md:text-5xl font-serif font-bold text-white mb-2"
                     style={{
                       textShadow: `
                         -1px -1px 0 #4A4A4A,
                         1px -1px 0 #4A4A4A,
                         -1px 1px 0 #4A4A4A,
                         1px 1px 0 #4A4A4A,
                         -2px -2px 0 #4A4A4A,
                         2px -2px 0 #4A4A4A,
                         -2px 2px 0 #4A4A4A,
                         2px 2px 0 #4A4A4A,
                         0 4px 8px rgba(0, 0, 0, 0.8)
                       `
                     }}>
                  10k+
                </div>
                <div className="text-sm uppercase tracking-wider text-white/80"
                     style={{
                       textShadow: `
                         -1px -1px 0 #4A4A4A,
                         1px -1px 0 #4A4A4A,
                         -1px 1px 0 #4A4A4A,
                         1px 1px 0 #4A4A4A,
                         0 2px 4px rgba(0, 0, 0, 0.7)
                       `
                     }}>
                  Satisfied Clients
                </div>
              </div>
              <div className="relative">
                <div className="text-4xl md:text-5xl font-serif font-bold text-white mb-2"
                     style={{
                       textShadow: `
                         -1px -1px 0 #4A4A4A,
                         1px -1px 0 #4A4A4A,
                         -1px 1px 0 #4A4A4A,
                         1px 1px 0 #4A4A4A,
                         -2px -2px 0 #4A4A4A,
                         2px -2px 0 #4A4A4A,
                         -2px 2px 0 #4A4A4A,
                         2px 2px 0 #4A4A4A,
                         0 4px 8px rgba(0, 0, 0, 0.8)
                       `
                     }}>
                  100%
                </div>
                <div className="text-sm uppercase tracking-wider text-white/80"
                     style={{
                       textShadow: `
                         -1px -1px 0 #4A4A4A,
                         1px -1px 0 #4A4A4A,
                         -1px 1px 0 #4A4A4A,
                         1px 1px 0 #4A4A4A,
                         0 2px 4px rgba(0, 0, 0, 0.7)
                       `
                     }}>
                  Certified Purity
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Below Ring */}
      <div className="relative z-10 container mx-auto px-4 pb-16 pt-8">
        {/* Featured Image Gallery */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Large Featured Image */}
            <div className="md:col-span-2 relative group">
              <div className="relative overflow-hidden rounded-lg shadow-elevation border border-border/50">
                <img 
                  src={heroBanner} 
                  alt="Signature Jewellery Collection" 
                  className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-background/95 backdrop-blur-md rounded-lg p-6 border border-border/50 shadow-luxury">
                    <div className="text-3xl font-serif font-bold text-primary mb-1">Festive Special</div>
                    <div className="text-sm text-muted-foreground mb-3">Flat 20% Off on Select Collections</div>
                    <Link to="/offers">
                      <Button size="sm" variant="outline" className="border-primary/50 hover:bg-primary/10 text-xs transition-all hover:scale-105">
                        View Offers
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Images */}
            <div className="flex flex-col gap-4">
              <div className="relative overflow-hidden rounded-lg shadow-elevation border border-border/50 group">
                <img 
                  src={heroBanner} 
                  alt="Bridal Collection" 
                  className="w-full h-[192px] md:h-[242px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="text-white font-serif text-xl font-bold">Custom Designs</div>
                  <div className="text-white/80 text-xs">Exclusive Designs</div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg shadow-elevation border border-border/50 group">
                <img 
                  src={heroBanner} 
                  alt="Diamond Collection" 
                  className="w-full h-[192px] md:h-[242px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="text-white font-serif text-xl font-bold">Diamonds</div>
                  <div className="text-white/80 text-xs">Certified Brilliance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust Badges */}
      <div className="relative z-10 bg-muted/30 backdrop-blur-sm border-y border-border/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: "BIS Hallmarked", desc: "Certified Authenticity" },
              { title: "Complimentary Shipping", desc: "Orders above ₹25,000" },
              { title: "Easy Returns", desc: "30-Day Policy" },
              { title: "Lifetime Exchange", desc: "Exclusive Benefit" },
            ].map((badge, index) => (
              <div key={index} className="text-center space-y-1">
                <div className="font-serif font-semibold text-base">{badge.title}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
