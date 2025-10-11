interface CollectionHeroProps {
  title: string;
  subtitle: string;
  tagline?: string;
  imageSrc: string;
}

export const CollectionHero = ({ title, subtitle, tagline, imageSrc }: CollectionHeroProps) => {
  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden mb-12 rounded-2xl animate-fade-in">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-700 hover:scale-110"
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {tagline && (
            <p className="text-primary font-medium tracking-wider uppercase text-sm md:text-base">
              {tagline}
            </p>
          )}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
            {subtitle}
          </p>
          
          {/* Decorative shine effect */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 left-60 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
