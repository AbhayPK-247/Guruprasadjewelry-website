import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import goldJewelry from "@/assets/gold-jewelry.jpg";
import diamondJewelry from "@/assets/diamond-jewelry.jpg";
import silverJewelry from "@/assets/silver-jewelry.jpg";
import gemstoneJewelry from "@/assets/gemstone-jewelry.jpg";
import bridalCollection from "@/assets/bridal-collection.jpg";

const CategoryShowcase = () => {
  const mainCategories = [
    {
      title: "Gold Collection",
      description: "Timeless elegance in 22K & 18K gold",
      image: goldJewelry,
      link: "/collections/gold",
      color: "from-yellow-50 to-amber-50"
    },
    {
      title: "Diamond Jewelry",
      description: "Sparkling brilliance for every occasion",
      image: diamondJewelry,
      link: "/collections/diamond",
      color: "from-blue-50 to-cyan-50"
    },
    {
      title: "Silver Collection",
      description: "Contemporary designs with traditional charm",
      image: silverJewelry,
      link: "/collections/silver",
      color: "from-gray-50 to-slate-50"
    },
    {
      title: "Gemstone Jewelry",
      description: "Vibrant colors, precious stones",
      image: gemstoneJewelry,
      link: "/collections/gemstones",
      color: "from-purple-50 to-pink-50"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Explore Our Collections
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Each piece is a masterpiece, crafted with precision and passion
          </p>
        </div>

        {/* Main Categories Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {mainCategories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-luxury transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent`} />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-white/90 mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-white font-medium group-hover:text-primary transition-colors">
                    Explore Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-shine opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:animate-shimmer" />
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Bridal Collection Banner */}
        <Link
          to="/collections/bridal"
          className="group relative block overflow-hidden rounded-2xl shadow-soft hover:shadow-luxury transition-all duration-500 animate-fade-in"
        >
          <div className="aspect-[21/9] md:aspect-[21/6] relative">
            <img
              src={bridalCollection}
              alt="Bridal Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-xl">
                  <span className="inline-block text-primary text-sm font-medium uppercase tracking-wider bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    Exclusive Collection
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    Bridal Collection
                  </h3>
                  <p className="text-white/90 text-lg mb-6">
                    Make your special day extraordinary with our handpicked bridal jewelry
                  </p>
                  <div className="inline-flex items-center bg-gradient-gold px-6 py-3 rounded-lg text-white font-medium group-hover:shadow-luxury transition-all">
                    View Collection
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {["New Arrivals", "Trending", "Best Sellers", "Gift Sets"].map((item, index) => (
            <Link
              key={index}
              to={item === "New Arrivals" ? "/collections/new-arrivals" : `/${item.toLowerCase().replace(' ', '-')}`}
              className="p-6 text-center border-2 border-border rounded-xl hover:border-primary hover:bg-secondary transition-all group"
            >
              <div className="font-semibold mb-1 group-hover:text-primary transition-colors">
                {item}
              </div>
              <div className="text-sm text-muted-foreground">Explore →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
