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
import { defaultSeoImage, googleBusinessUrl, graphSchema, pageSchema, siteUrl } from "@/lib/seo";
import { formatInr, parseInrPrice } from "@/lib/pricing";

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=85&w=2200",
    location: "Jaipur, Rajasthan",
    title: "Royal Rajasthan",
  },
  {
    url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=85&w=2200",
    location: "Alleppey, Kerala",
    title: "Kerala Backwaters",
  },
  {
    url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=85&w=2200",
    location: "Varanasi, Uttar Pradesh",
    title: "India's Sacred Heart",
  },
  {
    url: "https://images.unsplash.com/photo-1578155173088-710a9aef3849?auto=format&fit=crop&q=85&w=2200",
    location: "Rajasthan, India",
    title: "Desert and Palace India",
  },
];

const featuredDestinations = [
  "Rajasthan Grand Palace Journey",
  "Gujarat Heritage, Kutch & Textile Trails",
  "Kerala Backwaters",
  "Golden Chariot - Pride of Karnataka",
]
  .map((name) => destinations.find((destination) => destination.name === name))
  .filter((destination) => Boolean(destination));

const featuredInternationalDestinations = [
  "Vietnam Wonders",
  "South Korea Family Explorer: Busan, Jeju & Seoul",
  "Dubai & Abu Dhabi Premium Escape",
  "Thailand Islands & Bangkok Signature",
]
  .map((name) => destinations.find((destination) => destination.name === name))
  .filter((destination) => Boolean(destination));

const internationalHighlights = [
  "Vietnam Wonders",
  "Dubai & Abu Dhabi Premium Escape",
  "Bali Bliss",
  "South Korea Family Explorer: Busan, Jeju & Seoul",
]
  .map((name) => destinations.find((destination) => destination.name === name))
  .filter((destination) => Boolean(destination));

const trendCards = [
  {
    title: "Himalayan pilgrimages with buffers",
    description:
      "Mountain weather, road conditions, registration checks, and buffer days make practical darshan planning more valuable than a rushed temple checklist.",
    href: "/destinations?scope=INDIA&experience=Pilgrimage",
    label: "Explore pilgrimage routes",
  },
  {
    title: "Festival trips built around real dates",
    description:
      "Overlapping October celebrations reward a focused city and date-led route, with central stays and usable festival time ahead of an overpacked circuit.",
    href: "/blog/october-2026-festival-travel-dates-and-pacing",
    label: "Read festival planning brief",
  },
  {
    title: "Luxury trains with fewer hotel changes",
    description:
      "Premium travelers continue to ask for iconic India journeys that feel smoother, with heritage access and polished service without constant repacking.",
    href: "/destinations?experience=Luxury%20Train",
    label: "Explore luxury trains",
  },
  {
    title: "Personalized short-haul Asia",
    description:
      "Families and couples are comparing Vietnam, Thailand, Korea, and island routes by entry rules, flight time, food comfort, wellness, and total trip effort.",
    href: "/destinations?scope=International",
    label: "Compare international routes",
  },
];

const services = [
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: "Personally Designed",
    description: "Your route, hotel style, interests, pace, and rest days are shaped around how you want to experience India.",
  },
  {
    icon: <Plane className="w-8 h-8 text-primary" />,
    title: "Private, Smooth Travel",
    description: "Airport assistance, private transfers, local timings, and confirmed arrangements are coordinated in one clear plan.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Trusted Local Support",
    description: "You have a direct India-based contact before and during the journey, with practical support when plans need attention.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Thoughtful Hospitality",
    description: "English-speaking guides, carefully selected stays, dietary preferences, and comfort needs are discussed before booking.",
  },
];

