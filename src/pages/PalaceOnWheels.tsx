import { motion } from "framer-motion";
import { 
  MapPin, Clock, Star, CheckCircle2, 
  Download, ArrowLeft, ShieldCheck, 
  Sparkles, Coffee, Train, Utensils, Music,
  Compass, Map, Gift
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect } from "react";
import CurrencyConverter from "@/components/CurrencyConverter";

export default function PalaceOnWheels() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Palace on Wheels: The Original Luxury Rail of India";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Experience the official Palace on Wheels route: a 7 nights / 8 days luxury rail journey from New Delhi through Rajasthan, Bharatpur, and Agra.");
    }
  }, []);

  const itinerary = [
    { day: "Day 1", title: "New Delhi: Royal Welcome", description: "Board at Safdarjung Railway Station in New Delhi after the train's signature ceremonial welcome and settle into your cabin." },
    { day: "Day 2", title: "Jaipur", description: "Discover Jaipur's Pink City landmarks and courtly heritage, with the day built around its palaces, forts, and historic facades." },
    { day: "Day 3", title: "Sawai Madhopur & Chittorgarh", description: "Start with the Ranthambore-side wildlife leg at Sawai Madhopur, then continue to the monumental fort setting of Chittorgarh." },
    { day: "Day 4", title: "Udaipur", description: "Spend the day in Udaipur amid palace architecture, lakeside views, and the signature Lake Pichola experience." },
    { day: "Day 5", title: "Jaisalmer", description: "Move into the Thar for Jaisalmer's fort, havelis, and desert ambience." },
    { day: "Day 6", title: "Jodhpur", description: "Explore Jodhpur's blue-city character and major fort heritage before returning onboard." },
    { day: "Day 7", title: "Bharatpur & Agra", description: "Continue through Bharatpur and then Agra, where the Palace on Wheels route reaches its Taj Mahal and Mughal heritage finale." },
    { day: "Day 8", title: "Return to New Delhi", description: "Arrive back in New Delhi for breakfast and disembarkation at the close of the 7 nights / 8 days circuit." }
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#2C1810]">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15 }}
          src="https://www.palaceonwheels.rajasthan.gov.in/public/admin/images/banners/82590695175755113167.jpg"
          alt="Palace on Wheels Luxury Train"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF9F2] via-transparent to-black/30" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/destinations")}
                className="rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border border-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Explore More
              </Button>
              <Badge className="bg-[#B58941] text-white border-none py-1.5 px-5 text-[0.7rem] font-black uppercase tracking-[0.2em] shadow-xl">
                The Original Luxury Rail
              </Badge>
              <div className="flex items-center gap-2 text-white font-bold bg-black/40 backdrop-blur-md py-1.5 px-4 rounded-full text-xs border border-white/10">
                <Star className="w-4 h-4 text-[#B58941] fill-current" />
                <span>5.0 Iconic Status</span>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-[#2C1810] md:text-white uppercase tracking-tighter leading-[0.85]">
              Palace on <br/>
              <span className="text-[#B58941]">Wheels</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#2C1810]/80 md:text-white/90 max-w-2xl font-light leading-relaxed">
              Step into India's original luxury heritage train as it travels from New Delhi through Rajasthan, Bharatpur, and Agra in classic royal style.
            </p>

            <div className="flex items-center gap-8 text-[#2C1810] md:text-white/80 text-sm font-black uppercase tracking-widest pt-4">
              <span className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#B58941]" /> New Delhi, Rajasthan, Bharatpur & Agra
              </span>
              <span className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#B58941]" /> 8 Days / 7 Nights
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Onboard Experience Stats */}
      <section className="py-20 px-6 border-b border-[#B58941]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { value: "42", label: "Luxury Cabins", icon: <Train className="w-5 h-5" /> },
            { value: "2", label: "Maharaja Restaurants", icon: <Utensils className="w-5 h-5" /> },
            { value: "1", label: "Royal Spa", icon: <Sparkles className="w-5 h-5" /> },
            { value: "Full", label: "Khidmatgar Service", icon: <Gift className="w-5 h-5" /> },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-2"
            >
              <div className="flex justify-center text-[#B58941] mb-2">{stat.icon}</div>
              <p className="text-4xl font-black text-[#2C1810]">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-video lg:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl order-2 lg:order-1"
            >
              <img 
                src="https://www.palaceonwheels.rajasthan.gov.in/public/admin/images/banners/674513927919416555.png" 
                alt="Palace on Wheels official train welcome" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-500" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 order-1 lg:order-2"
            >
              <div className="space-y-4">
                <Badge variant="outline" className="text-[#B58941] border-[#B58941] px-4 py-1 uppercase tracking-widest text-[0.6rem] font-bold">The Heritage Legacy</Badge>
                <h2 className="text-4xl md:text-6xl font-black text-[#2C1810] leading-none uppercase tracking-tighter">
                  Regal <br/><span className="text-[#B58941]">Opulence</span>
                </h2>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                The Palace on Wheels is India's original luxury heritage train. The current official route runs for 7 nights / 8 days from New Delhi through Jaipur, Sawai Madhopur, Chittorgarh, Udaipur, Jaisalmer, Jodhpur, Bharatpur, and Agra before returning to the capital.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed font-light italic border-l-4 border-[#B58941] pl-6 py-2">
                "Waking up to the desert sunrise in Jaisalmer while being served aromatic masala tea in your private saloon is the pinnacle of Indian luxury."
              </p>
              <div className="pt-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#B58941]/5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider text-[#B58941] border border-[#B58941]/10">
                    <Music className="w-3 h-3" /> Folk Performances
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#B58941]/5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider text-[#B58941] border border-[#B58941]/10">
                    <Utensils className="w-3 h-3" /> Indian & Continental
                  </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="py-32 px-6 bg-[#2C1810]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">
              Regal <span className="text-[#B58941] not-italic">Itinerary</span>
            </h2>
            <p className="text-[#B58941] font-bold uppercase tracking-[0.3em] text-xs">The Official 7 Nights / 8 Days Route</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {itinerary.map((item, i) => (
                <div key={`summary-${i}`} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#B58941]">{item.day}</p>
                  <h3 className="mt-2 text-lg font-black uppercase tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">{item.description}</p>
                </div>
              ))}
            </div>

            {itinerary.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
              <Accordion type="single" className="w-full">
                  <AccordionItem value={`item-${i}`} className="border-none mb-4">
                    <AccordionTrigger className="hover:no-underline bg-white/5 hover:bg-white/10 rounded-[2.5rem] px-8 py-10 transition-all group data-[state=open]:rounded-b-none data-[state=open]:bg-[#B58941] data-[state=open]:text-white">
                      <div className="flex items-center gap-8 text-left w-full">
                        <span className="text-4xl font-black opacity-30 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">{item.day}</p>
                          <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight leading-none">{item.title}</h3>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white px-10 py-12 rounded-b-[2.5rem] text-[#2C1810]">
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                          <div className="md:col-span-3 space-y-6">
                             <div className="flex items-center gap-2 text-[#B58941]">
                                <Compass className="w-5 h-5" />
                                <span className="font-black uppercase tracking-widest text-xs">Royal Excursion</span>
                             </div>
                             <p className="text-xl leading-relaxed font-light">
                               {item.description}
                             </p>
                          </div>
                          <div className="space-y-6 pt-6 md:pt-0">
                             <div className="p-6 bg-[#2C1810]/5 rounded-3xl border border-[#2C1810]/10 space-y-4">
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2C1810]">
                                   <Map className="w-3 h-3" /> Historical Note
                                </h4>
                                <p className="text-xs text-muted-foreground italic">
                                  Every saloon is named after a former princely state and is decorated to reflect its distinct heritage.
                                </p>
                             </div>
                          </div>
                       </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#B58941] rounded-[4rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6">
               <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic">
                Journey Liked <br/><span className="not-italic opacity-80">A Maharaja</span>
              </h2>
              <p className="text-white/90 text-xl md:text-2xl font-light max-w-2xl mx-auto">
                Join the original luxury rail experience of India. Packages starting from ₹2,10,000* per person. T&C apply.
              </p>
              <div className="mx-auto max-w-xl">
                <CurrencyConverter amountInInr={210000} className="bg-white/95 text-left" />
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
              <Button 
                onClick={() => navigate("/contact?package=palace-on-wheels")}
                className="w-full md:w-auto px-12 py-10 rounded-full font-black text-2xl uppercase tracking-tighter bg-[#2C1810] hover:bg-black text-white shadow-3xl h-auto"
              >
                Inquire Now
              </Button>
              <Button 
                variant="outline"
                className="w-full md:w-auto px-12 py-10 rounded-full font-black text-xl uppercase tracking-tighter border-2 border-white text-white hover:bg-white hover:text-[#B58941] bg-transparent h-auto"
              >
                View Deck Plan
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

