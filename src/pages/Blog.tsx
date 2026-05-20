import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  Globe2,
  Loader2,
  Newspaper,
  RefreshCcw,
  Tag,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import SocialShare from "@/components/SocialShare";
import SEO from "@/components/SEO";
import { defaultSeoImage, graphSchema, pageSchema, siteUrl } from "@/lib/seo";

type EditorialPost = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  slug: string;
  readTime: string;
  tags: string[];
  body: string[];
  takeaways: string[];
};

type FeedArticle = {
  url: string;
  title: string;
  seendate: string;
  socialimage?: string;
  domain?: string;
  sourcecountry?: string;
  language?: string;
  description?: string;
};

type FeedResponse = {
  articles?: FeedArticle[];
  fetchedAt?: string;
  source?: string;
};

type LiveArticle = {
  id: string;
  title: string;
  url: string;
  image: string;
  source: string;
  sourceCountry: string;
  seenAt: Date;
  category: string;
  summary: string;
  checks: string[];
};

const officialIndiaTravelUpdates: LiveArticle[] = [
  {
    id: "india-tourism-adventure-regulation-2026-04-02",
    title: "Regulation of Adventure Tourism",
    url: "https://tourism.gov.in/press-release",
    image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=1000",
    source: "Ministry of Tourism, Government of India",
    sourceCountry: "India",
    seenAt: new Date("2026-04-02T00:00:00Z"),
    category: "India Travel News",
    summary:
      "Official ministry update touching adventure-tourism regulation. Useful for operators selling safaris, trekking, rafting, and guided outdoor experiences in India.",
    checks: [
      "Review whether the update affects supplier eligibility, guide standards, or activity insurance.",
      "Recheck waivers, fitness notes, and seasonality on adventure itineraries.",
      "Update guest-facing risk notes before confirming departures.",
    ],
  },
  {
    id: "india-tourism-buddhist-circuits-2026-04-02",
    title: "Attracting Tourists to Buddhist Circuits",
    url: "https://tourism.gov.in/press-release",
    image: "https://images.unsplash.com/photo-1652288156243-a7505dcaa0ec?auto=format&fit=crop&q=80&w=1000",
    source: "Ministry of Tourism, Government of India",
    sourceCountry: "India",
    seenAt: new Date("2026-04-02T00:00:00Z"),
    category: "India Travel News",
    summary:
      "A current ministry signal around Buddhist circuit promotion, relevant for inbound pilgrimage planning across Uttar Pradesh, Bihar, and connected extensions.",
    checks: [
      "Review circuit demand for Sarnath, Kushinagar, Shravasti, and Bodhgaya combinations.",
      "Check guide language needs and coach comfort for long overland sectors.",
      "Use official destination positioning in inbound proposals where appropriate.",
    ],
  },
  {
    id: "india-tourism-itas-2026-02-05",
    title: "International Tourist Arrivals in India reached 20.57 million in 2024",
    url: "https://tourism.gov.in/index.php/press-release/international-tourist-arrivals-itas-india-reached-2057-million-2024-showing-strong",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1000",
    source: "Ministry of Tourism, Government of India",
    sourceCountry: "India",
    seenAt: new Date("2026-02-05T00:00:00Z"),
    category: "India Travel News",
    summary:
      "India reported 20.57 million international tourist arrivals in 2024, signaling strong inbound recovery and supporting more assertive India-focused marketing for overseas guests.",
    checks: [
      "Use the demand signal to sharpen inbound landing pages and destination copy.",
      "Prepare supplier buffers for premium India departures in peak periods.",
      "Highlight guided India planning for first-time foreign guests.",
    ],
  },
  {
    id: "india-tourism-monthly-snapshot-2026-01",
    title: "Monthly Tourism Snapshot, January 2026",
    url: "https://tourism.gov.in/annual-reports/monthly-tourism-snapshot-january-2026",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000",
    source: "Ministry of Tourism, Government of India",
    sourceCountry: "India",
    seenAt: new Date("2026-03-11T00:00:00Z"),
    category: "India Travel News",
    summary:
      "The ministry’s monthly snapshot is a useful reference point for travel businesses tracking India tourism momentum, seasonality, and planning signals.",
    checks: [
      "Use the latest government snapshot in sales decks and B2B conversations.",
      "Compare demand trends with your own inquiry mix and destination mix.",
      "Refresh destination priorities if inbound or domestic demand shifts.",
    ],
  },
];

