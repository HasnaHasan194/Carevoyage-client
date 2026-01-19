import { motion } from "framer-motion";
import { MapPin, Star, Heart, ArrowRight } from "lucide-react";

const DESTINATIONS = [
  {
    id: 1,
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 128,
    price: 1200,
    days: 7,
    category: "Relaxation"
  },
  {
    id: 2,
    name: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 96,
    price: 1850,
    days: 10,
    category: "Cultural"
  },
  {
    id: 3,
    name: "Swiss Alps",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviews: 84,
    price: 2400,
    days: 8,
    category: "Adventure"
  },
    {
    id: 4,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 215,
    price: 890,
    days: 6,
    category: "Tropical"
  }
];

export const FeaturedDestinations = () => {
  return (
    <section className="py-24 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
             <span className="text-amber-600 font-semibold tracking-wider text-sm uppercase">Curated Gems</span>
            <h2 className="text-4xl font-bold text-stone-900 mt-2">Feautured Destinations</h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-stone-600 hover:text-amber-600 font-medium transition-colors">
            View All
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {DESTINATIONS.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-all">
                  <Heart className="w-5 h-5" />
                </button>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-medium rounded-full">
                    {dest.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                    {dest.name}
                  </h3>
                   <div className="flex items-center gap-1 text-sm font-medium text-stone-900">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    {dest.rating}
                  </div>
                </div>
                 
                 <div className="flex items-center gap-4 text-stone-500 text-sm mb-4">
                   <div className="flex items-center gap-1">
                     <MapPin className="w-4 h-4" />
                     <span>{dest.days} Days</span>
                   </div>
                   <span>•</span>
                   <span>{dest.reviews} Reviews</span>
                 </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <div>
                    <span className="text-gray-400 text-xs uppercase">Starts from</span>
                    <div className="text-lg font-bold text-stone-900">${dest.price}</div>
                  </div>
                  <button className="px-4 py-2 bg-stone-100 text-stone-900 rounded-xl text-sm font-semibold group-hover:bg-stone-900 group-hover:text-white transition-all">
                    Explore
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
         <button className="md:hidden w-full mt-8 flex items-center justify-center gap-2 text-stone-600 hover:text-amber-600 font-medium transition-colors p-4 border border-stone-200 rounded-xl">
            View All Destinations
            <ArrowRight className="w-5 h-5" />
          </button>
      </div>
    </section>
  );
};
