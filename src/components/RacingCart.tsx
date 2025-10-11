import { ShoppingCart } from "lucide-react";

const RacingCart = () => {
  return (
    <div className="relative w-full h-20 overflow-hidden mb-4">
      {/* Racing cart */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 animate-race-cart">
        <div className="relative">
          {/* Cart icon with bounce effect */}
          <ShoppingCart className="w-12 h-12 text-primary animate-bounce-slight" />
          
          {/* Speed lines behind cart */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 flex gap-1 animate-speed-lines">
            <div className="w-8 h-0.5 bg-primary/40 rounded"></div>
            <div className="w-6 h-0.5 bg-primary/30 rounded"></div>
            <div className="w-4 h-0.5 bg-primary/20 rounded"></div>
          </div>
          
          {/* Dust particles */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-dust-particle"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  left: `${-i * 8}px`,
                }}
              />
            ))}
          </div>
          
          {/* Wind effect (curved lines) */}
          <div className="absolute right-10 top-2 animate-wind-effect">
            <svg width="40" height="30" viewBox="0 0 40 30" className="opacity-40">
              <path
                d="M 0 5 Q 10 2, 20 5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                className="text-primary"
              />
              <path
                d="M 0 15 Q 15 12, 25 15"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                className="text-primary"
              />
              <path
                d="M 0 25 Q 12 22, 22 25"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                className="text-primary"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RacingCart;
