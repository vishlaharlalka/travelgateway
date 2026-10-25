import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { destinationPath, destinations, getDestinationFaqs } from "../src/lib/data";
import { parseInrPrice } from "../src/lib/pricing";
import { defaultSeoImage, graphSchema, pageSchema, siteUrl } from "../src/lib/seo";
import { editorialPostDate, posts } from "../src/pages/Blog";

type RouteMeta = {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  schemaNodes?: Record<string, unknown>[];
  noindex?: boolean;
  ogType?: "website" | "article";
};

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(rootDir, "dist");
const template = readFileSync(join(distDir, "index.html"), "utf8");

const staticRoutes: RouteMeta[] = [
  {
    path: "/",
    title: "Travel Agency in Ahmedabad for Private India Tours | Travel Gateway",
    description:
      "Discover India through personally designed private journeys, trusted local guides, exceptional stays, and direct support from Travel Gateway in Ahmedabad.",
    imageAlt: "Travel Gateway curated India and international journeys",
  },
  {
    path: "/services",
    title: "Travel Services | International Tours, Visa Help and Luxury Planning",
    description:
      "Explore Travel Gateway services for international holidays, India tours, visa guidance, luxury journeys, groups, corporate travel, and personalized trip planning.",
  },
  {
    path: "/destinations",
    title: "Destinations | India and International Tour Packages by Travel Gateway",
    description:
      "Compare curated India and international tour packages, detailed itineraries, pricing guidance, and travel ideas planned by Travel Gateway Ahmedabad.",
  },
  {
    path: "/destinations/vietnam",
    title: "Vietnam Tour Packages from Ahmedabad | Travel Gateway",
    description:
      "Compare Vietnam tour packages from Ahmedabad, including Hanoi, Ha Long Bay, Central Vietnam, Ho Chi Minh City, and Phu Quoc holiday routes.",
  },
  {
    path: "/destinations/golden-chariot",
    title: "Golden Chariot Pride of Karnataka | Luxury Train Journey",
    description:
      "Explore the Golden Chariot Pride of Karnataka luxury train route through Bengaluru, Bandipur, Mysuru, Hampi, Pattadakal, Aihole, and Goa.",
  },
  {
    path: "/destinations/palace-on-wheels",
    title: "Palace on Wheels Luxury Train | Rajasthan Rail Journey",
    description:
      "Discover the Palace on Wheels luxury rail journey from New Delhi through Jaipur, Ranthambhore, Udaipur, Jaisalmer, Jodhpur, Bharatpur, and Agra.",
  },
  {
    path: "/contact",
    title: "Contact Travel Gateway | Travel Agent in South Bopal Ahmedabad",
    description:
      "Contact Travel Gateway in South Bopal, Ahmedabad for India tours, international holidays, visa guidance, honeymoon packages, and personalized travel planning.",
  },
  {
    path: "/about",
    title: "About Travel Gateway | Vishal Harlalka Travel Planner Ahmedabad",
    description:
      "Meet Travel Gateway founder Vishal Harlalka and learn about the boutique Ahmedabad travel agency behind curated India and international journeys.",
  },
  {
    path: "/blog",
    title: "Travel Gateway Blog | Live Travel News, Visa Alerts and Planning Guides",
    description:
      "Read live travel news, visa updates, airline stories, destination insights, and advisor-written planning guides for Indian and international travelers.",
  },
  {
    path: "/faq",
    title: "Travel Planning FAQ | Travel Gateway Ahmedabad",
    description:
      "Find answers about booking with Travel Gateway, personalized itineraries, visas, payments, support, and travel planning from Ahmedabad.",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy | Travel Gateway",
    description: "Read how Travel Gateway handles traveler inquiries, personal information, and booking-related data.",
  },
  {
    path: "/terms-of-service",
    title: "Terms and Conditions | Travel Gateway",
    description: "Read Travel Gateway terms and conditions for travel planning, quotations, bookings, payments, and supplier services.",
  },
  {
    path: "/payment",
    title: "Secure Payment | Travel Gateway",
    description: "Use the Travel Gateway payment page for confirmed travel bookings and approved payment requests.",
    noindex: true,
  },
  {
    path: "/platform-overview",
    title: "Travel Gateway Platform Overview | Buyer Evaluation",
    description:
      "A public overview of Travel Gateway's customer-facing travel discovery, inquiry, and advisor-led fulfillment experience for prospective buyers and partners.",
    noindex: true,
  },
];

