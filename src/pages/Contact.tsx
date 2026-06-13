import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/SEO";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { googleBusinessUrl, graphSchema, pageSchema } from "@/lib/seo";

const inquiryEmail = "inquiry@travelgateway.in";
const inquiryDeliveryEmail = "info@travelgateway.in";
const inquiryWhatsAppNumber = "919898111689";
const inquiryEndpoint = "/api/inquiry";
const formSubmitEndpoint = `https://formsubmit.co/ajax/${inquiryDeliveryEmail}`;

type InquiryRequest = {
  name: string;
  email: string;
  phone: string;
  destination: string;
  travel_date: string;
  travel_month: string;
  urgency: string;
  adults: string;
  children: string;
  infants: string;
  wheelchair_support: string;
  special_assistance: string;
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
  travelDate: string;
  urgency: string;
  adults: string;
  children: string;
  infants: string;
  wheelchairSupport: boolean;
  specialAssistance: string;
  budget: string;
  preferredContact: string;
  message: string;
}) {
  const passengerSummary = `${formData.adults || "0"} adult(s), ${formData.children || "0"} child(ren), ${formData.infants || "0"} infant(s)`;
  const isUrgent = formData.urgency === "Same-day travel" || formData.urgency === "Within 72 hours";

  return [
    isUrgent ? `URGENT TRAVEL REQUEST - ${formData.urgency.toUpperCase()}` : "New Travel Gateway Inquiry",
    `Name: ${formData.name}`,
    `Email: ${formData.email}`,
    `Phone: ${formData.phone}`,
    `Destination: ${formData.destination || "Not specified"}`,
    `Exact Travel Date: ${formData.travelDate || "Not specified"}`,
    `Urgency: ${formData.urgency}`,
    `Passengers: ${passengerSummary}`,
    `Wheelchair Support: ${formData.wheelchairSupport ? "Required" : "Not required"}`,
    `Special Assistance: ${formData.specialAssistance || "None shared"}`,
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
  travelDate: string;
  urgency: string;
  adults: string;
  children: string;
  infants: string;
  wheelchairSupport: boolean;
  specialAssistance: string;
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
    _subject: `${payload.urgency === "Same-day travel" || payload.urgency === "Within 72 hours" ? `[URGENT: ${payload.urgency.toUpperCase()}] ` : ""}Travel Gateway Inquiry: ${payload.destination || "Custom trip request"} - ${payload.travel_date}`,
    _template: "table",
    _captcha: "false",
    _replyto: payload.email,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    destination: payload.destination,
    travel_date: payload.travel_date,
    travel_month: payload.travel_month,
    urgency: payload.urgency,
    adults: payload.adults,
    children: payload.children,
    infants: payload.infants,
    wheelchair_support: payload.wheelchair_support,
    special_assistance: payload.special_assistance,
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
    travelDate: "",
    urgency: "Planning ahead",
    adults: "1",
    children: "0",
    infants: "0",
    wheelchairSupport: false,
    specialAssistance: "",
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
        travel_date: formData.travelDate,
        travel_month: new Date(`${formData.travelDate}T00:00:00`).toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        }),
        urgency: formData.urgency,
        adults: formData.adults,
        children: formData.children,
        infants: formData.infants,
        wheelchair_support: formData.wheelchairSupport ? "Required" : "Not required",
        special_assistance: formData.specialAssistance || "None shared",
        budget_per_person: formData.budget || "Not specified",
        preferred_contact: formData.preferredContact,
        message: formData.message || "No additional notes shared.",
        source_page: leadPayload.sourcePage,
        submitted_at: leadPayload.visitedAt,
      });

      setSubmitState("success");
      setSubmitMessage("Thank you for your inquiry. Your email has been sent successfully. You can press Send Again if you need to resend the same details.");
    } catch (error) {
      console.error("Inquiry delivery failed. Opening direct contact fallback.", error);
      if (typeof window !== "undefined" && formData.preferredContact === "WhatsApp") {
        const whatsappUrl = buildWhatsAppUrl(formData);
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      } else if (typeof window !== "undefined") {
        const subject = `${formData.urgency === "Same-day travel" || formData.urgency === "Within 72 hours" ? `[URGENT: ${formData.urgency.toUpperCase()}] ` : ""}Travel Gateway Inquiry - ${formData.name || "Website Lead"}`;
        const body = buildInquiryLines(formData).join("\n");
        window.open(`mailto:${inquiryDeliveryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
      }

      setSubmitState(formData.preferredContact === "WhatsApp" ? "success" : "error");
      setSubmitMessage(
        formData.preferredContact === "WhatsApp"
          ? "Automatic email delivery needs attention. WhatsApp has been opened with your inquiry details so you can send them directly to Travel Gateway."
          : "Automatic email delivery needs attention. A pre-filled email has been opened as a backup."
      );
    }
  };
  const todayInputDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  const isUrgentRequest = formData.urgency === "Same-day travel" || formData.urgency === "Within 72 hours";

  return (
    <div className="pt-24 pb-16 px-6 bg-background">
      <SEO
        title="Contact Travel Gateway | Travel Agent in South Bopal Ahmedabad for India and International Bookings"
        description="Contact Travel Gateway in South Bopal, Ahmedabad for international holidays, India luxury journeys, visa guidance, family tours, honeymoon planning, and personalized booking support."
        canonicalPath="/contact"
        keywords="contact travel agent Ahmedabad, South Bopal travel agency, India holiday booking, international tour planner Gujarat, luxury travel consultant Ahmedabad"
        structuredData={graphSchema([
          pageSchema(
            "/contact",
            "Contact Travel Gateway | Travel Agent in South Bopal Ahmedabad for India and International Bookings",
            "Contact Travel Gateway in South Bopal, Ahmedabad for international holidays, India luxury journeys, visa guidance, family tours, honeymoon planning, and personalized booking support."
          ),
        ])}
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-none shadow-md rounded-3xl overflow-hidden">
              <CardContent className="p-6 space-y-6">
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

                <a
                  href={googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full border border-primary/20 px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
                >
                  View Travel Gateway on Google Maps
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-primary text-primary-foreground">
              <CardContent className="p-6">
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
              <CardContent className="p-6 md:p-10">
                <h3 className="text-3xl font-bold mb-5 tracking-tight">Plan Your Trip with Experts</h3>
                <p className="text-muted-foreground mb-7">
                  Share the operational details below so our team can quickly check availability, assistance, and next steps. Same-day and near-term requests are clearly flagged for priority review.
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

                  <div className="rounded-3xl border border-primary/15 bg-primary/5 p-5 md:p-6">
                    <div className="mb-5">
                      <h4 className="font-bold">Travel timing and urgency</h4>
                      <p className="mt-1 text-sm text-muted-foreground">Use the exact departure date. Urgent requests will be clearly marked in the message our team receives.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Exact Travel Date</label>
                        <Input
                          type="date"
                          min={todayInputDate}
                          className="rounded-2xl h-14 border-muted bg-background"
                          value={formData.travelDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, travelDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">How urgent is this request?</label>
                        <select
                          className="h-14 w-full rounded-2xl border border-muted bg-background px-4 text-sm"
                          value={formData.urgency}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            urgency: e.target.value,
                            travelDate: e.target.value === "Same-day travel" ? todayInputDate : prev.travelDate,
                          }))}
                        >
                          <option>Planning ahead</option>
                          <option>Within 7 days</option>
                          <option>Within 72 hours</option>
                          <option>Same-day travel</option>
                        </select>
                      </div>
                    </div>
                    {isUrgentRequest && (
                      <p className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                        This will be marked as an urgent travel request. For immediate help, call or WhatsApp +91 9898111689 after submitting.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="rounded-3xl border border-muted p-5 md:p-6">
                    <div className="mb-5">
                      <h4 className="font-bold">Passengers and assistance</h4>
                      <p className="mt-1 text-sm text-muted-foreground">Passenger ages and mobility needs help us check the right fares, rooms, transfers, and support.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        ["Adults", "adults"],
                        ["Children (2-11)", "children"],
                        ["Infants (under 2)", "infants"],
                      ].map(([label, field]) => (
                        <div className="space-y-2" key={field}>
                          <label className="text-sm font-semibold ml-1">{label}</label>
                          <Input
                            type="number"
                            min={field === "adults" ? "1" : "0"}
                            max="30"
                            className="rounded-2xl h-14 border-muted"
                            value={formData[field as "adults" | "children" | "infants"]}
                            onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                            required
                          />
                        </div>
                      ))}
                    </div>
                    <label className="mt-5 flex items-start gap-3 rounded-2xl bg-muted/60 p-4 text-sm">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={formData.wheelchairSupport}
                        onChange={(e) => setFormData(prev => ({ ...prev, wheelchairSupport: e.target.checked }))}
                      />
                      <span>
                        <strong className="block text-foreground">Wheelchair support required</strong>
                        <span className="text-muted-foreground">We will account for airport, transfer, hotel, and sightseeing accessibility.</span>
                      </span>
                    </label>
                    <div className="mt-5 space-y-2">
                      <label className="text-sm font-semibold ml-1">Other Special Assistance</label>
                      <Input
                        placeholder="e.g. senior traveler support, reduced mobility, dietary or medical context"
                        className="rounded-2xl h-14 border-muted"
                        value={formData.specialAssistance}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialAssistance: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">Tell Vishal about your dream trip</label>
                    <textarea 
                      className="w-full min-h-[120px] rounded-2xl border border-muted bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow"
                      placeholder="Share route preferences, booking status, hotel needs, or any other useful context..."
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
                      type="submit"
                      size="lg"
                      disabled={submitState === "submitting"}
                      className="w-full md:w-auto rounded-full px-12 py-7 text-lg font-bold group"
                    >
                      {submitState === "submitting"
                        ? "Sending Inquiry..."
                        : submitState === "success"
                          ? "Send Again"
                          : "Send Inquiry"}
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

