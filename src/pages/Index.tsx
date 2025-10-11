import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CategoryShowcase from "@/components/CategoryShowcase";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <CategoryShowcase />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
