import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
};

const siteUrl = "https://travelgateway.in";

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

export default function SEO({
  title,
  description,
  keywords,
  canonicalPath = "/",
  ogType = "website",
  structuredData,
}: SEOProps) {
  useEffect(() => {
    const canonicalUrl = new URL(canonicalPath, siteUrl).toString();
    document.title = title;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    if (keywords) {
      upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    }

    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: ogType });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const schemaId = "travelgateway-structured-data";
    const existingSchema = document.getElementById(schemaId);
    if (existingSchema) existingSchema.remove();

    if (structuredData) {
      const script = document.createElement("script");
      script.id = schemaId;
      script.type = "application/ld+json";
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      const currentSchema = document.getElementById(schemaId);
      if (currentSchema) currentSchema.remove();
    };
  }, [canonicalPath, description, keywords, ogType, structuredData, title]);

  return null;
}
