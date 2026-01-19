import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, CheckCircle2, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/env";

const PACKAGES = [
  {
    id: 1,
    title: "Grand European Tour",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    price: 3500,
    duration: "14 Days",
    groupSize: "10-12 People",
    difficulty: "Easy",
    type: "Popular",
    highlights: ["Accessible Hotels", "Private Van", "Guided Tours"]
  },
  {
    id: 2,
    title: "Maldives Luxury Escape",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    price: 5200,
    duration: "7 Days",
    groupSize: "2-4 People",
    difficulty: "Relaxed",
    type: "Luxury",
    highlights: ["Overwater Villa", "Spa Treatment", "Personal Butler"]
  },
  {
    id: 3,
    title: "Machu Picchu Expedition",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80",
    price: 2800,
    duration: "9 Days",
    groupSize: "6-8 People",
    difficulty: "Moderate",
    type: "Adventure",
    highlights: ["Train Journey", "Adaptive Hiking", "Cultural Show"]
  },
   {
    id: 4,
    title: "Tokyo & Kyoto",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    price: 3100,
    duration: "10 Days",
    groupSize: "10 People",
    difficulty: "Easy",
    type: "Popular",
    highlights: ["Tea Ceremony", "Bullet Train", "Temple Visits"]
  },
  {
    id: 5,
    title: "Safari in Kenya",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    price: 4500,
    duration: "8 Days",
    groupSize: "6 People",
    difficulty: "Adventure",
    type: "Adventure",
    highlights: ["Game Drives", "Luxury Tents", "Maasai Village"]
  }
];

const TABS = ["Popular", "Luxury", "Adventure"];

export const Packages = () => {
  const [activeTab, setActiveTab] = useState("Popular");
  const isAuthenticated = !!localStorage.getItem("accessToken");

  const filteredPackages = PACKAGES.filter(pkg => pkg.type === activeTab || (activeTab === "Popular" && pkg.type !== "Luxury" && pkg.type !== "Adventure") || activeTab === "Popular"); // Simplification for demo: show popular as mixed or specific tag. 
  // Let's actually adjust logic: strictly match type or show specific logic.
  // For this demo, let's just stick to matching types, or duplicate for popular.
  
  const displayPackages = PACKAGES.filter(pkg => activeTab === 'Popular' ? true : pkg.type === activeTab);


  return (
    <section className="py-24 bg-white" id="packages">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-semibold tracking-wider text-sm uppercase">Choose Your Vibe</span>
           <h2 className="text-4xl font-bold text-stone-900 mt-2 mb-6">Curated Holiday Packages</h2>
           
           <div className="flex justify-center gap-2 flex-wrap">
             {TABS.map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                   activeTab === tab 
                     ? "bg-stone-900 text-white shadow-lg scale-105" 
                     : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                 }`}
               >
                 {tab}
               </button>
             ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPackages.slice(0, 6).map((pkg) => (
            <motion.div
              key={pkg.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-stone-50 rounded-3xl overflow-hidden border border-stone-100 hover:shadow-xl hover:border-amber-200 transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-60 overflow-hidden">
                 <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-stone-900">
                   {pkg.difficulty}
                 </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 mb-1">{pkg.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-stone-500 font-medium">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {pkg.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {pkg.groupSize}</span>
                    </div>
                  </div>
                  <div className="text-right">
                     <span className="text-xs text-stone-400 line-through">${pkg.price + 500}</span>
                     <div className="text-xl font-extrabold text-amber-600">${pkg.price}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-8 flex-1">
                  {pkg.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-stone-600">
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                      {highlight}
                    </div>
                  ))}
                </div>

                {isAuthenticated ? (
                  <button className="w-full py-4 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/10">
                    Book Now
                  </button>
                ) : (
                  <Link to={ROUTES.LOGIN} className="w-full py-4 rounded-xl bg-stone-200 text-stone-500 font-bold hover:bg-stone-300 transition-colors flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Login to Book
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
