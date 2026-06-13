import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ChevronDown, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Tour Packages", href: "/destinations" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
  { name: "Payment", href: "/payment" },
];

const tourPackageMenuLinks = [
  { name: "India Tour Packages", href: "/destinations" },
  { name: "Gujarat Tours", href: "/destinations?scope=INDIA&state=Gujarat" },
  { name: "Rajasthan Tours", href: "/destinations?scope=INDIA&state=Rajasthan" },
  { name: "Kerala Tours", href: "/destinations?scope=INDIA&state=Kerala" },
  { name: "Himachal Tours", href: "/destinations?scope=INDIA&state=Himachal%20Pradesh" },
  { name: "Uttar Pradesh Tours", href: "/destinations?scope=INDIA&state=Uttar%20Pradesh" },
  { name: "Spiritual Tours", href: "/destinations?scope=INDIA&experience=Pilgrimage" },
  { name: "Luxury Train Tours", href: "/destinations?experience=Luxury%20Train" },
  { name: "International Tour Packages", href: "/destinations?scope=International" },
  { name: "Wildlife & Safari Tours", href: "/destinations?scope=International&search=safari" },
];

function TourPackagesMegaMenu({ useSolidHeader }: { useSolidHeader: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((current) => !current)}
        className="relative flex items-center gap-1.5 whitespace-nowrap text-sm font-bold uppercase tracking-widest transition-colors hover:text-primary focus:text-primary focus:outline-none"
      >
        Tour Packages
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
        <span className={cn("absolute -bottom-2 left-0 h-1 bg-primary transition-all duration-300", isOpen ? "w-full" : "w-0")} />
      </button>

      <div
        className={cn(
          "absolute left-0 top-full z-50 w-80 pt-5 transition-all duration-200",
          isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <div className="border border-slate-100 bg-white py-4 text-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col" role="menu" aria-label="Tour packages">
            {tourPackageMenuLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="whitespace-nowrap px-7 py-3 text-[1rem] font-black text-[#17143d] transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none"
              >
                {link.name}
              </Link>
            ))}
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
        <nav className="hidden lg:flex items-center gap-7 xl:gap-10">
          {navLinks.map((link) =>
            link.name === "Tour Packages" ? (
              <div key={link.name}>
                <TourPackagesMegaMenu useSolidHeader={useSolidHeader} />
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className="whitespace-nowrap text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors relative group"
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
                  aria-label="Open navigation menu"
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
                  {navLinks.map((link) =>
                    link.name === "Tour Packages" ? (
                      <div key={link.name}>
                        <SheetClose>
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

                        <div className="ml-4 mt-1 flex flex-col border-l border-slate-200 pl-3">
                          {tourPackageMenuLinks.map((menuLink) => (
                            <SheetClose key={menuLink.name}>
                              <Link
                                to={menuLink.href}
                                className="block rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary"
                              >
                                {menuLink.name}
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </div>
                    ) : (
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
                    )
                  )}
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
