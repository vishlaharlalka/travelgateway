import { motion } from "framer-motion";
import { Plane, Hotel, Map, Shield, Users, Briefcase, CreditCard, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { defaultSeoImage, graphSchema, pageSchema } from "@/lib/seo";

const services = [
  {
    icon: <Map className="w-10 h-10" />,
    title: "Custom Travel Planning",
    description: "We compare route options, trip length, comfort level, and budget before building the final plan.",
    details: ["Route and night-by-night planning", "Activity fit checks", "Guide and transfer coordination"],
  },
  {
    icon: <Plane className="w-10 h-10" />,
    title: "Flight & Transport",
    description: "Flight timings, layovers, baggage needs, and ground transfers are reviewed together.",
    details: ["Flight option comparison", "Private transfer arrangements", "Car rental coordination"],
  },
  {
    icon: <Hotel className="w-10 h-10" />,
    title: "Luxury Accommodations",
    description: "Hotel choices are shortlisted by location, room type, meal plan, service style, and trip purpose.",
    details: ["Room category guidance", "Breakfast and meal-plan checks", "Early check-in or late check-out requests"],
  },
  {
    icon: <Shield className="w-10 h-10" />,
    title: "Visa & Documentation",
    description: "We help organize visa requirements, passport validity, insurance, and entry-rule checks.",
    details: ["Document checklist", "Application support", "Entry requirement updates"],
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: "Group & Family Tours",
    description: "Plans account for age mix, walking comfort, meal preferences, rooming, and realistic daily pacing.",
    details: ["Child and senior-friendly pacing", "Private group dining", "Multi-room coordination"],
  },
  {
    icon: <Briefcase className="w-10 h-10" />,
    title: "Corporate Travel",
    description: "Business trips are kept practical with clear timings, stay options, transfers, and backup contacts.",
    details: ["Travel-day support", "Expense-friendly documentation", "Meeting room bookings"],
  },
];

export default function Services() {
  return (
    <div className="pt-24 pb-16 px-6 bg-background">
      <SEO
        title="Travel Services | International Tours, Visa Help and Luxury Planning"
        description="Explore Travel Gateway services including custom itineraries, flights, hotels, visa documentation, group tours, travel insurance, and concierge support."
        canonicalPath="/services"
        image={defaultSeoImage}
        imageAlt="Travel Gateway travel planning services"
        keywords="travel services Ahmedabad, visa assistance Ahmedabad, international tour planner, luxury travel services India"
        structuredData={graphSchema([
          pageSchema("/services", "Travel Services | International Tours, Visa Help and Luxury Planning", "Explore Travel Gateway services including custom itineraries, flights, hotels, visa documentation, group tours, travel insurance, and concierge support."),
          {
            "@type": "Service",
            name: "Custom travel planning",
            provider: { "@id": "https://travelgateway.in/#travelagency" },
            areaServed: "India",
            serviceType: services.map((service) => service.title),
          },
        ])}
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Our Services</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Travel planning support for flights, hotels, visas, group movement, and on-ground coordination from one Ahmedabad-based team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden group">
                <CardContent className="p-8">
                  <div className="mb-8 text-primary bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="mt-14 bg-muted/50 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-primary font-bold mb-4">
              <Headphones className="w-6 h-6" />
              <span>24/7 Concierge Support</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Support stays available while you travel.</h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              If timing changes, a pickup needs checking, or a hotel has a practical question, the Travel Gateway team remains reachable during the journey.
            </p>
            <Button size="lg" className="rounded-full px-8">Learn More About Support</Button>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800" 
                alt="Support Team" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
