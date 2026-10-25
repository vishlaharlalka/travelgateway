import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, CreditCard, Lock, CheckCircle2, AlertCircle, MessageCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { defaultSeoImage, graphSchema, pageSchema } from "@/lib/seo";

const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};
const razorpayPaymentButtonId = viteEnv.VITE_RAZORPAY_PAYMENT_BUTTON_ID?.trim();
const razorpayPaymentLink = viteEnv.VITE_RAZORPAY_PAYMENT_LINK?.trim();
const paymentWhatsAppUrl = `https://wa.me/919898111689?text=${encodeURIComponent(
  "Hello Travel Gateway, please share the secure Razorpay payment link for my confirmed booking."
)}`;

export default function Payment() {
  const paymentFormRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!razorpayPaymentButtonId) return;

    // Prevent multiple loads
    if (!paymentFormRef.current) return;
    if (paymentFormRef.current.childNodes.length > 0) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", razorpayPaymentButtonId);
    script.async = true;
    
    script.onload = () => {
      setError(null);
      console.log("Razorpay script loaded successfully");
    };

    script.onerror = () => {
      setError("The secure payment gateway did not load. Please retry, or request a direct Razorpay payment link from Travel Gateway.");
    };

    paymentFormRef.current.appendChild(script);

    return () => {
      // Leave the injected payment button in place during React StrictMode's dev-only effect replay.
    };
  }, [retryKey]);

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen bg-background relative overflow-hidden">
      <SEO
        title="Secure Travel Payment | Travel Gateway Ahmedabad"
        description="Use Travel Gateway's secure payment page for confirmed travel bookings, tour packages, and trip services."
        canonicalPath="/payment"
        image={defaultSeoImage}
        imageAlt="Travel Gateway secure payment"
        noindex
        structuredData={graphSchema([
          pageSchema("/payment", "Secure Travel Payment | Travel Gateway Ahmedabad", "Use Travel Gateway's secure payment page for confirmed travel bookings, tour packages, and trip services."),
        ])}
      />
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" 
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-6 bg-primary/10 text-primary border-none px-4 py-1.5 text-sm font-medium">
            🔒 Secure Payment Gateway
          </Badge>
          <h1 className="mx-auto mb-6 max-w-72 text-4xl font-black uppercase tracking-tight sm:max-w-none md:text-6xl md:tracking-tighter">
            Complete Your <span className="text-primary italic">Booking</span>
          </h1>
          <p className="mx-auto mb-8 max-w-72 text-base leading-relaxed text-muted-foreground sm:max-w-2xl sm:text-lg">
            Securely pay for your curated journey using our trusted Razorpay integration. 
            All transactions are encrypted and protected.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: <Lock className="w-6 h-6 text-primary" />, title: "Secure Processing", desc: "256-bit SSL encryption" },
              { icon: <CreditCard className="w-6 h-6 text-primary" />, title: "Multiple Options", desc: "Cards, UPI, NetBanking" },
              { icon: <ShieldCheck className="w-6 h-6 text-primary" />, title: "Trusted Partner", desc: "Verified by Razorpay" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="bg-muted/30 p-6 rounded-3xl border border-white/5 backdrop-blur-sm"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mx-auto max-w-lg rounded-[2rem] border border-primary/10 bg-white p-8 shadow-2xl dark:bg-zinc-900"
          >
            <h2 className="text-2xl font-bold mb-8">Payment Details</h2>
            <div className="space-y-6 mb-10 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                <p className="text-sm text-foreground/80">Authorized for personalized travel services.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                <p className="text-sm text-foreground/80">Instant booking confirmation upon successful payment.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                <p className="text-sm text-foreground/80">24/7 customer support for any payment queries.</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 min-h-[100px]">
              {razorpayPaymentLink ? (
                <Button render={<a href={razorpayPaymentLink} target="_blank" rel="noopener noreferrer" />} className="rounded-full px-8 py-6 text-base font-bold">
                  Open Secure Payment
                </Button>
              ) : error ? (
                <div className="flex w-full flex-col items-center gap-4 text-center">
                  <AlertCircle className="w-8 h-8" />
                  <p className="max-w-sm text-sm font-medium text-destructive">{error}</p>
                  <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
                    <Button
                      type="button"
                      className="rounded-full"
                      onClick={() => {
                        setError(null);
                        setRetryKey((key) => key + 1);
                      }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry Payment
                    </Button>
                    <Button render={<a href={paymentWhatsAppUrl} target="_blank" rel="noopener noreferrer" />} variant="outline" className="rounded-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Request Payment Link
                    </Button>
                  </div>
                </div>
              ) : razorpayPaymentButtonId ? (
                <form
                  key={retryKey}
                  ref={paymentFormRef}
                  className="payment-button-container flex justify-center w-full min-h-[40px]"
                  aria-label="Razorpay payment form"
                />
              ) : (
                <div className="text-center">
                  <p className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground">
                    For security, payment links are shared against confirmed bookings. Request your secure Razorpay link and we will send the correct amount for your trip.
                  </p>
                  <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button render={<a href={paymentWhatsAppUrl} target="_blank" rel="noopener noreferrer" />} className="rounded-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Request Payment Link
                    </Button>
                    <Button render={<Link to="/contact?topic=payment-link" />} variant="outline" className="rounded-full">
                      Contact Office
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <p className="mt-8 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              Powered by Razorpay Secure
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
