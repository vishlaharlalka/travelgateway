import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { defaultSeoImage, graphSchema, pageSchema } from "@/lib/seo";

export default function Payment() {
  const paymentFormRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Prevent multiple loads
    if (!paymentFormRef.current) return;
    if (paymentFormRef.current.childNodes.length > 0) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", "pl_HplZK56YvO7ZkZ");
    script.async = true;
    
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
    };

    script.onerror = () => {
      setError("Failed to load payment gateway. Please check your internet connection and refresh.");
    };

    paymentFormRef.current.appendChild(script);

    return () => {
      // Leave the injected payment button in place during React StrictMode's dev-only effect replay.
    };
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-background relative overflow-hidden">
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
          <p className="mx-auto mb-12 max-w-72 text-base leading-relaxed text-muted-foreground sm:max-w-2xl sm:text-lg">
            Securely pay for your curated journey using our trusted Razorpay integration. 
            All transactions are encrypted and protected.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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
            className="bg-white dark:bg-zinc-900 shadow-2xl rounded-[3rem] p-12 max-w-lg mx-auto border border-white/10"
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
              {error ? (
                <div className="flex flex-col items-center gap-2 text-destructive">
                  <AlertCircle className="w-8 h-8" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              ) : (
                <form
                  ref={paymentFormRef}
                  className="payment-button-container flex justify-center w-full min-h-[40px]"
                  aria-label="Razorpay payment form"
                />
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
