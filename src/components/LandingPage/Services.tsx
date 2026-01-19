import { motion } from "framer-motion";
import {
  Shield,
  HeartHandshake,
  Clock,
  Globe,
  Award,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

/* -----------------------------
   Services Data
----------------------------- */

const SERVICES: {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}[] = [
  {
    icon: Shield,
    title: "Comprehensive Insurance",
    description: "Travel with peace of mind knowing you're fully covered.",
    color: "text-blue-500",
  },
  {
    icon: Globe,
    title: "Expert Guides",
    description: "Local experts who understand accessibility needs perfectly.",
    color: "text-amber-500",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance whenever you need it.",
    color: "text-purple-500",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Care",
    description: "Itineraries tailored specifically to your preferences.",
    color: "text-rose-500",
  },
];

/* -----------------------------
   Stats Data
----------------------------- */

const STATS: {
  label: string;
  value: string;
  icon: LucideIcon;
}[] = [
  { label: "Happy Travelers", value: "10k+", icon: UserCheck },
  { label: "Destinations", value: "500+", icon: Globe },
  { label: "Average Rating", value: "4.9/5", icon: Award },
];

/* -----------------------------
   Component
----------------------------- */

export const Services = () => {
  return (
    <section className="py-24 bg-stone-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-amber-600 font-semibold tracking-wider text-sm uppercase">
            Why Choose Us
          </span>
          <h2 className="text-4xl font-bold text-stone-900 mt-2">
            We Care About Your Journey
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-stone-100"
              >
                <div className="mb-6 p-4 bg-stone-50 rounded-2xl w-fit">
                  <Icon className={`w-8 h-8 ${service.color}`} />
                </div>

                <h3 className="text-xl font-bold text-stone-900 mb-3">
                  {service.title}
                </h3>

                <p className="text-stone-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-stone-900 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;

              return (
                <div
                  key={idx}
                  className="text-center border-r border-white/10 last:border-0"
                >
                  <div className="flex justify-center mb-4 text-amber-500 opacity-80">
                    <Icon className="w-8 h-8" />
                  </div>

                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.value}
                  </div>

                  <div className="text-white/60 font-medium uppercase tracking-wider text-sm">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
