import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/SEO";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const inquiryEmail = "info@travelgateway.in";
const inquiryWhatsAppNumber = "919898111689";
const inquiryEndpoint = "/api/inquiry";
const formSubmitEndpoint = `https://formsubmit.co/ajax/${inquiryEmail}`;

type InquiryRequest = {
  name: string;
  email: string;
  phone: string;
  destination: string;
  travel_month: string;
  budget_per_person: string;
  preferred_contact: string;
  message: string;
  source_page: string;
  submitted_at: string;
};

function isSuccessfulSubmission(result: unknown) {
  if (!result || typeof result !== "object") return false;

  const responseBody = result as { ok?: unknown; success?: unknown };
  return responseBody.ok === true || responseBody.success === true || responseBody.success === "true";
}

function buildInquiryLines(formData: {
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelMonth: string;
  budget: string;
  preferredContact: string;
  message: string;
}) {
  return [
    "New Travel Gateway Inquiry",
    `Name: ${formData.name}`,
    `Email: ${formData.email}`,
    `Phone: ${formData.phone}`,
    `Destination: ${formData.destination || "Not specified"}`,
    `Travel Month: ${formData.travelMonth || "Not specified"}`,
    `Budget: ${formData.budget || "Not specified"}`,
    `Preferred Contact: ${formData.preferredContact}`,
    `Message: ${formData.message || "No additional notes shared."}`,
  ];
}

