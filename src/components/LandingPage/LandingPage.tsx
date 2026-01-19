import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { FeaturedDestinations } from "./FeaturedDestinations";
import { Packages } from "./Packages";
import { Services } from "./Services";
import { Reviews } from "./Reviews";
import { Newsletter } from "./Newsletter";
import { Footer } from "./Footer";
import { motion, useScroll, useSpring } from "framer-motion";

export const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-amber-500 origin-left z-50"
        style={{ scaleX }}
      />

      <Navbar />

      <main>
        <Hero />
        <FeaturedDestinations />
        <Packages />
        <Services />
        <Reviews />
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
