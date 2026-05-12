import { motion } from "framer-motion";
import { FileText, Scale, AlertCircle, CheckCircle } from "lucide-react";
import { useEffect } from "react";

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms & Conditions | TravelGateway South Bopal";
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Terms & Conditions</h1>
            <p className="text-muted-foreground text-lg">
              The fine print, made simple. Please read our terms before booking your journey with TravelGateway.
            </p>
          </motion.div>
        </div>

        <div className="prose prose-lg max-w-none text-muted-foreground space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Scale className="text-primary w-6 h-6" /> 1. Booking & Payments
            </h2>
            <p>
              By booking a tour with TravelGateway (managed by Vishal Harlalka), you agree to the following:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A booking is confirmed only upon receipt of the initial deposit.</li>
              <li>Itineraries, package prices, and costings shown on the website, brochures, PDFs, or shared proposals are indicative quotes only and do not mean that any booking, seat, room, cabin, cruise, train journey, visa slot, guide, vehicle, or service has been held.</li>
              <li>No itinerary or service will be considered booked unless and until written confirmation is received from TravelGateway / the Company by email or another official written communication.</li>
              <li>Full payment must be made at least 30 days prior to the departure date (unless specified otherwise).</li>
              <li>We accept bank transfers, UPI, and major credit/debit cards at our South Bopal office.</li>
              <li>Government taxes, GST, TCS, tourism levies, visa fees, park fees, resort taxes, city taxes, and any other statutory charges are extra on the total booking amount unless specifically included in writing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <AlertCircle className="text-primary w-6 h-6" /> 2. Cancellation & Refunds
            </h2>
            <p>
              We understand that plans change. Our cancellation policy is as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cancellations made 60+ days before departure: Full refund minus administrative fees.</li>
              <li>30-60 days before departure: 50% of the total tour cost is non-refundable.</li>
              <li>Less than 30 days: 100% non-refundable.</li>
              <li>Note: Airline and hotel-specific cancellation policies may also apply and will be communicated at the time of booking.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <CheckCircle className="text-primary w-6 h-6" /> 3. Responsibility & Liability
            </h2>
            <p>
              TravelGateway acts as an intermediary between you and the service providers (airlines, hotels, local transport). While we only work with vetted partners, we are not liable for delays, accidents, or service failures caused by third parties or "Acts of God" (natural disasters, strikes, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <FileText className="text-primary w-6 h-6" /> 4. Documentation
            </h2>
            <p>
              It is the traveler's responsibility to ensure they have a valid passport (minimum 6 months validity) and the necessary visas. TravelGateway provides assistance, but the final decision on visa issuance rests with the respective consulates.
            </p>
          </section>

          <section className="bg-muted/30 p-8 rounded-3xl border border-muted">
            <h2 className="text-xl font-bold text-foreground mb-4">Governing Law</h2>
            <p className="text-sm">
              These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in <strong>Ahmedabad, Gujarat</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
