import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { destinationPath, destinations } from "../src/lib/data";

const siteUrl = "https://travelgateway.in";
const lastmod = new Date().toISOString().slice(0, 10);
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));

const staticRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/destinations", changefreq: "weekly", priority: "0.9" },
  { path: "/contact", changefreq: "monthly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/faq", changefreq: "monthly", priority: "0.7" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-of-service", changefreq: "yearly", priority: "0.3" },
];

const destinationRoutes = Array.from(
  new Set(destinations.map((destination) => destinationPath(destination)))
)
  .sort((a, b) => a.localeCompare(b))
  .map((path) => ({ path, changefreq: "monthly", priority: "0.8" }));

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function loc(path: string) {
  return `${siteUrl}${path === "/" ? "" : path}`;
}

const urls = [...staticRoutes, ...destinationRoutes];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${xmlEscape(loc(url.path))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const sitemapPath = join(rootDir, "public", "sitemap.xml");
mkdirSync(dirname(sitemapPath), { recursive: true });
writeFileSync(sitemapPath, xml);

console.log(`Generated sitemap with ${urls.length} URLs.`);
