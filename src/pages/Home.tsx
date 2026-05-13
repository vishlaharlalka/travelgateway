import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Star, Calendar, Users, ShieldCheck, Globe, Plane, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CurrencyConverter from "@/components/CurrencyConverter";
import { formatInr, parseInrPrice } from "@/lib/pricing";

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=2000",
    location: "Maasai Mara, Kenya",
    title: "Wild Majesty"
  },
  {
    url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2000",
    location: "Ha Long Bay, Vietnam",
    title: "Emerald Waters"
  },
  {
    url: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&q=80&w=2000",
    location: "Angkor Wat, Cambodia",
    title: "Ancient Echoes"
  },
  {
    url: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=2000",
    location: "Palawan, Philippines",
    title: "Island Paradise"
  }
];

const featuredDestinations = [
  {
    id: 1,
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800",
    price: "₹1,08,000",
    rating: 4.9,
    category: "Coastal",
  },
  {
    id: 2,
    name: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    price: "₹1,54,000",
    rating: 4.8,
    category: "Cultural",
  },
  {
    id: 3,
    name: "Swiss Alps, Switzerland",
    image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800",
    price: "₹1,75,000",
    rating: 5.0,
    category: "Adventure",
  },
  {
    id: 4,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
    price: "₹79,000",
    rating: 4.7,
    category: "Tropical",
  },
];

const services = [
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: "Custom Itineraries",
    description: "Tailor-made travel plans designed around your unique interests and pace.",
  },
  {
    icon: <Plane className="w-8 h-8 text-primary" />,
    title: "Seamless Logistics",
    description: "From flights to private transfers, we handle every detail for a stress-free trip.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Travel Insurance",
    description: "Comprehensive coverage to protect you and your investment wherever you go.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Group Expeditions",
    description: "Expertly guided small group tours for like-minded adventure seekers.",
  },
];

