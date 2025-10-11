import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MetalRatesContextType {
  goldRate: number | null;
  silverRate: number | null;
  loading: boolean;
}

const MetalRatesContext = createContext<MetalRatesContextType | undefined>(undefined);

export const useMetalRates = () => {
  const context = useContext(MetalRatesContext);
  if (!context) throw new Error("useMetalRates must be used within a MetalRatesProvider");
  return context;
};

export const MetalRatesProvider = ({ children }: { children: ReactNode }) => {
  const [goldRate, setGoldRate] = useState<number | null>(null);
  const [silverRate, setSilverRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscribed = true;

    const fetchRates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("metal_rates")
          .select("metal, rate")
          .in("metal", ["gold", "silver"]);

        if (error) throw error;

        let gold = null;
        let silver = null;
        data.forEach((r: { metal: string; rate: number }) => {
          if (r.metal.toLowerCase() === "gold") gold = r.rate;
          if (r.metal.toLowerCase() === "silver") silver = r.rate;
        });

        if (subscribed) {
          setGoldRate(gold);
          setSilverRate(silver);
        }
      } catch (err) {
        console.error("Error fetching metal rates:", err);
      } finally {
        if (subscribed) setLoading(false);
      }
    };

    fetchRates();

    const subscription = supabase
      .channel("public:metal_rates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "metal_rates" },
        () => fetchRates()
      )
      .subscribe();

    return () => {
      subscribed = false;
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <MetalRatesContext.Provider value={{ goldRate, silverRate, loading }}>
      {children}
    </MetalRatesContext.Provider>
  );
};
