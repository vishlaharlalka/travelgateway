import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, MapPin, Globe, Briefcase, User, BookOpen, HelpCircle, ShieldCheck, FileSignature, CreditCard } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        <div className="space-y-8">
          <Link to="/" className="flex items-center gap-4 group">
            <Logo className="w-16 h-16 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="bg-[linear-gradient(90deg,#07111F,#0B2147,#B98635)] bg-clip-text text-xl font-black uppercase tracking-[0.2em] text-transparent">
                Travel Gateway
              </span>
              <span className="text-[0.6rem] tracking-[0.32em] uppercase font-bold text-[#B98635] opacity-90">
                Curated Journeys
              </span>
            </div>
          </Link>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Personalized travel planning by Vishal Harlalka and his expert team. We craft journeys that reflect your unique travel style.
          </p>
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground/80">Follow Our Journey</h4>
            <div className="grid grid-cols-2 gap-4">
              <a href="https://www.facebook.com/vishal.harlalka1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-[#1877F2] transition-colors group">
                <div className="p-2 bg-background rounded-lg shadow-sm group-hover:shadow-md transition-all">
                  <Facebook className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Facebook</span>
              </a>
              <a href="https://www.instagram.com/travelgateway_india/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-[#E4405F] transition-colors group">
                <div className="p-2 bg-background rounded-lg shadow-sm group-hover:shadow-md transition-all">
                  <Instagram className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li>
              <Link to="/destinations" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <Globe className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100" />
                <span>Destinations</span>
              </Link>
            </li>
            <li>
              <Link to="/services" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <Briefcase className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100" />
                <span>Our Services</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <User className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100" />
                <span>About Vishal</span>
              </Link>
            </li>
            <li>
              <Link to="/blog" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <BookOpen className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100" />
                <span>Travel Blog</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Support</h4>
          <ul className="space-y-4">
            <li>
              <Link to="/faq" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <HelpCircle className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100" />
                <span>FAQ</span>
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <ShieldCheck className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100" />
                <span>Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <FileSignature className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100" />
                <span>Terms of Service</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <Mail className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100" />
                <span>Contact Us</span>
              </Link>
            </li>
            <li>
              <Link to="/payment" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <CreditCard className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100" />
                <span>Payment Gateway</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Contact Info</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span>G 901, SAMANVAY SCINTILLA, B/H APOLLO INTERNATIONAL SCHOOL, VIP ROAD, SOUTH BOPAL, AHMEDABAD-380058</span>
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <span>+91 9898111689</span>
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <span>enquiries@travelgateway.in</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-6">
          <p>© 2026 Travel Gateway. All rights reserved.</p>
          <div className="flex items-center gap-3 border-l pl-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Affiliated with</span>
            <img 
              src="https://www.adtoi.in/images/logo/ADTOILogo%20Without%20slogan.jpg" 
              alt="ADTOI Logo" 
              className="h-8 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <p>Managed by Vishal Harlalka & Team.</p>
      </div>
    </footer>
  );
}