const testimonials = [
  {
    name: "Rahul & Priya Sharma",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=900",
    feedback: "TravelGateway transformed our honeymoon into a dream. Vishal's attention to detail was incredible, from the private dinners in Santorini to the seamless flight connections. We felt like royalty throughout the trip.",
    role: "Honeymooners from Ahmedabad"
  },
  {
    name: "Amit Patel",
    photo: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=400",
    feedback: "As a business owner, I appreciate efficiency and precision. TravelGateway handles my complex multi-city family trips with such ease that I can focus entirely on enjoying time with my loved ones. Highly recommended for busy professionals.",
    role: "Business Owner, Surat"
  },
  {
    name: "Ananya Iyer",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    feedback: "The off-beat locations suggested by Vishal in Vietnam were the highlight of our trip. We explored hidden cafes in Hanoi and serene bays that most tourists never get to see. Truly a personalized experience that respects local culture.",
    role: "Culture & Solo Traveler"
  },
  {
    name: "Dr. Vikram Malhotra",
    photo: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=900",
    feedback: "Our family safari in Kenya was perfectly organized. Every detail from vegetarian meal preferences to child-safe activities was pre-arranged. Vishal's team ensures a safety standard that is unmatched for Indian families traveling abroad.",
    role: "Family Traveler, Mumbai"
  }
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden">
      <SEO
        title="Travel Gateway | Luxury Travel Agency in Ahmedabad for India and International Tours"
        description="Travel Gateway is a boutique travel agency in Ahmedabad helping Indian travelers and international guests book curated holidays, India tours, luxury trains, safaris, and personalized trip planning."
        canonicalPath="/"
        keywords="travel agency Ahmedabad, travel agent India, international tour booking Ahmedabad, India luxury travel, inbound India travel planner, Golden Chariot booking, Palace on Wheels booking, Gujarat travel consultant"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: "Travel Gateway",
            url: "https://travelgateway.in/",
            telephone: "+91 9898111689",
            email: "enquiries@travelgateway.in",
            address: {
              "@type": "PostalAddress",
              streetAddress: "G 901, Samanvay Scintilla, VIP Road, South Bopal",
              addressLocality: "Ahmedabad",
              addressRegion: "Gujarat",
              postalCode: "380058",
              addressCountry: "IN",
            },
            areaServed: ["India", "United States", "United Kingdom", "UAE", "Australia", "Canada", "Europe"],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Travel Gateway",
            url: "https://travelgateway.in/",
          },
        ]}
      />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-36 sm:pt-40 lg:pt-28">
        <motion.div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-12 left-12 z-20 hidden md:block">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={currentImageIndex === index ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10"
                >
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Featured Location</p>
                  <p className="text-white font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> {image.location}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background" />
        </motion.div>

        <motion.div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-16 text-center text-white sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="mx-auto mb-6 max-w-72 rounded-full bg-white/18 px-4 py-2 text-center text-sm font-medium leading-snug text-white backdrop-blur-md sm:w-fit sm:max-w-[32rem]">
              <span className="sm:hidden">Luxury holidays, planned from Ahmedabad</span>
              <span className="hidden sm:inline">Luxury India and international holidays, planned from Ahmedabad</span>
            </p>
            <h1 className="mx-auto mb-8 max-w-72 text-4xl font-bold leading-[1.08] tracking-tight sm:w-auto sm:max-w-none sm:text-5xl md:text-7xl lg:text-8xl">
              <span className="hidden sm:inline">
                Bespoke India and <br />
                <span className="text-primary italic">World Journeys</span>
              </span>
              <span className="sm:hidden">
                Bespoke India <br />
                <span className="text-primary italic">and World</span>
                <br />
                <span className="text-primary italic">Journeys</span>
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-72 text-base leading-relaxed text-white/80 sm:max-w-2xl sm:text-lg md:text-xl">
              Travel Gateway is a boutique travel company in Ahmedabad for Indian travelers going abroad and international guests booking curated India trips, luxury trains, safaris, family holidays, and high-touch custom itineraries.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-2xl shadow-primary/20 transition-colors hover:bg-primary/90"
              >
                Plan Your Trip
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/destinations"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Explore Destinations
              </Link>
            </div>
            <div className="mx-auto mt-6 flex max-w-72 flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white/70 sm:max-w-full sm:text-xs sm:tracking-[0.24em]">
              <span>India bookings</span>
              <span>International holidays</span>
              <span>Inbound luxury travel</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-none">Meet the Founder</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Vishal Harlalka</h2>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed italic">
                "Travel is not just about seeing new places; it's about seeing the world with new eyes. My team and I are dedicated to making every trip a masterpiece of memories."
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                With years of experience in the travel industry, Vishal Harlalka founded TravelGateway to provide a more personalized, boutique approach to travel planning. Every client receives direct attention from our expert team, ensuring no detail is overlooked.
              </p>
              <Button
                render={<Link to="/about" />}
                variant="outline"
                className="rounded-full px-8 py-6 text-lg border-primary text-primary hover:bg-primary hover:text-white transition-all"
              >
                Learn More About Our Approach
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">Handpicked Destinations</h2>
              <p className="text-muted-foreground text-lg">
                Locations vetted by Vishal and the team for their exceptional quality and unique charm.
              </p>
            </div>
            <Button render={<Link to="/destinations" />} variant="ghost" className="text-primary font-semibold group">
              View All Destinations
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDestinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-500 rounded-3xl">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-black backdrop-blur-sm border-none">
                        {dest.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                      <div className="flex items-center gap-1 text-yellow-400 mb-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold">{dest.rating}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{dest.name}</h3>
                      <p className="text-white/80 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Starting from {dest.price}*
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">T&C apply</p>
                      <p className="mt-2 text-xs font-semibold text-white/75">
                        India fare view: {formatInr(parseInrPrice(dest.price))}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-8">
            <CurrencyConverter amountInInr={parseInrPrice(featuredDestinations[0].price)} compact />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6 tracking-tight">The TravelGateway Difference</h2>
            <p className="text-muted-foreground text-lg">
              We provide a level of personal care that large agencies simply can't match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-6 inline-block p-4 bg-primary/10 rounded-2xl">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <div className="max-w-xl">
              <Badge className="mb-4 bg-primary/10 text-primary border-none">Testimonials</Badge>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">What Our Travelers Say</h2>
              <p className="text-muted-foreground text-lg">
                Stories of unforgettable journeys from those who have explored the world with TravelGateway.
              </p>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-primary/20 hover:bg-primary/5 h-12 w-12"
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-primary/20 hover:bg-primary/5 h-12 w-12"
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                <div className="relative">
                  <Quote className="absolute -top-12 -left-12 w-24 h-24 text-primary/10 -z-10" />
                  <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-10 italic text-foreground">
                    "{testimonials[activeTestimonial].feedback}"
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="h-1 bg-primary w-12" />
                    <div>
                      <p className="text-xl font-bold">{testimonials[activeTestimonial].name}</p>
                      <p className="text-muted-foreground">{testimonials[activeTestimonial].role}</p>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                    <img 
                      src={testimonials[activeTestimonial].photo} 
                      alt={testimonials[activeTestimonial].name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Floating dots decoration */}
                  <div className="absolute -top-6 -right-6 grid grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-primary/20" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center mt-16 gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeTestimonial === i ? "w-10 bg-primary" : "w-2.5 bg-primary/20"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[3rem] bg-primary text-primary-foreground p-12 md:p-24">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <Globe className="w-full h-full scale-150 translate-x-1/4 translate-y-1/4" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Ready to plan your <br /> next masterpiece?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 leading-relaxed">
              Join the exclusive circle of travelers who trust Vishal Harlalka and TravelGateway for their most precious journeys.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button render={<Link to="/contact" />} size="lg" variant="secondary" className="rounded-full px-8 py-7 text-lg font-bold">
                Get a Free Quote
              </Button>
              <Button render={<Link to="/contact" />} size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground">
                Contact Vishal Directly
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
