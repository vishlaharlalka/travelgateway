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
    description: "We design unique itineraries based on your preferences, budget, and travel style.",
    details: ["Personalized route mapping", "Activity recommendations", "Local guide connections"],
  },
  {
    icon: <Plane className="w-10 h-10" />,
    title: "Flight & Transport",
    description: "Seamless booking for international flights, private jets, and local transportation.",
    details: ["Best fare guarantee", "Private transfer arrangements", "Car rental coordination"],
  },
  {
    icon: <Hotel className="w-10 h-10" />,
    title: "Luxury Accommodations",
    description: "Access to exclusive hotels, private villas, and boutique stays worldwide.",
    details: ["VIP room upgrades", "Complimentary breakfast", "Late check-out options"],
  },
  {
    icon: <Shield className="w-10 h-10" />,
    title: "Visa & Documentation",
    description: "Expert assistance with visa applications and all necessary travel documents.",
    details: ["Fast-track processing", "Document verification", "Entry requirement updates"],
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: "Group & Family Tours",
    description: "Curated experiences for families and groups that cater to all ages and interests.",
    details: ["Kid-friendly activities", "Private group dining", "Multi-room coordination"],
  },
  {
    icon: <Briefcase className="w-10 h-10" />,
    title: "Corporate Travel",
    description: "Efficient and professional travel management for businesses and executives.",
    details: ["24/7 travel support", "Expense management", "Meeting room bookings"],
  },
];

export default function Services() {
  return (
    <div className="pt-32 pb-24 px-6 bg-background">
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
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Our Services</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We provide end-to-end travel solutions to ensure your journey is as smooth as it is memorable.
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
                <CardContent className="p-10">
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
        <div className="mt-24 bg-muted/50 rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-primary font-bold mb-4">
              <Headphones className="w-6 h-6" />
              <span>24/7 Concierge Support</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">We're with you every step of the way.</h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Our dedicated support team is available around the clock to assist you with any changes, emergencies, or special requests during your trip.
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
