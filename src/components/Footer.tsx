// src/components/Footer.tsx
import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "./ui/button"
import logo from "@/assets/logo.png"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"

const Footer = () => {
  const [email, setEmail] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!email) {
      alert("Please enter your email address.")
      return
    }

    try {
      const { data, error } = await supabase
        .from("subscribers")
        .insert([{ email }])
        .select()

      if (error) {
        console.error("Error inserting data:", error)
        alert("There was an error subscribing. Please try again.")
      } else {
        alert("Thank you for subscribing!")
        setEmail("") // Clear the input field
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error)
      alert("An unexpected error occurred. Please try again later.")
    }
  }

  return (
    <footer className="bg-muted border-t border-border">
      <NewsletterSection handleSubmit={handleSubmit} setEmail={setEmail} email={email} />
      <MainFooter />
    </footer>
  )
}

const NewsletterSection = ({ handleSubmit, setEmail, email }: {
  handleSubmit: (event: React.FormEvent) => void
  setEmail: (email: string) => void
  email: string
}) => (
  <div className="bg-gradient-gold py-12">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
          Stay Connected with Guruprasad Jewellers
        </h3>
        <p className="text-white/90 mb-6">
          Subscribe to receive exclusive offers, new collection updates, and special events
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="bg-white text-primary hover:bg-white/90 font-semibold py-3 px-6 h-auto">
            Subscribe
          </Button>
        </form>
        <Button asChild className="mt-6 bg-white text-primary hover:bg-white/90 font-semibold py-3 px-6 h-auto">
          <Link to="/review">
            Review Us
          </Link>
        </Button>
      </div>
    </div>
  </div>
)

const MainFooter = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <BrandColumn />
      <QuickLinks />
      <CustomerService />
      <ContactInfo />
    </div>
    <BottomBar />
  </div>
)

const BrandColumn = () => (
  <div className="space-y-4">
    <img src={logo} alt="Guruprasad Jewellers" className="h-56 md:h-64 w-auto object-contain" />
    <p className="text-muted-foreground text-sm">
      Crafting timeless jewelry since 2000. Your trusted destination for exquisite gold, diamond, and gemstone jewelry.
    </p>
    <SocialLinks />
  </div>
)

const SocialLinks = () => (
  <div className="flex gap-3">
    <a href="#" className="w-9 h-9 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
      <Facebook className="w-4 h-4" />
    </a>
    <a href="https://www.instagram.com/guruprasadjewellery?igsh=ejgxN2E2eTE1ZWxw&utm_source=qr" className="w-9 h-9 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
      <Instagram className="w-4 h-4" />
    </a>
    <a href="#" className="w-9 h-9 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
      <Twitter className="w-4 h-4" />
    </a>
  </div>
)

const QuickLinks = () => (
  <div>
    <h4 className="font-semibold mb-4">Quick Links</h4>
    <ul className="space-y-2">
      <li>
        <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
          About Us
        </Link>
      </li>
      <li>
        <Link to="/collections/all" className="text-muted-foreground hover:text-primary transition-colors text-sm">
          Our Collections
        </Link>
      </li>
      <li>
        <Link to="/collections/all" className="text-muted-foreground hover:text-primary transition-colors text-sm">
          New Arrivals
        </Link>
      </li>
      <li>
        <Link to="/collections/bridal" className="text-muted-foreground hover:text-primary transition-colors text-sm">
          Bridal Collection
        </Link>
      </li>
      <li>
        <Link to="/collections/all" className="text-muted-foreground hover:text-primary transition-colors text-sm">
          Gift Sets
        </Link>
      </li>
      <li>
        <a
          href="https://maps.app.goo.gl/RkKsoRYpx55jrSm97"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors text-sm"
        >
          Store Locator
        </a>
      </li>
    </ul>
  </div>
)

const CustomerService = () => (
  <div>
    <h4 className="font-semibold mb-4">Customer Service</h4>
    <ul className="space-y-2">
      {[
        "Book Appointment",
        "Shipping & Delivery",
        "Returns & Exchange",
        "Size Guide",
        "Care Guide",
      ].map((item) => (
        <li key={item}>
          <Link to={item === "Care Guide" ? "/careguide" : item === "Book Appointment" ? "/schedule-visit" : item === "Size Guide" ? "/size-guide" : "#"} className="text-muted-foreground hover:text-primary transition-colors text-sm">
            {item}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

const ContactInfo = () => (
  <div>
    <h4 className="font-semibold mb-4">Contact Us</h4>
    <div className="space-y-3">
      <a href="tel:+919945763133" className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors text-sm">
        <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
        <span>+91 99457 63133</span>
      </a>
      <a href="tel:+918431658122" className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors text-sm">
        <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
        <span>+91 84316 58122</span>
      </a>
      <a href="mailto:guruprasadjewellery@gmail.com" className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors text-sm">
        <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
        <span>guruprasadjewellery@gmail.com</span>
      </a>
      <div className="flex items-start gap-3 text-muted-foreground text-sm">
        <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
        <span>Mandoli Rd, Guruprasad colony,<br />Bhavani Nagar, Belagavi,<br />Karnataka 590008</span>
      </div>
    </div>
    <Certifications />
  </div>
)

const Certifications = () => (
  <div className="mt-6">
    <h5 className="font-semibold text-sm mb-2">Certifications</h5>
    <div className="flex gap-2">
      <div className="px-3 py-1 bg-background rounded text-xs font-medium">
        BIS Hallmarked
      </div>
      <div className="px-3 py-1 bg-background rounded text-xs font-medium">
        IGI Certified
      </div>
    </div>
  </div>
)

const BottomBar = () => (
  <div className="border-t border-border pt-6">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-sm text-muted-foreground text-center md:text-left">
        © 2000- Guruprasad Jewellers. All rights reserved.
      </p>
      <LegalLinks />
    </div>
  </div>
)

const LegalLinks = () => (
  <div className="flex gap-6 text-sm">
    <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
      Privacy Policy
    </Link>
    <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
      Terms of Service
    </Link>
    <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
      Sitemap
    </Link>
  </div>
)

export default Footer
