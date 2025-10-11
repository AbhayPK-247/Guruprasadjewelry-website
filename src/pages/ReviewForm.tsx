import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { User, MapPin, Phone, MessageCircle, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  location: z.string().min(2, "Location must be at least 2 characters").max(100),
  phone: z.string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{10}$/.test(val),
      "Please enter a valid 10-digit phone number"
    )
    .nullable(),
  comment: z.string().min(3, "Comment must be at least 3 characters").max(500),
  rating: z.number().min(1, "Please provide a rating").max(5),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const ReviewForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: "",
      location: "",
      phone: "",
      comment: "",
      rating: 0,
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase.from("reviews").insert({
        name: data.name,
        location: data.location,
        phone: data.phone || null,
        comment: data.comment,
        rating: data.rating,
      });

      if (dbError) throw dbError;

      toast({
        title: "Review Submitted! ✅",
        description: "Thank you for your feedback. We appreciate your review.",
      });

      form.reset();

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // For star rating input UI
  const handleStarClick = (star: number) => {
    form.setValue("rating", star, { shouldValidate: true });
  };

  const currentRating = form.watch("rating");

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
              <span className="text-primary text-xs font-medium uppercase tracking-[0.3em] px-4 py-2 border border-primary/30 rounded-sm bg-background/50">
                Reviews
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Submit Your <span className="text-primary">Review</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We value your feedback. Share your experience with our products and service.
            </p>
          </div>

          {/* Form */}
          <div className="bg-card border border-border rounded-lg p-8 shadow-luxury">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Name *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Location *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Your location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        Phone (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="10 digit number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Comment */}
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-primary" />
                        Comment *
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="Write your comment here..." {...field} className="min-h-[120px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Rating */}
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    Rating *
                  </FormLabel>
                  <div className="flex items-center space-x-2 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`cursor-pointer w-8 h-8 ${
                          star <= currentRating ? "text-yellow-500" : "text-gray-300"
                        }`}
                        onClick={() => handleStarClick(star)}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-gold hover:opacity-90 text-white font-medium shadow-luxury transition-all hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReviewForm;
