import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { UserNavbar } from "@/components/User/UserNavbar";
import { UserFooter } from "@/components/User/UserFooter";
import { Button } from "@/components/User/button";
import { ROUTES } from "@/config/env";

export const BookingCancelPage: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      <UserNavbar />
      <main className="flex-1 flex items-center justify-center pt-16 px-4">
        <div
          className="max-w-md w-full text-center rounded-2xl shadow-xl p-8 md:p-12"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E5DDD5",
            borderWidth: "1px",
          }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#FFEBEE" }}
          >
            <XCircle className="w-12 h-12" style={{ color: "#C62828" }} />
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: "#7C5A3B" }}
          >
            Payment Cancelled
          </h1>
          <p className="text-base mb-6" style={{ color: "#8B6F47" }}>
            Your payment was cancelled. No charges have been made. You can try
            again whenever you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={ROUTES.CLIENT_PACKAGES}>
              <Button
                className="w-full sm:w-auto"
                style={{
                  backgroundColor: "#D4A574",
                  color: "#FFFFFF",
                }}
              >
                Browse Packages
              </Button>
            </Link>
            <Link to={ROUTES.CLIENT_DASHBOARD}>
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <UserFooter />
    </div>
  );
};
