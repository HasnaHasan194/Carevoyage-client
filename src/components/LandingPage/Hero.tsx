import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";

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
  const navigate = useNavigate();

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
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="bg-linear-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300"
            >
              Explore Destinations
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