type NewsStatus = "idle" | "loading" | "success" | "error";

const LIVE_NEWS_ENDPOINT = "/api/travel-news";
const NEWS_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000";

const liveCategoryImages: Record<string, string> = {
  Aviation:
    "https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&q=80&w=1000",
  Cruise:
    "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1000",
  Hotels:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
  Tourism:
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000",
  Visa:
    "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&q=80&w=1000",
  "India Travel News":
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1000",
  "India Aviation":
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
  "Travel News": NEWS_FALLBACK_IMAGE,
};

const travelKeywords = [
  "airline",
  "airport",
  "cruise",
  "destination",
  "flight",
  "hotel",
  "passport",
  "tourism",
  "tourist",
  "travel",
  "traveler",
  "traveller",
  "visa",
  "vacation",
  "holiday",
];

const blockedTitleTerms = ["used suv", "teen driver", "top used suv"];

const posts: EditorialPost[] = [
  {
    id: 1,
    title: "Vietnam 2026 Planning Guide for Indian Travelers",
    excerpt:
      "A practical briefing for travelers comparing Vietnam packages, entry documents, route timing, weather windows, and local experiences.",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1000",
    author: "Vishal Harlalka",
    date: "April 24, 2026",
    category: "Visa",
    slug: "vietnam-2026-planning-guide",
    readTime: "7 min read",
    tags: ["Vietnam", "Visa", "Planning"],
    body: [
      "Vietnam remains one of the most efficient international holidays for Indian travelers who want strong value, varied scenery, and a trip that can be paced from relaxed to adventurous. The strongest itineraries usually combine Hanoi or Ho Chi Minh City with one scenic anchor such as Ha Long Bay, Ninh Binh, Da Nang, Hoi An, or Phu Quoc.",
      "For Travel Gateway clients, the key is sequencing. First-time visitors should avoid trying to cover north, central, and south Vietnam in a very short trip. A well-designed seven to nine day plan usually feels better than a rushed checklist because road transfers, domestic flights, and weather differences can change the rhythm of the holiday.",
      "Entry rules and airline schedules can change quickly, so travelers should verify passport validity, visa or e-visa requirements, and the latest airline baggage rules before confirming non-refundable bookings. Families should also keep hotel location and walking distance in mind because many old-quarter and heritage areas are charming but compact.",
      "The best guest experience comes from mixing headline sights with one slower day. A lantern walk in Hoi An, a countryside cycling route, a cooking class, or a guided food trail can often become the most memorable part of the trip.",
    ],
    takeaways: [
      "Plan north, central, or south Vietnam around the season instead of forcing every region into one short trip.",
      "Check visa, passport validity, and airline baggage terms before issuing final vouchers.",
      "Keep one slower cultural day in the itinerary for a more premium, less rushed experience.",
    ],
  },
  {
    id: 2,
    title: "How Direct Flight Changes Affect Holiday Package Pricing",
    excerpt:
      "A clear look at why new routes, seasonal capacity, and airline schedule changes can move package prices faster than hotel rates.",
    image:
      "https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&q=80&w=1000",
    author: "Rohan Deshmukh",
    date: "April 22, 2026",
    category: "Aviation",
    slug: "direct-flight-changes-package-pricing",
    readTime: "6 min read",
    tags: ["Flights", "Pricing", "Packages"],
    body: [
      "When a new direct flight is announced, the first reaction is usually excitement about shorter travel time. For travel planners, the bigger question is capacity. More seats on a strong route can soften fares, but early demand, school holidays, and festival weekends can still push prices up quickly.",
      "Package pricing depends on more than the lowest fare shown online. Good planning includes baggage, arrival time, airport transfer windows, hotel check-in timing, and whether the flight schedule protects the first and last day of the holiday. A cheap late-night arrival can quietly reduce usable vacation time.",
      "The best booking window changes by destination. Short-haul Asia and domestic holidays can move quickly around long weekends, while Europe and luxury rail products often require earlier commitment. Clients should be shown the trade-off clearly: wait for a sale, or protect availability while the itinerary is still ideal.",
      "A reliable quote should also include a schedule-change plan. Airlines can retime flights after booking, so high-value trips need enough buffer around cruises, safaris, trains, and once-a-day transfers.",
    ],
    takeaways: [
      "Direct flights improve convenience but do not automatically mean lower fares.",
      "Quote around total trip value, not only the lowest ticket price.",
      "Protect high-value connections with buffer time and flexible supplier rules.",
    ],
  },
  {
    id: 3,
    title: "Impact-First Safari Planning: What Luxury Travelers Ask Now",
    excerpt:
      "Safari clients increasingly want excellent guiding, conservation value, slower pacing, and lodges that support local communities.",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1000",
    author: "Priya Venkat",
    date: "April 18, 2026",
    category: "Trends",
    slug: "impact-first-safari-planning",
    readTime: "8 min read",
    tags: ["Safari", "Luxury", "Conservation"],
    body: [
      "Luxury safari planning is moving beyond the question of which lodge has the best view. Travelers now ask about guiding quality, conservation work, community partnerships, and whether the itinerary avoids unnecessary internal hops. That shift is good for both clients and destinations.",
      "A stronger safari itinerary usually spends more time in fewer locations. Two or three nights per camp gives guests a better chance to settle into wildlife rhythms, understand the landscape, and avoid losing entire days to transfers. It also reduces the fatigue that can make premium trips feel rushed.",
      "The most successful lodge recommendations are honest about trade-offs. A remote camp may offer outstanding wildlife and privacy, but it may also require charter flights and stricter baggage limits. A larger lodge may offer more amenities and easier access, but less solitude.",
      "Impact-first travel does not mean sacrificing comfort. It means choosing operators who connect comfort with good guiding, fair employment, habitat protection, and respectful guest behavior.",
    ],
    takeaways: [
      "Sell safari pacing before selling lodge count.",
      "Explain baggage, charter, and transfer realities early.",
      "Highlight conservation and community value when it is specific and verifiable.",
    ],
  },
  {
    id: 4,
    title: "Workation Travel: Building Remote-Friendly Trips Without Friction",
    excerpt:
      "Remote workers need more than a good view. They need realistic connectivity, quiet work blocks, and accommodation that supports routine.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000",
    author: "Aarav Mehta",
    date: "April 15, 2026",
    category: "Workation",
    slug: "remote-friendly-workation-trips",
    readTime: "5 min read",
    tags: ["Workation", "Japan", "Remote Work"],
    body: [
      "Workation travel is not simply leisure travel with a laptop. The itinerary has to respect meeting hours, connectivity, privacy, and the psychological difference between work time and holiday time. A beautiful hotel can still be a poor fit if the desk, Wi-Fi, or time zone is wrong.",
      "The most reliable workation plans start with the work pattern. If the client has late-night calls with India, the morning should be left flexible. If they need quiet video calls, the room type and hotel infrastructure matter more than proximity to nightlife.",
      "Good workation destinations offer three layers: dependable infrastructure, accessible local experiences, and enough downtime to prevent burnout. Cities with efficient transport and strong cafe culture can work well, but slower coastal or mountain stays can be better for longer trips.",
      "Travel advisors should also be careful with visa language. Remote-work permissions vary by country and can change. Clients should be advised to verify the correct visa category and tax implications before treating a holiday stay as a work base.",
    ],
    takeaways: [
      "Design around meeting hours and connectivity first.",
      "Treat room type and desk setup as core product details.",
      "Confirm visa and remote-work permissions before positioning a destination as workation-ready.",
    ],
  },
];

