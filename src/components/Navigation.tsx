import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu, X, MapPin, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useLikes } from "@/contexts/LikesContext";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const { likedItems } = useLikes();
  const [isAdmin, setIsAdmin] = useState(false);
  const [goldRate, setGoldRate] = useState<number | null>(null);
  const [silverRate, setSilverRate] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();
      setIsAdmin(!!roles);
    };
    checkAdmin();

    const fetchMetalRates = async () => {
      try {
        const { data, error } = await supabase
          .from("metal_rates")
          .select("metal, rate")
          .in("metal", ["gold", "silver"]);

        if (error) throw error;

        data.forEach((item) => {
          if (item.metal === "gold") setGoldRate(item.rate);
          if (item.metal === "silver") setSilverRate(item.rate);
        });
      } catch (error) {
        console.error("Error fetching metal rates:", error);
      }
    };
    fetchMetalRates();
  }, []);


  const categories = [
    { name: "All Jewellery", path: "/collections/all" },
    { name: "Gold", path: "/collections/gold" },
    { name: "Diamond", path: "/collections/diamond" },
    { name: "Silver", path: "/collections/silver" },
    { name: "Gemstones", path: "/collections/gemstones" },
    { name: "Bridal", path: "/collections/bridal" },
    { name: "New Arrivals", path: "/collections/new-arrivals" },
    { name: "About Us", path: "/about" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-lg border-b border-border/30 shadow-soft">
      <TopBar />
      <MainNav
        categories={categories}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAdmin={isAdmin}
        navigate={navigate}
        likedItems={likedItems}
        totalItems={totalItems}
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
        goldRate={goldRate}
        silverRate={silverRate}
      />
    </header>
  );
};

const TopBar = () => (
  <div className="bg-secondary/40 backdrop-blur-md border-b border-border/20">
    <div className="container mx-auto px-4 py-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex gap-6">
          <a href="tel:+919945763133" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">+91 9945 763133</span>
          </a>
          <a
            href="https://maps.app.goo.gl/RkKsoRYpx55jrSm97"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Find Store</span>
          </a>
        </div>
        <div className="text-muted-foreground">
          <span className="hidden md:inline">Complimentary shipping on orders above ₹25,000</span>
          <span className="md:hidden">Free shipping ₹25,000+</span>
        </div>
      </div>
    </div>
  </div>
);

const MainNav = ({
  categories,
  handleSearch,
  searchQuery,
  setSearchQuery,
  isAdmin,
  navigate,
  likedItems,
  totalItems,
  setMobileMenuOpen,
  mobileMenuOpen,
  goldRate,
  silverRate,
}) => (
  <nav className="container mx-auto px-4">
    <div className="flex items-center justify-between py-2">
      <Logo />
      <div className="flex items-center flex-grow mx-8 space-x-8">
        <DesktopSearch handleSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="hidden lg:flex items-center space-x-6 text-sm font-semibold whitespace-nowrap">
          <span>GOLD: {goldRate !== null ? `₹${goldRate.toFixed(2)}` : "Loading..."}</span>
          <span>SILVER: {silverRate !== null ? `₹${silverRate.toFixed(2)}` : "Loading..."}</span>
        </div>
      </div>
      <DesktopActions isAdmin={isAdmin} navigate={navigate} likedItems={likedItems} totalItems={totalItems} />
      <MobileMenuButton setMobileMenuOpen={setMobileMenuOpen} mobileMenuOpen={mobileMenuOpen} />
    </div>
    <DesktopCategories categories={categories} />
    {/* Only show mobile menu when open */}
    {mobileMenuOpen && (
      <MobileMenu
        categories={categories}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAdmin={isAdmin}
        navigate={navigate}
        likedItems={likedItems}
        totalItems={totalItems}
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
      />
    )}
  </nav>
);


const Logo = () => (
  <Link to="/" className="flex items-center">
    <img src={logo} alt="Guruprasad Jewellers" className="h-12 md:h-14 w-auto" />
  </Link>
);

const DesktopSearch = ({ handleSearch, searchQuery, setSearchQuery }) => (
  <div className="hidden lg:flex flex-1 max-w-xl mx-8">
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search for Gold, Diamond jewellery and more..."
        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  </div>
);

