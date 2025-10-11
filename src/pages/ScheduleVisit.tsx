import { useState } from "react";
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
import { Calendar, Clock, User, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const scheduleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
  email: z.string().email("Please enter a valid email address").max(255),
  date: z.string().nonempty("Please select a preferred date"),
  time: z.string().nonempty("Please select a preferred time"),
  message: z.string().max(500).optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

const ScheduleVisit = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      message: "",
    },
  });

  const onSubmit = async (data: ScheduleFormData) => {
    setIsSubmitting(true);
    
    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('visit_schedules')
        .insert({
          name: data.name,
          phone: data.phone,
          email: data.email,
          preferred_date: data.date,
          preferred_time: data.time,
          message: data.message || null,
        });

      if (dbError) throw dbError;

      // Send email notification via Edge Function
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-visit-notification', {
        body: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          date: data.date,
          time: data.time,
          message: data.message || '',
        },
      });

      if (emailError) {
        console.error('Email sending failed:', emailError);
      } else if (emailData) {
        console.log('Email sent successfully:', emailData);
      }

      toast({
        title: "Visit Scheduled Successfully! ✅",
        description: "We'll contact you soon to confirm your appointment. Check your email for details.",
      });
      
      form.reset();
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.error('Error scheduling visit:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to schedule visit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Visit Us
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Schedule Your <span className="text-primary">Visit</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Book an appointment to explore our exquisite collection in person. Our experts will guide you through your perfect jewelry selection.
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
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone & Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          Contact Number *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Date & Time */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Preferred Date *
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          Preferred Time *
                        </FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Special Requests */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Let us know if you have any specific preferences or requirements..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-gold hover:opacity-90 text-white font-medium shadow-luxury transition-all hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Scheduling..." : "Schedule Visit"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Contact Info */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-muted/30 rounded-lg">
              <div className="text-2xl font-serif font-bold text-primary mb-2">📍</div>
              <div className="text-sm font-medium mb-1">Visit Our Store</div>
              <div className="text-xs text-muted-foreground">Belagavi, Karnataka</div>
            </div>
            <div className="p-6 bg-muted/30 rounded-lg">
              <div className="text-2xl font-serif font-bold text-primary mb-2">📞</div>
              <div className="text-sm font-medium mb-1">Call Us</div>
              <div className="text-xs text-muted-foreground">+91 9945 763133</div>
            </div>
            <div className="p-6 bg-muted/30 rounded-lg">
              <div className="text-2xl font-serif font-bold text-primary mb-2">⏰</div>
              <div className="text-sm font-medium mb-1">Store Hours</div>
              <div className="text-xs text-muted-foreground">Mon-Sun: 10 AM - 8 PM</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScheduleVisit;
