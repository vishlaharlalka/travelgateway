import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Headphones, MapPin, Search, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";
import { destinationPath, destinations as globalDestinations } from "@/lib/data";
import { generateDestinationPDF } from "@/lib/pdf";
import { Destination } from "@/lib/types";
import { defaultSeoImage, graphSchema, pageSchema, siteUrl } from "@/lib/seo";

const destinations = globalDestinations;
const tripScopes = ["INDIA", "International"];
const experienceStyles = ["All Experiences", "Luxury Train", "Cruise", "Seasonal", "Pilgrimage", "Coastal", "Cultural", "Adventure", "Tropical", "Metropolitan"];
const destinationImageFallback = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000";

const parsePrice = (priceStr: string) => parseInt(priceStr.replace(/[^0-9]/g, ""), 10);

const isIndiaDestination = (dest: Destination) => dest.country === "India" || (dest.type === "Luxury Train" && dest.country === "India");

interface DestinationCardProps {
  dest: Destination;
  index: number;
  onSelect: (dest: Destination) => void;
  key?: any;
}

function DestinationCard({ dest, index, onSelect }: DestinationCardProps) {
  const locationLabel = [dest.city, dest.state, dest.country].filter(Boolean).join(", ");
  const itineraryCount = dest.itinerary?.length || 0;
  const displayType = isIndiaDestination(dest) && dest.type === "Domestic" ? "INDIA" : dest.type;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_24px_70px_-48px_rgba(15,23,42,0.8)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_34px_90px_-52px_rgba(15,23,42,0.9)]">
        <button type="button" onClick={() => onSelect(dest)} className="block w-full text-left">
          <div className="relative aspect-[16/11] overflow-hidden">
            <img
              src={dest.image}
              alt={dest.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(event) => {
                if (event.currentTarget.src !== destinationImageFallback) {
                  event.currentTarget.src = destinationImageFallback;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              <Badge className="border-none bg-white/95 text-slate-950 shadow-sm">{dest.category}</Badge>
              {dest.type === "Luxury Train" && (
                <Badge className="border-none bg-[#0B2147] text-white shadow-sm">Luxury Train</Badge>
              )}
            </div>
            <div className="absolute bottom-5 left-5 right-5">
              <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-white/90">
                <MapPin className="h-4 w-4" />
                {locationLabel || dest.country}
              </p>
              <h3 className="text-2xl font-black leading-tight text-white">{dest.name}</h3>
            </div>
          </div>
        </button>

        <div className="flex h-[calc(100%-0px)] flex-col p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Starting from</p>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <p className="text-2xl font-black text-primary">{dest.price}*</p>
                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">T&C apply</span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-black text-amber-600">
              <Star className="h-4 w-4 fill-current" />
              {dest.rating}
            </div>
          </div>

          <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">{dest.description}</p>

          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
            {itineraryCount > 0 && <span className="rounded-full bg-slate-100 px-3 py-1.5">{itineraryCount} day plan</span>}
            <span className="rounded-full bg-slate-100 px-3 py-1.5">{displayType}</span>
            {dest.state && <span className="rounded-full bg-slate-100 px-3 py-1.5">{dest.state}</span>}
          </div>

          <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-6">
            <Button
              type="button"
              onClick={() => onSelect(dest)}
              className="h-11 flex-1 rounded-full bg-[#0B2147] font-bold text-white hover:bg-primary"
            >
              View Itinerary
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-label={`Download ${dest.name} brochure`}
              onClick={() => generateDestinationPDF(dest)}
              className="h-11 w-11 rounded-full border-slate-200 p-0 hover:border-primary hover:text-primary"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => navigateToPackageReviews(dest)}
            className="mt-4 inline-flex items-center text-sm font-bold text-primary transition-colors hover:text-primary/80"
          >
            Review this package
            <Star className="ml-2 h-4 w-4" />
          </button>
        </div>
      </Card>
    </motion.article>
  );
}

function navigateToPackageReviews(dest: Destination) {
  const reviewPath = `${destinationPath(dest)}#package-reviews`;
  window.location.href = reviewPath;
}

