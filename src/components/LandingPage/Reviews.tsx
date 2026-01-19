import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Sarah Johnson",
    role: "Travel Enthusiast",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    content: "CareVoyage made my dream trip to Europe possible. The accessibility arrangements were flawless!",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Adventure Seeker",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    content: "Incredible service. I never thought I could go hiking, but their adaptive equipment made it easy.",
    rating: 5
  },
  {
    name: "Emily Davis",
    role: "Family Traveler",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    content: "A truly inclusive experience. My son loved every moment, and we felt supported 24/7.",
    rating: 5
  }
];

export const Reviews = () => {
  return (
    <section className="py-24 bg-linear-to-b from-white to-stone-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-semibold tracking-wider text-sm uppercase">Testimonials</span>
          <h2 className="text-4xl font-bold text-stone-900 mt-2">What Our Travelers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-stone-50 relative"
            >
              <Quote className="absolute top-8 right-8 w-10 h-10 text-amber-100 fill-amber-100" />
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-stone-600 text-lg italic mb-8 relative z-10 leading-relaxed">
                "{review.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-100"
                />
                <div>
                  <div className="font-bold text-stone-900">{review.name}</div>
                  <div className="text-sm text-stone-500">{review.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
