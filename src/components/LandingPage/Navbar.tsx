import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import { ROUTES } from "@/config/env";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    };

    // Initial check
    checkAuth();

    // Listen for storage events (in case login happens in another tab)
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authSession");
    setIsAuthenticated(false);
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
            CV
          </div>
          <span
            className={`text-2xl font-bold tracking-tight ${
              isScrolled ? "text-stone-800" : "text-stone-800 lg:text-white"
            }`}
          >
            CareVoyage
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <Link
            to={ROUTES.HOME}
            className={`text-sm font-medium transition-colors hover:text-amber-500 ${
              isScrolled ? "text-stone-600" : "text-white/90 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to={isAuthenticated ? ROUTES.CLIENT_PACKAGES : "#packages"}
            className={`text-sm font-medium transition-colors hover:text-amber-500 ${
              isScrolled ? "text-stone-600" : "text-white/90 hover:text-white"
            }`}
          >
            Packages
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-amber-500 ${
              isScrolled ? "text-stone-600" : "text-white/90 hover:text-white"
            }`}
          >
            About
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link 
                to={ROUTES.CLIENT_PROFILE}
                onClick={(e) => e.stopPropagation()}
                title="Profile"
              >
                <div
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    isScrolled
                      ? "hover:bg-stone-100 text-stone-600"
                      : "hover:bg-white/10 text-white"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <User className="w-5 h-5" />
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled
                    ? "hover:bg-stone-100 text-stone-600"
                    : "hover:bg-white/10 text-white"
                }`}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                isScrolled
                  ? "bg-stone-900 text-white hover:bg-stone-800"
                  : "bg-white text-stone-900 hover:bg-stone-100"
              }`}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-stone-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X
              className={`w-6 h-6 ${isScrolled ? "text-stone-800" : "text-stone-800 lg:text-white"}`}
            />
          ) : (
            <Menu
              className={`w-6 h-6 ${isScrolled ? "text-stone-800" : "text-stone-800 lg:text-white"}`}
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-stone-100 shadow-xl lg:hidden p-6"
          >
            <div className="flex flex-col gap-4">
              <Link
                to={ROUTES.HOME}
                className="text-lg font-medium text-stone-600 hover:text-amber-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to={isAuthenticated ? ROUTES.CLIENT_PACKAGES : "#packages"}
                className="text-lg font-medium text-stone-600 hover:text-amber-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Packages
              </Link>
              <Link
                to="/about"
                className="text-lg font-medium text-stone-600 hover:text-amber-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <hr className="border-stone-100 my-2" />
              {isAuthenticated ? (
                <>
                  <Link
                    to={ROUTES.CLIENT_PROFILE}
                    className="flex items-center gap-2 text-stone-600 hover:text-amber-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-stone-600 hover:text-red-600 text-left"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to={ROUTES.LOGIN}
                  className="w-full text-center py-3 rounded-xl bg-stone-900 text-white font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
