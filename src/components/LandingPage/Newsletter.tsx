import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, ArrowRight } from "lucide-react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="bg-linear-to-br from-stone-900 to-stone-800 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          
          {/* Background blobs */}
          <div className="absolute top-0 right-0 w-120 h-120 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Join Our Travel Community
              </h2>

              <p className="text-white/70 text-lg mb-8 max-w-md">
                Get exclusive access to new accessible travel packages, tips, and inspiration delivered straight to your inbox.
              </p>

              <div className="flex items-center gap-6 text-white/60 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500" />
                  Weekly Updates
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500" />
                  No Spam
                </span>
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-white/5 backdrop-blur-lg p-2 rounded-2xl border border-white/10">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8 bg-green-500/20 rounded-xl"
                >
                  <Check className="w-12 h-12 text-green-400 mb-2" />
                  <h3 className="text-white font-bold text-xl">Subscribed!</h3>
                  <p className="text-white/70">Thank you for joining us.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white ml-2">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-stone-500 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 group"
                  >
                    Subscribe Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-center text-xs text-white/40">
                    By subscribing, you agree to our Policy.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
