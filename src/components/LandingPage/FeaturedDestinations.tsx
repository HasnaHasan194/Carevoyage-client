import { motion } from "framer-motion";
import { MapPin, Star, Heart, ArrowRight, Loader2 } from "lucide-react";
import { useBrowsePackages } from "@/hooks/User/usePackages";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";

// Helper function to calculate duration in days
const calculateDuration = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

// Fallback image if no images available
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80";

export const FeaturedDestinations = () => {
  const navigate = useNavigate();
  
  // Fetch packages with limit of 4 for featured section
  const { data, isLoading, error } = useBrowsePackages({
    limit: 4,
    page: 1,
    sortKey: "newest",
  });
  const packages = data?.data || [];

  const handleViewAll = () => {
    navigate(ROUTES.CLIENT_PACKAGES);
  };

  const handleExplore = (packageId: string) => {
    navigate(`/client/packages/${packageId}`);
  };

  return (
    <section className="py-24 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
             <span className="text-amber-600 font-semibold tracking-wider text-sm uppercase">Curated Gems</span>
            <h2 className="text-4xl font-bold text-stone-900 mt-2">Featured Destinations</h2>
          </div>
          <button 
            onClick={handleViewAll}
            className="hidden md:flex items-center gap-2 text-stone-600 hover:text-amber-600 font-medium transition-colors"
          >
            View All
            <ArrowRight className="w-5 h-5" />
          </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg, index) => {
              const duration = calculateDuration(pkg.startDate, pkg.endDate);
              const image = pkg.images?.[0] || FALLBACK_IMAGE;
              
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={image}
                      alt={pkg.PackageName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-all">
                      <Heart className="w-5 h-5" />
                    </button>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-medium rounded-full">
                        {pkg.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                        {pkg.PackageName}
                      </h3>
                       <div className="flex items-center gap-1 text-sm font-medium text-stone-900">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        4.8
                      </div>
                    </div>
                     
                     <div className="flex items-center gap-4 text-stone-500 text-sm mb-4">
                       <div className="flex items-center gap-1">
                         <MapPin className="w-4 h-4" />
                         <span>{duration} Days</span>
                       </div>
                       <span>•</span>
                       <span>{pkg.meetingPoint}</span>
                     </div>

                    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                      <div>
                        <span className="text-gray-400 text-xs uppercase">Starts from</span>
                        <div className="text-lg font-bold text-stone-900">${pkg.basePrice}</div>
                      </div>
                      <button 
                        onClick={() => handleExplore(pkg.id)}
                        className="px-4 py-2 bg-stone-100 text-stone-900 rounded-xl text-sm font-semibold group-hover:bg-stone-900 group-hover:text-white transition-all"
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && packages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-stone-500">No packages available at the moment.</p>
          </div>
        )}
        
         <button 
           onClick={handleViewAll}
           className="md:hidden w-full mt-8 flex items-center justify-center gap-2 text-stone-600 hover:text-amber-600 font-medium transition-colors p-4 border border-stone-200 rounded-xl"
         >
            View All Destinations
            <ArrowRight className="w-5 h-5" />
          </button>
      </div>
    </section>
  );
};
