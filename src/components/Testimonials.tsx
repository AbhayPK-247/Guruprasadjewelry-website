import { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/contexts/AdminContext";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const { isAdmin, loading: adminLoading } = useAdmin();

  useEffect(() => {
    fetchReviews();
    fetchAverageRating();
    // eslint-disable-next-line
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, name, location, rating, comment, inserted_at")
        .order("inserted_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        return;
      }
      if (data) {
        const formatted = data.map((review) => ({
          id: review.id,
          name: review.name,
          location: review.location,
          rating: review.rating,
          text: review.comment,
          date: new Date(review.inserted_at).toLocaleDateString(),
        }));
        setTestimonials(formatted);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  // NEW FUNCTION: Fetch all ratings and compute average
  const fetchAverageRating = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("rating");

    if (error) {
      console.error("Error fetching ratings for average:", error);
      setAverageRating(null);
      return;
    }
    if (data && data.length > 0) {
      const total = data.reduce((sum, row) => sum + (row.rating || 0), 0);
      const avg = total / data.length;
      setAverageRating(avg);
    } else {
      setAverageRating(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) {
        alert("Failed to delete the review.");
        console.error("Deletion error:", error);
      } else {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        fetchAverageRating(); // Refresh average after delete
      }
    } catch (err) {
      alert("Unexpected error during deletion.");
      console.error(err);
    }
  };

  if (loading || adminLoading) {
    return <p className="text-center py-12">Loading testimonials...</p>;
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-light">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trusted by thousands of happy customers across India
          </p>
        </div>

        {/* Horizontal Scrollable Testimonials */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="min-w-[340px] bg-background rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all duration-300 animate-fade-in relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {isAdmin && (
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                  title="Delete review"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
                <div className="text-xs text-muted-foreground">{testimonial.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center p-6 bg-background rounded-xl shadow-soft">
            <div className="font-serif text-3xl font-bold text-primary mb-2">
              {averageRating !== null ? `${averageRating.toFixed(1)}/5` : "—"}
            </div>
            <div className="text-sm text-muted-foreground">Customer Rating</div>
          </div>
          <div className="text-center p-6 bg-background rounded-xl shadow-soft">
            <div className="font-serif text-3xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center p-6 bg-background rounded-xl shadow-soft">
            <div className="font-serif text-3xl font-bold text-primary mb-2">25+</div>
            <div className="text-sm text-muted-foreground">Years of Trust</div>
          </div>
          <div className="text-center p-6 bg-background rounded-xl shadow-soft">
            <div className="font-serif text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Certified Jewelry</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
