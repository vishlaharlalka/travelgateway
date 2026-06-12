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
import SEO from "@/components/SEO";
import { defaultSeoImage, graphSchema, pageSchema } from "@/lib/seo";

export default function About() {
  return (
    <div className="pt-24 pb-16 px-6 bg-background">
      <SEO
        title="About Travel Gateway | Vishal Harlalka Travel Planner Ahmedabad"
        description="Meet Travel Gateway founder Vishal Harlalka and learn about the boutique Ahmedabad travel agency behind curated India and international journeys."
        canonicalPath="/about"
        image={defaultSeoImage}
        imageAlt="About Travel Gateway Ahmedabad"
        keywords="Vishal Harlalka, Travel Gateway Ahmedabad, boutique travel agency Ahmedabad, travel planner South Bopal"
        structuredData={graphSchema([
          pageSchema("/about", "About Travel Gateway | Vishal Harlalka Travel Planner Ahmedabad", "Meet Travel Gateway founder Vishal Harlalka and learn about the boutique Ahmedabad travel agency behind curated India and international journeys."),
        ])}
      />
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="mb-16 flex justify-center">
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
              Travel Gateway is run from Ahmedabad for travelers who want a human planner before they commit money to flights, hotels, visas, and ground arrangements. Vishal Harlalka stays close to the planning conversation so the trip is built around real constraints, not brochure promises.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The team starts with practical questions: who is traveling, how fast they like to move, what comfort level matters, where flexibility is needed, and which parts of the trip should be handled privately.
            </p>
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              Our Mission
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              To help Indian and inbound travelers make confident travel decisions with clear advice, realistic routing, verified suppliers, and support that continues after the booking is made.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[2rem] bg-muted border border-border"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Compass className="w-8 h-8 text-primary" />
              Our Vision
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              To become the Ahmedabad travel-planning team clients return to when they need careful judgment, transparent coordination, and trips that feel manageable from the first call.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Our Core Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These are the standards we use when comparing hotels, guides, routes, and supplier options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <Heart className="w-10 h-10 text-primary" />,
                title: "Clear Advice",
                description: "We explain tradeoffs before booking, including route timing, hotel location, comfort level, and what is worth upgrading.",
              },
              {
                icon: <ShieldCheck className="w-10 h-10 text-primary" />,
                title: "Transparent Choices",
                description: "Recommendations are kept practical and easy to compare, so clients understand why an option is being suggested.",
              },
              {
                icon: <Award className="w-10 h-10 text-primary" />,
                title: "Discreet Handling",
                description: "Family details, budgets, passports, and preferences are handled carefully and shared only where the booking requires it.",
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
                <Card className="h-full border-none shadow-md rounded-3xl p-8 hover:shadow-xl transition-all duration-500 bg-card/50 backdrop-blur-sm group hover:-translate-y-2">
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
        <div className="mb-16">
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
                    Vishal Harlalka has spent years helping Gujarat-based travelers compare destinations, hotels, visa requirements, and seasonal routes. The advice is grounded in what clients actually ask before they book.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-primary">Global Network</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The team coordinates with hotels, destination partners, transport teams, and local guides so itinerary details are checked before the traveler is on the road.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-primary">Relentless Curation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Suggested routes are reviewed for season, travel time, comfort, supplier reliability, and whether the pace makes sense for the people traveling.
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
          className="mb-16 -mx-6 md:-mx-12 lg:-mx-24 px-6 md:px-12 lg:px-24 py-16 bg-slate-950 text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] -ml-64 -mb-64" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="max-w-3xl mb-12 text-center mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">The Boutique Advantage</h2>
              <p className="text-slate-400 text-xl leading-relaxed">
                We help turn broad travel ideas into workable plans, with fewer surprises between inquiry, booking, departure, and return.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Award className="w-12 h-12 text-primary" />,
                  title: "Expertise",
                  description: "Get route, season, hotel, and transport guidance before the itinerary is finalized."
                },
                {
                  icon: <UserCheck className="w-12 h-12 text-primary" />,
                  title: "Personalization",
                  description: "Keep the trip paced for your family, group size, comfort level, and budget."
                },
                {
                  icon: <Crown className="w-12 h-12 text-primary" />,
                  title: "Supplier Coordination",
                  description: "Work with one planning team while hotels, guides, transfers, and local partners are coordinated in the background."
                },
                {
                  icon: <Zap className="w-12 h-12 text-primary" />,
                  title: "Proactive Ease",
                  description: "Have a reachable team for changes, local timing questions, and travel-day clarifications."
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
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">Why Choose Travel Gateway</h2>
              <p className="text-muted-foreground text-lg">
                A closer look at the planning habits that make trips easier to understand before you pay.
              </p>
            </div>
            <div className="hidden md:block h-px flex-grow bg-border mx-8 mb-4 opacity-50" />
            <div className="text-primary font-serif italic text-xl whitespace-nowrap mb-2">
              Practical, personal, accountable.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Compass className="w-8 h-8" />,
                title: "Expert Guidance",
                description: "Destination advice shaped by client questions, seasonal constraints, and route logic.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: <Gem className="w-8 h-8" />,
                title: "Better Fit",
                description: "Hotels, guides, and activities are chosen for the traveler, not just the destination name.",
                color: "bg-purple-50 text-purple-600"
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Travel-Day Support",
                description: "Key contacts and changes stay organized so travelers are not left guessing.",
                color: "bg-emerald-50 text-emerald-600"
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Local Depth",
                description: "Local partners help check timing, transport, and on-ground practicality.",
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
        <div className="bg-muted/50 rounded-[2rem] p-8 md:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
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
