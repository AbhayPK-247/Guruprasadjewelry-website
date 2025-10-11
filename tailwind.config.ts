import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'luxury': 'var(--shadow-luxury)',
        'soft': 'var(--shadow-soft)',
        'elevation': 'var(--shadow-elevation)',
      },
      backgroundImage: {
        'gradient-gold': 'var(--gradient-gold)',
        'gradient-light': 'var(--gradient-light)',
        'gradient-shine': 'var(--gradient-shine)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        // Heart floating animation
        "float-up": {
          "0%": {
            transform: "translateY(0) rotate(0deg) scale(1)",
            opacity: "0.8",
          },
          "50%": {
            transform: "translateY(-50vh) rotate(180deg) scale(1.2)",
            opacity: "0.6",
          },
          "100%": {
            transform: "translateY(-100vh) rotate(360deg) scale(0.8)",
            opacity: "0",
          },
        },
        // Heart burst animation
        burst: {
          "0%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.5) rotate(180deg)",
            opacity: "0.7",
          },
          "100%": {
            transform: "scale(0) rotate(360deg)",
            opacity: "0",
          },
        },
        // Racing cart animation (left to right with fade in/out)
        "race-cart": {
          "0%": {
            transform: "translateX(-100px)",
            opacity: "0",
          },
          "10%": {
            opacity: "1",
          },
          "90%": {
            opacity: "1",
          },
          "100%": {
            transform: "translateX(calc(100vw + 100px))",
            opacity: "0",
          },
        },
        // Slight bounce for cart
        "bounce-slight": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-4px)",
          },
        },
        // Speed lines behind cart
        "speed-lines": {
          "0%, 100%": {
            opacity: "0",
            transform: "translateX(0) scaleX(0.5)",
          },
          "50%": {
            opacity: "1",
            transform: "translateX(-10px) scaleX(1)",
          },
        },
        // Dust particles
        "dust-particle": {
          "0%": {
            transform: "translate(0, 0) scale(1)",
            opacity: "0.6",
          },
          "100%": {
            transform: "translate(-40px, 10px) scale(0.3)",
            opacity: "0",
          },
        },
        // Wind effect (wavy lines)
        "wind-effect": {
          "0%": {
            opacity: "0",
            transform: "translateX(20px)",
          },
          "50%": {
            opacity: "0.6",
          },
          "100%": {
            opacity: "0",
            transform: "translateX(-40px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "shimmer": "shimmer 2s infinite",
        "float": "float 3s ease-in-out infinite",
        "float-up": "float-up 4s ease-out forwards",
        burst: "burst 0.8s ease-out forwards",
        "race-cart": "race-cart 4s ease-in-out infinite",
        "bounce-slight": "bounce-slight 0.6s ease-in-out infinite",
        "speed-lines": "speed-lines 0.8s ease-in-out infinite",
        "dust-particle": "dust-particle 1.2s ease-out infinite",
        "wind-effect": "wind-effect 1s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
