import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Globe, MapPin, Plane, Quote, ShieldCheck, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CurrencyConverter from "@/components/CurrencyConverter";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { destinationPath, destinations, shouldFitWholeImage } from "@/lib/data";
import { defaultSeoImage, graphSchema, pageSchema, siteUrl } from "@/lib/seo";
import { formatInr, parseInrPrice } from "@/lib/pricing";

const heroImages = [
  {
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kutch_White_Rann_Tents_%288335851293%29.jpg",
    location: "Dhordo, Kutch",
    title: "Dordo Tent City",
  },
  {
    url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=2000",
    location: "Maasai Mara, Kenya",
    title: "Wild Majesty",
  },
  {
    url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2000",
    location: "Ha Long Bay, Vietnam",
    title: "Emerald Waters",
  },
  {
    url: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&q=80&w=2000",
    location: "Angkor Wat, Cambodia",
    title: "Ancient Echoes",
  },
  {
    url: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=2000",
    location: "Palawan, Philippines",
    title: "Island Paradise",
  },
];

const featuredDestinations = [
  "Vietnam Wonders",
  "Char Dham Yatra: Yamunotri, Gangotri, Kedarnath & Badrinath",
  "Monsoon India: Kerala Ayurveda & Western Ghats",
  "Golden Chariot",
]
  .map((name) => destinations.find((destination) => destination.name === name))
  .filter((destination) => Boolean(destination));

const trendCards = [
  {
    title: "Vietnam routes with clearer pacing",
    description:
      "Travelers comparing value-led international trips are responding well to 7 to 10 day Vietnam itineraries with practical e-visa support and fewer rushed sector changes.",
    href: "/destinations/vietnam",
    label: "Compare Vietnam packages",
  },
  {
    title: "Pilgrimage journeys need detail, not generic copy",
    description:
      "Char Dham, Jyotirlinga, and Ayodhya-Varanasi style routes perform better when pacing, darshan support, and senior-traveler comfort are stated upfront.",
    href: "/destinations?scope=INDIA&experience=Pilgrimage",
    label: "Browse pilgrimage routes",
  },
  {
    title: "Monsoon Kerala is a real seasonal product",
    description:
      "Wellness-minded guests are actively looking for softer monsoon trips with Ayurveda, backwaters, and weather-aware routing instead of summer-style sightseeing checklists.",
    href: "/destinations/monsoon-india-kerala-ayurveda-and-western-ghats-133",
    label: "See monsoon Kerala",
  },
  {
    title: "Luxury train and India inbound pages deserve prominence",
    description:
      "Higher-intent travelers still search for iconic rail journeys and guided India planning, especially when the route, service level, and next inquiry step are obvious.",
    href: "/destinations?experience=Luxury%20Train",
    label: "View luxury trains",
  },
];

const services = [
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: "Custom Itineraries",
    description: "Route ideas, hotel styles, sightseeing pace, and rest days planned around how you actually like to travel.",
  },
  {
    icon: <Plane className="w-8 h-8 text-primary" />,
    title: "Seamless Logistics",
    description: "Flights, private transfers, local timings, and supplier confirmations kept in one coordinated plan.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Travel Insurance",
    description: "Insurance guidance and basic travel-risk checks are discussed before the final itinerary is confirmed.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Group Expeditions",
    description: "Small group and family departures planned with rooming, meals, comfort, and pace in mind.",
  },
];

const reviewPlatforms = [
  {
    name: "Google",
    tone: "Public listing",
    description: "Opens a Google search for Travel Gateway so travelers can confirm the current business listing before leaving feedback.",
    actionLabel: "Open Google",
    href: "https://www.google.com/search?q=Travel+Gateway+9898111689",
    accent: "border-[#4285F4]/25 bg-[#4285F4]/5",
  },
  {
    name: "Tripadvisor",
    tone: "Directory search",
    description: "Searches Tripadvisor for Travel Gateway Ahmedabad. Use it only if the correct listing is visible.",
    actionLabel: "Search Tripadvisor",
    href: "https://www.tripadvisor.com/Search?q=Travel%20Gateway%20Ahmedabad",
    accent: "border-[#00AA6C]/25 bg-[#00AA6C]/5",
  },
];

