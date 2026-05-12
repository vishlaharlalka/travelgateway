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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEffect } from "react";
import CurrencyConverter from "@/components/CurrencyConverter";

export default function GoldenChariot() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Golden Chariot: Pride of Karnataka | Luxury Rail Journey";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Experience IRCTC's Golden Chariot on the Pride of Karnataka route, a 5 nights / 6 days luxury rail journey through Karnataka and Goa.");
    }
  }, []);

  const galleryImages = [
    { src: "https://www.goldenchariot.org/luxury-tourist-train-south-india/img/5.jpg", title: "Official Exterior", description: "The Golden Chariot's signature purple-and-gold exterior from the operator site." },
    { src: "https://www.goldenchariot.org/luxury-tourist-train-south-india/img/5.jpg", title: "Royal Coaches", description: "A closer look at the train livery used across the Golden Chariot coaches." },
    { src: "https://www.goldenchariot.org/luxury-tourist-train-south-india/img/5.jpg", title: "Onboard Identity", description: "The official Golden Chariot branding and coach styling visible along the rake." }
  ];

  const itinerary = [
    { day: "Day 1", title: "Bengaluru Departure", description: "Board the Golden Chariot in Bengaluru and settle in for the Pride of Karnataka journey as the train begins its luxury circuit." },
    { day: "Day 2", title: "Bandipur & Mysuru", description: "Start with Bandipur Tiger Reserve's wilderness setting, then continue to Mysuru for the city's royal palace and heritage atmosphere." },
    { day: "Day 3", title: "Halebidu & Chikkamagaluru", description: "Discover Hoysala-era temple artistry at Halebidu before heading through the lush coffee landscapes of Chikkamagaluru." },
    { day: "Day 4", title: "Hampi", description: "Spend the day among the UNESCO-listed Vijayanagara ruins of Hampi, including its celebrated temple complexes and stone chariot precinct." },
    { day: "Day 5", title: "Pattadakal, Aihole & Goa", description: "Explore the Chalukyan heritage corridor around Pattadakal and Aihole before the route extends onward toward Goa." },
    { day: "Day 6", title: "Goa to Bengaluru", description: "Enjoy the final day of the circuit with Goa's heritage flavour before the return stretch to Bengaluru and disembarkation." }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A]">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15 }}
          src="https://www.goldenchariot.org/luxury-tourist-train-south-india/img/5.jpg"
          alt="Golden Chariot Luxury Train"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-transparent to-black/30" />
        
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
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Rail
              </Button>
              <Badge className="bg-[#D4AF37] text-white border-none py-1.5 px-5 text-[0.7rem] font-black uppercase tracking-[0.2em] shadow-xl">
                Luxury Train Journey
              </Badge>
              <div className="flex items-center gap-2 text-white font-bold bg-black/40 backdrop-blur-md py-1.5 px-4 rounded-full text-xs border border-white/10">
                <Star className="w-4 h-4 text-[#D4AF37] fill-current" />
                <span>5.0 Excellence Rating</span>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-[#0B2147] md:text-white uppercase tracking-tighter leading-[0.85]">
              Pride of <br/>
              <span className="text-[#D4AF37]">Karnataka</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#0B2147]/80 md:text-white/90 max-w-2xl font-light leading-relaxed">
               IRCTC's Pride of Karnataka route combines wildlife, dynastic temple heritage, Hampi's monumental ruins, and Goa's coastal legacy in one luxury rail circuit.
            </p>

            <div className="flex items-center gap-8 text-[#0B2147] md:text-white/80 text-sm font-black uppercase tracking-widest pt-4">
              <span className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37]" /> Karnataka & Goa
              </span>
              <span className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#D4AF37]" /> 6 Days / 5 Nights
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Onboard Experience Stats */}
      <section className="py-20 px-6 border-b border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { value: "44", label: "Luxury Cabins", icon: <Train className="w-5 h-5" /> },
            { value: "2", label: "Fine Dining Cars", icon: <Utensils className="w-5 h-5" /> },
            { value: "1", label: "Spa & Gym", icon: <Sparkles className="w-5 h-5" /> },
            { value: "24/7", label: "Personal Butler", icon: <Gift className="w-5 h-5" /> },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-2"
            >
              <div className="flex justify-center text-[#D4AF37] mb-2">{stat.icon}</div>
              <p className="text-4xl font-black text-[#0B2147]">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Royal Gallery Carousel */}
      <section className="py-32 px-6 bg-[#FDFCFB]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="text-[#D4AF37] border-[#D4AF37] px-4 py-1 uppercase tracking-widest text-[0.6rem] font-bold">Atmosphere</Badge>
            <h2 className="text-4xl md:text-6xl font-black text-[#0B2147] leading-none uppercase tracking-tighter">
              The <span className="text-[#D4AF37]">Royal Gallery</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-light">A closer look at the official Golden Chariot exterior and the route identity used for the Pride of Karnataka journey.</p>
          </div>

          <div className="relative px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-8">
                {galleryImages.map((image, index) => (
                  <CarouselItem key={index} className="pl-4 md:pl-8 md:basis-1/2 lg:basis-1/2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-2xl aspect-[16/10]"
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-2xl font-black text-[#D4AF37] uppercase tracking-tight">{image.title}</h3>
                        <p className="text-white/80 font-light text-sm mt-1">{image.description}</p>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-6 h-12 w-12 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white" />
                <CarouselNext className="-right-6 h-12 w-12 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="outline" className="text-[#D4AF37] border-[#D4AF37] px-4 py-1 uppercase tracking-widest text-[0.6rem] font-bold">The Royal Narrative</Badge>
                <h2 className="text-4xl md:text-6xl font-black text-[#0B2147] leading-none uppercase tracking-tighter">
                  A Palace <br/><span className="text-[#D4AF37]">On Wheels</span>
                </h2>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                Named after the famous Stone Chariot in Hampi, The Golden Chariot luxury train invites you on a regal journey through South India. The interiors of the train are inspired by the Hoysala and Chalukya architectural styles, offering a seamless blend of historical grandeur and contemporary luxury.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed font-light italic border-l-4 border-[#D4AF37] pl-6 py-2">
                "Wait until the sun sets over the ruins of Hampi while you sip a single malt in the Madira Bar - it is an experience that transcends time."
              </p>
              <div className="pt-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider text-[#D4AF37] border border-[#D4AF37]/10">
                    <Music className="w-3 h-3" /> Pride of Karnataka
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider text-[#D4AF37] border border-[#D4AF37]/10">
                    <Coffee className="w-3 h-3" /> Gourmet Breakfast
                  </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-video lg:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img 
                src="https://www.goldenchariot.org/luxury-tourist-train-south-india/img/5.jpg" 
                alt="Golden Chariot official train exterior" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-500" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="py-32 px-6 bg-[#0B2147]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">
              Detailed <span className="text-[#D4AF37] not-italic">Chronicle</span>
            </h2>
            <p className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-xs">The Pride of Karnataka Route</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {itinerary.map((item, i) => (
                <div key={`summary-${i}`} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#D4AF37]">{item.day}</p>
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
                    <AccordionTrigger className="hover:no-underline bg-white/5 hover:bg-white/10 rounded-[2.5rem] px-8 py-10 transition-all group data-[state=open]:rounded-b-none data-[state=open]:bg-[#D4AF37] data-[state=open]:text-white">
                      <div className="flex items-center gap-8 text-left w-full">
                        <span className="text-4xl font-black opacity-30 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">{item.day}</p>
                          <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight leading-none">{item.title}</h3>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white px-10 py-12 rounded-b-[2.5rem] text-[#0B2147]">
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                          <div className="md:col-span-3 space-y-6">
                             <div className="flex items-center gap-2 text-[#D4AF37]">
                                <Compass className="w-5 h-5" />
                                <span className="font-black uppercase tracking-widest text-xs">Daily Excursion</span>
                             </div>
                             <p className="text-xl leading-relaxed font-light">
                               {item.description}
                             </p>
                          </div>
                          <div className="space-y-6 pt-6 md:pt-0">
                             <div className="p-6 bg-[#0B2147]/5 rounded-3xl border border-[#0B2147]/10 space-y-4">
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0B2147]">
                                   <Map className="w-3 h-3" /> Key Insight
                                </h4>
                                <p className="text-xs text-muted-foreground italic">
                                  Our signature TravelGateway guide will accompany you during these excursions to provide deep historical context.
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
          <div className="bg-[#D4AF37] rounded-[4rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
               <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="w-full h-full border-[100px] border-white rounded-full translate-x-1/2" 
               />
            </div>
            
            <div className="relative z-10 space-y-6">
               <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic">
                Reserve Your <br/><span className="not-italic opacity-80">Royal Cabin</span>
              </h2>
              <p className="text-white/90 text-xl md:text-2xl font-light max-w-2xl mx-auto">
                Limited departures strictly for the discerning traveler. Packages starting from ₹1,85,000* per person. T&C apply.
              </p>
              <div className="mx-auto max-w-xl">
                <CurrencyConverter amountInInr={185000} className="bg-white/95 text-left" />
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
              <Button 
                onClick={() => navigate("/contact?package=golden-chariot")}
                className="w-full md:w-auto px-12 py-10 rounded-full font-black text-2xl uppercase tracking-tighter bg-[#0B2147] hover:bg-black text-white shadow-3xl h-auto"
              >
                Inquire Now
              </Button>
              <Button 
                variant="outline"
                className="w-full md:w-auto px-12 py-10 rounded-full font-black text-xl uppercase tracking-tighter border-2 border-white text-white hover:bg-white hover:text-[#D4AF37] bg-transparent h-auto"
              >
                Download Menu
              </Button>
            </div>
            
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest relative z-10">
              *Exclusive TravelGateway Concierge Support Included
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

