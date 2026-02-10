import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/slices/userSlice";
import { useLogoutMutation } from "@/hooks/auth/auth";
import type { RootState } from "@/store/store";
import {
  User,
  CalendarCheck,
  Wallet,
  Heart,
  MessageSquare,
  UserCheck,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/User/button";
import toast from "react-hot-toast";

interface UserSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  isMobile = false,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: logout, isPending } = useLogoutMutation();

  // Get user data from Redux store
  const user = useSelector((state: RootState) => state.auth.user);

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

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      path: ROUTES.CLIENT_PROFILE,
    },
    {
      icon: CalendarCheck,
      label: "My Bookings",
      path: ROUTES.CLIENT_BOOKINGS || "#",
    },
    {
      icon: Wallet,
      label: "Wallet",
      path: ROUTES.CLIENT_WALLET || "#",
    },
    {
      icon: Heart,
      label: "Bucket List",
      path: ROUTES.CLIENT_BUCKET_LIST || "#",
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: ROUTES.CLIENT_MESSAGES || "#",
    },
    {
      icon: UserCheck,
      label: "Caretaker",
      path: ROUTES.CLIENT_CARETAKER || "#",
    },
  ];

  const handleClick = (path: string) => {
    if (onClose) onClose();
    if (path !== "#") {
      navigate(path);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <aside
      className={`${
        isMobile ? "w-full" : "w-80"
      } h-screen flex flex-col relative backdrop-blur-sm`}
      style={{
        backgroundColor: "#FFFBF5",
      }}
    >
      {/* Elegant gradient border */}
      {!isMobile && (
        <div
          className="absolute right-0 top-0 bottom-0 w-px opacity-60"
          style={{
            background: "linear-gradient(180deg, transparent 0%, #E5DDD5 10%, #E5DDD5 90%, transparent 100%)",
          }}
        />
      )}

      {/* Mobile Close Button */}
      {isMobile && onClose && (
        <div className="flex justify-end p-6">
          <button
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-[#F5EDE3]/50 transition-all duration-300 hover:rotate-90"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" style={{ color: "#7C5A3B" }} />
          </button>
        </div>
      )}

      {/* User Profile Section - Modern Card Style */}
      <div className="px-8 pt-10 pb-8">
        <div className="flex flex-col items-center">
          {/* Profile Image / Avatar - Clickable to go to landing page */}
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              navigate(ROUTES.HOME);
            }}
            className="relative mb-5 group focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:ring-offset-2 rounded-2xl"
            aria-label="Go to home"
          >
            <div
              className="w-28 h-28 rounded-2xl flex items-center justify-center text-white font-medium text-2xl overflow-hidden transition-all duration-300 group-hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: "#D4A574",
                boxShadow: "0 8px 24px rgba(212, 165, 116, 0.15)",
              }}
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="tracking-wider">{getUserInitials()}</span>
              )}
            </div>
            {/* Subtle indicator dot */}
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] pointer-events-none"
              style={{
                backgroundColor: "#10B981",
                borderColor: "#FFFBF5",
              }}
            />
          </button>

          {/* User Info with modern spacing */}
          <div className="text-center space-y-1.5 w-full">
            <h3
              className="text-xl font-semibold tracking-tight"
              style={{ color: "#7C5A3B" }}
            >
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : "User"}
            </h3>
            <p
              className="text-sm truncate max-w-full px-4 opacity-80"
              style={{ color: "#8B6F47" }}
            >
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Subtle divider */}
      <div className="px-8 mb-2">
        <div
          className="h-px w-full opacity-40"
          style={{ backgroundColor: "#E5DDD5" }}
        />
      </div>

      {/* Navigation Menu - Modern & Minimal */}
      <nav className="flex-1 px-6 py-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-[#E5DDD5] scrollbar-track-transparent">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.label}
              onClick={() => handleClick(item.path)}
              disabled={item.path === "#"}
              className={`
                w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl
                transition-all duration-300 ease-out group
                ${
                  active
                    ? "scale-[1.02]"
                    : item.path === "#"
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:scale-[1.01] hover:translate-x-1"
                }
              `}
              style={{
                backgroundColor: active ? "#F5EDE3" : "transparent",
                color: active ? "#7C5A3B" : "#8B6F47",
                fontWeight: active ? 600 : 500,
                boxShadow: active
                  ? "0 2px 8px rgba(212, 165, 116, 0.08)"
                  : "none",
              }}
            >
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-xl
                  transition-all duration-300
                  ${active ? "scale-110" : "group-hover:scale-105"}
                `}
                style={{
                  backgroundColor: active
                    ? "rgba(212, 165, 116, 0.15)"
                    : "transparent",
                }}
              >
                <Icon
                  className="w-5 h-5 transition-transform duration-300"
                  style={{
                    color: active ? "#D4A574" : "#8B6F47",
                  }}
                />
              </div>
              <span className="text-[15px] tracking-wide">{item.label}</span>
              {active && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#D4A574" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button - Modern Glass Effect */}
      <div className="p-6 pt-4">
        <div
          className="h-px w-full mb-4 opacity-40"
          style={{ backgroundColor: "#E5DDD5" }}
        />
        <Button
          onClick={handleLogout}
          disabled={isPending}
          variant="outline"
          className="
            w-full flex items-center justify-center gap-3 
            px-5 py-3.5 rounded-2xl
            transition-all duration-300 
            hover:scale-[1.02] hover:shadow-md
            disabled:opacity-50 disabled:cursor-not-allowed
            font-medium tracking-wide
          "
          style={{
            borderColor: "#DC2626",
            borderWidth: "1.5px",
            color: "#DC2626",
            backgroundColor: "transparent",
          }}
        >
          <LogOut className={`w-4.5 h-4.5 ${isPending ? "animate-spin" : ""}`} />
          <span className="text-[15px]">
            {isPending ? "Logging out..." : "Logout"}
          </span>
        </Button>
      </div>
    </aside>
  );
};