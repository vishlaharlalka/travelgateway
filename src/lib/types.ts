import { destinations } from "./data";

export interface ItineraryItem {
  day: string;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface DestinationImage {
  url: string;
  alt: string;
  caption: string;
}

export interface PlanningNote {
  title: string;
  body: string;
}

export interface Destination {
  id: number;
  name: string;
  country: string;
  state?: string;
  city?: string;
  type: string;
  region: string;
  regionId: string;
  image: string;
  category: string;
  price: string;
  rating: number;
  description: string;
  longDescription?: string;
  link?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  services?: string[];
  itinerary?: ItineraryItem[];
  faqs?: FAQItem[];
  galleryImages?: DestinationImage[];
  planningNotes?: PlanningNote[];
}
