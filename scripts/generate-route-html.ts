import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { destinationPath, destinations } from "../src/lib/data";
import { defaultSeoImage, graphSchema, pageSchema, siteUrl } from "../src/lib/seo";

type RouteMeta = {
  path: string;
  title: string;
  description: string;
  image?: string;
};

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(rootDir, "dist");
const template = readFileSync(join(distDir, "index.html"), "utf8");

const staticRoutes: RouteMeta[] = [
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
  },
];

const destinationRoutes: RouteMeta[] = destinations.map((destination) => ({
  path: destinationPath(destination),
  title: `${destination.name} Tour Package | Travel Gateway`,
  description: destination.longDescription || destination.description,
  image: destination.image,
}));

function replaceMeta(html: string, route: RouteMeta) {
  const canonical = new URL(route.path, siteUrl).toString();
  const image = new URL(route.image || defaultSeoImage, siteUrl).toString();
  const schema = JSON.stringify(
    graphSchema([pageSchema(route.path, route.title, route.description, image)])
  );

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escapeHtml(route.description)}" />`
    )
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(route.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(route.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${escapeHtml(image)}" />`)
    .replace(/<meta property="og:image:secure_url" content="[^"]*"\s*\/>/, `<meta property="og:image:secure_url" content="${escapeHtml(image)}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${escapeHtml(image)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${schema}</script>`
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
  new Map([...staticRoutes, ...destinationRoutes].map((route) => [route.path, route])).values()
);

for (const route of routes) {
  const outputPath = join(distDir, route.path.replace(/^\/+/, ""), "index.html");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, replaceMeta(template, route));
}

console.log(`Generated route-specific HTML metadata for ${routes.length} routes.`);
