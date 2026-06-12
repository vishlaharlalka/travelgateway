import { CheckCircle2, FileCheck2, MapPin, Plane, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type VietnamEVisaGuideProps = {
  compact?: boolean;
};

const visaChecklist = [
  "Indian passport valid for the trip, usually with 6+ months validity kept as a safe buffer",
  "Clear passport bio-page scan and recent digital photo",
  "Planned entry and exit dates, Vietnam entry and exit ports, and hotel or stay address",
  "Traveler contact details, occupation, visit purpose, and payment card for the e-visa fee",
];

export default function VietnamEVisaGuide({ compact = false }: VietnamEVisaGuideProps) {
  return (
    <section className={`rounded-[2rem] border border-primary/15 bg-primary/5 ${compact ? "p-6 md:p-8" : "p-8 md:p-10"}`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Vietnam e-visa guidance
          </Badge>
          <h2 className={`${compact ? "text-2xl" : "text-3xl"} font-black uppercase tracking-tight text-[#0B2147]`}>
            Visa Notes for Indian Travelers
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Indian passport holders normally need a Vietnam visa before entering mainland Vietnam. The official e-visa is usually the simplest route for tourism, and Vietnam Immigration currently directs applications through <span className="font-semibold text-foreground">evisa.gov.vn</span> or <span className="font-semibold text-foreground">thithucdientu.gov.vn</span>, so match your passport details, travel dates, and entry ports carefully before flights are locked.
          </p>
        </div>
        <a href="/contact?destination=Vietnam%20visa-ready%20documents" className="shrink-0">
          <Button className="w-full rounded-full px-6 py-6 font-bold lg:w-auto">
            Ask for Visa-Ready Documents
          </Button>
        </a>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-background/80 p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Plane className="h-5 w-5" />
            <h3 className="font-bold">When it is needed</h3>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Plan for an e-visa if your itinerary includes Hanoi, Da Nang, Hoi An, Ho Chi Minh City, Ha Long Bay, Mekong Delta, or any mainland Vietnam stop.
          </p>
        </div>

        <div className="rounded-2xl bg-background/80 p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <MapPin className="h-5 w-5" />
            <h3 className="font-bold">Phu Quoc exception</h3>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Phu Quoc can be visa-free for up to 30 days when it is your only Vietnam destination and you enter, stay, and exit under that island-only route. If you transit immigration through Hanoi or Ho Chi Minh City or visit mainland Vietnam, carry the proper Vietnam visa.
          </p>
        </div>

        <div className="rounded-2xl bg-background/80 p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="font-bold">How we help</h3>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Travel Gateway can align hotel vouchers, flight routing, passport-name checks, stay addresses, and day-by-day plans so your documents are ready before you apply.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-primary/25 bg-background/70 p-5">
        <div className="mb-3 flex items-center gap-2 text-primary">
          <FileCheck2 className="h-5 w-5" />
          <h3 className="font-bold">Details typically required</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {visaChecklist.map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Recheck the official portal, entry port list, and visa validity before issuing non-refundable flights because immigration domains and practical requirements can change.
        </p>
      </div>
    </section>
  );
}