const travelerNotes = [
  {
    name: "Ahmedabad honeymoon travelers",
    note: "We had too many Europe route options at first. The useful part was narrowing it to a pace we could actually enjoy, with hotel locations explained before booking.",
    journey: "Italy and Greece honeymoon",
  },
  {
    name: "Family group from Gujarat",
    note: "The children wanted safari time, while the parents needed easier transfers. The final Kenya plan balanced both without making every day start too early.",
    journey: "Kenya family safari",
  },
  {
    name: "Couple travelers",
    note: "For Vietnam, we were confused between north, central, and Phu Quoc. The comparison helped us choose the route instead of just picking the cheapest package.",
    journey: "Vietnam holiday",
  },
  {
    name: "Repeat client family",
    note: "Meal preferences, pickup timings, and visa notes were written clearly. That mattered more to us than adding extra sightseeing stops.",
    journey: "Dubai and Abu Dhabi",
  },
  {
    name: "Senior couple from Ahmedabad",
    note: "We wanted temples and comfort, not a rushed checklist. The plan kept driving time realistic and suggested where a private car made sense.",
    journey: "Gujarat and Rajasthan route",
  },
  {
    name: "Friends planning a short break",
    note: "The budget conversation was direct. We could see what was worth upgrading and what could stay simple, which made the decision easier.",
    journey: "Bali private holiday",
  },
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        image={defaultSeoImage}
        imageAlt="Travel Gateway curated India and international journeys"
        keywords="travel agency Ahmedabad, travel agent India, international tour booking Ahmedabad, India luxury travel, inbound India travel planner, Golden Chariot booking, Palace on Wheels booking, Gujarat travel consultant"
        structuredData={graphSchema([
          pageSchema(
            "/",
            "Travel Gateway | Luxury Travel Agency in Ahmedabad for India and International Tours",
            "Travel Gateway is a boutique travel agency in Ahmedabad helping Indian travelers and international guests book curated holidays, India tours, luxury trains, safaris, and personalized trip planning."
          ),
          {
            "@type": "ItemList",
            "@id": `${siteUrl}/#featured-destinations`,
            name: "Featured Travel Gateway destinations",
            itemListElement: featuredDestinations.map((destination, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: destination.name,
              url: new URL(destinationPath(destination), siteUrl).toString(),
            })),
          },
        ])}
      />

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
              {shouldFitWholeImage(`${image.url} ${image.title}`) ? (
                <>
                  <img
                    src={image.url}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full scale-110 object-cover object-[center_28%] opacity-45 blur-xl"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    src={image.url}
                    alt={image.title}
                    className="absolute inset-0 h-full w-full object-contain px-3 py-28 sm:px-8 sm:py-32 lg:py-24"
                    referrerPolicy="no-referrer"
                  />
                </>
              ) : (
                <img
                  src={image.url}
                  alt={image.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute bottom-12 left-12 z-20 hidden md:block">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={currentImageIndex === index ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-md"
                >
                  <p className="mb-1 text-xs uppercase tracking-widest text-white/60">Featured Location</p>
                  <p className="flex items-center gap-2 font-bold text-white">
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
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
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
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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

        <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 animate-bounce">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30 pt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>
        </div>
      </section>

      <section className="bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <Badge className="mb-4 border-none bg-primary/10 text-primary">Meet the Founder</Badge>
              <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">Vishal Harlalka</h2>
              <p className="mb-6 text-xl italic leading-relaxed text-muted-foreground">
                "A good holiday should feel calm before it begins. Our job is to ask the practical questions early, then shape a journey that fits the traveler, not a template."
              </p>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                Vishal Harlalka leads Travel Gateway from Ahmedabad with a hands-on planning style: destination shortlisting, hotel guidance, visa coordination, transfers, and on-trip support are discussed clearly before each booking moves ahead.
              </p>
              <Button
                render={<Link to="/about" />}
                variant="outline"
                className="rounded-full border-primary px-8 py-6 text-lg text-primary transition-all hover:bg-primary hover:text-white"
              >
                Learn More About Our Approach
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-2xl">
              <h2 className="mb-4 text-4xl font-bold tracking-tight">Handpicked Destinations</h2>
              <p className="text-lg text-muted-foreground">
                A quick look at routes Indian travelers are actively comparing right now across international value trips, pilgrimage journeys, monsoon wellness, and premium rail holidays.
              </p>
            </div>
            <Button render={<Link to="/destinations" />} variant="ghost" className="group font-semibold text-primary">
              View All Destinations
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDestinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden rounded-3xl border-none shadow-lg transition-all duration-500 hover:shadow-xl">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-4 top-4">
                      <Badge className="border-none bg-white/90 text-black backdrop-blur-sm">{dest.category}</Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                      <div className="mb-1 flex items-center gap-1 text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-bold">{dest.rating}</span>
                      </div>
                      <h3 className="mb-1 text-xl font-bold">{dest.name}</h3>
                      <p className="flex items-center gap-1 text-sm text-white/80">
                        <MapPin className="h-3 w-3" /> Starting from {dest.price}*
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">T&C apply</p>
                      <p className="mt-2 text-xs font-semibold text-white/75">India fare view: {formatInr(parseInrPrice(dest.price))}</p>
                      <Link to={destinationPath(dest)} className="mt-4 inline-flex items-center text-sm font-bold text-white">
                        View journey
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
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

      <section className="bg-background px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <Badge className="mb-4 border-none bg-primary/10 text-primary">What Is Trending For Us</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Travel themes worth surfacing earlier</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              These routes line up with current traveler demand for clearer planning, stronger practical detail, and destination pages that answer the booking question faster.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {trendCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-2xl font-black tracking-tight">{card.title}</h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{card.description}</p>
                <Link to={card.href} className="mt-6 inline-flex items-center text-sm font-bold text-primary">
                  {card.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tight">The TravelGateway Difference</h2>
            <p className="text-lg text-muted-foreground">
              Practical planning help for travelers who want clear options, reliable coordination, and one team accountable for the details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl bg-background p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-6 inline-block rounded-2xl bg-primary/10 p-4">{service.icon}</div>
                <h3 className="mb-3 text-xl font-bold">{service.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Badge className="mb-3 border-none bg-primary/10 text-primary">Traveler Feedback</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Find Travel Gateway on review platforms</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                These links open public search results so you can confirm the correct listing before reading or posting a review.
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold text-primary">
              <Star className="h-4 w-4 fill-current" />
              Check the listing first
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {reviewPlatforms.map((platform, index) => (
              <motion.a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group block rounded-2xl border ${platform.accent} p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">{platform.tone}</p>
                    <h3 className="text-2xl font-black tracking-tight">{platform.name}</h3>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-primary shadow-sm transition-transform group-hover:scale-105">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>

                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{platform.description}</p>
                <span className="inline-flex items-center text-sm font-bold text-primary">
                  {platform.actionLabel}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <Badge className="mb-4 border-none bg-primary/10 text-primary">Traveler Notes</Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Traveler notes from planned journeys</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Small planning details clients often remember after a trip is shaped properly.
              </p>
            </div>
            <div className="max-w-sm rounded-2xl border border-primary/10 bg-background px-4 py-3 text-xs leading-5 text-muted-foreground shadow-sm">
              These are written as planning notes, not staged reviews, so the focus stays on decisions, comfort, and clarity.
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {travelerNotes.map((note, index) => (
              <motion.article
                key={`${note.name}-${note.journey}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-border bg-background p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <Badge variant="outline" className="rounded-full border-primary/15 px-3 py-1 text-[0.62rem] font-bold text-primary">
                    {note.journey}
                  </Badge>
                  <Quote className="h-4 w-4 shrink-0 text-primary/35" />
                </div>
                <p className="text-sm leading-6 text-foreground/82">"{note.note}"</p>
                <p className="mt-5 border-t border-border/70 pt-4 text-xs font-bold text-muted-foreground">{note.name}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-primary p-12 text-primary-foreground md:p-24">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-10">
            <Globe className="h-full w-full translate-x-1/4 translate-y-1/4 scale-150" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <h2 className="mb-8 text-4xl font-bold leading-tight md:text-6xl">
              Ready to plan a trip <br /> that feels clear?
            </h2>
            <p className="mb-10 text-xl leading-relaxed text-primary-foreground/80">
              Share your dates, travelers, comfort level, and rough budget. We will help you turn the idea into a practical route before you commit.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button render={<Link to="/contact" />} size="lg" variant="secondary" className="rounded-full px-8 py-7 text-lg font-bold">
                Get a Free Quote
              </Button>
              <Button
                render={<Link to="/contact" />}
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/30 px-8 py-7 text-lg text-primary-foreground hover:bg-primary-foreground/10"
              >
                Contact Vishal Directly
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
