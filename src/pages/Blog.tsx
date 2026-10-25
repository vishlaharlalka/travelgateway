import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Archive,
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  Globe2,
  Loader2,
  Newspaper,
  Radio,
  RefreshCcw,
  Search,
  Sparkles,
  Tag,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import SocialShare from "@/components/SocialShare";
import SEO from "@/components/SEO";
import { defaultSeoImage, graphSchema, pageSchema, siteUrl } from "@/lib/seo";

export type EditorialPost = {
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
  sources?: Array<{ label: string; url: string }>;
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
const NEWS_ARCHIVE_STORAGE_KEY = "travelgateway.newsArchive.v1";
const MAX_ARCHIVED_NEWS = 160;
const NEWS_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000";

const liveCategoryImages: Record<string, string[]> = {
  Aviation: [
    "https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=1000",
  ],
  Cruise: [
    "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1580541631950-7282082b53ce?auto=format&fit=crop&q=80&w=1000",
  ],
  Hotels: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=1000",
  ],
  Tourism: [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1000",
  ],
  Visa: [
    "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000",
  ],
  "India Travel News": [
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1000",
  ],
  "India Aviation": [
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=1000",
  ],
  "Travel News": [NEWS_FALLBACK_IMAGE],
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

const blockedTitleTerms = [
  "appointed",
  "brand usa",
  "director of operations",
  "food & beverage manager",
  "hospitality with a heart",
  "osceola county",
  "profit and purpose",
  "supports over",
  "the leela welcomes",
  "used suv",
  "teen driver",
  "top used suv",
];

export const posts: EditorialPost[] = [
  {
    id: 11,
    title: "October 2026: Build One Festival Trip Around the Dates That Matter",
    excerpt:
      "India's October festival calendar creates strong cultural travel opportunities, but overlapping dates and city-to-city transfers make a focused regional plan more useful than a rushed multi-city checklist.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1000",
    author: "Vishal Harlalka",
    date: "October 5, 2026",
    category: "Planning",
    slug: "october-2026-festival-travel-dates-and-pacing",
    readTime: "4 min read",
    tags: ["Festival Travel", "India Travel", "Cultural Travel", "Trip Planning"],
    body: [
      "October's cultural calendar is a reason to plan precisely, not to overfill a route. Incredible India lists Navratri from October 11 to 19 in 2026, with Durga Puja in Kolkata from October 17 to 21; Diwali falls on November 8 in the national public-holiday listing. The overlap means a single 7-day departure cannot honestly promise every festival at its peak. Pick the ritual, city, and dates that matter most before building the rest of the holiday.",
      "For Gujarat, a Navratri-first plan can use Ahmedabad as a base and leave enough time for event transport, hotel check-in, and late-night Garba timing. For Kolkata, a Durga Puja-first plan should favour a centrally located stay, realistic pandal movement, and lighter daytime sightseeing. These are high-footfall celebration periods, so local event access, security restrictions, traffic diversions, and venue rules need checking again close to travel.",
      "A multi-city festival trip still works when it is presented as a date-led custom route rather than a fixed circuit. Start with confirmed arrival and departure cities, include a recovery morning after a late festival evening, and add flights only where they preserve useful time. If the goal is Diwali, keep it as a separate November departure or extension unless the calendar and travel dates genuinely align.",
      "Travel Gateway can tailor a festival route around one primary celebration, hotel style, mobility needs, dietary preferences, and a dated quote. Starting prices and proposed event plans remain indicative: final transport, hotel space, local access, and any official event guidance must be reconfirmed before non-refundable payment.",
    ],
    takeaways: [
      "Choose one primary festival and city before adding secondary stops.",
      "Treat the 2026 Navratri, Durga Puja, and Diwali dates as planning anchors, then reconfirm local schedules and access.",
      "Protect usable celebration time with central hotels, recovery time, and realistic intercity transfers.",
    ],
    sources: [
      {
        label: "Incredible India: Navratri 2026 dates and regional celebrations",
        url: "https://www.incredibleindia.gov.in/en/festivals-and-events/navratri",
      },
      {
        label: "Incredible India: Kolkata Durga Puja 2026 dates",
        url: "https://www.incredibleindia.gov.in/en/festivals-and-events/durga-puja",
      },
      {
        label: "Incredible India: 2026 public-holiday calendar",
        url: "https://www.incredibleindia.gov.in/en/plan-your-trip/public-holidays",
      },
    ],
  },
  {
    id: 10,
    title: "September 2026: Price the Festive Trip Before You Add Stops",
    excerpt:
      "Festive demand is building earlier, but higher peak-date airfares and hotel pressure make route discipline, usable days, and a complete cost comparison essential.",
    image:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1000",
    author: "Vishal Harlalka",
    date: "September 10, 2026",
    category: "Planning",
    slug: "september-2026-festive-travel-full-cost-planning",
    readTime: "4 min read",
    tags: ["Festive Travel", "India Travel", "Family Travel", "Trip Budget"],
    body: [
      "India's festive travel window is starting earlier. The Economic Times reported on September 9 that travel-platform search volumes were up around 40–45% month on month and that many travelers were combining festivals, school holidays, and paid leave into 5–9-day domestic or international itineraries. These are company and hotel-sector signals rather than a promise about every route, but they make one planning step urgent: confirm the travel window before peak-date inventory narrows.",
      "A second September market report points to the budget trade-off. ET TravelWorld reported elevated festive airfares, hotel costs, and currency pressure, with travelers considering value-oriented international choices or less obvious domestic destinations. That does not make one destination automatically cheaper. It means a fair comparison needs flights, baggage, transfers, visa or entry steps, meals, hotel location, taxes, and peak-date supplements in the same total.",
      "For a 5–9-day family holiday, protect the days that guests can actually enjoy. A single-region India route or a well-connected short-haul circuit can outperform a longer destination list if extra flights, long drives, early check-outs, and repeated packing consume the leave. Families should also decide rooming, child ages, meal preferences, mobility needs, and any festival-day closures before asking suppliers to hold space.",
      "Travel Gateway can compare a domestic route with a short-haul international option using the same dated brief. Starting prices on the site remain indicative; final fares, hotel space, visas, entry rules, and local operating conditions must be reconfirmed before non-refundable payment.",
    ],
    takeaways: [
      "Fix the travel dates, rooming, and non-negotiable experiences before requesting a festive quote.",
      "Compare the complete trip cost, including flights, baggage, transfers, taxes, entry steps, and peak-date supplements.",
      "Protect usable holiday time by limiting unnecessary hotel changes, internal flights, and long transfer days.",
    ],
    sources: [
      {
        label: "The Economic Times: festive bookings and longer holiday demand",
        url: "https://economictimes.indiatimes.com/industry/services/hotels-/-restaurants/festive-fever-checks-in-early-hotel-bookings-room-rates-rise-as-indians-plan-longer-getaways/articleshow/133939679.cms",
      },
      {
        label: "ET TravelWorld: festive airfare and full-cost pressure",
        url: "https://travel.economictimes.indiatimes.com/news/research-and-statistics/weaker-rupee-and-costly-airfares-make-seasonal-international-travel-unviable/133724910",
      },
    ],
  },
  {
    id: 9,
    title: "Late-August 2026: Plan the Long Weekend Before the Fare",
    excerpt:
      "Short breaks are growing, but a useful 2–3-day plan starts with leave, flight timing, transfers, and the right-sized route—not a cheap headline fare.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1000",
    author: "Vishal Harlalka",
    date: "August 30, 2026",
    category: "Planning",
    slug: "late-august-2026-long-weekend-micro-holiday-planning",
    readTime: "4 min read",
    tags: ["Long Weekends", "Short Breaks", "India Travel", "Short-Haul Asia"],
    body: [
      "India's late-August travel market is rewarding shorter, more intentional breaks. Business Standard, citing Pickyourtrail and Cleartrip data, reported 40% year-on-year growth in overseas long-weekend bookings and strong interest in nearby destinations such as the Maldives, Bali, Thailand, Singapore, and Sri Lanka. The useful lesson is not that every long weekend should become an international trip; it is that travelers are planning limited leave more deliberately.",
      "Scapia's July platform report points in the same direction from a different angle. It described more frequent micro-holidays, an average domestic trip length of 1.7 nights, and more than one in three domestic air bookings made within three days of travel. Because these are company-platform signals rather than the whole market, treat them as directional—but they still explain why concise routes, fast quote turnaround, hotel location, child-friendly stays, and transfer time matter so much.",
      "For a 2–3-day India break, choose one compact base or a single short circuit instead of turning the holiday into a chain of check-ins. For a short-haul international break, count immigration, airport transfers, entry forms, baggage rules, and flight timings before comparing the number of hotel nights. A late arrival and early departure can turn a four-night headline into only two useful destination days.",
      "Travel Gateway can compare a compact domestic escape with a short-haul international option using the same checklist: door-to-door travel time, usable sightseeing time, hotel location, transfer mode, meals, entry requirements, weather dependency, and the full indicative trip cost. Live fares and supplier space still need to be reconfirmed before any non-refundable payment.",
    ],
    takeaways: [
      "Build a short break around usable destination time, not only the advertised number of nights.",
      "For 2–3-day routes, prefer one strong base over multiple hotel changes.",
      "Compare the complete trip cost after flights, baggage, transfers, entry steps, and peak-date supplements.",
    ],
    sources: [
      {
        label: "Business Standard: long-weekend and festive travel demand",
        url: "https://www.business-standard.com/industry/news/indians-long-weekend-travel-overseas-holidays-onam-raksha-bandhan-126082000290_1.html",
      },
      {
        label: "Scapia: India's 2026 micro-holiday economy",
        url: "https://www.scapia.cards/newsroom/india-enters-the-micro-holiday-economy-more-trips-higher-standards-new-destinations",
      },
    ],
  },
  {
    id: 8,
    title: "What India’s 2026 Travelers Need Before They Book",
    excerpt:
      "Current Google research points to longer, multi-touch planning journeys and record interest in group and slow travel—making practical package detail more valuable than generic inspiration.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1000",
    author: "Vishal Harlalka",
    date: "August 20, 2026",
    category: "Trends",
    slug: "india-2026-travel-search-booking-expectations",
    readTime: "5 min read",
    tags: ["India Travel", "Group Travel", "Slow Travel", "Planning"],
    body: [
      "Google and Kantar’s India traveler research says people use an average of seven inspiration touchpoints, while 44% take more than a week to plan and book a holiday. Search and YouTube remain central throughout the journey, especially when travelers compare reviews, hotel location, room availability, flights, and the details needed to make a confident decision.",
      "That raises the standard for a useful tour page. A strong package should explain who the route suits, realistic pacing, hotel category, transport, meal support, inclusions, exclusions, starting-price context, entry-document checks, and what can change with dates or availability. Attractive imagery still matters, but it should lead into decision-ready detail rather than replace it.",
      "Google’s 2026 travel-search review also found record interest in travel groups and tour groups, alongside an all-time high for slow travel. For a personal travel planner, the practical opportunity is not to force every guest into a fixed departure. It is to make private families, friends, senior travelers, solo guests seeking a group, and slower single-region journeys easier to compare before an inquiry.",
      "Travel Gateway’s current package pages now emphasize route pacing, operational checks, indicative pricing, customization, and direct inquiry support. Travelers should still verify visas, government advisories, supplier availability, and transport schedules before non-refundable payments because those details can change after a page is published.",
    ],
    takeaways: [
      "Answer hotel, transport, meal, pacing, inclusion, and exclusion questions before asking for a lead.",
      "Offer a clear choice between private customization, small-group needs, and slower single-region travel.",
      "Use current official sources for entry and operational facts, then reconfirm them before payment.",
    ],
    sources: [
      {
        label: "Think with Google: India traveler research for 2026",
        url: "https://business.google.com/in/think/consumer-insights/travel-trends-marketing-india/",
      },
      {
        label: "Google: 2026 travel search trends",
        url: "https://blog.google/products-and-platforms/products/travel/2026-travel-trends/",
      },
    ],
  },
  {
    id: 7,
    title: "August 2026: Short-Haul Asia and Flexible India Holiday Planning",
    excerpt:
      "Why value, visa readiness, flexible routing, and a clear land-package quote matter when comparing India and short-haul Asia holidays.",
    image:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80&w=1000",
    author: "Vishal Harlalka",
    date: "August 1, 2026",
    category: "Planning",
    slug: "august-2026-short-haul-asia-india-planning",
    readTime: "4 min read",
    tags: ["Short-Haul Asia", "Vietnam", "India", "Value"],
    body: [
      "Indian outbound demand continues to favour short- and medium-haul holidays that are easy to reach, offer clear value, and can be tailored around family needs. That makes a quick comparison of total trip effort more useful than comparing a headline package price alone: flight timing, baggage, airport transfers, hotel location, internal travel, food preferences, and entry documentation can change the experience substantially.",
      "Vietnam remains a strong choice for travellers who want a multi-stop cultural and coastal route, but mainland itineraries need visa planning. Vietnam Immigration says its e-visa can be valid for up to 90 days with single or multiple entry; use the official portal and verify the correct entry port, passport details, and current requirements before any non-refundable payment.",
      "For India, seasonal routes should be presented with operational honesty. Himalayan pilgrimages and monsoon hill or coastal itineraries need realistic drive times, weather-aware alternatives, and room to move a transfer when local conditions require it. The best quote is a transparent starting land-package estimate with inclusions, exclusions, peak-date supplements, and supplier confirmation made clear.",
    ],
    takeaways: [
      "Compare total trip effort and inclusions, not only the starting fare.",
      "Verify visas, passport details, entry ports, and airline rules before issuing non-refundable tickets.",
      "Build weather buffers and flexible routing into mountain and monsoon journeys.",
    ],
  },
  {
    id: 6,
    title: "June 2026 Monsoon and Short-Haul Asia Planning Checks",
    excerpt:
      "Current notes for travelers comparing monsoon India, Char Dham, Kerala wellness, Thailand entry rules, and practical short-haul Asia holidays.",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1000",
    author: "Vishal Harlalka",
    date: "June 24, 2026",
    category: "Planning",
    slug: "june-2026-monsoon-short-haul-asia-checks",
    readTime: "5 min read",
    tags: ["Monsoon", "Thailand", "Kerala", "Family Travel"],
    body: [
      "India travel planning needs more operational detail this week because active monsoon conditions can affect routes differently. IMD-linked June 23-24 updates warned of widespread rain, thunderstorms, and heavy spells across several regions, including Kerala, Uttarakhand, Goa, Karnataka, parts of Maharashtra, and the Northeast. That does not mean travelers should avoid every monsoon plan, but it does mean the itinerary should allow flexible sightseeing order, better vehicles, and buffer time around hill, coast, ferry, and pilgrimage sectors.",
      "For Kerala, the stronger product is still wellness-first: Ayurveda, backwater resorts, tea landscapes, good hotels, and slower days. Trying to sell a dry-season sightseeing checklist during active rain weeks creates the wrong expectation. Travelers should be told upfront which activities are weather-dependent and which parts of the trip remain enjoyable even when it rains.",
      "For Char Dham, June and early monsoon planning should be treated as an operational pilgrimage. Registration, medical fitness, road advisories, local weather, pony or palki support, porter help, and helicopter-sector uncertainty all need to be discussed before final payment, especially for senior travelers and families.",
      "Short-haul Asia is also not just about the cheapest package. Current travel trend reporting for 2026 points toward more personalized, wellness-led, culinary, mountain, and multi-generational trips. At the same time, Thailand entry-rule reporting has been volatile, so Indian travelers comparing Thailand, Vietnam, South Korea, Singapore, and island holidays should verify visa or exemption rules, passport validity, baggage, hotel location, and internal transfers before issuing non-refundable tickets.",
    ],
    takeaways: [
      "Add weather buffers to monsoon India, Char Dham, hill, coast, and ferry-based itineraries.",
      "Position Kerala monsoon around wellness and comfort, not only sightseeing volume.",
      "For short-haul Asia, compare entry rules, family comfort, food, pacing, and total travel effort before price.",
    ],
  },
  {
    id: 5,
    title: "India Travel Planning Signals for Summer and Monsoon 2026",
    excerpt:
      "A practical read on why inbound India demand, Char Dham timing, and Kerala wellness travel deserve sharper planning language right now.",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1000",
    author: "Vishal Harlalka",
    date: "June 17, 2026",
    category: "Trends",
    slug: "india-travel-planning-signals-summer-monsoon-2026",
    readTime: "6 min read",
    tags: ["India", "Pilgrimage", "Kerala", "Planning"],
    body: [
      "India's Ministry of Tourism said on February 5, 2026 that international tourist arrivals in India reached 20.57 million in 2024, up 8.9 percent year on year. For a travel planner, that is not just a statistic. It is a reminder that India pages aimed at overseas guests need stronger route clarity, better comfort signals, and less generic package language.",
      "At the same time, summer pilgrimage demand remains operationally sensitive. The official Uttarakhand registration portal for Char Dham and Hemkund is active, and successful planning depends on more than temple names. Guests need realistic drive times, health awareness, registration timing, and early discussion of helicopter sectors, pony or palki support, and hotel quality near key stops.",
      "For monsoon travel, Kerala remains easier to position when the promise is wellness, softer pacing, greenery, and backwater downtime rather than nonstop sightseeing. That is especially relevant for couples, senior travelers, and guests who want a restorative India holiday instead of a checklist-heavy route in heavy rain.",
      "The product lesson is simple: seasonal pages should lead with why this route makes sense now, what practical constraints matter, and which traveler profile it suits best. Better travel content does not guarantee rankings, but it does make the right inquiry easier to earn.",
    ],
    takeaways: [
      "Use stronger premium-planning language on India pages because inbound demand has recovered materially.",
      "Treat Char Dham as an operational product with registration, health, and pacing details surfaced early.",
      "Sell monsoon Kerala around wellness and comfort instead of forcing dry-season sightseeing expectations.",
    ],
  },
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

export function editorialPostDate(value: string) {
  return new Date(`${value} 12:00:00 UTC`).toISOString().slice(0, 10);
}

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
  const text = title.toLowerCase();
  if (feedCategory?.startsWith("India")) {
    if (text.includes("visa") || text.includes("passport") || text.includes("e-gate") || text.includes("immigration")) {
      return "Visa";
    }
    if (
      text.includes("airline") ||
      text.includes("flight") ||
      text.includes("airport") ||
      text.includes("bengaluru-zurich") ||
      text.includes("hyderabad")
    ) {
      return "India Aviation";
    }
    if (
      text.includes("hotel") ||
      text.includes("resort") ||
      text.includes("hospitality") ||
      text.includes("restaurant") ||
      text.includes("ihg") ||
      text.includes("hilton")
    ) {
      return "Hotels";
    }
    return feedCategory;
  }

  if (feedCategory) return feedCategory;

  if (text.includes("india")) return "India Travel News";
  if (text.includes("visa") || text.includes("passport")) return "Visa";
  if (text.includes("airline") || text.includes("flight") || text.includes("airport")) return "Aviation";
  if (text.includes("cruise")) return "Cruise";
  if (text.includes("hotel")) return "Hotels";
  if (text.includes("tourism") || text.includes("tourist")) return "Tourism";
  return "Travel News";
}

function getImageIndex(title: string, total: number) {
  if (total <= 1) return 0;
  return Math.abs([...title].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % total;
}

function getLiveImage(category: string, title: string, sourceImage?: string) {
  if (sourceImage?.startsWith("http")) return sourceImage;
  const images = liveCategoryImages[category] || liveCategoryImages["Travel News"];
  return images[getImageIndex(title, images.length)] || NEWS_FALLBACK_IMAGE;
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

function getNewsImpact(category: string) {
  if (category === "Visa") {
    return "Entry-rule changes can affect whether a traveler can board, how early documents must be prepared, and which bookings are safe to confirm.";
  }

  if (category === "Aviation" || category === "India Aviation") {
    return "Airline and airport changes can quickly affect fares, connection time, baggage planning, and the usable days inside a holiday.";
  }

  if (category === "Cruise") {
    return "Cruise updates matter before flights and hotels are locked because port timings, embarkation rules, and route changes can affect the whole trip.";
  }

  if (category === "Hotels") {
    return "Hotel developments can change destination value, room availability, location choices, and the service level travelers should expect.";
  }

  if (category === "India Travel News") {
    return "This update may influence current India itinerary planning, destination demand, supplier availability, or the advice shared with travelers.";
  }

  return "This story is a useful planning signal for travelers and advisors comparing destination timing, availability, costs, and current conditions.";
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
    image: getLiveImage(category, title, article.socialimage),
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
  const publishedAt = parseGdeltDate(article.seendate);
  const isRecent = Date.now() - publishedAt.getTime() < 14 * 24 * 60 * 60 * 1000;
  const hasTravelKeyword = travelKeywords.some((keyword) => title.includes(keyword));
  const isBlocked = blockedTitleTerms.some((term) => title.includes(term));
  return isRecent && hasTravelKeyword && !isBlocked;
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

function normalizeStoredArticle(article: Omit<LiveArticle, "seenAt"> & { seenAt: Date | string }): LiveArticle {
  return {
    ...article,
    seenAt: article.seenAt instanceof Date ? article.seenAt : new Date(article.seenAt),
  };
}

function mergeArchivedArticles(current: LiveArticle[], incoming: LiveArticle[]) {
  return dedupeArticles([...incoming, ...current].map(normalizeStoredArticle))
    .sort((a, b) => b.seenAt.getTime() - a.seenAt.getTime())
    .slice(0, MAX_ARCHIVED_NEWS);
}

function readNewsArchive() {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(NEWS_ARCHIVE_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as LiveArticle[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(normalizeStoredArticle)
      .filter((article) => article.title && article.url && !Number.isNaN(article.seenAt.getTime()));
  } catch {
    return [];
  }
}

function writeNewsArchive(articles: LiveArticle[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(NEWS_ARCHIVE_STORAGE_KEY, JSON.stringify(articles));
  } catch {
    // Private browsing and full storage should not break the live newsroom.
  }
}

function matchesSearch(article: LiveArticle, query: string) {
  const haystack = [
    article.title,
    article.summary,
    article.source,
    article.sourceCountry,
    article.category,
    ...article.checks,
  ]
    .join(" ")
    .toLowerCase();

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export default function Blog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const routePost = posts.find((post) => post.slug === slug);
  const isArticlePage = Boolean(routePost);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPostId, setSelectedPostId] = useState(routePost?.id ?? posts[0].id);
  const [liveArticles, setLiveArticles] = useState<LiveArticle[]>([]);
  const [newsArchive, setNewsArchive] = useState<LiveArticle[]>([]);
  const [newsSearch, setNewsSearch] = useState("");
  const [selectedLiveId, setSelectedLiveId] = useState<string | null>(null);
  const [newsStatus, setNewsStatus] = useState<NewsStatus>("idle");
  const [newsError, setNewsError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [feedSource, setFeedSource] = useState("Live travel feeds");
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    if (routePost) {
      setSelectedPostId(routePost.id);
      return;
    }

    if (slug) {
      navigate("/blog", { replace: true });
      return;
    }

    const hashSlug = window.location.hash.replace(/^#/, "");
    const linkedPost = posts.find((post) => post.slug === hashSlug);
    if (linkedPost) navigate(`/blog/${linkedPost.slug}`, { replace: true });
  }, [navigate, routePost, slug]);

  const refreshLiveNews = useCallback(async () => {
    setNewsStatus("loading");
    setNewsError(null);

    try {
      const data = await loadLiveNews();
      const liveFeedArticles = (data.articles || [])
        .filter(isTravelRelevant)
        .map(normalizeArticle);
      const nextArticles = dedupeArticles(
        liveFeedArticles.length > 0 ? liveFeedArticles : officialIndiaTravelUpdates
      ).slice(0, 12);

      setLiveArticles(nextArticles);
      setNewsArchive((current) => {
        const nextArchive = mergeArchivedArticles(current, nextArticles);
        writeNewsArchive(nextArchive);
        return nextArchive;
      });
      setSelectedLiveId((current) => {
        if (current && nextArticles.some((article) => article.id === current)) return current;
        return nextArticles[0]?.id ?? null;
      });
      setLastUpdated(new Date());
      setFeedSource(data.source || "Live travel feeds");
      setNewsStatus("success");
    } catch (error) {
      setLiveArticles(officialIndiaTravelUpdates);
      setNewsArchive((current) => {
        const nextArchive = mergeArchivedArticles(current, officialIndiaTravelUpdates);
        writeNewsArchive(nextArchive);
        return nextArchive;
      });
      setSelectedLiveId(officialIndiaTravelUpdates[0]?.id ?? null);
      setLastUpdated(new Date());
      setNewsStatus("error");
      setNewsError(
        "The live travel feed could not refresh right now. Showing verified India travel updates instead."
      );
    }
  }, []);

  useEffect(() => {
    setNewsArchive(readNewsArchive());
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
  const normalizedNewsSearch = newsSearch.trim();
  const searchedArchive = normalizedNewsSearch
    ? newsArchive.filter((article) => matchesSearch(article, normalizedNewsSearch))
    : [];
  const displayedLiveArticles = normalizedNewsSearch ? searchedArchive : liveArticles;

  useEffect(() => {
    if (normalizedNewsSearch) {
      if (searchedArchive.length === 0) return;
      if (selectedLiveId && searchedArchive.some((article) => article.id === selectedLiveId)) return;
      setSelectedLiveId(searchedArchive[0].id);
      return;
    }

    if (selectedLiveId && liveArticles.some((article) => article.id === selectedLiveId)) return;
    setSelectedLiveId(liveArticles[0]?.id ?? null);
  }, [liveArticles, normalizedNewsSearch, searchedArchive, selectedLiveId]);

  const selectedLiveArticle =
    displayedLiveArticles.find((article) => article.id === selectedLiveId) ||
    liveArticles.find((article) => article.id === selectedLiveId) ||
    displayedLiveArticles[0] ||
    liveArticles[0];
  const latestLiveArticle = liveArticles[0];
  const liveCategories = Array.from(new Set(liveArticles.map((article) => article.category)));
  const showEditorialGrid = activeCategory !== "Live News";

  const selectPost = (postId: number) => {
    setSelectedPostId(postId);
    document.getElementById("detailed-blog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const articlePath = `/blog/${selectedPost.slug}`;
  const articleSchema = {
    "@type": "BlogPosting",
    "@id": `${siteUrl}${articlePath}#article`,
    headline: selectedPost.title,
    description: selectedPost.excerpt,
    image: selectedPost.image,
    datePublished: editorialPostDate(selectedPost.date),
    author: { "@type": "Person", name: selectedPost.author, url: `${siteUrl}/about` },
    publisher: { "@id": `${siteUrl}/#travelagency` },
    mainEntityOfPage: { "@id": `${siteUrl}${articlePath}#webpage` },
    url: `${siteUrl}${articlePath}`,
    articleSection: selectedPost.category,
    keywords: selectedPost.tags.join(", "),
  };

  return (
    <div className="pt-24 pb-16 px-6 bg-background">
      <SEO
        title={isArticlePage ? `${selectedPost.title} | Travel Gateway` : "Travel Gateway Blog | Live Travel News, Visa Alerts and Planning Guides"}
        description={isArticlePage ? selectedPost.excerpt : "Read Travel Gateway travel news, visa updates, airline stories, destination insights, and advisor-written planning guides for Indian and international travelers."}
        canonicalPath={isArticlePage ? articlePath : "/blog"}
        ogType={isArticlePage ? "article" : "website"}
        image={isArticlePage ? selectedPost.image : defaultSeoImage}
        imageAlt={isArticlePage ? selectedPost.title : "Travel Gateway blog and live travel news"}
        keywords={isArticlePage ? selectedPost.tags.join(", ") : "travel blog India, travel news India, visa updates for Indian travelers, airline news, holiday planning guides"}
        structuredData={isArticlePage
          ? graphSchema([
              pageSchema(articlePath, selectedPost.title, selectedPost.excerpt, selectedPost.image),
              articleSchema,
              {
                "@type": "BreadcrumbList",
                "@id": `${siteUrl}${articlePath}#breadcrumb`,
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
                  { "@type": "ListItem", position: 2, name: "Journal", item: `${siteUrl}/blog` },
                  { "@type": "ListItem", position: 3, name: selectedPost.title, item: `${siteUrl}${articlePath}` },
                ],
              },
            ])
          : graphSchema([
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
              author: { "@type": "Person", name: post.author, url: `${siteUrl}/about` },
              publisher: { "@id": `${siteUrl}/#travelagency` },
              url: `${siteUrl}/blog/${post.slug}`,
              articleSection: post.category,
              keywords: post.tags.join(", "),
            })),
              },
            ])}
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <Badge className="mb-4 border-none bg-emerald-500/10 text-emerald-700">
            {!isArticlePage && <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
            {isArticlePage ? selectedPost.category : "Live Travel Dispatch"}
          </Badge>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            {isArticlePage ? selectedPost.title : <>The <span className="text-primary italic">TravelGateway</span> Journal</>}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isArticlePage
              ? selectedPost.excerpt
              : "Real-time travel news, visa alerts, airline updates, and detailed advisor-written planning briefs on one page."}
          </p>
        </div>

        {!isArticlePage && <section className="mb-16">
          <div className="mb-8 overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-950 text-white shadow-xl">
            <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:px-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <Radio className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                    Live newsroom
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white/80">
                    {newsStatus === "loading"
                      ? "Refreshing current travel headlines..."
                      : latestLiveArticle
                        ? `Latest: ${latestLiveArticle.title}`
                        : "Waiting for the next travel update"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-white/5 px-4 py-3">
                  <p className="text-xl font-black">{liveArticles.length}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/55">Stories</p>
                </div>
                <div className="rounded-xl bg-white/5 px-4 py-3">
                  <p className="text-xl font-black">{liveCategories.length}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/55">Sections</p>
                </div>
                <div className="rounded-xl bg-white/5 px-4 py-3">
                  <p className="text-xl font-black">5m</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/55">Refresh</p>
                </div>
              </div>
            </div>
            {liveArticles.length > 0 && (
              <div className="border-t border-white/10 bg-white/5 px-5 py-3 md:px-7">
                <div className="flex gap-8 overflow-hidden whitespace-nowrap text-xs font-semibold text-white/70">
                  {liveArticles.slice(0, 4).map((article) => (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => setSelectedLiveId(article.id)}
                      className="transition-colors hover:text-emerald-300"
                    >
                      <span className="mr-2 text-emerald-400">LIVE</span>
                      {article.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-6">
            <div>
              <Badge className="mb-3 bg-emerald-500/10 text-emerald-700 border-none">
                <Newspaper className="mr-2 h-3.5 w-3.5" />
                Real-time news feed
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">Live Travel News</h2>
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
                      <span className="flex items-center gap-1 text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live feed
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                      {selectedLiveArticle.title}
                    </h3>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border bg-muted/20 p-5">
                        <div className="mb-3 flex items-center gap-2 text-primary">
                          <Newspaper className="h-4 w-4" />
                          <h4 className="text-xs font-black uppercase tracking-[0.18em]">News brief</h4>
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {selectedLiveArticle.summary}
                        </p>
                      </div>
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                        <div className="mb-3 flex items-center gap-2 text-amber-700">
                          <Sparkles className="h-4 w-4" />
                          <h4 className="text-xs font-black uppercase tracking-[0.18em]">Why it matters</h4>
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {getNewsImpact(selectedLiveArticle.category)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 rounded-lg bg-muted/40 p-5">
                      <h4 className="font-bold mb-3">What travelers should check next</h4>
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
                        Feed: {feedSource} / Source country: {selectedLiveArticle.sourceCountry}
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
        </section>}

        {!isArticlePage && <section className="flex flex-col items-center mb-12">
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
        </section>}

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
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
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
                    </Link>
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
                  {!isArticlePage && <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                    {selectedPost.title}
                  </h2>}
                  <p className={cn("text-lg text-muted-foreground leading-relaxed", !isArticlePage && "mt-5")}>
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
                  {selectedPost.sources?.length ? (
                    <div className="mt-8 rounded-lg border border-primary/15 bg-primary/[0.03] p-5">
                      <h3 className="mb-4 font-bold">Sources and further reading</h3>
                      <ul className="space-y-3">
                        {selectedPost.sources.map((source) => (
                          <li key={source.url}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                            >
                              {source.label}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t pt-6">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Share article
                    </span>
                    <SocialShare url={`${baseUrl}${articlePath}`} title={selectedPost.title} />
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
                        <Link
                          to={`/blog/${post.slug}`}
                          onClick={() => selectPost(post.id)}
                          className={cn(buttonVariants({ variant: "link" }), "p-0 h-auto font-bold text-primary group/link")}
                        >
                          Read Detailed Blog
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
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