function cleanTitle(title: string) {
  return title
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/\s+\./g, ".")
    .trim();
}

function cleanExcerpt(value?: string) {
  if (!value) return "";
  const text = value.replace(/\s+/g, " ").trim();
  return text.length > 260 ? `${text.slice(0, 257).trim()}...` : text;
}

function parseGdeltDate(value: string) {
  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(value);
  if (!match) return new Date();

  const [, year, month, day, hour, minute, second] = match;
  return new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    )
  );
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeTime(date: Date) {
  const diffInSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffInSeconds);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSeconds < 3600) {
    return formatter.format(Math.round(diffInSeconds / 60), "minute");
  }

  if (absSeconds < 86400) {
    return formatter.format(Math.round(diffInSeconds / 3600), "hour");
  }

  return formatter.format(Math.round(diffInSeconds / 86400), "day");
}

function getLiveCategory(title: string, feedCategory?: string) {
  if (feedCategory) return feedCategory;

  const text = title.toLowerCase();
  if (text.includes("india")) return "India Travel News";
  if (text.includes("visa") || text.includes("passport")) return "Visa";
  if (text.includes("airline") || text.includes("flight") || text.includes("airport")) return "Aviation";
  if (text.includes("cruise")) return "Cruise";
  if (text.includes("hotel")) return "Hotels";
  if (text.includes("tourism") || text.includes("tourist")) return "Tourism";
  return "Travel News";
}

