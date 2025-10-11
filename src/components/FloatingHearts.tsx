import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface FloatingHeartsProps {
  count: number;
  onBurst?: boolean;
}

interface HeartParticle {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

const FloatingHearts = ({ count, onBurst }: FloatingHeartsProps) => {
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 90 + 5,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
    setHearts(newHearts);
  }, [count]);

  useEffect(() => {
    if (onBurst) {
      // Create burst effect with 8 particles
      const particles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.cos((i * Math.PI * 2) / 8) * 100,
        y: Math.sin((i * Math.PI * 2) / 8) * 100,
        rotation: Math.random() * 360,
      }));
      
      setBurstParticles(particles);
      
      // Clear burst particles after animation
      setTimeout(() => {
        setBurstParticles([]);
      }, 1000);
    }
  }, [onBurst]);

  if (count === 0 && burstParticles.length === 0) return null;

  return (
    <>
      {/* Floating hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute bottom-0 animate-float-up opacity-0"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
            }}
          >
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          </div>
        ))}
      </div>

      {/* Burst effect */}
      {burstParticles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50 flex items-center justify-center">
          {burstParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute animate-burst"
              style={{
                transform: `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`,
              }}
            >
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default FloatingHearts;
