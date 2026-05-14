import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import { defaultSeoImage, graphSchema, pageSchema } from "@/lib/seo";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | TravelGateway Ahmedabad";
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 bg-background">
      <SEO
        title="Privacy Policy | Travel Gateway Ahmedabad"
        description="Read the Travel Gateway privacy policy for how customer inquiry, contact, and travel planning information is handled."
        canonicalPath="/privacy-policy"
        image={defaultSeoImage}
        imageAlt="Travel Gateway privacy policy"
        structuredData={graphSchema([
          pageSchema("/privacy-policy", "Privacy Policy | Travel Gateway Ahmedabad", "Read the Travel Gateway privacy policy for how customer inquiry, contact, and travel planning information is handled."),
        ])}
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground text-lg">
              Your trust is our most valuable asset. Learn how TravelGateway protects your personal information.
            </p>
          </motion.div>
        </div>

        <div className="prose prose-lg max-w-none text-muted-foreground space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Eye className="text-primary w-6 h-6" /> 1. Information We Collect
            </h2>
            <p>
              At TravelGateway, led by Vishal Harlalka in South Bopal, Ahmedabad, we collect information necessary to provide you with personalized travel services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal identifiers (Name, Email, Phone Number, Address).</li>
              <li>Travel documents (Passport details for international bookings and visa processing).</li>
              <li>Payment information (Processed securely through our banking partners).</li>
              <li>Travel preferences and special requirements (Dietary needs, medical conditions for insurance).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Lock className="text-primary w-6 h-6" /> 2. How We Use Your Information
            </h2>
            <p>
              We use your data strictly for travel-related purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Booking flights, hotels, and local tours.</li>
              <li>Processing Visas with respective embassies.</li>
              <li>Providing 24/7 support during your journey.</li>
              <li>Sending you updates about your trip or exclusive travel offers from TravelGateway.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <ShieldCheck className="text-primary w-6 h-6" /> 3. Data Security
            </h2>
            <p>
              We implement robust security measures to protect your data. As a boutique travel agent in Ahmedabad, we handle your sensitive documents (like Passports) with extreme care, ensuring they are only shared with authorized service providers (airlines, embassies, hotels) required for your booking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <FileText className="text-primary w-6 h-6" /> 4. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal information at any time. Simply contact Vishal Harlalka or our team at our South Bopal office to exercise these rights.
            </p>
          </section>

          <section className="bg-muted/30 p-8 rounded-3xl border border-muted">
            <h2 className="text-xl font-bold text-foreground mb-4">Contact Us Regarding Privacy</h2>
            <p className="text-sm">
              If you have any questions about this Privacy Policy, please contact us at:<br />
              <strong>TravelGateway</strong><br />
              G 901, SAMANVAY SCINTILLA, VIP ROAD, SOUTH BOPAL, AHMEDABAD-380058<br />
              Email: inquiry@travelgateway.in<br />
              Phone: +91 9898111689
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
