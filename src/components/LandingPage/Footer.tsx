import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";
import { ROUTES } from "@/config/env";

export const Footer = () => {
  return (
    <footer className="bg-stone-50 pt-20 pb-10 border-t border-stone-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                CV
              </div>
              <span className="text-2xl font-bold tracking-tight text-stone-900">
                CareVoyage
              </span>
            </Link>
            <p className="text-stone-500 leading-relaxed">
              Making the world accessible for everyone. We believe travel should have no boundaries.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-white rounded-full text-stone-400 hover:text-amber-600 hover:shadow-md transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-stone-900 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {["Home", "Packages", "About", "Services", "Login"].map((item) => (
                <li key={item}>
                   <Link to={item === "Home" ? ROUTES.HOME : `/${item.toLowerCase()}`} className="text-stone-500 hover:text-amber-600 transition-colors">
                     {item}
                   </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-stone-900 mb-6">Resources</h4>
            <ul className="space-y-4">
              {["Accessibility Guide", "Travel Insurance", "Support Center", "Terms & Conditions", "Privacy Policy"].map((item) => (
                <li key={item}>
                   <a href="#" className="text-stone-500 hover:text-amber-600 transition-colors">
                     {item}
                   </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-stone-900 mb-6">Contact Us</h4>
             <ul className="space-y-4">
               <li className="flex items-start gap-3 text-stone-500">
                 <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                 <span>123 Accessible Ave, Travel City, TC 90210</span>
               </li>
               <li className="flex items-center gap-3 text-stone-500">
                 <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                 <span>hello@carevoyage.com</span>
               </li>
               <li className="flex items-center gap-3 text-stone-500">
                 <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                 <span>+1 (555) 123-4567</span>
               </li>
             </ul>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-400">
          <p>© {new Date().getFullYear()} CareVoyage. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-stone-600">Privacy</a>
            <a href="#" className="hover:text-stone-600">Terms</a>
            <a href="#" className="hover:text-stone-600">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