const DesktopActions = ({ isAdmin, navigate, likedItems, totalItems }) => (
  <div className="hidden md:flex items-center gap-4">
    {isAdmin && (
      <Link to="/admin">
        <Button variant="outline" size="sm" className="font-semibold text-primary">
          Admin
        </Button>
      </Link>
    )}
    <Button variant="ghost" size="icon" onClick={() => navigate("/search")} className="lg:hidden">
      <Search className="w-5 h-5" />
    </Button>
    <WishlistButton likedItems={likedItems} />
    <ProfileButton />
    <CartButton totalItems={totalItems} />
  </div>
);

const WishlistButton = ({ likedItems }) => (
  <Link to="/favorites">
    <Button variant="ghost" size="icon" className="relative">
      <Heart className="w-5 h-5" />
      {likedItems.length > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
          {likedItems.length}
        </Badge>
      )}
    </Button>
  </Link>
);

const ProfileButton = () => (
  <Link to="/profile">
    <Button variant="ghost" size="icon">
      <User className="w-5 h-5" />
    </Button>
  </Link>
);

const CartButton = ({ totalItems }) => (
  <Link to="/cart">
    <Button variant="ghost" size="icon" className="relative">
      <ShoppingCart className="w-5 h-5" />
      {totalItems > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
          {totalItems}
        </Badge>
      )}
    </Button>
  </Link>
);

const MobileMenuButton = ({ setMobileMenuOpen, mobileMenuOpen }) => (
  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
  </Button>
);

const DesktopCategories = ({ categories }) => (
  <div className="hidden lg:flex items-center justify-center gap-8 pb-2 border-t border-border pt-2">
    {categories.map((category) => (
      <Link
        key={category.path}
        to={category.path}
        className="text-sm font-medium hover:text-primary transition-colors relative group"
      >
        {category.name}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
      </Link>
    ))}
  </div>
);

const MobileMenu = ({
  categories,
  handleSearch,
  searchQuery,
  setSearchQuery,
  isAdmin,
  navigate,
  likedItems,
  totalItems,
  setMobileMenuOpen,
  mobileMenuOpen,
}) => (
  <div className="lg:hidden border-t border-border bg-background">
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col gap-4">
        <MobileSearch handleSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <MobileCategories categories={categories} setMobileMenuOpen={setMobileMenuOpen} navigate={navigate} />
        <MobileActions isAdmin={isAdmin} navigate={navigate} likedItems={likedItems} totalItems={totalItems} setMobileMenuOpen={setMobileMenuOpen} />
      </div>
    </div>
  </div>
);

const MobileSearch = ({ handleSearch, searchQuery, setSearchQuery }) => (
  <form onSubmit={handleSearch} className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
    <input
      type="text"
      placeholder="Search jewellery..."
      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </form>
);

const MobileCategories = ({ categories, setMobileMenuOpen, navigate }) => (
  <div className="flex flex-col gap-2">
    {categories.map((category) => (
      <Link
        key={category.path}
        to={category.path}
        className="py-2 px-4 hover:bg-secondary rounded-lg transition-colors"
        onClick={() => {
          setMobileMenuOpen(false);
          navigate(category.path);
        }}
      >
        {category.name}
      </Link>
    ))}
  </div>
);

const MobileActions = ({ isAdmin, navigate, likedItems, totalItems, setMobileMenuOpen }) => (
  <div className="flex items-center justify-around pt-4 border-t border-border">
    {isAdmin && (
      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
        <Button variant="outline" className="flex flex-col items-center gap-1 font-semibold text-primary">
          <span className="text-xs">Admin</span>
        </Button>
      </Link>
    )}
    <Link to="/favorites" onClick={() => setMobileMenuOpen(false)}>
      <Button variant="ghost" className="flex flex-col items-center gap-1 relative">
        <Heart className="w-5 h-5" />
        <span className="text-xs">Wishlist</span>
        {likedItems.length > 0 && (
          <Badge className="absolute -top-1 right-4 h-5 w-5 flex items-center justify-center p-0 text-xs">{likedItems.length}</Badge>
        )}
      </Button>
    </Link>
    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
      <Button variant="ghost" className="flex flex-col items-center gap-1">
        <User className="w-5 h-5" />
        <span className="text-xs">Account</span>
      </Button>
    </Link>
    <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
      <Button variant="ghost" className="flex flex-col items-center gap-1 relative">
        <ShoppingCart className="w-5 h-5" />
        <span className="text-xs">Cart</span>
        {totalItems > 0 && (
          <Badge className="absolute -top-1 right-4 h-5 w-5 flex items-center justify-center p-0 text-xs">{totalItems}</Badge>
        )}
      </Button>
    </Link>
  </div>
);

export default Navigation;
