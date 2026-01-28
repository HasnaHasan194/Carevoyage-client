import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, CheckCircle2, Lock, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";
import { useBrowsePackages } from "@/hooks/User/usePackages";

// Helper function to calculate duration in days
const calculateDuration = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

// Fallback image if no images available
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80";

// Category tabs - using a subset of package categories
const TABS = ["All", "Adventure", "Cultural", "Family"];

export const Packages = () => {
  const [activeTab, setActiveTab] = useState("All");
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const navigate = useNavigate();

  // Fetch packages - use category filter if not "All"
  const { data, isLoading, error } = useBrowsePackages({
    limit: 6,
    page: 1,
    category: activeTab === "All" ? undefined : activeTab,
    sortKey: "newest",
  });

  const packages = data?.data || [];


  const handleBookNow = (packageId: string) => {
    navigate(`/client/packages/${packageId}`);
  };

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-stone-500">Unable to load packages. Please try again later.</p>
          </div>
        )}

        {/* Packages Grid */}
        {!isLoading && !error && packages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const duration = calculateDuration(pkg.startDate, pkg.endDate);
              const image = pkg.images?.[0] || FALLBACK_IMAGE;
              // Use inclusions as highlights, or fallback
              const highlights = pkg.inclusions?.slice(0, 3) || ["Guided Tours", "Accommodation", "Meals Included"];
              
              return (
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
                     <img src={image} alt={pkg.PackageName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-stone-900">
                       {pkg.category}
                     </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-stone-900 mb-1 line-clamp-1">{pkg.PackageName}</h3>
                        <div className="flex items-center gap-4 text-xs text-stone-500 font-medium">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {duration} Days</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Up to {pkg.maxGroupSize}</span>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className="text-xs text-stone-400 line-through">${Math.round(pkg.basePrice * 1.2)}</span>
                         <div className="text-xl font-extrabold text-amber-600">${pkg.basePrice}</div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-8 flex-1">
                      {highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-stone-600">
                          <CheckCircle2 className="w-4 h-4 text-amber-500" />
                          {highlight}
                        </div>
                      ))}
                    </div>

                    {isAuthenticated ? (
                      <button 
                        onClick={() => handleBookNow(pkg.id)}
                        className="w-full py-4 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/10"
                      >
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
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && packages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-stone-500">No packages available in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};
