import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";
import { ROUTES } from "@/config/env";

export const UserFooter = () => {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: "#2D2D2D",
        borderColor: "#3D3D3D",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to={ROUTES.CLIENT_DASHBOARD} className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: "#D4A574" }}
              >
                CV
              </div>
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ color: "#FFFFFF" }}
              >
                CareVoyage
              </span>
            </Link>
            <p style={{ color: "#B0B0B0" }} className="text-sm leading-relaxed">
              Making the world accessible for everyone. We believe travel should have no boundaries.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-full transition-all hover:scale-110"
                  style={{
                    backgroundColor: "#3D3D3D",
                    color: "#B0B0B0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#D4A574";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#B0B0B0";
                  }}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-bold mb-4"
              style={{ color: "#FFFFFF" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Dashboard", path: ROUTES.CLIENT_DASHBOARD },
                { label: "Packages", path: ROUTES.CLIENT_PACKAGES },
                { label: "Profile", path: ROUTES.CLIENT_PROFILE },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: "#B0B0B0" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#D4A574";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#B0B0B0";
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4
              className="font-bold mb-4"
              style={{ color: "#FFFFFF" }}
            >
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                "Accessibility Caretaker",
                "Travel Insurance",
                "Support Center",
                "Terms & Conditions",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: "#B0B0B0" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#D4A574";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#B0B0B0";
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-bold mb-4"
              style={{ color: "#FFFFFF" }}
            >
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin
                  className="w-5 h-5 shrink-0 mt-0.5"
                  style={{ color: "#D4A574" }}
                />
                <span className="text-sm" style={{ color: "#B0B0B0" }}>
                  123 Accessible Ave, Travel City, TC 90210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  className="w-5 h-5 shrink-0"
                  style={{ color: "#D4A574" }}
                />
                <a
                  href="mailto:hello@carevoyage.com"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#D4A574";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#B0B0B0";
                  }}
                >
                  hello@carevoyage.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  className="w-5 h-5 shrink-0"
                  style={{ color: "#D4A574" }}
                />
                <a
                  href="tel:+15551234567"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#D4A574";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#B0B0B0";
                  }}
                >
                  +1 (555) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
          style={{ borderColor: "#3D3D3D" }}
        >
          <p style={{ color: "#808080" }}>
            © {new Date().getFullYear()} CareVoyage. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors hover:opacity-80"
                style={{ color: "#808080" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#D4A574";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#808080";
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};




