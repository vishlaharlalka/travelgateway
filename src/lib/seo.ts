export const siteUrl = "https://travelgateway.in";
export const siteName = "Travel Gateway";
export const googleBusinessUrl =
  "https://www.google.com/maps/place/TRAVEL+GATEWAY/data=!4m7!3m6!1s0x395e9b901cf52447:0xbe1e27450dd4a9be!8m2!3d23.0178547!4d72.4734294!16s%2Fg%2F11gyjk6k_t";
export const defaultSeoImage =
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1200";

export const businessSchema = {
  "@type": "TravelAgency",
  "@id": `${siteUrl}/#travelagency`,
  name: siteName,
  url: siteUrl,
  telephone: "+91 9898111689",
  email: "inquiry@travelgateway.in",
  image: defaultSeoImage,
  logo: `${siteUrl}/favicon.svg`,
  priceRange: "$$",
  hasMap: googleBusinessUrl,
  sameAs: [
    googleBusinessUrl,
    "https://www.facebook.com/vishal.harlalka1",
    "https://www.instagram.com/travelgateway_india/",
  ],
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.0178547,
    longitude: 72.4734294,
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "G 901, Samanvay Scintilla, VIP Road, South Bopal",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    postalCode: "380058",
    addressCountry: "IN",
  },
  areaServed: ["India", "United States", "United Kingdom", "UAE", "Australia", "Canada", "Europe"],
  founder: {
    "@type": "Person",
    name: "Vishal Harlalka",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91 9898111689",
      contactType: "customer service",
      areaServed: ["IN", "US", "GB", "AE", "AU", "CA"],
      availableLanguage: ["English", "Hindi", "Gujarati"],
    },
  ],
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: siteName,
  url: siteUrl,
  publisher: { "@id": `${siteUrl}/#travelagency` },
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/destinations?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export function pageSchema(path: string, title: string, description: string, image = defaultSeoImage) {
  const url = new URL(path, siteUrl).toString();

  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    image,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#travelagency` },
  };
}

export function graphSchema(nodes: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [businessSchema, websiteSchema, ...nodes],
  };
}
