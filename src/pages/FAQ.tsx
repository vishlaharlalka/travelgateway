import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import { defaultSeoImage, graphSchema, pageSchema } from "@/lib/seo";

export default function FAQ() {
  useEffect(() => {
    document.title = "Frequently Asked Questions | TravelGateway South Bopal Ahmedabad";
  }, []);

  const faqs = [
    {
      question: "Where is TravelGateway located in Ahmedabad?",
      answer: "We are located at G 901, SAMANVAY SCINTILLA, B/H APOLLO INTERNATIONAL SCHOOL, VIP ROAD, SOUTH BOPAL, AHMEDABAD-380058. We are one of the most trusted travel agents in South Bopal, providing personalized services to our local community."
    },
    {
      question: "Do you provide customized international tour packages?",
      answer: "Yes, customization is our specialty. Vishal Harlalka and his team curate bespoke itineraries for destinations like Vietnam, Kenya, Cambodia, Philippines, Europe, and more, tailored to your specific preferences and budget."
    },
    {
      question: "How can I book a trip with TravelGateway?",
      answer: "You can book by visiting our office in South Bopal, calling us at +91 9898111689, or sending us a message on WhatsApp. We prefer a personalized consultation to understand your travel dreams before finalizing any booking."
    },
    {
      question: "Do you assist with Visa processing for Indian travelers?",
      answer: "Absolutely. We provide comprehensive visa assistance, including E-visas for countries like Vietnam and sticker visas for Schengen, UK, USA, and others. Our team ensures your documentation is perfect to maximize approval chances."
    },
    {
      question: "What makes TravelGateway different from online travel portals?",
      answer: "Unlike generic portals, we offer human-centric service. You have direct access to Vishal Harlalka and a dedicated team. We provide 24/7 support during your trip, handle emergencies personally, and offer local insights that algorithms can't."
    },
    {
      question: "Do you offer travel insurance?",
      answer: "Yes, we highly recommend and provide comprehensive travel insurance to protect you against medical emergencies, trip cancellations, and lost baggage."
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 bg-background">
      <SEO
        title="Travel Gateway FAQs | Ahmedabad Travel Agency Questions"
        description="Answers to common questions about Travel Gateway, international tour packages, visa assistance, travel insurance, payments, and trip support."
        canonicalPath="/faq"
        image={defaultSeoImage}
        imageAlt="Travel Gateway frequently asked questions"
        keywords="Travel Gateway FAQ, Ahmedabad travel agency questions, visa assistance FAQ, tour package questions"
        structuredData={graphSchema([
          pageSchema("/faq", "Travel Gateway FAQs | Ahmedabad Travel Agency Questions", "Answers to common questions about Travel Gateway, international tour packages, visa assistance, travel insurance, payments, and trip support."),
          {
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
        ])}
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HelpCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about planning your next journey with the leading travel agent in South Bopal, Ahmedabad.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-muted/30 p-8 md:p-12 rounded-[2.5rem] mb-16"
        >
            <Accordion type="single" className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-muted py-2">
                <AccordionTrigger className="text-left text-lg font-bold hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <div className="text-center bg-primary text-primary-foreground p-12 rounded-[3rem] shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Vishal and the team are just a message away. Get in touch for a personalized consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/919898111689" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="secondary" 
                size="lg" 
                className="rounded-full px-8 font-bold"
              >
                <MessageCircle className="mr-2 w-5 h-5" /> WhatsApp Us
              </Button>
            </a>
            <a href="tel:+919898111689">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground"
              >
                <Phone className="mr-2 w-5 h-5" /> Call Now
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
