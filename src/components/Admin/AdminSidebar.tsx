import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/slices/userSlice";
import { useLogoutMutation } from "@/hooks/auth/auth";
import type { RootState } from "@/store/store";
import {
  LayoutDashboard,
  Users,
  Building2,
  LogOut,
  X,
  Shield,
} from "lucide-react";
import { Button } from "@/components/User/button";
import toast from "react-hot-toast";

interface AdminSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobile = false,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: logout, isPending } = useLogoutMutation();

  // Get admin user data from Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(logoutUser());
        toast.success("Logged out successfully");
        navigate("/admin/login");
      },
      onError: (error: unknown) => {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Logout failed";
        toast.error(errorMessage);
        dispatch(logoutUser());
        navigate("/admin/login");
      },
    });
  };

  const isActive = (path: string) => {
    // Check for exact match or if current path starts with the menu item path
    if (path === ROUTES.ADMIN_DASHBOARD) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: ROUTES.ADMIN_DASHBOARD,
    },
    {
      icon: Users,
      label: "Users",
      path: ROUTES.ADMIN_USERS,
    },
    {
      icon: Building2,
      label: "Agencies",
      path: ROUTES.ADMIN_AGENCIES,
    },
  ];

  const handleClick = (path: string) => {
    if (onClose) onClose();
    navigate(path);
  };

  return (
    <aside
      className={`${
        isMobile ? "w-full" : "w-72"
      } h-screen flex flex-col relative`}
      style={{
        backgroundColor: "#FFFBF5",
      }}
    >
      {/* Elegant gradient border */}
      {!isMobile && (
        <div
          className="absolute right-0 top-0 bottom-0 w-px opacity-60"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, #E5DDD5 10%, #E5DDD5 90%, transparent 100%)",
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

      {/* Admin Profile Section */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex flex-col items-center">
          {/* Admin Avatar */}
          <div className="relative mb-4 group">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-white font-medium text-2xl overflow-hidden transition-all duration-300 group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                boxShadow: "0 8px 24px rgba(124, 58, 237, 0.2)",
              }}
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Shield className="w-10 h-10" />
              )}
            </div>
            {/* Online indicator */}
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px]"
              style={{
                backgroundColor: "#10B981",
                borderColor: "#FFFBF5",
              }}
            />
          </div>

          {/* Admin Info */}
          <div className="text-center space-y-1 w-full">
            <h3
              className="text-lg font-semibold tracking-tight"
              style={{ color: "#7C5A3B" }}
            >
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : "Admin"}
            </h3>
            <p
              className="text-sm truncate max-w-full px-4 opacity-70"
              style={{ color: "#8B6F47" }}
            >
              {user?.email || ""}
            </p>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-2"
              style={{
                backgroundColor: "rgba(124, 58, 237, 0.15)",
                color: "#7C3AED",
              }}
            >
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-6 mb-2">
        <div
          className="h-px w-full opacity-40"
          style={{ backgroundColor: "#E5DDD5" }}
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.label}
              onClick={() => handleClick(item.path)}
              className={`
                w-full flex items-center gap-4 px-4 py-3.5 rounded-xl
                transition-all duration-300 ease-out group
                ${
                  active
                    ? "scale-[1.02]"
                    : "hover:scale-[1.01] hover:translate-x-1"
                }
              `}
              style={{
                backgroundColor: active ? "#F5EDE3" : "transparent",
                color: active ? "#7C5A3B" : "#8B6F47",
                fontWeight: active ? 600 : 500,
                boxShadow: active
                  ? "0 2px 8px rgba(212, 165, 116, 0.1)"
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
                    ? "rgba(212, 165, 116, 0.2)"
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

      {/* Logout Button */}
      <div className="p-5 pt-3">
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
            px-5 py-3.5 rounded-xl
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
          <LogOut
            className={`w-4.5 h-4.5 ${isPending ? "animate-spin" : ""}`}
          />
          <span className="text-[15px]">
            {isPending ? "Logging out..." : "Logout"}
          </span>
        </Button>
      </div>
    </aside>
  );
};
