import { useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import { Volume2, VolumeX } from "lucide-react";
import Footer from "@/components/Footer";
import Interactive3D from "@/components/Interactive3D";
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';

const AboutUs = () => (
  <ParallaxProvider>
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <HeroSection />
      <BannerText />
      <ContentSection />
      <Footer />
    </div>
  </ParallaxProvider>
);

const HeroSection = () => {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-0 bg-white gap-10">
      {/* Apply parallax vertical translate effect to the 3D component */}
      <Parallax translateY={[-30, 30]}>
        <div className="w-screen h-[900px] m-0 p-0 flex justify-center items-center">
          <Interactive3D />
        </div>
      </Parallax>

      {/* Centered Video below the 3D object */}
      <div className="relative w-full max-w-5xl aspect-video bg-white rounded-2xl shadow-xl border border-gray-300 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/about_us_video.mp4"
          autoPlay
          loop
          muted={muted}
          playsInline
          className="w-full h-full object-contain fade-corners"
          style={{ background: "white", display: "block" }}
        />
        <button
          className="absolute bottom-6 right-8 p-2 bg-black bg-opacity-70 rounded-full text-white z-10"
          aria-label={muted ? "Unmute video" : "Mute video"}
          onClick={toggleMute}
          type="button"
        >
          {muted ? <VolumeX size={28} /> : <Volume2 size={28} />}
        </button>
      </div>
    </div>
  );
};

const BannerText = () => (
  <div className="w-full text-center px-4 py-8 bg-white border-b">
    <h1 className="text-4xl md:text-6xl font-serif mb-2 text-primary drop-shadow-lg">
      About Us
    </h1>
    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto drop-shadow-md">
      Learn about our history and the people behind Guruprasad Jewellers
    </p>
  </div>
);

const ContentSection = () => (
  <main className="flex-1 bg-gradient-to-b from-white via-secondary/10 to-white">
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <TeamSection />
        <HistorySection />
      </div>
    </div>
  </main>
);

const TeamSection = () => (
  <div>
    <h2 className="text-2xl font-serif mb-4">Our Team</h2>
    <div className="space-y-4">
      <FamilyMember name="Prashant Laxman Kalghatkar" title="Founder" />
      <FamilyMember name="Savita Prashant Kalghatkar" title="Co-founder" />
      <FamilyMember name="Anirudh Prashant Kalghatkar" title="Technical" />
      <FamilyMember name="Abhay Prashant Kalghatkar" title="Technical" />
    </div>
  </div>
);

const HistorySection = () => (
  <div>
    <h2 className="text-2xl font-serif mb-4">Our History</h2>
    <p className="text-muted-foreground">
      Guruprasad Jewellers was founded in 2000 with a vision to provide exquisite jewelry to customers.
      Since then, we have been committed to crafting timeless pieces with the finest materials and craftsmanship.
      Our dedication to quality and customer satisfaction has made us a trusted name in the industry.
    </p>
  </div>
);

const FamilyMember = ({ name, title }: { name: string; title: string }) => (
  <div className="flex items-center gap-4">
    <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0"></div>
    <div>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  </div>
);

export default AboutUs;
