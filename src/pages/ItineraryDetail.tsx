import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Download, MapPin, Clock, Star, 
  CheckCircle2, Headphones, Sparkles, Lightbulb, 
  Calendar, Globe, ShieldCheck, Share2, MessageSquare, Send, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from "@/components/ui/accordion";
import { curatedImageForText, destinationPath, destinations, findDestinationByRouteParam, shouldFitWholeImage } from "@/lib/data";
import { GoogleGenAI, Type } from "@google/genai";
import { generateDestinationPDF } from "@/lib/pdf";
import CurrencyConverter from "@/components/CurrencyConverter";
import { displayInr, parseInrPrice } from "@/lib/pricing";
import SEO from "@/components/SEO";
import { graphSchema, pageSchema, siteUrl } from "@/lib/seo";
import VietnamEVisaGuide from "@/components/VietnamEVisaGuide";

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const destinationImageFallback = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000";
const reviewPrompts = [
  "What made this package easy to plan from India?",
  "Which hotel, guide, transfer, or sightseeing moment stood out?",
  "Would you recommend this itinerary to another Indian family, couple, or group?",
  "What should future travelers know before booking this route?",
  "How did Travel Gateway support you before and during the journey?",
  "Which day of the itinerary became your favorite memory?",
];

export default function ItineraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isGeneratingTips, setIsGeneratingTips] = useState(false);
  const [aiTips, setAiTips] = useState<{ title: string; content: string }[]>([]);
  const [quickBookingForm, setQuickBookingForm] = useState({
    name: "",
    phone: "",
    travelDate: "",
    guests: "2",
    urgency: "Planning ahead",
    wheelchairSupport: false,
    hotelStyle: "Comfort",
  });

  const destination = useMemo(() => {
    return findDestinationByRouteParam(id);
  }, [id]);

  const itineraryItems = useMemo(() => {
    if (!destination) return [];
    if (destination.itinerary?.length) return destination.itinerary;

    const location = [destination.city, destination.state, destination.country].filter(Boolean).join(", ") || destination.country;

    return [
      {
        day: "Day 1",
        title: `${destination.name} Arrival & Orientation`,
        description: `Arrive in ${location}, settle into your hotel, and complete a relaxed orientation with key local highlights, dining guidance, and trip briefing.`,
      },
      {
        day: "Day 2",
        title: "Signature Sightseeing & Local Stories",
        description: `Explore the main cultural, scenic, or heritage experiences connected with ${destination.name}, paced with private transfers and guide support where useful.`,
      },
      {
        day: "Day 3",
        title: "Deeper Experiences & Personal Time",
        description: `Add curated experiences such as markets, viewpoints, food trails, temples, beaches, wildlife, or museums based on the destination style and your travel preferences.`,
      },
      {
        day: "Day 4",
        title: "Flexible Extension or Departure",
        description: "Keep the final day flexible for shopping, a relaxed breakfast, an optional add-on experience, or a smooth transfer to the airport, station, or next destination.",
      },
    ];
  }, [destination]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!destination) return;

    const generateTips = async () => {
      if (!geminiApiKey) {
        setAiTips([
          { title: "Planning Note", content: "Share your travel dates and preferences with TravelGateway to receive personalized destination guidance." },
          { title: "Local Comfort", content: "Ask us to pre-arrange dining, transfers, and guide support around your pace before departure." },
          { title: "Pro Tip", content: "Confirm seasonal weather, visa timing, and local holidays before finalizing flights and hotel dates." }
        ]);
        return;
      }

      setIsGeneratingTips(true);
      try {
        const aiClient = new GoogleGenAI({ apiKey: geminiApiKey });
        const result = await aiClient.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `You are a savvy travel expert for TravelGateway. Based on this destination: ${destination.name}, ${destination.country} and its description: "${destination.longDescription || destination.description}", provide 3 brief, high-impact travel tips specifically for luxury Indian travelers. Focus on etiquette, dining, or a "pro tip".`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["title", "content"]
              }
            }
          }
        });
        
        const tipsJson = result.text;
        if (tipsJson) {
          setAiTips(JSON.parse(tipsJson));
        }
      } catch (error) {
        console.error("AI Tips Error:", error);
      } finally {
        setIsGeneratingTips(false);
      }
    };

    generateTips();

  }, [destination]);

  const generatePDF = async () => {
    if (!destination) return;
    await generateDestinationPDF(destination);
  };

  if (!destination) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20">
        <h1 className="text-2xl font-bold mb-4">Destination not found</h1>
        <Button onClick={() => navigate("/destinations")}>Back to Destinations</Button>
      </div>
    );
  }

  const locationLabel = [destination.city, destination.state, destination.country].filter(Boolean).join(", ");
  const galleryImages = destination.galleryImages?.length
    ? destination.galleryImages
    : [{ url: destination.image, alt: destination.name, caption: `${destination.name} signature view` }];
  const itineraryVisuals = itineraryItems.map((item, index) => {
    return (
      curatedImageForText(
        `${item.title} ${item.description}`
      ) ||
      curatedImageForText(
        `${destination.city || ""} ${destination.state || ""} ${destination.country} ${item.title}`
      ) ||
      galleryImages[index % galleryImages.length] ||
      galleryImages[0]
    );
  });
  const visualGalleryImages = [
    ...itineraryVisuals,
    ...galleryImages,
  ].filter((image, index, images) => images.findIndex((candidate) => candidate.url === image.url) === index);
  const faqItems = destination.faqs?.length
    ? destination.faqs
    : [
        {
          question: `What is the best way to book the ${destination.name} package?`,
          answer: "Send an inquiry with your travel month, number of guests, budget, and preferred hotel style. Travel Gateway will reply with a personalized plan and current availability.",
        },
        {
          question: "Can this itinerary be customized?",
          answer: "Yes. The route, hotels, transfers, meal preferences, sightseeing pace, and add-on nights can be adjusted for families, couples, senior travelers, honeymooners, or group travel.",
        },
        {
          question: "Are flights, hotels, and local transfers included?",
          answer: "Package inclusions depend on the final quote. Share your requirements through the booking inquiry form and the team will clearly mention flights, hotels, transfers, guide services, meals, and exclusions.",
        },
        {
          question: "How quickly will I receive the package details?",
          answer: "After you submit the inquiry, the request goes to Travel Gateway's team so they can respond with practical details, current pricing, and the next booking steps.",
        },
      ];
  const packageReviewUrl = `/contact?destination=${encodeURIComponent(`${destination.name} package review`)}`;
  const bookingUrl = `/contact?destination=${encodeURIComponent(destination.name)}`;
  const detailPath = destinationPath(destination);
  const detailTitle = `${destination.name} Tour Package | Travel Gateway`;
  const detailDescription = destination.longDescription || destination.description;
  const detailUrl = new URL(detailPath, siteUrl).toString();
  const isAndamanOffer = destination.id === 37;
  const andamanAvailabilityUrl = `https://wa.me/919898111689?text=${encodeURIComponent(
    `Hi Travel Gateway, I want to check June availability and the current value quote for ${destination.name}. Page: ${detailUrl}`
  )}`;
  const shouldShowVietnamVisaGuide = destination.country.toLowerCase() === "vietnam";
  const relatedDestinations = destinations
    .filter((candidate) => candidate.id !== destination.id)
    .filter((candidate) => candidate.country === destination.country || candidate.regionId === destination.regionId)
    .slice(0, 3);
  const todayInputDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  const handleQuickBookingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isUrgent = quickBookingForm.urgency === "Same-day travel" || quickBookingForm.urgency === "Within 72 hours";
    const messageLines = [
      isUrgent
        ? `URGENT TRAVEL REQUEST - ${quickBookingForm.urgency.toUpperCase()}`
        : `Travel Gateway booking request: ${destination.name}`,
      `Package: ${destination.name}`,
      `Location: ${locationLabel || destination.country}`,
      `Indicative price: ${destination.price} per person`,
      `Name: ${quickBookingForm.name}`,
      `Phone: ${quickBookingForm.phone}`,
      `Exact travel date: ${quickBookingForm.travelDate}`,
      `Urgency: ${quickBookingForm.urgency}`,
      `Guests: ${quickBookingForm.guests}`,
      `Wheelchair support: ${quickBookingForm.wheelchairSupport ? "Required" : "Not required"}`,
      `Hotel style: ${quickBookingForm.hotelStyle}`,
      `Page: ${detailUrl}`,
    ];

    window.open(
      `https://wa.me/919898111689?text=${encodeURIComponent(messageLines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={detailTitle}
        description={detailDescription}
        canonicalPath={detailPath}
        ogType="article"
        image={destination.image}
        imageAlt={`${destination.name} travel package by Travel Gateway`}
        keywords={`${destination.name} package, ${destination.country} tour package, ${destination.category} travel package, Travel Gateway Ahmedabad`}
        structuredData={graphSchema([
          pageSchema(detailPath, detailTitle, detailDescription, destination.image),
          {
            "@type": "TouristTrip",
            "@id": `${detailUrl}#tour`,
            name: destination.name,
            description: detailDescription,
            image: destination.image,
            touristType: ["Indian travelers", "Families", "Couples", "Inbound guests"],
            itinerary: {
              "@type": "ItemList",
              itemListElement: itineraryItems.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.title,
                item: {
                  "@type": "TouristAttraction",
                  name: item.title,
                  description: item.description,
                },
              })),
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: parseInrPrice(destination.price),
              availability: "https://schema.org/InStock",
              url: detailUrl,
            },
            provider: { "@id": `${siteUrl}/#travelagency` },
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${detailUrl}#breadcrumb`,
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
              { "@type": "ListItem", position: 2, name: "Destinations", item: `${siteUrl}/destinations` },
              { "@type": "ListItem", position: 3, name: destination.name, item: detailUrl },
            ],
          },
          {
            "@type": "FAQPage",
            mainEntity: faqItems.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
        ])}
      />
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10 }}
          src={destination.image}
          alt={destination.name}
          className={`h-full w-full object-cover ${shouldFitWholeImage(destination.image) ? "object-[center_28%]" : ""}`}
          referrerPolicy="no-referrer"
          onError={(event) => {
            if (event.currentTarget.src !== destinationImageFallback) {
              event.currentTarget.src = destinationImageFallback;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Badge className="bg-primary text-white border-none py-1 px-4 text-xs font-bold uppercase tracking-wider">
                {destination.category}
              </Badge>
              {isAndamanOffer && (
                <Badge className="border border-white/30 bg-white/15 py-1 px-4 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  June value window
                </Badge>
              )}
              <div className="flex items-center gap-1 text-yellow-400 font-bold bg-black/40 backdrop-blur-md py-1 px-3 rounded-full text-xs">
                <Star className="w-4 h-4 fill-current" />
                <span>{destination.rating}</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
              {destination.name}
            </h1>
            
            <div className="flex items-center gap-4 text-white/80 text-lg md:text-xl font-medium">
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> {locationLabel || destination.country}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> {itineraryItems.length} Days
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <section className="space-y-6">
              <div className="inline-block">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">The Experience</p>
                <h2 className="text-3xl font-black uppercase tracking-tight border-b-2 border-primary/20 pb-4">Overview</h2>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                {destination.longDescription || destination.description}
              </p>
            </section>

            {isAndamanOffer && (
              <section className="overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-cyan-500/10 to-background p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Travel in June 2026</p>
                    <h2 className="mt-3 text-3xl font-black uppercase tracking-tight">Ask for the current off-season value</h2>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                      June sits inside the available off-season travel window for this compact island route. Share your dates now and we will check the best current hotel and ferry combination before quoting, with no assumptions about availability or weather-dependent activities.
                    </p>
                  </div>
                  <Button asChild className="h-auto rounded-full px-7 py-4 font-black uppercase tracking-tight">
                    <a href={andamanAvailabilityUrl} target="_blank" rel="noreferrer">
                      Check June dates now
                      <Send className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </section>
            )}

            {shouldShowVietnamVisaGuide && <VietnamEVisaGuide compact />}

            {relatedDestinations.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-end justify-between border-b-2 border-primary/20 pb-4">
                  <div className="inline-block">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Compare Nearby Options</p>
                    <h2 className="text-3xl font-black uppercase tracking-tight">
                      {destination.country === "Vietnam" ? "Other Vietnam Routes" : "Related Journeys"}
                    </h2>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  {relatedDestinations.map((related) => (
                    <button
                      key={related.id}
                      type="button"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(destinationPath(related));
                      }}
                      className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={related.image}
                          alt={related.name}
                          className={`h-full w-full ${shouldFitWholeImage(related.image) ? "object-contain bg-slate-100" : "object-cover"}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">{related.category}</p>
                        <h3 className="mt-2 text-xl font-black tracking-tight">{related.name}</h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{related.description}</p>
                        <div className="mt-4 flex items-center justify-between gap-4">
                          <span className="text-sm font-black text-primary">{displayInr(related.price)}*</span>
                          <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Compare route</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Visual Gallery */}
            <section className="space-y-6">
              <div className="flex items-end justify-between border-b-2 border-primary/20 pb-4">
                <div className="inline-block">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">High Definition Gallery</p>
                  <h2 className="text-3xl font-black uppercase tracking-tight">Visual Preview</h2>
                </div>
                <Badge variant="outline" className="hidden md:inline-flex rounded-full px-4 py-1.5 border-primary/20 text-primary">
                  Included in PDF
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {visualGalleryImages.slice(0, 3).map((image, index) => (
                  <motion.figure
                    key={`${image.url}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-muted/10 shadow-lg"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className={`h-full w-full transition-transform duration-700 group-hover:scale-105 ${shouldFitWholeImage(image) ? "object-contain bg-slate-100" : "object-cover"}`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          if (event.currentTarget.src !== destinationImageFallback) {
                            event.currentTarget.src = destinationImageFallback;
                          }
                        }}
                      />
                    </div>
                    <figcaption className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {image.caption}
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section className="space-y-6">
              <div className="flex items-end justify-between border-b-2 border-primary/20 pb-4">
                <div className="inline-block">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Dream Before You Book</p>
                  <h2 className="text-3xl font-black uppercase tracking-tight">Visual Day-by-Day Itinerary</h2>
                </div>
                <div className="hidden md:flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Curated for 2026/27 Seasonal Cycles</span>
                </div>
              </div>

              <div className="space-y-5">
                {itineraryItems.map((item, i) => {
                  const image = itineraryVisuals[i];

                  return (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    key={i}
                    className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_-48px_rgba(15,23,42,0.8)]"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr]">
                      <div className="relative min-h-[16rem] overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.alt}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className={`h-full w-full transition-transform duration-700 hover:scale-105 ${shouldFitWholeImage(image) ? "object-contain bg-slate-100" : "object-cover"}`}
                          onError={(event) => {
                            if (event.currentTarget.src !== destinationImageFallback) {
                              event.currentTarget.src = destinationImageFallback;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="mb-3 rounded-full border-none bg-white text-slate-950">{item.day}</Badge>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">{image.caption}</p>
                        </div>
                      </div>

                      <div className="p-6 md:p-8">
                        <div className="mb-5 flex items-center gap-4">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-base font-black text-white shadow-lg shadow-primary/20">
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Planned Day</p>
                            <h3 className="text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                          </div>
                        </div>

                        <p className="text-base leading-7 text-muted-foreground">
                          {item.description}
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                            <div className="mb-2 flex items-center gap-2 text-primary">
                              <Sparkles className="h-4 w-4" />
                              <span className="text-[10px] font-black uppercase tracking-[0.18em]">Mood</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">Scenic, relaxed, and photo-friendly</p>
                          </div>
                          <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                            <div className="mb-2 flex items-center gap-2 text-primary">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-[10px] font-black uppercase tracking-[0.18em]">Comfort</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">Balanced pace with room to breathe</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </div>

            </section>

            {/* FAQs */}
            {faqItems.length > 0 && (
              <section className="space-y-6">
                <div className="inline-block">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Expert Advice</p>
                  <h2 className="text-3xl font-black uppercase tracking-tight border-b-2 border-primary/20 pb-4">Essential FAQs</h2>
                </div>
                
                    <Accordion type="single" className="w-full space-y-4">
                  {faqItems.map((faq, idx) => (
                    <AccordionItem 
                      key={idx} 
                      value={`faq-${idx}`}
                      className="border border-white/10 rounded-2xl px-6 bg-muted/5 hover:bg-muted/10 transition-colors overflow-hidden data-[state=open]:bg-white/5 data-[state=open]:border-primary/20"
                    >
                      <AccordionTrigger className="hover:no-underline py-6">
                        <div className="flex items-center gap-4 text-left">
                          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                            <HelpCircle className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-bold text-lg tracking-tight">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 pt-2">
                        <div className="pl-12 pr-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                <div className="p-6 bg-muted/20 rounded-3xl border border-white/5 text-center">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Globe className="w-4 h-4" />
                    Have more questions? <Button variant="link" className="p-0 h-auto font-bold text-primary" onClick={() => navigate(bookingUrl)}>Consult Vishal Directly</Button>
                  </p>
                </div>
              </section>
            )}

            {/* AI Insights */}
            <section className="p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-amber-500/10 to-primary/5 border border-amber-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Sparkles className="w-32 h-32 text-amber-500" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-amber-700 dark:text-amber-300">AI Expert synthesis</h3>
                    <p className="text-muted-foreground text-sm">Savvy travel tips for the discerning Indian traveler</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {isGeneratingTips && aiTips.length === 0 ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="bg-background/40 backdrop-blur-md rounded-2xl p-6 border border-amber-500/10 h-32 animate-pulse" />
                    ))
                  ) : (
                    aiTips.map((tip, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="bg-background/60 backdrop-blur-md p-6 rounded-2xl border border-amber-500/10 hover:border-amber-500/30 transition-all group/tip"
                      >
                        <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-2 uppercase text-xs tracking-widest">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                          "{tip.content}"
                        </p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* Package Reviews */}
            <section id="package-reviews" className="space-y-6 rounded-[2rem] border border-primary/10 bg-muted/20 p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Package Reviews</p>
                  <h2 className="text-3xl font-black uppercase tracking-tight">Review this {destination.name} package</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    We only publish genuine traveler feedback. If you booked this itinerary with Travel Gateway, share your experience so future Indian travelers can choose with confidence.
                  </p>
                </div>
                <Button
                  className="rounded-full px-7 py-6 font-bold"
                  onClick={() => navigate(packageReviewUrl)}
                >
                  Write a Review
                  <MessageSquare className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {reviewPrompts.map((prompt, index) => (
                  <div key={prompt} className="rounded-2xl border border-primary/10 bg-background/70 p-5">
                    <div className="mb-3 flex items-center gap-2 text-primary">
                      <Star className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.18em]">Review prompt {index + 1}</span>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{prompt}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-dashed border-primary/25 bg-background/60 p-6 text-sm leading-6 text-muted-foreground">
                No public reviews are shown for this package yet. Once real travelers submit feedback, Travel Gateway can add approved reviews here with the traveler name, city, travel month, and package details.
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Action Card */}
          <div className="lg:col-span-4">
            <aside className="sticky top-28 space-y-6">
              <div className="bg-muted/20 p-6 md:p-8 rounded-[2rem] border border-white/10 backdrop-blur-md shadow-2xl relative">
                <div className="absolute -top-6 -right-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full bg-primary flex items-center justify-center border-4 border-background"
                  >
                    <Share2 className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Package Investment</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-primary">{displayInr(destination.price)}*</span>
                      <span className="text-muted-foreground font-light text-sm italic">per person</span>
                    </div>
                    <p className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">T&C apply</p>
                  </div>

                  <CurrencyConverter amountInInr={parseInrPrice(destination.price)} />

                  <form className="space-y-4 rounded-3xl border border-primary/10 bg-background/80 p-5" onSubmit={handleQuickBookingSubmit}>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                        {isAndamanOffer ? "Check Andaman dates now" : "Quick booking request"}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {isAndamanOffer
                          ? "Send your dates for a current June value and ferry availability check."
                          : "Send the key operational details for availability and next steps."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <label className="space-y-1.5 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Name
                        <input
                          value={quickBookingForm.name}
                          onChange={(event) => setQuickBookingForm((current) => ({ ...current, name: event.target.value }))}
                          required
                          placeholder="Your name"
                          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium normal-case tracking-normal text-foreground outline-none transition focus:border-primary"
                        />
                      </label>

                      <label className="space-y-1.5 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Phone / WhatsApp
                        <input
                          value={quickBookingForm.phone}
                          onChange={(event) => setQuickBookingForm((current) => ({ ...current, phone: event.target.value.replace(/\D/g, "") }))}
                          required
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="9898111689"
                          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium normal-case tracking-normal text-foreground outline-none transition focus:border-primary"
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        <label className="space-y-1.5 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          Date
                          <input
                            type="date"
                            min={todayInputDate}
                            value={quickBookingForm.travelDate}
                            onChange={(event) => setQuickBookingForm((current) => ({ ...current, travelDate: event.target.value }))}
                            required
                            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium normal-case tracking-normal text-foreground outline-none transition focus:border-primary"
                          />
                        </label>

                        <label className="space-y-1.5 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          Guests
                          <input
                            type="number"
                            min="1"
                            value={quickBookingForm.guests}
                            onChange={(event) => setQuickBookingForm((current) => ({ ...current, guests: event.target.value }))}
                            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium normal-case tracking-normal text-foreground outline-none transition focus:border-primary"
                          />
                        </label>
                      </div>

                      <label className="space-y-1.5 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Urgency
                        <select
                          value={quickBookingForm.urgency}
                          onChange={(event) => setQuickBookingForm((current) => ({
                            ...current,
                            urgency: event.target.value,
                            travelDate: event.target.value === "Same-day travel" ? todayInputDate : current.travelDate,
                          }))}
                          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium normal-case tracking-normal text-foreground outline-none transition focus:border-primary"
                        >
                          <option>Planning ahead</option>
                          <option>Within 7 days</option>
                          <option>Within 72 hours</option>
                          <option>Same-day travel</option>
                        </select>
                      </label>

                      <label className="space-y-1.5 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Stay style
                        <select
                          value={quickBookingForm.hotelStyle}
                          onChange={(event) => setQuickBookingForm((current) => ({ ...current, hotelStyle: event.target.value }))}
                          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium normal-case tracking-normal text-foreground outline-none transition focus:border-primary"
                        >
                          <option>Comfort</option>
                          <option>Premium</option>
                          <option>Luxury</option>
                          <option>Flexible</option>
                        </select>
                      </label>

                      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        <input
                          type="checkbox"
                          className="mt-0.5"
                          checked={quickBookingForm.wheelchairSupport}
                          onChange={(event) => setQuickBookingForm((current) => ({ ...current, wheelchairSupport: event.target.checked }))}
                        />
                        Wheelchair support required
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="h-auto w-full rounded-full bg-primary py-4 text-sm font-black uppercase tracking-tight hover:bg-primary/90"
                    >
                      {isAndamanOffer ? "Check availability on WhatsApp" : "Send on WhatsApp"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-green-500" />
                       Boutique Perks
                    </h4>
                    <div className="space-y-3">
                      {(destination.services || [
                        "Curated Luxury Stays",
                        "Private Ground Logistics",
                        "Expert Local Knowledge",
                        "24/7 Concierge Access"
                      ]).map((service, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground group/item">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10 space-y-4">
                    <Button 
                      className="w-full py-8 rounded-full font-black text-lg uppercase tracking-tight bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 group h-auto"
                      onClick={() => navigate(bookingUrl)}
                    >
                      Send Inquiry Now
                      <Send className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <p className="text-center text-xs font-semibold leading-5 text-muted-foreground">
                      Opens the contact form for this package and sends your inquiry to info@travelgateway.in.
                    </p>
                    
                    <Button 
                      variant="outline" 
                      className="w-full py-6 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-3 border-primary/20 text-primary hover:bg-primary/5 h-auto"
                      onClick={generatePDF}
                    >
                      <Download className="w-5 h-5" /> Image-Rich Brochure PDF
                    </Button>
                    <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
                      Includes itinerary, FAQs, price, and HD image section
                    </p>
                  </div>

                  <div className="rounded-3xl border border-primary/10 bg-primary/5 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Already travelled?</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Help future guests by reviewing this package after your journey.
                    </p>
                    <Button
                      variant="link"
                      className="mt-2 h-auto p-0 font-bold text-primary"
                      onClick={() => document.getElementById("package-reviews")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Review this package
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                      Hand-crafted by TravelGateway.in<br/>
                      Vishal Harlalka & Team
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Contact Card */}
              <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-center gap-5">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <Headphones className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest">Global Assist</h4>
                  <p className="text-muted-foreground text-xs font-medium">+91 9898111689</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
