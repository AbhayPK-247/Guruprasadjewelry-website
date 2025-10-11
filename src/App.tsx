import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import ThemeProvider from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import { MetalRatesProvider } from "@/contexts/MetalRatesContext";
import Index from "./pages/Index";
import AllJewellery from "./pages/AllJewellery";
import SizeGuide from "./pages/SizeGuide";
import Gold from "./pages/Gold";
import Diamond from "./pages/Diamond";
import Silver from "./pages/Silver";
import Gemstones from "./pages/Gemstones";
import ScheduleVisit from "./pages/ScheduleVisit";
import Offers from "./pages/Offers";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Bridal from "./pages/Bridal";
import NewArrivals from "./pages/NewArrivals";
import Admin from "./pages/Admin";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Trending from "./pages/Trending";
import BestSellers from "./pages/BestSellers";
import GiftSets from "./pages/GiftSets";
import ReviewPage from "./pages/ReviewForm";
import CareGuide from "./pages/CareGuide";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <MetalRatesProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop /> {/* ADD THIS LINE */}
            <AdminProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/collections/all" element={<AllJewellery />} />
                <Route path="/collections/gold" element={<Gold />} />
                <Route path="/collections/diamond" element={<Diamond />} />
                <Route path="/collections/silver" element={<Silver />} />
                <Route path="/collections/gemstones" element={<Gemstones />} />
                <Route path="/collections/bridal" element={<Bridal />} />
                <Route path="/collections/new-arrivals" element={<NewArrivals />} />
                <Route path="/schedule-visit" element={<ScheduleVisit />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/best-sellers" element={<BestSellers />} />
                <Route path="/gift-sets" element={<GiftSets />} />
                <Route path="/careguide" element={<CareGuide />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/size-guide" element={<SizeGuide />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AdminProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </MetalRatesProvider>
);

export default App;