export default function Destinations() {
  const [tripScope, setTripScope] = useState("INDIA");
  const [activeCategory, setActiveCategory] = useState("All Experiences");
  const [selectedDestinationId, setSelectedDestinationId] = useState("All Destinations");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [activeState, setActiveState] = useState("All India");
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const gridRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Explore World Destinations | Bespoke Travel Packages | TravelGateway";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Discover curated India and international itineraries with TravelGateway.");
  }, []);

  useEffect(() => {
    const scope = searchParams.get("scope");
    const state = searchParams.get("state");
    const experience = searchParams.get("experience");
    const search = searchParams.get("search");

    if (scope === "INDIA" || scope === "International") {
      setTripScope(scope);
    }

    if (state) {
      setTripScope("INDIA");
      setActiveState(state);
    }

    if (experience) {
      setActiveCategory(experience);
    }

    if (search) {
      setSearchQuery(search);
    }

    if (scope || state || experience || search) {
      setSelectedDestinationId("All Destinations");
      setVisibleCount(9);
    }
  }, [searchParams]);

  useEffect(() => {
    setSelectedDestinationId("All Destinations");
    setActiveState("All India");
    setVisibleCount(9);
  }, [tripScope]);

  useEffect(() => {
    setVisibleCount(9);
  }, [tripScope, activeCategory, selectedDestinationId, searchQuery, activeState, minPrice, maxPrice]);

  const destinationDropdownOptions = useMemo(() => {
    return destinations
      .filter((dest) => (tripScope === "INDIA" ? isIndiaDestination(dest) : !isIndiaDestination(dest)))
      .sort((a, b) =>
        tripScope === "INDIA"
          ? (a.state || "India").localeCompare(b.state || "India") || a.name.localeCompare(b.name)
          : a.country.localeCompare(b.country) || a.name.localeCompare(b.name)
      );
  }, [tripScope]);

  const indiaDropdownGroups = useMemo(() => {
    return destinationDropdownOptions.reduce<Record<string, Destination[]>>((groups, dest) => {
      const state = dest.state || "India";
      groups[state] = [...(groups[state] || []), dest];
      return groups;
    }, {});
  }, [destinationDropdownOptions]);

  const internationalDropdownGroups = useMemo(() => {
    return destinationDropdownOptions.reduce<Record<string, Destination[]>>((groups, dest) => {
      const country = dest.country || "International";
      groups[country] = [...(groups[country] || []), dest];
      return groups;
    }, {});
  }, [destinationDropdownOptions]);

  const indianStates = useMemo(() => {
    return Array.from(
      new Set(
        destinations
          .filter((dest) => dest.country === "India" && dest.state)
          .map((dest) => dest.state as string)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredDestinations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return destinations.filter((dest) => {
      const matchesTripScope = tripScope === "INDIA" ? isIndiaDestination(dest) : !isIndiaDestination(dest);
      const matchesStyle =
        activeCategory === "All Experiences" ||
        dest.category === activeCategory ||
        (activeCategory === "Luxury Train" && dest.type === "Luxury Train");
      const matchesDestination = selectedDestinationId === "All Destinations" || dest.id === Number(selectedDestinationId);
      const matchesState = tripScope !== "INDIA" || activeState === "All India" || dest.state === activeState;
      const price = parsePrice(dest.price);
      const matchesMinPrice = minPrice === "" || price >= parseInt(minPrice, 10);
      const matchesMaxPrice = maxPrice === "" || price <= parseInt(maxPrice, 10);
      const haystack = [
        dest.name,
        dest.country,
        dest.state,
        dest.city,
        dest.region,
        dest.category,
        dest.type,
        dest.description,
        ...(dest.itinerary?.map((item) => `${item.title} ${item.description}`) || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = query === "" || haystack.includes(query);

      return matchesTripScope && matchesStyle && matchesDestination && matchesState && matchesMinPrice && matchesMaxPrice && matchesSearch;
    });
  }, [tripScope, activeCategory, selectedDestinationId, searchQuery, activeState, minPrice, maxPrice]);

  const visibleDestinations = useMemo(() => filteredDestinations.slice(0, visibleCount), [filteredDestinations, visibleCount]);
  const groupedVisibleDestinations = useMemo(() => {
    return visibleDestinations.reduce<Array<{ label: string; items: Destination[] }>>((groups, dest) => {
      const label = tripScope === "INDIA" ? dest.state || "India" : dest.country || "International";
      const existingGroup = groups.find((group) => group.label === label);
      if (existingGroup) {
        existingGroup.items.push(dest);
      } else {
        groups.push({ label, items: [dest] });
      }
      return groups;
    }, []);
  }, [tripScope, visibleDestinations]);

  const indiaStateCounts = useMemo(() => {
    return filteredDestinations.reduce<Record<string, number>>((counts, dest) => {
      if (isIndiaDestination(dest)) {
        const state = dest.state || "India";
        counts[state] = (counts[state] || 0) + 1;
      }
      return counts;
    }, {});
  }, [filteredDestinations]);

  const internationalCountryCounts = useMemo(() => {
    return filteredDestinations.reduce<Record<string, number>>((counts, dest) => {
      if (!isIndiaDestination(dest)) {
        const country = dest.country || "International";
        counts[country] = (counts[country] || 0) + 1;
      }
      return counts;
    }, {});
  }, [filteredDestinations]);

  const heroImage = tripScope === "INDIA" ? "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1600" : "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1600";
  const hasFilters = searchQuery || minPrice || maxPrice || activeCategory !== "All Experiences" || selectedDestinationId !== "All Destinations" || activeState !== "All India";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredDestinations.length && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 6);
            setLoadingMore(false);
          }, 450);
        }
      },
      { threshold: 1, rootMargin: "120px" }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filteredDestinations.length, loadingMore, visibleCount]);

  const navigateToDetail = (dest: Destination) => {
    window.scrollTo(0, 0);
    navigate(destinationPath(dest));
  };

  const clearFilters = () => {
    setActiveCategory("All Experiences");
    setSelectedDestinationId("All Destinations");
    setSearchQuery("");
    setActiveState("All India");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] pb-16 text-slate-950">
      <SEO
        title="Destinations | India and International Tour Packages by Travel Gateway"
        description="Browse Travel Gateway destinations across India and the world, including luxury trains, family holidays, cultural routes, safaris, and curated international journeys."
        canonicalPath="/destinations"
        image={defaultSeoImage}
        imageAlt="Travel Gateway India and international destination packages"
        keywords="India tour packages, international travel packages, luxury train booking India, Golden Chariot tour, Palace on Wheels tour, curated holidays Ahmedabad"
        structuredData={graphSchema([
          pageSchema("/destinations", "Destinations | India and International Tour Packages by Travel Gateway", "Browse Travel Gateway destinations across India and the world, including luxury trains, family holidays, cultural routes, safaris, and curated international journeys."),
          {
            "@type": "ItemList",
            "@id": `${siteUrl}/destinations#packages`,
            name: "Travel Gateway tour packages",
            itemListElement: destinations.slice(0, 30).map((destination, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: new URL(destinationPath(destination), siteUrl).toString(),
              name: destination.name,
            })),
          },
        ])}
      />
      <section className="relative overflow-hidden px-6 pt-24">
        <div className="absolute inset-0 h-[36rem] bg-[#061328]" />
        <img src={heroImage} alt="" className="absolute inset-0 h-[36rem] w-full object-cover opacity-35" />
        <div className="absolute inset-0 h-[36rem] bg-gradient-to-b from-black/45 via-[#061328]/70 to-[#f6f8fb]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="pb-4 text-white">
              <Badge className="mb-5 h-auto max-w-72 whitespace-normal border-white/20 bg-white/10 px-4 py-1.5 text-center text-white backdrop-blur-md sm:max-w-none">Curated travel portfolio</Badge>
              <h1 className="max-w-72 text-4xl font-black uppercase leading-none tracking-tight sm:max-w-3xl sm:text-5xl md:text-7xl">
                Journeys Designed To Be Remembered
              </h1>
              <p className="mt-6 max-w-72 text-base leading-7 text-white/78 sm:max-w-2xl sm:text-lg sm:leading-8">
                An editorial travel catalogue for India and international journeys, built around strong visuals, clear choices, and polished itinerary discovery.
              </p>
              <div className="mt-8 grid max-w-72 grid-cols-1 gap-3 sm:max-w-2xl sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-[#07111f]/70 p-4 shadow-lg backdrop-blur-md">
                  <p className="text-2xl font-black">{destinations.filter(isIndiaDestination).length}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/65">India</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-[#07111f]/70 p-4 shadow-lg backdrop-blur-md">
                  <p className="text-2xl font-black">{destinations.filter((dest) => !isIndiaDestination(dest)).length}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/65">Global</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-[#07111f]/70 p-4 shadow-lg backdrop-blur-md">
                  <p className="text-2xl font-black">{destinations.filter((dest) => dest.type === "Luxury Train").length}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/65">Luxury Rail</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="rounded-[2rem] border border-white/20 bg-white p-5 shadow-[0_34px_90px_-52px_rgba(15,23,42,1)]"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Journey Finder</p>
                  <h2 className="mt-1 text-2xl font-black">Browse with purpose</h2>
                </div>
                <Badge variant="outline" className="rounded-full border-slate-200 px-3 py-1">
                  {filteredDestinations.length} shown
                </Badge>
              </div>

              <div className="grid gap-4">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Travel Type</span>
                  <select value={tripScope} onChange={(event) => setTripScope(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-primary">
                    {tripScopes.map((scope) => <option key={scope} value={scope}>{scope}</option>)}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Destination</span>
                  <select value={selectedDestinationId} onChange={(event) => setSelectedDestinationId(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-primary">
                    <option value="All Destinations">{tripScope === "INDIA" ? "All India Itineraries" : "All International Itineraries"}</option>
                    {tripScope === "INDIA"
                      ? (Object.entries(indiaDropdownGroups) as Array<[string, Destination[]]>).map(([state, stateDestinations]) => (
                          <optgroup key={state} label={state}>
                            {stateDestinations.map((dest) => <option key={dest.id} value={String(dest.id)}>{dest.name}</option>)}
                          </optgroup>
                        ))
                      : (Object.entries(internationalDropdownGroups) as Array<[string, Destination[]]>).map(([country, countryDestinations]) => (
                          <optgroup key={country} label={country}>
                            {countryDestinations.map((dest) => <option key={dest.id} value={String(dest.id)}>{dest.name}</option>)}
                          </optgroup>
                        ))}
                  </select>
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Experience</span>
                    <select value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-primary">
                      {experienceStyles.map((style) => <option key={style} value={style}>{style}</option>)}
                    </select>
                  </label>
                  {tripScope === "INDIA" && (
                    <label className="space-y-2">
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">State</span>
                      <select value={activeState} onChange={(event) => setActiveState(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-primary">
                        <option value="All India">All India</option>
                        {indianStates.map((state) => <option key={state} value={state}>{state}</option>)}
                      </select>
                    </label>
                  )}
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search city, theme or itinerary" className="h-12 rounded-xl border-slate-200 pl-10" />
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <Input type="number" placeholder="Min budget" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} className="h-12 rounded-xl border-slate-200" />
                  <span className="hidden text-sm font-bold text-slate-400 sm:block">to</span>
                  <Input type="number" placeholder="Max budget" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="h-12 rounded-xl border-slate-200" />
                </div>

                {hasFilters && (
                  <Button type="button" variant="ghost" onClick={clearFilters} className="rounded-xl font-bold hover:text-primary">
                    Clear all filters
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section ref={gridRef} className="relative mx-auto mt-10 max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">{tripScope === "INDIA" ? "India collection" : "International collection"}</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight">Available Itineraries</h2>
          </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
            One card per itinerary, with brochure download kept as a secondary action for a calm, premium browsing flow.
          </p>
        </div>

        {visibleDestinations.length > 0 ? (
          tripScope === "International" || tripScope === "INDIA" ? (
            <div className="space-y-8">
              {groupedVisibleDestinations.map((group) => (
                <section key={group.label} className="rounded-[2rem] border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm md:p-6">
                  <div className="mb-6 flex flex-col gap-2 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">{tripScope === "INDIA" ? "India state portfolio" : "International portfolio"}</p>
                      <h3 className="mt-1 text-3xl font-black tracking-tight">{group.label}</h3>
                    </div>
                    <Badge variant="outline" className="w-fit rounded-full border-primary/20 px-4 py-1.5 text-primary">
                      {tripScope === "INDIA"
                        ? indiaStateCounts[group.label] || group.items.length
                        : internationalCountryCounts[group.label] || group.items.length} package{(tripScope === "INDIA"
                        ? indiaStateCounts[group.label] || group.items.length
                        : internationalCountryCounts[group.label] || group.items.length) > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <motion.div layout className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((dest, index) => (
                      <DestinationCard key={dest.id} dest={dest} index={index} onSelect={navigateToDetail} />
                    ))}
                  </motion.div>
                </section>
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {visibleDestinations.map((dest, index) => (
                <DestinationCard key={dest.id} dest={dest} index={index} onSelect={navigateToDetail} />
              ))}
            </motion.div>
          )
        ) : (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-xl font-bold text-slate-700">No destinations found matching your criteria.</p>
            <Button variant="link" onClick={clearFilters} className="mt-3 font-bold">Clear all filters</Button>
          </div>
        )}

        <div className="mt-16 flex justify-center">
          {visibleCount < filteredDestinations.length ? (
            <div ref={loadMoreRef}>
              <Button onClick={() => setVisibleCount((prev) => prev + 6)} disabled={loadingMore} variant="outline" className="h-14 rounded-full border-2 border-primary/20 px-10 text-base font-black hover:border-primary hover:bg-primary/5">
                {loadingMore ? "Curating More..." : "Load More Itineraries"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ) : filteredDestinations.length > 0 ? (
            <Badge variant="outline" className="rounded-full border-primary/20 px-5 py-2 text-primary">End of current collection</Badge>
          ) : null}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Sparkles className="h-6 w-6" />, title: "Curated Portfolio", description: "Hand-picked itineraries with clearer destination grouping." },
            { icon: <Users className="h-6 w-6" />, title: "India Expertise", description: "Journeys prepared for domestic and international travellers." },
            { icon: <Headphones className="h-6 w-6" />, title: "Travel Support", description: "Guidance before and during the trip." },
            { icon: <ShieldCheck className="h-6 w-6" />, title: "Verified Partners", description: "Reliable hotels, guides, and local operators." },
          ].map((feature) => (
            <div key={feature.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">{feature.icon}</div>
              <h3 className="text-lg font-black">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
