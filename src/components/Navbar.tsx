import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ChevronDown, Globe2, MapPin, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { destinationPath, destinations } from "@/lib/data";
import type { Destination } from "@/lib/types";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Destinations", href: "/destinations" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
  { name: "Payment", href: "/payment" },
];

const isIndiaDestination = (destination: Destination) =>
  destination.country === "India" || (destination.type === "Luxury Train" && destination.country === "India");

const destinationMenuGroups = [
  {
    title: "India Packages",
    icon: MapPin,
    items: destinations
      .filter(isIndiaDestination)
      .sort((a, b) => (a.state || "India").localeCompare(b.state || "India") || a.name.localeCompare(b.name)),
  },
  {
    title: "International Packages",
    icon: Globe2,
    items: destinations
      .filter((destination) => !isIndiaDestination(destination))
      .sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name)),
  },
];

function DestinationMegaMenu({ useSolidHeader }: { useSolidHeader: boolean }) {
  return (
    <div className="group/menu relative">
      <Link
        to="/destinations"
        className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors relative"
      >
        Destinations
        <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover/menu:rotate-180" />
        <span className="absolute -bottom-2 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover/menu:w-full" />
      </Link>

      <div className="pointer-events-none absolute left-1/2 top-full z-50 w-[min(92vw,64rem)] -translate-x-1/2 translate-y-2 pt-5 opacity-0 transition-all duration-200 group-hover/menu:pointer-events-auto group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-focus-within/menu:pointer-events-auto group-focus-within/menu:opacity-100 group-focus-within/menu:translate-y-0">
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white text-slate-950 shadow-[0_32px_90px_rgba(15,23,42,0.25)]">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-[#f7f8fb] px-6 py-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">All destination URLs</p>
              <h3 className="text-lg font-black tracking-tight">Choose a package directly</h3>
            </div>
            <Link
              to="/destinations"
              className="rounded-full border border-primary/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-white"
            >
              View all
            </Link>
          </div>

          <div className="grid max-h-[70vh] grid-cols-1 gap-0 overflow-y-auto lg:grid-cols-2">
            {destinationMenuGroups.map((group) => {
              const Icon = group.icon;

              return (
                <div key={group.title} className="border-b border-slate-100 p-5 lg:border-b-0 lg:border-r last:lg:border-r-0">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.16em]">{group.title}</h4>
                        <p className="text-xs text-slate-500">{group.items.length} curated routes</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {group.items.map((destination) => (
                      <Link
                        key={destination.id}
                        to={destinationPath(destination)}
                        className="rounded-xl px-3 py-2 transition-colors hover:bg-primary/10 focus:bg-primary/10 focus:outline-none"
                      >
                        <span className="block truncate text-sm font-bold">{destination.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-slate-500">
                          {[destination.state || destination.country, destination.category].filter(Boolean).join(" | ")}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={cn(
            "mx-auto mt-3 h-1 w-24 rounded-full",
            useSolidHeader ? "bg-primary/40" : "bg-white/60"
          )}
        />
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHeroRoute = location.pathname === "/" || location.pathname.startsWith("/destinations");
  const useTransparentHeader = isHeroRoute && !isScrolled;
  const useSolidHeader = !useTransparentHeader;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-700 sm:px-6",
        useSolidHeader
          ? "border-b bg-background/95 py-2 shadow-2xl backdrop-blur-xl text-foreground" 
          : "bg-transparent py-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 lg:gap-8">
        <Link
          to="/"
          className={cn(
            "group flex flex-none items-center gap-3 rounded-[1.75rem] border px-3 py-3 transition-all duration-700 sm:px-4",
            useSolidHeader
              ? "border-[#D9B56D]/30 bg-white/92 shadow-lg shadow-slate-900/8 backdrop-blur-xl"
              : "border-white/15 bg-[linear-gradient(135deg,rgba(7,17,31,0.92),rgba(11,33,71,0.78),rgba(217,181,109,0.18))] shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl"
          )}
        >
          <Logo 
            className={cn(
              "shrink-0 transition-all duration-700 group-hover:scale-[1.05]",
              useSolidHeader ? "h-[3.25rem] w-[3.25rem] sm:h-[3.65rem] sm:w-[3.65rem]" : "h-[3.85rem] w-[3.85rem] sm:h-[4.25rem] sm:w-[4.25rem]"
            )} 
          />
          <div className="flex min-w-0 flex-col justify-center">
            <span className={cn(
              "whitespace-nowrap text-[0.96rem] font-black uppercase leading-none tracking-[0.14em] transition-all duration-700 sm:text-[1.08rem] md:text-[1.2rem]",
              useSolidHeader
                ? "bg-[linear-gradient(90deg,#07111F,#0B2147,#B98635)] bg-clip-text text-transparent"
                : "bg-[linear-gradient(90deg,#FFFFFF,#F5E4B8,#D9B56D)] bg-clip-text text-transparent"
            )}>
              Travel Gateway
            </span>
            <span
              className={cn(
                "mt-2 h-1 rounded-full transition-all duration-700",
                useSolidHeader
                  ? "w-18 sm:w-24 bg-[linear-gradient(90deg,#0B2147,#D9B56D,#8FB6AA)]"
                  : "w-20 sm:w-28 bg-[linear-gradient(90deg,#FFFFFF,#D9B56D,#8FB6AA)] shadow-[0_0_24px_rgba(217,181,109,0.22)]"
              )}
            />
            <span className={cn(
              "mt-2 text-[0.54rem] font-bold uppercase leading-none tracking-[0.24em] transition-all duration-700 sm:text-[0.64rem] md:text-[0.72rem]",
              useSolidHeader ? "text-[#0B2147]/72" : "text-[#F8E9B8]/92"
            )}>
              Curated Journeys
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) =>
            link.name === "Destinations" ? (
              <div key={link.name}>
                <DestinationMegaMenu useSolidHeader={useSolidHeader} />
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher renderTranslateTarget />
        </div>

        {/* Mobile Nav */}
        <div className="shrink-0 lg:hidden">
          <Sheet>
            <SheetTrigger
              render={(props) => (
                <Button
                  {...props}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-11 w-11 rounded-full border transition-all",
                    useSolidHeader
                      ? "border-slate-200 bg-white/90 text-[#0B2147] shadow-sm"
                      : "border-white/20 bg-black/20 text-white backdrop-blur-md"
                  )}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              )}
            />
            <SheetContent
              side="right"
              className="w-[min(88vw,390px)] !bg-white text-[#07111f] border-l border-slate-200 shadow-[0_32px_90px_rgba(0,0,0,0.45)]"
            >
              <div className="flex h-full flex-col px-2 py-8">
                <div className="mb-10 flex items-center gap-4 rounded-[1.8rem] border border-[#D9B56D]/25 bg-[linear-gradient(135deg,#07111F,#0B2147,#18345F)] px-4 py-4 shadow-lg shadow-slate-950/15">
                  <Logo className="h-24 w-24 shrink-0" />
                  <div className="flex flex-col">
                    <span className="bg-[linear-gradient(90deg,#FFFFFF,#F5E4B8,#D9B56D)] bg-clip-text text-[1.15rem] font-black uppercase tracking-[0.14em] text-transparent">
                      Travel Gateway
                    </span>
                    <span className="mt-2 h-1 w-24 rounded-full bg-[linear-gradient(90deg,#FFFFFF,#D9B56D,#8FB6AA)]" />
                    <span className="mt-2 text-[0.68rem] tracking-[0.26em] uppercase font-bold text-[#F8E9B8]/80">
                      Curated Journeys
                    </span>
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <SheetClose key={link.name}>
                      <Link
                        to={link.href}
                        className={cn(
                          "group flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-black uppercase tracking-tight transition-all",
                          location.pathname === link.href
                            ? "bg-[#0B2147] text-white shadow-lg shadow-slate-900/15"
                            : "text-[#07111f] hover:bg-slate-100 hover:text-primary"
                        )}
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="mt-8 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
                  <LanguageSwitcher mobile />
                </div>

                <div className="mt-auto rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-bold text-[#0B2147]">Plan with confidence</p>
                  <p className="mt-1 leading-relaxed">Curated journeys, verified partners, and support before you travel.</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
