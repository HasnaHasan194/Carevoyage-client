import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { UserSidebar } from "@/components/User/UserSidebar";
import { Menu } from "lucide-react";

export const UserLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FDFBF8" }}>
      {/* Desktop Sidebar - Fixed position */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64">
        <UserSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <UserSidebar isMobile onClose={closeSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header
          className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b"
          style={{
            backgroundColor: "#FFFBF5",
            borderColor: "#E5DDD5",
          }}
        >
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-[#F5EDE3] transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" style={{ color: "#7C5A3B" }} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ backgroundColor: "#D4A574" }}
            >
              CV
            </div>
            <span
              className="text-lg font-bold"
              style={{ color: "#7C5A3B" }}
            >
              CareVoyage
            </span>
          </div>

          {/* Spacer for centering */}
          <div className="w-10" />
        </header>

        {/* Page Content - Scrollable */}
        <main className="min-h-[calc(100vh-64px)] lg:min-h-screen overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
