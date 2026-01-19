import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Users, MapPin, PlayCircle } from "lucide-react";

const HERO_IMAGES = [
  {
    url: "/caretakermodi.png",
    title: "Discover Ancient Wonders",
    subtitle: "Experience the magic of Egypt with complete accessibility.",
  },
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80",
    title: "Mountains Calling",
    subtitle: "Scale new heights with our adaptive adventure packages.",
  },
  {
    url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80",
    title: " serene Getaways",
    subtitle: "Relax in 100% accessible luxury resorts worldwide.",
  },
];

export const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen min-h-175 w-full overflow-hidden bg-stone-900">
      {/* Background Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={HERO_IMAGES[currentImage].url}
            alt="Travel Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/40" />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-transparent to-stone-900/10" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center text-white">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {HERO_IMAGES[currentImage].title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl leading-relaxed">
            {HERO_IMAGES[currentImage].subtitle} Join CareVoyage for worry-free,
            fully accessible travel experiences.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-linear-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300">
              Explore Destinations
            </button>
            <button className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300">
              <PlayCircle className="w-5 h-5" />
              Watch Video
            </button>
          </div>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl max-w-5xl w-full mx-auto hidden lg:block"
        >
          <div className="flex items-center gap-4">
            {/* Destination */}
            <div className="flex-1 p-4 border-r border-stone-100">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1 block">
                Location
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="w-full bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-medium"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="flex-1 p-4 border-r border-stone-100">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1 block">
                Dates
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  placeholder="Add dates"
                  className="w-full bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-medium"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="flex-1 p-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1 block">
                Travelers
              </label>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  placeholder="Add guests"
                  className="w-full bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-medium"
                />
              </div>
            </div>

            {/* Search Button */}
            <button className="bg-stone-900 text-white p-5 rounded-2xl hover:bg-stone-800 transition-colors shadow-lg">
              <Search className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};
