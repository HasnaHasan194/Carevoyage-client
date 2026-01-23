import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/userSlice";
import { useLogoutMutation } from "@/hooks/auth/auth";
import {
  LayoutDashboard,
  User,
  Users,
  Star,
  MessageSquare,
  Mail,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/User/button";
import toast from "react-hot-toast";

interface CaretakerSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export const CaretakerSidebar: React.FC<CaretakerSidebarProps> = ({
  isMobile = false,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: logout, isPending } = useLogoutMutation();

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
      icon: LayoutDashboard,
      label: "Dashboard",
      path: ROUTES.CARETAKER_DASHBOARD,
    },
    {
      icon: User,
      label: "Profile",
      path: ROUTES.CARETAKER_PROFILE,
    },
    {
      icon: Users,
      label: "Users Assigned",
      path: "#", // Placeholder
    },
    {
      icon: Star,
      label: "Reviews",
      path: "#", // Placeholder
    },
    {
      icon: MessageSquare,
      label: "Queries",
      path: "#", // Placeholder
    },
    {
      icon: Mail,
      label: "Guardian Email Update",
      path: "#", // Placeholder
    },
  ];

  const handleClick = (path: string) => {
    if (onClose) onClose();
    if (path !== "#") {
      navigate(path);
    }
  };

  return (
    <aside
      className={`${
        isMobile ? "w-full" : "w-64"
      } h-screen bg-white border-r flex flex-col`}
      style={{
        borderColor: "#E5E7EB",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Logo/Brand */}
      <div className="p-6 border-b" style={{ borderColor: "#E5E7EB" }}>
        <Link
          to={ROUTES.CARETAKER_DASHBOARD}
          className="flex items-center gap-2"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
            style={{ backgroundColor: "#D4A574" }}
          >
            CV
          </div>
          <span
            className="text-xl font-bold"
            style={{ color: "#7C5A3B" }}
          >
            CareVoyage
          </span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => handleClick(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? "font-semibold"
                  : "hover:bg-opacity-50"
              }`}
              style={{
                backgroundColor: active ? "#FDFBF8" : "transparent",
                color: active ? "#7C5A3B" : "#8B6F47",
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t" style={{ borderColor: "#E5E7EB" }}>
        <Button
          onClick={handleLogout}
          disabled={isPending}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          style={{
            borderColor: "#DC2626",
            color: "#DC2626",
          }}
        >
          <LogOut className="w-4 h-4" />
          {isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </aside>
  );
};

