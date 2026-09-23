import { motion } from "framer-motion";
import { Briefcase, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/env";

export const BecomeAgencyCTA = () => {
  return (
    <section className="py-12 px-6 bg-stone-50">
      <div className="container mx-auto">
        <div className="bg-white border border-stone-200 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-xl transition-shadow hover:shadow-2xl">
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-stone-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 font-bold tracking-wide text-sm mb-6 border border-amber-200">
                <Briefcase className="w-4 h-4" />
                PARTNER WITH US
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-6 leading-tight">
                Do you want to become an agency?
              </h2>

              <p className="text-stone-600 text-lg mb-8 max-w-md leading-relaxed font-medium">
                Join our platform to offer your unique, accessible travel experiences to a global community. Expand your reach and make travel inclusive for everyone.
              </p>

              <div className="space-y-4 mb-8">
                {["Reach a wider audience", "Streamlined booking management", "Dedicated support team"].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-stone-700 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Action */}
            <div className="flex flex-col justify-center items-center md:items-end h-full">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto"
              >
                <Link
                  to={ROUTES.AGENCY_SIGNUP}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-5 px-10 rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-3 group w-full md:w-auto text-lg"
                >
                  Register Your Agency
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <p className="mt-6 text-sm text-stone-500 text-center md:text-right w-full md:w-auto font-medium">
                Quick and easy onboarding process.
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};
