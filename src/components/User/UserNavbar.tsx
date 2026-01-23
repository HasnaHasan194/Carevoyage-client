import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X,  LogOut,  } from "lucide-react";
import { ROUTES } from "@/config/env";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/userSlice";
import { useLogoutMutation } from "@/hooks/auth/auth";
import type { RootState } from "@/store/store";
import type { User as UserType } from "@/types/auth.types";
import toast from "react-hot-toast";
import { Button } from "@/components/User/button";

export const UserNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const { mutate: logout, isPending } = useLogoutMutation();

  // Get user from Redux or localStorage fallback
  const [user, setUser] = useState<UserType | null>(reduxUser);

  useEffect(() => {
    // Update user when Redux state changes
    if (reduxUser) {
      setUser(reduxUser);
    } else {
      // Fallback to localStorage if Redux state is not available
      try {
        const stored = localStorage.getItem("authSession");
        if (stored) {
          const parsed = JSON.parse(stored) as UserType;
          if (parsed && parsed.id && parsed.email && parsed.role) {
            setUser(parsed);
          }
        }
      } catch {
        setUser(null);
      }
    }
  }, [reduxUser]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(logoutUser());
        toast.success("Logged out successfully");
        navigate(ROUTES.LOGIN);
      },
      onError: (error: unknown) => {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Logout failed";
        toast.error(errorMessage);
        dispatch(logoutUser());
        navigate(ROUTES.LOGIN);
      },
    });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-3"
          : "bg-white/90 backdrop-blur-sm py-4"
      }`}
      style={{ borderBottom: "1px solid #E5E7EB" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={ROUTES.CLIENT_DASHBOARD}
            className="flex items-center gap-2 group"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform"
              style={{ backgroundColor: "#D4A574" }}
            >
              CV
            </div>
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: "#7C5A3B" }}
            >
              CareVoyage
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to={ROUTES.CLIENT_DASHBOARD}
              className={`text-sm font-medium transition-colors ${
                isActive(ROUTES.CLIENT_DASHBOARD)
                  ? "font-semibold"
                  : "hover:opacity-80"
              }`}
              style={{
                color: isActive(ROUTES.CLIENT_DASHBOARD) ? "#7C5A3B" : "#8B6F47",
              }}
            >
              Dashboard
            </Link>
            <Link
              to={ROUTES.CLIENT_PACKAGES}
              className={`text-sm font-medium transition-colors ${
                isActive(ROUTES.CLIENT_PACKAGES)
                  ? "font-semibold"
                  : "hover:opacity-80"
              }`}
              style={{
                color: isActive(ROUTES.CLIENT_PACKAGES) ? "#7C5A3B" : "#8B6F47",
              }}
            >
              Packages
            </Link>
            <Link
              to={ROUTES.CLIENT_PROFILE}
              className={`text-sm font-medium transition-colors ${
                isActive(ROUTES.CLIENT_PROFILE)
                  ? "font-semibold"
                  : "hover:opacity-80"
              }`}
              style={{
                color: isActive(ROUTES.CLIENT_PROFILE) ? "#7C5A3B" : "#8B6F47",
              }}
            >
              Profile
            </Link>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-4">
                {/* User Info Card */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg border-2 transition-all hover:shadow-md" style={{
                  backgroundColor: "#FDFBF8",
                  borderColor: "#E5E7EB",
                }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md"
                    style={{ backgroundColor: "#D4A574" }}
                  >
                    {user.firstName?.[0]?.toUpperCase() || "U"}
                    {user.lastName?.[0]?.toUpperCase() || ""}
                  </div>
                  <div className="text-left">
                    <p
                      className="text-sm font-semibold leading-tight"
                      style={{ color: "#7C5A3B" }}
                    >
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs leading-tight" style={{ color: "#8B6F47" }}>
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  disabled={isPending}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  style={{
                    borderColor: "#D4A574",
                    color: "#7C5A3B",
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: "#7C5A3B" }}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E5E7EB",
          }}
        >
          <div className="px-4 py-4 space-y-3">
            <Link
              to={ROUTES.CLIENT_DASHBOARD}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium"
              style={{ color: "#7C5A3B" }}
            >
              Dashboard
            </Link>
            <Link
              to={ROUTES.CLIENT_PACKAGES}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium"
              style={{ color: "#7C5A3B" }}
            >
              Packages
            </Link>
            <Link
              to={ROUTES.CLIENT_PROFILE}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium"
              style={{ color: "#7C5A3B" }}
            >
              Profile
            </Link>
            {user && (
              <>
                <div className="pt-3 border-t" style={{ borderColor: "#E5E7EB" }}>
                  {/* User Info Card for Mobile */}
                  <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-lg border-2" style={{
                    backgroundColor: "#FDFBF8",
                    borderColor: "#E5E7EB",
                  }}>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-md shrink-0"
                      style={{ backgroundColor: "#D4A574" }}
                    >
                      {user.firstName?.[0]?.toUpperCase() || "U"}
                      {user.lastName?.[0]?.toUpperCase() || ""}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold mb-1 truncate" style={{ color: "#7C5A3B" }}>
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs truncate" style={{ color: "#8B6F47" }}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={isPending}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    style={{
                      borderColor: "#D4A574",
                      color: "#7C5A3B",
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

