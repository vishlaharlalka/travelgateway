import { motion } from "framer-motion";
import { MapPin, Clock, CheckCircle2, Star, ArrowRight, Plane, Hotel, Utensils, PhoneCall, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect } from "react";
import { destinations } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { generateDestinationPDF } from "@/lib/pdf";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Vietnam() {
  const navigate = useNavigate();
  const vietnamDestination = destinations.find((destination) => destination.link === "/destinations/vietnam");
  const inquiryPath = "/contact?destination=Vietnam%20Wonders";
  const whatsappMessage = encodeURIComponent(
    "Hi Vishal, I'm interested in the Vietnam Wonders package from Travel Gateway. Please share the itinerary and best available quote."
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Vietnam Tour Package from South Bopal, Ahmedabad | TravelGateway";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Book the best Vietnam tour package from South Bopal, Ahmedabad. Personalized itineraries by Vishal Harlalka at TravelGateway. Explore Ha Long Bay, Hanoi, and more."
      );
    }
  }, []);

  const handleDownloadItinerary = async () => {
    if (!vietnamDestination) return;
    await generateDestinationPDF(vietnamDestination);
  };

  const itinerary = [
    {
      day: "Day 1-2",
      title: "Hanoi Arrival & City Exploration",
      description:
        "Arrive in Vietnam's character-filled capital, settle into your hotel, and begin with the Old Quarter, key heritage landmarks, and an evening cultural show.",
      highlights: ["Old Quarter Walk", "Temple of Literature", "Water Puppet Show"],
    },
    {
      day: "Day 3",
      title: "Ha Long Bay Cruise",
      description:
        "Sail through Ha Long Bay's limestone seascape on an overnight cruise with time for kayaking, cave visits, and a relaxed evening on deck.",
      highlights: ["Kayaking", "Cave Exploration", "Sunset Deck Dinner"],
    },
    {
      day: "Day 4-5",
      title: "Da Nang & Hoi An Ancient Town",
      description:
        "Fly south for Central Vietnam's most photogenic stretch, including Ba Na Hills, the Golden Bridge, beach time, and lantern-lit Hoi An.",
      highlights: ["Golden Bridge", "Lantern Making", "Beach Relaxation"],
    },
    {
      day: "Day 6-7",
      title: "Ho Chi Minh City & Cu Chi Tunnels",
      description:
        "Finish in Ho Chi Minh City with its fast-paced energy, wartime history, shopping, and the option to add a Mekong Delta excursion.",
      highlights: ["Cu Chi Tunnels", "Ben Thanh Market", "Mekong Delta Day Trip"],
    },
  ];

  return (
    <div className="pt-20 pb-16 bg-background">
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2000"
            alt="Ha Long Bay Vietnam"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-primary text-white border-none px-4 py-1">Top Trending Destination</Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-6">
              Vietnam Tour Package <br />
              <span className="text-primary italic">from South Bopal, Ahmedabad</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              Explore Vietnam with a thoughtfully planned journey that balances headline sights, smooth logistics, and local guidance so your holiday feels polished from the moment you leave Ahmedabad.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-bold"
                onClick={() => navigate(inquiryPath)}
              >
                Get My Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                onClick={handleDownloadItinerary}
              >
                Download Itinerary
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-3xl font-bold mb-6 tracking-tight">Why Choose Our Vietnam Tour Package?</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Travel Gateway designs Vietnam holidays for travelers who want more than a generic online package. We help you move comfortably between Hanoi, Ha Long Bay, Central Vietnam, and Ho Chi Minh City with hotel choices, sightseeing pace, and meal planning that work especially well for Indian couples, families, and first-time Southeast Asia travelers.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: <Plane className="text-primary" />, text: "Smart flight planning from Ahmedabad with practical connection options" },
                  { icon: <CheckCircle2 className="text-primary" />, text: "Clear Vietnam e-visa guidance for Indian passport holders" },
                  { icon: <Utensils className="text-primary" />, text: "Vegetarian, Jain, and Indian meal preferences handled in advance" },
                  { icon: <Hotel className="text-primary" />, text: "Well-reviewed 4-star and 5-star stays selected for comfort and location" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl">
                    {item.icon}
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-8 tracking-tight">The Ultimate 7-Day Itinerary</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                This sample route is ideal for a classic first trip to Vietnam with a strong mix of scenery, culture, and breathing room. We can also tailor it for honeymoons, family travel, premium upgrades, or slower pacing.
              </p>
              <div className="space-y-8">
                {itinerary.map((item, i) => (
                  <div key={i} className="relative pl-8 border-l-2 border-primary/30 pb-8 last:pb-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full" />
                    <Badge variant="outline" className="mb-2 text-primary border-primary">
                      {item.day}
                    </Badge>
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="bg-muted text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-muted/30 p-8 md:p-12 rounded-[2.5rem]">
              <h2 className="text-3xl font-bold mb-6 tracking-tight">Vietnam Tour FAQs: Everything You Need to Know</h2>
              <Accordion type="single" className="w-full">
                <AccordionItem value="item-1" className="border-b-muted">
                  <AccordionTrigger className="text-lg font-bold text-left">
                    What is the best time to book a Vietnam tour package from Ahmedabad?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    The most popular travel window is from November to April, when much of Vietnam enjoys comfortable weather for sightseeing and cruising. If your dates are flexible, we can also suggest value-focused departures in May or October when fares are often softer and crowds are lighter.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-b-muted">
                  <AccordionTrigger className="text-lg font-bold text-left">
                    How much does a Vietnam trip cost from India for a couple?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    A well-planned 7-day Vietnam holiday usually starts around {"\u20B9"}75,000* per person, T&C apply, depending on your travel month, flight choice, hotel category, and inclusions. For couples and families, we prepare custom quotes so you can compare value clearly before you commit.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-b-muted">
                  <AccordionTrigger className="text-lg font-bold text-left">
                    Is a visa required for Indians visiting Vietnam?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes, Indian passport holders need a visa for Vietnam. The e-visa route is usually the simplest option, and our team helps you understand the documents, timing, and practical steps before you travel.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border-b-muted">
                  <AccordionTrigger className="text-lg font-bold text-left">
                    Are there direct flights from Ahmedabad to Vietnam?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Flight schedules change by season, but Ahmedabad travelers usually have convenient options into Hanoi or Ho Chi Minh City, either direct or with a simple connection. We recommend the best routing based on price, baggage rules, and transit comfort rather than just the lowest fare.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="border-b-muted">
                  <AccordionTrigger className="text-lg font-bold text-left">
                    Can I find good Indian food in Vietnam?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes. Hanoi, Da Nang, Hoi An, and Ho Chi Minh City all have reliable Indian dining options, and we can also help you plan vegetarian or Jain-friendly meals. If food comfort matters to your group, we factor that into the route before booking.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6" className="border-b-muted">
                  <AccordionTrigger className="text-lg font-bold text-left">
                    What is the local currency, and can I use Indian Rupees?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Vietnam uses the Vietnamese Dong (VND). Indian Rupees are generally not accepted, so we usually suggest carrying a forex card or internationally enabled card, plus a small amount of exchange-ready cash for convenience on arrival.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7" className="border-b-muted">
                  <AccordionTrigger className="text-lg font-bold text-left">
                    How many days are ideal for a complete Vietnam experience?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Seven to ten days is the sweet spot for a first visit. That gives you enough time to combine North, Central, and South Vietnam without turning the holiday into a rushed checklist, and extra days can easily be used for Sapa or a beach stay in Phu Quoc.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-primary text-primary-foreground overflow-hidden sticky top-32">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Book Your Vietnam Tour</h3>
                <p className="mb-6 opacity-80">
                  Share your dates, budget, and travel style to receive a practical itinerary and personalized quote from our team.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 opacity-70" />
                    <span>7 Days / 6 Nights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span>4.9/5 (120+ Reviews)</span>
                  </div>
                  <div className="text-3xl font-bold">
                    {"\u20B9"}75,000 <span className="text-sm font-normal opacity-70">/ person</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="w-full rounded-full py-7 text-lg font-bold mb-4"
                  onClick={() => navigate(inquiryPath)}
                >
                  Plan My Trip
                </Button>
                <a
                  href={`https://wa.me/919898111689?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="w-full rounded-full py-7 text-lg border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground"
                  >
                    Chat with Vishal
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-8">
                <h4 className="font-bold text-xl mb-4">Why TravelGateway?</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">
                      Local support from our South Bopal, Ahmedabad team before and after booking.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">
                      Trip planning personally reviewed for route quality, hotel fit, and traveler comfort.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">Transparent pricing with no hidden costs.</span>
                  </li>
                </ul>
                <div className="mt-8 grid gap-3">
                  <Button
                    variant="outline"
                    className="justify-start rounded-2xl"
                    onClick={handleDownloadItinerary}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Download brochure
                  </Button>
                  <a href="tel:+919898111689" className="inline-flex">
                    <Button variant="outline" className="w-full justify-start rounded-2xl">
                      <PhoneCall className="mr-2 h-4 w-4" />
                      Call Vishal
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <section className="mt-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">Glimpses of Vietnam</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1555661530-68c8e98db4e6?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=800",
            ].map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="aspect-square rounded-3xl overflow-hidden shadow-md"
              >
                <img src={img} alt="Vietnam" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 pb-16 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto pt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <Badge
                variant="outline"
                className="mb-4 text-primary border-primary px-4 py-1 uppercase tracking-widest text-[0.6rem] font-bold"
              >
                Recommendations
              </Badge>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-[#0B2147]">
                Similar <span className="text-primary not-italic">Destinations</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-md text-lg">
              Loved Vietnam? You might also enjoy these curated Southeast Asian journeys with a similar mix of culture, scenery, and easy-going exploration.
            </p>
          </div>

          <div className="relative px-4">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-6">
                {destinations
                  .filter((destination) =>
                    ["Bali Bliss", "Amazing Thailand", "Singapore & Malaysia Highlights"].includes(destination.name)
                  )
                  .map((destination) => (
                    <CarouselItem key={destination.id} className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3">
                      <div
                        onClick={() => {
                          window.scrollTo(0, 0);
                          navigate(destination.link || `/destinations/${destination.id}`);
                        }}
                        className="group cursor-pointer h-full"
                      >
                        <Card className="overflow-hidden border-none shadow-lg rounded-[2.5rem] bg-background transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <img
                              src={destination.image}
                              alt={destination.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-white/90 text-[#0B2147] backdrop-blur-md border-none font-bold uppercase tracking-tighter shadow-sm">
                                {destination.price}* T&C apply
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-2">
                              <MapPin className="w-3 h-3" />
                              {destination.country}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-[#0B2147] group-hover:text-primary transition-colors">
                              {destination.name}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                              {destination.description}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-muted/50">
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                                <span className="text-sm font-bold text-[#0B2147]">{destination.rating}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="group/btn hover:bg-primary hover:text-white rounded-full h-10 w-10 p-0"
                              >
                                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <div className="hidden md:flex gap-2 absolute -top-24 right-4">
                <CarouselPrevious className="static translate-y-0 h-12 w-12 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5 text-primary transition-all" />
                <CarouselNext className="static translate-y-0 h-12 w-12 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5 text-primary transition-all" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
    </div>
  );
}