function getLiveImage(category: string) {
  return liveCategoryImages[category] || NEWS_FALLBACK_IMAGE;
}

async function loadLiveNews() {
  const response = await fetch(LIVE_NEWS_ENDPOINT, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Live feed returned ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("Live feed is temporarily unavailable");
  }

  return (await response.json()) as FeedResponse;
}

function getTravelerChecks(category: string) {
  if (category === "Visa") {
    return [
      "Verify passport validity, visa category, and entry window before ticketing.",
      "Check the embassy or official immigration portal before collecting documents.",
      "Flag processing-time risk clearly in the client quotation.",
    ];
  }

  if (category === "Aviation" || category === "India Aviation") {
    return [
      "Check operating airline, baggage allowance, and airport terminal before confirming.",
      "Protect cruises, trains, and safaris with a sensible connection buffer.",
      "Review schedule-change and refund rules for non-refundable packages.",
    ];
  }

  if (category === "Cruise") {
    return [
      "Confirm boarding documents, health rules, and port arrival timing.",
      "Check whether the itinerary includes tender ports or possible reroutes.",
      "Keep insurance and emergency contact details ready before departure.",
    ];
  }

  if (category === "Hotels") {
    return [
      "Confirm resort fees, city taxes, check-in timing, and cancellation terms.",
      "Match hotel location to the traveler's daily movement pattern.",
      "Reconfirm bedding, accessibility, and family-room requirements early.",
    ];
  }

  return [
    "Use the source story as a signal, then verify official rules before advising clients.",
    "Check whether the update affects pricing, availability, safety, or documents.",
    "Record the date of verification on the final itinerary notes.",
  ];
}

function normalizeArticle(article: FeedArticle): LiveArticle {
  const title = cleanTitle(article.title);
  const category = getLiveCategory(title, article.sourcecountry);
  const source = article.domain || "Live travel source";
  const sourceCountry = article.sourcecountry || "Global";
  const excerpt = cleanExcerpt(article.description);

  return {
    id: `${article.url}-${article.seendate}`,
    title,
    url: article.url,
    image: getLiveImage(category),
    source,
    sourceCountry,
    seenAt: parseGdeltDate(article.seendate),
    category,
    summary:
      excerpt ||
      `This live update from ${source} is a current signal for travel planners. Review the original source, then confirm official rules, supplier terms, and client impact before changing an itinerary.`,
    checks: getTravelerChecks(category),
  };
}

