import { Link } from "react-router-dom";
import { Compass, Home, Mail } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { defaultSeoImage, graphSchema, pageSchema } from "@/lib/seo";

export default function NotFound() {
  return (
    <div className="min-h-[72vh] bg-background px-6 pb-20 pt-36">
      <SEO
        title="Page Not Found | Travel Gateway"
        description="This Travel Gateway page could not be found. Return home or contact our Ahmedabad travel planning team."
        canonicalPath="/404"
        image={defaultSeoImage}
        imageAlt="Travel Gateway page not found"
        noindex
        structuredData={graphSchema([
          pageSchema(
            "/404",
            "Page Not Found | Travel Gateway",
            "This Travel Gateway page could not be found. Return home or contact our Ahmedabad travel planning team."
          ),
        ])}
      />
      <section className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass className="h-10 w-10" />
        </div>
        <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-primary">404</p>
        <h1 className="mb-6 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          This journey has moved.
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          The page you requested is not available. Explore current tours from the homepage, or ask the Travel Gateway team to point you in the right direction.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button render={<Link to="/" />} size="lg" className="rounded-full px-8 font-bold">
            <Home className="mr-2 h-4 w-4" />
            Go home
          </Button>
          <Button render={<Link to="/contact" />} size="lg" variant="outline" className="rounded-full px-8 font-bold">
            <Mail className="mr-2 h-4 w-4" />
            Contact us
          </Button>
        </div>
      </section>
    </div>
  );
}
