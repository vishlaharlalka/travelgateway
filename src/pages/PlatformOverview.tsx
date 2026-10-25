import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ClipboardCheck, Globe2, LayoutDashboard, MessageSquare, ShieldCheck, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { defaultSeoImage, graphSchema, pageSchema } from "@/lib/seo";

const capabilities = [
  {
    icon: <Globe2 className="h-7 w-7" />,
    title: "Searchable travel catalogue",
    description: "Destination pages, filters, route comparisons, seasonal collections, and individual itinerary detail pages create a browsable discovery layer.",
  },
  {
    icon: <MessageSquare className="h-7 w-7" />,
    title: "Inquiry-first conversion",
    description: "Contact forms and package-specific WhatsApp requests collect the initial trip brief without claiming live inventory or instant booking capability.",
  },
  {
    icon: <Workflow className="h-7 w-7" />,
    title: "Advisor-led fulfillment",
    description: "The site supports a practical handoff from inspiration and route selection to a human-led quote, supplier confirmation, and trip coordination process.",
  },
  {
    icon: <ShieldCheck className="h-7 w-7" />,
    title: "Trust and policy surface",
    description: "Privacy, terms, payment, contact, FAQ, structured data, sitemap, and crawl rules are available for a more complete public operating presence.",
  },
];

const diligenceItems = [
  "Verify traffic, inquiry volume, conversion rate, acquisition sources, and repeat-client performance through the relevant analytics and CRM exports.",
  "Review supplier contracts, margin structure, cancellation exposure, customer-data handling, and the operational workload behind each itinerary type.",
  "Validate ownership and licensing for brand assets, content, imagery, social profiles, domains, and any third-party integrations before a transaction.",
];

export default function PlatformOverview() {
  return (
    <div className="bg-background px-6 pb-20 pt-32">
      <SEO
        title="Travel Gateway Platform Overview | Buyer Evaluation"
        description="A public overview of Travel Gateway's customer-facing travel discovery, inquiry, and advisor-led fulfillment experience for prospective buyers and partners."
        canonicalPath="/platform-overview"
        image={defaultSeoImage}
        imageAlt="Travel Gateway platform overview"
        noindex
        structuredData={graphSchema([
          pageSchema(
            "/platform-overview",
            "Travel Gateway Platform Overview | Buyer Evaluation",
            "A public overview of Travel Gateway's customer-facing travel discovery, inquiry, and advisor-led fulfillment experience for prospective buyers and partners."
          ),
        ])}
      />

      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2.5rem] bg-[#07111f] px-7 py-14 text-white md:px-14 md:py-20">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative max-w-3xl">
            <Badge className="mb-6 border border-white/15 bg-white/10 text-white">For prospective buyers and partners</Badge>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">A clear view of the customer-facing platform</h1>
            <p className="mt-6 text-lg leading-8 text-white/75 md:text-xl">
              Travel Gateway is a travel-discovery and inquiry platform for curated India and international journeys. It is designed to turn destination research into a qualified planning conversation with a human travel advisor.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button render={<Link to="/destinations" />} className="rounded-full px-6 py-6 font-bold">
                Explore the live catalogue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button render={<Link to="/contact?destination=Prospective%20buyer%20platform%20review" />} variant="outline" className="rounded-full border-white/30 px-6 py-6 text-white hover:bg-white/10 hover:text-white">
                Request a buyer discussion
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Live product scope</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">What a buyer can evaluate on the site today</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((capability, index) => (
              <motion.article
                key={capability.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-6 inline-flex rounded-2xl bg-primary/10 p-4 text-primary">{capability.icon}</div>
                <h3 className="text-xl font-black tracking-tight">{capability.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{capability.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-[2rem] bg-muted/50 p-8 md:grid-cols-[0.8fr_1.2fr] md:p-12">
          <div>
            <div className="inline-flex rounded-2xl bg-primary/10 p-4 text-primary"><LayoutDashboard className="h-8 w-8" /></div>
            <h2 className="mt-6 text-3xl font-black tracking-tight">Current operating model</h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-muted-foreground">
            <p><span className="font-bold text-foreground">1. Discover:</span> a visitor explores packages, route variants, FAQs, service information, and travel planning content.</p>
            <p><span className="font-bold text-foreground">2. Qualify:</span> the visitor submits dates, party size, hotel style, and contact details through a package or general inquiry path.</p>
            <p><span className="font-bold text-foreground">3. Fulfill:</span> the travel team reviews availability, prepares a tailored quote, confirms suppliers, and coordinates pre-departure and travel-day details.</p>
            <p className="rounded-2xl border border-primary/15 bg-background p-5 text-sm"><span className="font-bold text-foreground">Important:</span> displayed package prices are indicative starting points. They are not live inventory, a financial forecast, or a representation of booked revenue.</p>
          </div>
        </section>

        <section className="py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Buyer diligence</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">What should be verified off-site</h2>
            </div>
            <ClipboardCheck className="hidden h-12 w-12 text-primary md:block" />
          </div>
          <div className="space-y-4">
            {diligenceItems.map((item) => (
              <div key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="leading-7 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
