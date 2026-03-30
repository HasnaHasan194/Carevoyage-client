import { Shield, HeartHandshake, Clock, Globe, Award, UserCheck } from "lucide-react";

import { ROUTES } from "@/config/env";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: Shield,
    title: "Comprehensive Insurance",
    description: "Travel with peace of mind knowing you're fully covered.",
    className: "text-blue-500",
  },
  {
    icon: Globe,
    title: "Expert Caretakers",
    description: "Care teams matched to accessibility needs.",
    className: "text-amber-500",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance whenever you need it.",
    className: "text-purple-500",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Care",
    description: "Plans tailored to preferences and comfort.",
    className: "text-rose-500",
  },
];

const STATS = [
  { label: "Happy Travelers", value: "10k+", icon: UserCheck },
  { label: "Destinations", value: "500+", icon: Globe },
  { label: "Average Rating", value: "4.9/5", icon: Award },
];

export function AboutPage() {
  return (
    <div className="bg-stone-50 min-h-screen font-sans selection:bg-amber-200 selection:text-amber-900">
      <Navbar />

      <main className="pt-28 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-6 mb-16">
          <div className="rounded-3xl bg-stone-900 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.35),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.25),transparent_55%)]" />
            <div className="relative z-10 p-10 md:p-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10 text-amber-200 text-sm font-semibold">
                Accessible Travel, Simplified
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mt-4 leading-tight">
                About CareVoyage
              </h1>
              <p className="text-white/90 mt-4 max-w-2xl leading-relaxed">
                We make travel accessible for everyone by matching travelers with
                expert caretakers, reliable support, and confidence-building
                care.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  to={ROUTES.CLIENT_PACKAGES}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors font-semibold shadow-lg"
                >
                  Explore Packages
                </Link>
                <a
                  href="#"
                  className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors font-semibold"
                  onClick={(e) => e.preventDefault()}
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-6 mb-16">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold tracking-wider text-sm uppercase">
              Why choose us
            </span>
            <h2 className="text-4xl font-bold text-stone-900 mt-2">
              Built around your comfort
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-stone-100"
                >
                  <div className="mb-6 p-4 bg-stone-50 rounded-2xl w-fit">
                    <Icon className={`w-8 h-8 ${feature.className}`} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-6 mb-16">
          <div className="bg-stone-900 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label}>
                    <div className="flex justify-center mb-4 text-amber-500 opacity-90">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="text-4xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <div className="text-white/60 font-medium uppercase tracking-wider text-sm">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="container mx-auto px-6">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 md:p-10">
            <h2 className="text-3xl font-bold text-stone-900">
              Ready to plan an accessible trip?
            </h2>
            <p className="text-stone-600 mt-3 max-w-2xl leading-relaxed">
              Browse packages built for comfort and confidence, and let our team handle the rest.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={ROUTES.CLIENT_PACKAGES}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors font-semibold shadow-lg"
              >
                Browse Destinations
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="px-6 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 transition-colors font-semibold"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