const destinationRoutes: RouteMeta[] = destinations.map((destination) => {
  const path = destinationPath(destination);
  const url = new URL(path, siteUrl).toString();
  const description = destination.description;
  const tripDescription = destination.longDescription || destination.description;
  const faqItems = getDestinationFaqs(destination);

  return {
    path,
    title: `${destination.name} Tour Package | Travel Gateway`,
    description,
    image: destination.image,
    imageAlt: `${destination.name} travel package by Travel Gateway`,
    schemaNodes: [
      {
        "@type": "TouristTrip",
        "@id": `${url}#tour`,
        name: destination.name,
        description: tripDescription,
        image: destination.image,
        touristType: ["Indian travelers", "Families", "Couples", "Inbound guests"],
        provider: { "@id": `${siteUrl}/#travelagency` },
        itinerary: {
          "@type": "ItemList",
          itemListElement: (destination.itinerary || []).map((item, index) => ({
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
          url,
          description:
            "Indicative starting price per person; final price and availability are confirmed for the selected dates and inclusions.",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Destinations", item: `${siteUrl}/destinations` },
          { "@type": "ListItem", position: 3, name: destination.name, item: url },
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
    ],
  };
});

const blogPostRoutes: RouteMeta[] = posts.map((post) => {
  const path = `/blog/${post.slug}`;
  const url = new URL(path, siteUrl).toString();

  return {
    path,
    title: `${post.title} | Travel Gateway`,
    description: post.excerpt,
    image: post.image,
    imageAlt: post.title,
    ogType: "article",
    schemaNodes: [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        datePublished: editorialPostDate(post.date),
        author: { "@type": "Person", name: post.author, url: `${siteUrl}/about` },
        publisher: { "@id": `${siteUrl}/#travelagency` },
        mainEntityOfPage: { "@id": `${url}#webpage` },
        url,
        articleSection: post.category,
        keywords: post.tags.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Journal", item: `${siteUrl}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
});

function replaceMeta(html: string, route: RouteMeta) {
  const canonical = new URL(route.path, siteUrl).toString();
  const image = new URL(route.image || defaultSeoImage, siteUrl).toString();
  const imageAlt = route.imageAlt || route.title;
  const schema = JSON.stringify(
    graphSchema([
      pageSchema(route.path, route.title, route.description, image),
      ...(route.schemaNodes || []),
    ])
  );

  return html
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(route.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/>/,
      () => `<meta name="description" content="${escapeHtml(route.description)}" />`
    )
    .replace(
      /<meta name="robots" content="[^"]*"\s*\/>/,
      () => `<meta name="robots" content="${route.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}" />`
    )
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, () => `<meta property="og:title" content="${escapeHtml(route.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, () => `<meta property="og:description" content="${escapeHtml(route.description)}" />`)
    .replace(/<meta property="og:type" content="[^"]*"\s*\/>/, () => `<meta property="og:type" content="${route.ogType || "website"}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, () => `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, () => `<meta property="og:image" content="${escapeHtml(image)}" />`)
    .replace(/<meta property="og:image:secure_url" content="[^"]*"\s*\/>/, () => `<meta property="og:image:secure_url" content="${escapeHtml(image)}" />`)
    .replace(/<meta property="og:image:alt" content="[^"]*"\s*\/>/, () => `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, () => `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, () => `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, () => `<meta name="twitter:image" content="${escapeHtml(image)}" />`)
    .replace(/<meta name="twitter:image:alt" content="[^"]*"\s*\/>/, () => `<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, () => `<link rel="canonical" href="${canonical}" />`)
    .replace(
      /<script(?=[^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/,
      () => `<script id="travelgateway-structured-data" type="application/ld+json">${schema}</script>`
    );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const routes = Array.from(
  new Map([...destinationRoutes, ...staticRoutes, ...blogPostRoutes].map((route) => [route.path, route])).values()
);

for (const route of routes) {
  const outputPath = join(distDir, route.path.replace(/^\/+/, ""), "index.html");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, replaceMeta(template, route));
}

console.log(`Generated route-specific HTML metadata for ${routes.length} routes.`);