function buildWhatsAppUrl(formData: {
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelMonth: string;
  budget: string;
  preferredContact: string;
  message: string;
}) {
  const inquiryLines = buildInquiryLines(formData);
  const whatsappMessage = [`*${inquiryLines[0]}*`, ...inquiryLines.slice(1)].join("\n");
  return `https://wa.me/${inquiryWhatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;
}

async function postJson(endpoint: string, payload: Record<string, unknown>) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : null;

  if (!response.ok || !isSuccessfulSubmission(result)) {
    throw new Error(
      typeof result?.error === "string"
        ? result.error
        : `Inquiry request failed with ${response.status}`
    );
  }

  return result;
}

async function sendInquiry(payload: InquiryRequest) {
  try {
    await postJson(inquiryEndpoint, payload);
    return;
  } catch (apiError) {
    console.warn("Primary inquiry endpoint failed; trying hosted form fallback.", apiError);
  }

  await postJson(formSubmitEndpoint, {
    _subject: `New Travel Gateway Inquiry: ${payload.destination || "Custom trip request"}`,
    _template: "table",
    _captcha: "false",
    _replyto: payload.email,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    destination: payload.destination,
    travel_month: payload.travel_month,
    budget_per_person: payload.budget_per_person,
    preferred_contact: payload.preferred_contact,
    message: payload.message,
    source_page: payload.source_page,
    submitted_at: payload.submitted_at,
  });
}

export default function Contact() {
  const [searchParams] = useSearchParams();
  const prefilledDestination = searchParams.get("destination") || "";
  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    destination: prefilledDestination,
    travelMonth: "",
    budget: "",
    preferredContact: "WhatsApp",
    message: "",
    consent: false,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    if (prefilledDestination) {
      setFormData(prev => ({ ...prev, destination: prefilledDestination }));
    }
  }, [prefilledDestination]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage(null);
    if (!formData.consent) {
      setSubmitMessage("Please confirm consent before we use your details for trip planning and follow-up.");
      setSubmitState("error");
      return;
    }

    const leadPayload = {
      ...formData,
      visitedAt: new Date().toISOString(),
      sourcePage: typeof window !== "undefined" ? window.location.href : "/contact",
    };

    try {
      localStorage.setItem("travelgateway-latest-lead", JSON.stringify(leadPayload));
    } catch (storageError) {
      console.warn("Could not store the latest inquiry locally.", storageError);
    }
    setSubmitState("submitting");

    try {
      await sendInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        destination: formData.destination || "Not specified",
        travel_month: formData.travelMonth || "Not specified",
        budget_per_person: formData.budget || "Not specified",
        preferred_contact: formData.preferredContact,
        message: formData.message || "No additional notes shared.",
        source_page: leadPayload.sourcePage,
        submitted_at: leadPayload.visitedAt,
      });
      const whatsappUrl = buildWhatsAppUrl(formData);

      if (typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }

      setSubmitState("success");
      setSubmitMessage("Thank you for your inquiry. Your email has been sent successfully and our team will contact you shortly.");
      setFormData({ ...initialFormData, destination: prefilledDestination });
    } catch (error) {
      if (typeof window !== "undefined" && formData.preferredContact === "WhatsApp") {
        const whatsappUrl = buildWhatsAppUrl(formData);
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      } else if (typeof window !== "undefined") {
        const subject = `Travel Gateway Inquiry - ${formData.name || "Website Lead"}`;
        const body = buildInquiryLines(formData).join("\n");
        window.open(`mailto:${inquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
      }

      setSubmitState(formData.preferredContact === "WhatsApp" ? "success" : "error");
      setSubmitMessage(
        formData.preferredContact === "WhatsApp"
          ? "WhatsApp has been opened with your inquiry details so you can send them directly to Travel Gateway."
          : "We could not send your inquiry automatically right now. A pre-filled email has been opened as a backup."
      );
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-background">
      <SEO
        title="Contact Travel Gateway | Travel Agent in South Bopal Ahmedabad for India and International Bookings"
        description="Contact Travel Gateway in South Bopal, Ahmedabad for international holidays, India luxury journeys, visa guidance, family tours, honeymoon planning, and personalized booking support."
        canonicalPath="/contact"
        keywords="contact travel agent Ahmedabad, South Bopal travel agency, India holiday booking, international tour planner Gujarat, luxury travel consultant Ahmedabad"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: "Travel Gateway",
          url: "https://travelgateway.in/contact",
          telephone: "+91 9898111689",
          email: inquiryEmail,
          address: {
            "@type": "PostalAddress",
            streetAddress: "G 901, Samanvay Scintilla, VIP Road, South Bopal",
            addressLocality: "Ahmedabad",
            addressRegion: "Gujarat",
            postalCode: "380058",
            addressCountry: "IN",
          },
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="mx-auto mb-6 max-w-72 text-4xl font-bold tracking-tight sm:max-w-none sm:text-5xl md:text-6xl">
              Connect with <span className="text-primary italic">Vishal</span>
            </h1>
            <p className="mx-auto max-w-72 text-base leading-relaxed text-muted-foreground sm:max-w-2xl sm:text-lg">
              Looking for a reliable travel agent in South Bopal, Ahmedabad? Reach out to Vishal Harlalka and the Travel Gateway team for international holidays, India bookings, and tailor-made travel planning.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="border-none shadow-md rounded-3xl overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Email Us</h4>
                    <p className="text-muted-foreground">{inquiryEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Call / WhatsApp</h4>
                    <p className="text-muted-foreground">+91 9898111689</p>
                    <p className="text-muted-foreground">Mon-Sat: 10am - 7pm IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Our Office</h4>
                    <p className="text-muted-foreground">G 901, SAMANVAY SCINTILLA</p>
                    <p className="text-muted-foreground">VIP ROAD, SOUTH BOPAL</p>
                    <p className="text-muted-foreground">AHMEDABAD, GUJARAT-380058</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6" />
                  <h4 className="font-bold text-xl">WhatsApp Chat</h4>
                </div>
                <p className="mb-8 opacity-80 leading-relaxed">
                  Get instant responses and personalized trip ideas by chatting with us on WhatsApp. We are your local travel experts in South Bopal.
                </p>
                <a 
                  href={`https://wa.me/${inquiryWhatsAppNumber}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block w-full"
                >
                  <Button variant="secondary" className="w-full rounded-full font-bold py-6">Chat with Vishal</Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-10 md:p-16">
                <h3 className="text-3xl font-bold mb-8 tracking-tight">Plan Your Trip with Experts</h3>
                <p className="text-muted-foreground mb-10">
                  Fill out the form below, and our team will get back to you with a customized itinerary within 24 hours.
                </p>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Full Name</label>
                      <Input 
                        placeholder="John Doe" 
                        className="rounded-2xl h-14 border-muted"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Email Address</label>
                      <Input 
                        placeholder="john@example.com" 
                        type="email" 
                        className="rounded-2xl h-14 border-muted"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Phone / WhatsApp</label>
                      <Input 
                        placeholder="+91-00000-00000" 
                        className="rounded-2xl h-14 border-muted"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">Destination of Interest</label>
                    <Input 
                      placeholder="e.g. Vietnam, Kenya, or Iceland" 
                      className="rounded-2xl h-14 border-muted"
                      value={formData.destination}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Preferred Travel Month</label>
                      <Input
                        placeholder="e.g. October 2026"
                        className="rounded-2xl h-14 border-muted"
                        value={formData.travelMonth}
                        onChange={(e) => setFormData(prev => ({ ...prev, travelMonth: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Budget Per Person</label>
                      <Input
                        placeholder="e.g. ₹1,25,000"
                        className="rounded-2xl h-14 border-muted"
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Preferred Contact</label>
                      <select
                        className="h-14 w-full rounded-2xl border border-muted bg-background px-4 text-sm"
                        value={formData.preferredContact}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredContact: e.target.value }))}
                      >
                        <option>WhatsApp</option>
                        <option>Phone Call</option>
                        <option>Email</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">Tell Vishal about your dream trip</label>
                    <textarea 
                      className="w-full min-h-[150px] rounded-2xl border border-muted bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow"
                      placeholder="Share your preferences, dates, budget, or any special requests..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <label className="mb-5 flex items-start gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={formData.consent}
                        onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                      />
                      <span>
                        I agree that Travel Gateway may use my name, email, and phone number to contact me about this trip inquiry.
                      </span>
                    </label>

                    {submitMessage && (
                      <p className={`mb-4 rounded-2xl px-4 py-3 text-sm ${
                        submitState === "success"
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {submitMessage}
                      </p>
                    )}

                    <Button
                      size="lg"
                      disabled={submitState === "submitting"}
                      className="w-full md:w-auto rounded-full px-12 py-7 text-lg font-bold group"
                    >
                      {submitState === "submitting" ? "Sending Inquiry..." : "Send Inquiry"}
                      {submitState === "submitting" ? (
                        <Loader2 className="ml-2 w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

