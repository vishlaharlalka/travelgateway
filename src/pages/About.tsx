import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Heart, 
  Award, 
  ChevronRight, 
  Compass, 
  ShieldCheck, 
  Gem, 
  MapPin,
  Sparkles,
  Crown,
  Zap,
  UserCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="pt-32 pb-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="mb-32 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight leading-tight">
              Personalized Travel <br />
              <span className="text-primary italic">by Vishal Harlalka</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              TravelGateway was founded by Vishal Harlalka with a simple yet powerful mission: to bring the "personal" back into travel planning. In an era of automated booking engines, we believe that true luxury lies in human connection and expert curation.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Vishal and his handpicked team of travel specialists work closely with each client to understand their unique preferences, ensuring that every itinerary is a reflection of their individual personality and travel style.
            </p>
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-[3rem] bg-primary/5 border border-primary/10"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              Our Mission
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              To transform the way Indian travelers experience the world by providing unparalleled personalization, expert local insights, and a seamless journey from inception to completion.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-12 rounded-[3rem] bg-muted border border-border"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Compass className="w-8 h-8 text-primary" />
              Our Vision
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              To be the most trusted name in boutique travel consultancy, recognized for our integrity, creativity, and the deep human connections we foster across the globe.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Our Core Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These principles guide every decision we make and every itinerary we craft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <Heart className="w-10 h-10 text-primary" />,
                title: "Passion for Excellence",
                description: "We don't settle for 'good enough'. We strive for perfection in every detail, from hotel selection to airport transfers.",
              },
              {
                icon: <ShieldCheck className="w-10 h-10 text-primary" />,
                title: "Uncompromising Integrity",
                description: "We work on a foundation of trust. Our recommendations are always based on what's best for you, not our bottom line.",
              },
              {
                icon: <Award className="w-10 h-10 text-primary" />,
                title: "Exclusivity & Discretion",
                description: "We provide high-value travelers with the privacy and exclusive access they deserve, handled with utmost care.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: [0.21, 0.47, 0.32, 0.98] 
                }}
              >
                <Card className="h-full border-none shadow-md rounded-3xl p-10 hover:shadow-xl transition-all duration-500 bg-card/50 backdrop-blur-sm group hover:-translate-y-2">
                  <motion.div 
                    className="mb-6 inline-block"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {value.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed transition-colors group-hover:text-foreground/80">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team & Expertise */}
        <div className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" 
                  alt="Travel Gateway Team" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary rounded-3xl -z-10 animate-pulse opacity-20" />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl font-bold mb-8 tracking-tight">Expertise You Can Trust</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-primary">Decades of Discovery</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Vishal Harlalka brings over 20 years of intensive travel consultancy experience. Having explored over 50 countries personally, he doesn't just read about destinations; he knows them.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-primary">Global Network</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our team maintains direct relationships with boutique hoteliers, private guides, and local fixers worldwide. This network ensures our clients get treatment that standard booking engines can't provide.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-primary">Relentless Curation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We spend hundreds of hours every year researching new trends, visiting new properties, and refining our itineraries. If it's on a TravelGateway trip, it's been vetted.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* The TravelGateway Advantage - Distinct Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-32 -mx-6 md:-mx-12 lg:-mx-24 px-6 md:px-12 lg:px-24 py-24 bg-slate-950 text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] -ml-64 -mb-64" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="max-w-3xl mb-20 text-center mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">The Boutique Advantage</h2>
              <p className="text-slate-400 text-xl leading-relaxed">
                We go beyond booking. We curate experiences that are defined by their depth, precision, and personal touch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Award className="w-12 h-12 text-primary" />,
                  title: "Expertise",
                  description: "Leverage 20 years of boots-on-the-ground knowledge. We find the soul of a destination, not just its surface."
                },
                {
                  icon: <UserCheck className="w-12 h-12 text-primary" />,
                  title: "Personalization",
                  description: "Every second reflects your rhythm. Your itinerary is a unique fingerprint, never duplicated for another client."
                },
                {
                  icon: <Crown className="w-12 h-12 text-primary" />,
                  title: "Exclusive Access",
                  description: "Unlock private views, sold-out venues, and invitation-only events through our elite global partnerships."
                },
                {
                  icon: <Zap className="w-12 h-12 text-primary" />,
                  title: "Proactive Ease",
                  description: "Travel with absolute peace of mind. We monitor your journey 24/7, handling details before you even notice them."
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="mb-8 transform group-hover:scale-110 transition-transform duration-300">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <div className="mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">Why Choose Travel Gateway</h2>
              <p className="text-muted-foreground text-lg">
                We don't just book trips; we craft legacies of discovery and wonder.
              </p>
            </div>
            <div className="hidden md:block h-px flex-grow bg-border mx-8 mb-4 opacity-50" />
            <div className="text-primary font-serif italic text-xl whitespace-nowrap mb-2">
              Experience the Vishal Harlalka standard.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Compass className="w-8 h-8" />,
                title: "Expert Guidance",
                description: "Over two decades of travel expertise distilled into every itinerary we create.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: <Gem className="w-8 h-8" />,
                title: "Exclusive Access",
                description: "From private museum tours to hidden villas, we open doors others didn't know existed.",
                color: "bg-purple-50 text-purple-600"
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Total Peace of Mind",
                description: "Meticulous planning and 24/7 support mean you only have to worry about where to look next.",
                color: "bg-emerald-50 text-emerald-600"
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Local Depth",
                description: "Our global network of local insiders ensures you see the soul of a place, not just its surface.",
                color: "bg-orange-50 text-orange-600"
              }
            ].map((usp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full p-8 rounded-[2rem] border border-border/50 bg-card hover:border-primary/50 transition-colors duration-300">
                  <div className={`w-16 h-16 rounded-2xl ${usp.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {usp.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{usp.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {usp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-muted/50 rounded-[3rem] p-12 md:p-20 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div>
            <p className="text-5xl font-bold text-primary mb-2">5k+</p>
            <p className="text-muted-foreground font-medium">Curated Trips</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-primary mb-2">60+</p>
            <p className="text-muted-foreground font-medium">Global Destinations</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-primary mb-2">100%</p>
            <p className="text-muted-foreground font-medium">Personalized Attention</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-primary mb-2">24/7</p>
            <p className="text-muted-foreground font-medium">Founder Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