function isTravelRelevant(article: FeedArticle) {
  const title = cleanTitle(article.title).toLowerCase();
  const hasTravelKeyword = travelKeywords.some((keyword) => title.includes(keyword));
  const isBlocked = blockedTitleTerms.some((term) => title.includes(term));
  return hasTravelKeyword && !isBlocked;
}

function dedupeArticles(articles: LiveArticle[]) {
  const seen = new Set<string>();

  return articles.filter((article) => {
    const key = article.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPostId, setSelectedPostId] = useState(posts[0].id);
  const [liveArticles, setLiveArticles] = useState<LiveArticle[]>([]);
  const [selectedLiveId, setSelectedLiveId] = useState<string | null>(null);
  const [newsStatus, setNewsStatus] = useState<NewsStatus>("idle");
  const [newsError, setNewsError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const refreshLiveNews = useCallback(async () => {
    setNewsStatus("loading");
    setNewsError(null);

    try {
      const data = await loadLiveNews();
      const liveFeedArticles = (data.articles || [])
        .filter(isTravelRelevant)
        .map(normalizeArticle)
        .slice(0, 12);
      const nextArticles = dedupeArticles(
        liveFeedArticles.length > 0
          ? [...liveFeedArticles, ...officialIndiaTravelUpdates]
          : officialIndiaTravelUpdates
      );

      setLiveArticles(nextArticles);
      setSelectedLiveId((current) => {
        if (current && nextArticles.some((article) => article.id === current)) return current;
        return nextArticles[0]?.id ?? null;
      });
      setLastUpdated(new Date());
      setNewsStatus("success");
    } catch (error) {
      setLiveArticles(officialIndiaTravelUpdates);
      setSelectedLiveId(officialIndiaTravelUpdates[0]?.id ?? null);
      setLastUpdated(new Date());
      setNewsStatus("error");
      setNewsError(
        "The live travel feed could not refresh right now. Showing verified India travel updates instead."
      );
    }
  }, []);

  useEffect(() => {
    void refreshLiveNews();
    const interval = window.setInterval(() => {
      void refreshLiveNews();
    }, 300000);

    return () => window.clearInterval(interval);
  }, [refreshLiveNews]);

  const categories = useMemo(
    () => ["All", "Live News", ...Array.from(new Set(posts.map((post) => post.category)))],
    []
  );

  const filteredPosts =
    activeCategory === "All" || activeCategory === "Live News"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  useEffect(() => {
    if (activeCategory === "All" || activeCategory === "Live News") return;

    const currentPostStillVisible = posts.some(
      (post) => post.id === selectedPostId && post.category === activeCategory
    );
    const firstFilteredPost = posts.find((post) => post.category === activeCategory);

    if (!currentPostStillVisible && firstFilteredPost) {
      setSelectedPostId(firstFilteredPost.id);
    }
  }, [activeCategory, selectedPostId]);

  const selectedPost = posts.find((post) => post.id === selectedPostId) || posts[0];
  const selectedLiveArticle =
    liveArticles.find((article) => article.id === selectedLiveId) || liveArticles[0];
  const showEditorialGrid = activeCategory !== "Live News";

  const selectPost = (postId: number) => {
    setSelectedPostId(postId);
    document.getElementById("detailed-blog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-background">
      <SEO
        title="Travel Gateway Blog | Live Travel News, Visa Alerts and Planning Guides"
        description="Read Travel Gateway travel news, visa updates, airline stories, destination insights, and advisor-written planning guides for Indian and international travelers."
        canonicalPath="/blog"
        ogType="article"
        image={defaultSeoImage}
        imageAlt="Travel Gateway blog and live travel news"
        keywords="travel blog India, travel news India, visa updates for Indian travelers, airline news, holiday planning guides"
        structuredData={graphSchema([
          pageSchema("/blog", "Travel Gateway Blog | Live Travel News, Visa Alerts and Planning Guides", "Read Travel Gateway travel news, visa updates, airline stories, destination insights, and advisor-written planning guides for Indian and international travelers."),
          {
            "@type": "Blog",
            "@id": `${siteUrl}/blog#blog`,
            name: "Travel Gateway Journal",
            url: `${siteUrl}/blog`,
            publisher: { "@id": `${siteUrl}/#travelagency` },
            blogPost: posts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              image: post.image,
              author: { "@type": "Person", name: post.author },
              publisher: { "@id": `${siteUrl}/#travelagency` },
              url: `${siteUrl}/blog/${post.slug}`,
              keywords: post.tags.join(", "),
            })),
          },
        ])}
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <Badge className="mb-4 bg-primary/10 text-primary border-none">Live Travel Dispatch</Badge>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            The <span className="text-primary italic">TravelGateway</span> Journal
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time travel news, visa alerts, airline updates, and detailed advisor-written
            planning briefs on one page.
          </p>
        </div>

        <section className="mb-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-6">
            <div>
              <Badge className="mb-3 bg-emerald-500/10 text-emerald-700 border-none">
                <Newspaper className="mr-2 h-3.5 w-3.5" />
                Real-time news feed
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">Live Travel News</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                India travel and aviation updates first, followed by live global airline,
                hotel, cruise, and tourism stories refreshed every five minutes.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {lastUpdated && (
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Updated {formatRelativeTime(lastUpdated)}
                </span>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => void refreshLiveNews()}
                disabled={newsStatus === "loading"}
                className="rounded-full"
              >
                <RefreshCcw
                  className={cn("mr-2 h-4 w-4", newsStatus === "loading" && "animate-spin")}
                />
                Refresh
              </Button>
            </div>
          </div>

          {newsStatus === "error" && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Live feed could not refresh.</p>
                <p>{newsError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6">
            <div className="rounded-lg border bg-muted/20 p-3">
              {newsStatus === "loading" && liveArticles.length === 0 ? (
                <div className="flex min-h-[22rem] items-center justify-center text-muted-foreground">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading live travel news
                </div>
              ) : liveArticles.length > 0 ? (
                <div className="space-y-3">
                  {liveArticles.map((article) => (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => setSelectedLiveId(article.id)}
                      className={cn(
                        "w-full rounded-lg border bg-background p-4 text-left transition-all hover:border-primary/40 hover:shadow-md",
                        selectedLiveArticle?.id === article.id && "border-primary shadow-md"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={article.image}
                          alt=""
                          className="h-20 w-24 rounded-md object-cover"
                          referrerPolicy="no-referrer"
                          onError={(event) => {
                            if (event.currentTarget.src !== NEWS_FALLBACK_IMAGE) {
                              event.currentTarget.src = NEWS_FALLBACK_IMAGE;
                            }
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="rounded-full">
                              {article.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(article.seenAt)}
                            </span>
                          </div>
                          <h3 className="line-clamp-2 font-bold leading-snug">{article.title}</h3>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {article.source} / {article.sourceCountry}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[22rem] items-center justify-center px-6 text-center text-sm text-muted-foreground">
                  No live travel stories matched the feed filters right now. Use refresh to check
                  again.
                </div>
              )}
            </div>

            <article className="rounded-lg border bg-background overflow-hidden shadow-sm">
              {selectedLiveArticle ? (
                <>
                  <div className="relative aspect-[16/8] overflow-hidden">
                    <img
                      src={selectedLiveArticle.image}
                      alt=""
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(event) => {
                        if (event.currentTarget.src !== NEWS_FALLBACK_IMAGE) {
                          event.currentTarget.src = NEWS_FALLBACK_IMAGE;
                        }
                      }}
                    />
                    <div className="absolute left-5 top-5">
                      <Badge className="bg-white text-black border-none">
                        {selectedLiveArticle.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Globe2 className="h-3.5 w-3.5" />
                        {selectedLiveArticle.source}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDateTime(selectedLiveArticle.seenAt)}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                      {selectedLiveArticle.title}
                    </h3>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      {selectedLiveArticle.summary}
                    </p>
                    <div className="mt-6 rounded-lg bg-muted/40 p-5">
                      <h4 className="font-bold mb-3">Advisor action checklist</h4>
                      <ul className="space-y-3">
                        {selectedLiveArticle.checks.map((check) => (
                          <li key={check} className="flex gap-3 text-sm text-foreground/80">
                            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{check}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
                      <a
                        href={selectedLiveArticle.url}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(buttonVariants(), "rounded-full")}
                      >
                        Open Source
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                      <span className="text-xs text-muted-foreground">
                        Source country: {selectedLiveArticle.sourceCountry}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[32rem] items-center justify-center px-8 text-center text-muted-foreground">
                  Select a live story to view the detailed travel brief.
                </div>
              )}
            </article>
          </div>
        </section>

        <section className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground font-medium uppercase tracking-wider">
            <Filter className="w-4 h-4" />
            <span>Filter by Category</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "rounded-full px-6 py-2 h-auto text-sm font-semibold transition-all duration-300",
                  activeCategory === category
                    ? "bg-primary text-white shadow-lg shadow-primary/25 border-primary"
                    : "hover:bg-primary/5 hover:border-primary/30 text-muted-foreground hover:text-primary"
                )}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {showEditorialGrid && (
          <section id="detailed-blog" className="mb-16 scroll-mt-28">
            <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8">
              <div className="rounded-lg border bg-muted/20 p-4 h-fit">
                <Badge className="mb-4 bg-primary/10 text-primary border-none">
                  Detailed blog
                </Badge>
                <h2 className="text-2xl font-bold mb-4">Advisor-Written Planning Briefs</h2>
                <div className="space-y-3">
                  {filteredPosts.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => setSelectedPostId(post.id)}
                      className={cn(
                        "w-full rounded-lg border bg-background p-4 text-left transition-all hover:border-primary/40",
                        selectedPost.id === post.id && "border-primary shadow-md"
                      )}
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="rounded-full">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      </div>
                      <h3 className="font-bold leading-snug">{post.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <article className="rounded-lg border bg-background overflow-hidden shadow-sm">
                <div className="relative aspect-[16/7] overflow-hidden">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute left-5 top-5">
                    <Badge className="bg-white text-black border-none">{selectedPost.category}</Badge>
                  </div>
                </div>
                <div className="p-6 md:p-10">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {selectedPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {selectedPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                    {selectedPost.title}
                  </h2>
                  <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                    {selectedPost.excerpt}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="rounded-full">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-8 space-y-5 text-foreground/85 leading-relaxed">
                    {selectedPost.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-8 rounded-lg bg-muted/40 p-5">
                    <h3 className="font-bold mb-4">Key takeaways</h3>
                    <ul className="space-y-3">
                      {selectedPost.takeaways.map((takeaway) => (
                        <li key={takeaway} className="flex gap-3 text-sm text-foreground/80">
                          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t pt-6">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Share article
                    </span>
                    <SocialShare url={`${baseUrl}/blog/${selectedPost.slug}`} title={selectedPost.title} />
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

        {showEditorialGrid && (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="h-full border shadow-sm hover:shadow-xl transition-all duration-500 rounded-lg overflow-hidden group">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-5 left-5">
                        <Badge className="bg-white/90 text-black backdrop-blur-sm border-none">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-7">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-7 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between gap-4 pt-5 border-t border-muted/20">
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => selectPost(post.id)}
                          className="p-0 h-auto font-bold text-primary group/link"
                        >
                          Read Detailed Blog
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Button>
                        <SocialShare url={`${baseUrl}/blog/${post.slug}`} title={post.title} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {showEditorialGrid && filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg italic">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