const reviewPlatforms = [
  {
    name: "Google",
    tone: "Public listing",
    description: "Opens the verified Travel Gateway listing on Google Maps so travelers can view details, directions, and public feedback.",
    actionLabel: "Open Google Maps",
    href: googleBusinessUrl,
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
        title="Travel Agency in Ahmedabad for Private India Tours | Travel Gateway"
        description="Discover India through personally designed private journeys, trusted local guides, exceptional stays, and direct support from Travel Gateway in Ahmedabad."
        canonicalPath="/"
        image={defaultSeoImage}
        imageAlt="Travel Gateway curated India and international journeys"
        keywords="travel agency Ahmedabad, travel agent India, international tour booking Ahmedabad, India luxury travel, inbound India travel planner, Golden Chariot booking, Palace on Wheels booking, Gujarat travel consultant"
        structuredData={graphSchema([
          pageSchema(
            "/",
            "Travel Agency in Ahmedabad for Private India Tours | Travel Gateway",
            "Discover India through personally designed private journeys, trusted local guides, exceptional stays, and direct support from Travel Gateway in Ahmedabad."
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
              <span className="sm:hidden">Private India journeys, personally designed</span>
              <span className="hidden sm:inline">Private India journeys, personally designed by a local travel expert</span>
            </p>
            <h1 className="mx-auto mb-8 max-w-72 text-4xl font-bold leading-[1.08] tracking-tight sm:w-auto sm:max-w-none sm:text-5xl md:text-7xl lg:text-8xl">
              <span className="hidden sm:inline">
                India, Personally <br />
                <span className="text-primary italic">Designed For You</span>
              </span>
              <span className="sm:hidden">
                India, Personally <br />
                <span className="text-primary italic">Designed</span>
                <br />
                <span className="text-primary italic">For You</span>
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-72 text-base leading-relaxed text-white/80 sm:max-w-2xl sm:text-lg md:text-xl">
              Private journeys, trusted local guides, exceptional stays, and thoughtful support from the moment you arrive until the journey home.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-2xl shadow-primary/20 transition-colors hover:bg-primary/90"
              >
                Design My India Journey
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/destinations"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Explore Private India Tours
              </Link>
            </div>
            <div className="mx-auto mt-6 flex max-w-72 flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white/70 sm:max-w-full sm:text-xs sm:tracking-[0.24em]">
              <span>Private drivers</span>
              <span>English-speaking guides</span>
              <span>Direct local support</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 animate-bounce">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30 pt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-8 px-6">
        <div className="mx-auto grid max-w-6xl gap-3 rounded-[2rem] border border-white/70 bg-background/95 p-4 shadow-2xl backdrop-blur md:grid-cols-4 md:p-6">
          {[
            ["One local contact", "Direct planning and on-trip support"],
            ["Private by design", "Your pace, interests, and comfort"],
            ["Carefully selected", "Guides, stays, and experiences"],
            ["Clear before booking", "Practical details discussed upfront"],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl bg-muted/40 px-5 py-4 text-center md:text-left">
              <p className="font-bold text-foreground">{title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <Badge className="mb-4 border-none bg-primary/10 text-primary">Your Local India Travel Expert</Badge>
              <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">Meet Vishal, your personal connection in India</h2>
              <p className="mb-6 text-xl italic leading-relaxed text-muted-foreground">
                "A good holiday should feel calm before it begins. Our job is to ask the practical questions early, then shape a journey that fits the traveler, not a template."
              </p>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                Based in Ahmedabad, Vishal brings local knowledge and hands-on planning to every journey. From choosing the right route and stays to coordinating guides, transfers, and on-trip support, you have one person who understands the complete plan.
              </p>
              <Button
                render={<Link to="/about" />}
                variant="outline"
                className="rounded-full border-primary px-8 py-6 text-lg text-primary transition-all hover:bg-primary hover:text-white"
              >
                Meet Your India Travel Planner
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-2xl">
              <Badge className="mb-4 border-none bg-primary/10 text-primary">Signature India Journeys</Badge>
              <h2 className="mb-4 text-4xl font-bold tracking-tight">A beautiful starting point, never a fixed template</h2>
              <p className="text-lg text-muted-foreground">
                Begin with one of these distinctive India journeys, then let us adapt the route, pace, hotels, and experiences around you.
              </p>
            </div>
            <Button render={<Link to="/destinations" />} variant="ghost" className="group font-semibold text-primary">
              View All India Journeys
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

      <section className="bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-3xl">
              <Badge className="mb-4 border-none bg-primary/10 text-primary">International Escapes</Badge>
              <h2 className="mb-4 text-4xl font-bold tracking-tight">Beyond India, planned with the same personal care</h2>
              <p className="text-lg text-muted-foreground">
                Promote practical international holidays for Indian travelers, with visa notes, flight pacing, hotel location, food comfort, and private support discussed before booking.
              </p>
            </div>
            <Button render={<Link to="/destinations?scope=International" />} variant="ghost" className="group font-semibold text-primary">
              View International Tours
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {internationalHighlights.map((dest, index) => (
              <motion.article
                key={dest.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <Badge className="border-none bg-white/90 text-black">{dest.country}</Badge>
                    <Badge className="border-none bg-black/55 text-white backdrop-blur-sm">{dest.category}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-bold">{dest.rating}</span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{dest.name}</h3>
                  <p className="mt-3 min-h-16 text-sm leading-6 text-muted-foreground">{dest.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-foreground">From {dest.price}*</p>
                    <Link to={destinationPath(dest)} className="inline-flex items-center text-sm font-bold text-primary">
                      View
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-2xl">
              <Badge className="mb-4 border-none bg-primary/10 text-primary">International Journeys</Badge>
              <h2 className="mb-4 text-4xl font-bold tracking-tight">Short-haul Asia and polished overseas escapes</h2>
              <p className="text-lg text-muted-foreground">
                Promote international trips alongside India with routes that are practical for families, couples, and Gujarati travelers comparing visas, flights, meals, and hotel comfort.
              </p>
            </div>
            <Button render={<Link to="/destinations?scope=International" />} variant="ghost" className="group font-semibold text-primary">
              View International Tours
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredInternationalDestinations.map((dest, index) => (
              <motion.article
                key={dest.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              >
                <Link to={destinationPath(dest)} className="block h-full">
                  <div className="relative aspect-[5/3] overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <Badge className="border-none bg-white/90 text-black">{dest.country}</Badge>
                      <Badge className="border-none bg-primary text-primary-foreground">{dest.category}</Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-2xl font-black tracking-tight">{dest.name}</h3>
                      <p className="mt-2 flex items-center gap-1 text-sm text-white/85">
                        <MapPin className="h-3 w-3" /> Starting from {dest.price}*
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="min-h-[4.5rem] text-sm leading-6 text-muted-foreground">{dest.description}</p>
                    <span className="mt-5 inline-flex items-center text-sm font-bold text-primary">
                      Plan this trip
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <Badge className="mb-4 border-none bg-primary/10 text-primary">Find Your India</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Current travel-planning themes for 2026</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Current travel signals favour decision-ready detail, festival dates and pacing, plus practical pilgrimage, rail, and short-haul Asia routes.
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

          <div className="mt-8 rounded-[2rem] border border-primary/15 bg-primary/[0.03] p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-[1.1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Fresh planning brief</p>
                <h3 className="mt-3 text-3xl font-black tracking-tight">Build one festival trip around the dates that matter</h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Read the October 5 brief on overlapping festival dates, choosing a primary city, central stays, and protecting usable celebration time.
                </p>
              </div>
              <Button render={<Link to="/blog/october-2026-festival-travel-dates-and-pacing" />} className="rounded-full px-7 py-6 text-sm font-black uppercase tracking-tight">
                Read The Journal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <Badge className="mb-4 border-none bg-primary/10 text-primary">Travel With Confidence</Badge>
            <h2 className="mb-6 text-4xl font-bold tracking-tight">India feels easier with the right local team</h2>
            <p className="text-lg text-muted-foreground">
              Thoughtful planning and dependable local coordination let you focus on the people, places, and moments that brought you here.
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
              Your India story <br /> starts with a conversation.
            </h2>
            <p className="mb-10 text-xl leading-relaxed text-primary-foreground/80">
              Tell us when you hope to travel, what inspires you, and how you like to explore. Vishal will help shape a private India journey around you.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button render={<Link to="/contact" />} size="lg" variant="secondary" className="rounded-full px-8 py-7 text-lg font-bold">
                Design My India Journey
              </Button>
              <Button
                render={<Link to="/contact" />}
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/30 px-8 py-7 text-lg text-primary-foreground hover:bg-primary-foreground/10"
              >
                Speak With Vishal
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
