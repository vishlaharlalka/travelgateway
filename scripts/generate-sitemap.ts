import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { destinationPath, destinations } from "../src/lib/data";
import { posts } from "../src/pages/Blog";

const siteUrl = "https://travelgateway.in";
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));

const staticRoutes = [
  { path: "/" },
  { path: "/services" },
  { path: "/destinations" },
  { path: "/destinations/vietnam" },
  { path: "/destinations/golden-chariot" },
  { path: "/destinations/palace-on-wheels" },
  { path: "/contact" },
  { path: "/about" },
  { path: "/blog" },
  { path: "/faq" },
  { path: "/privacy-policy" },
  { path: "/terms-of-service" },
];

const destinationRoutes = Array.from(
  new Set(destinations.map((destination) => destinationPath(destination)))
)
  .sort((a, b) => a.localeCompare(b))
  .map((path) => ({ path }));

const blogRoutes = posts.map((post) => ({ path: `/blog/${post.slug}` }));

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

const urls = Array.from(
  new Map([...staticRoutes, ...blogRoutes, ...destinationRoutes].map((route) => [route.path, route])).values()
);
const lastmod = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${xmlEscape(loc(url.path))}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const sitemapPath = join(rootDir, "public", "sitemap.xml");
mkdirSync(dirname(sitemapPath), { recursive: true });
writeFileSync(sitemapPath, xml);

console.log(`Generated sitemap with ${urls.length} URLs.`);
