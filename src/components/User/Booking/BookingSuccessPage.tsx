import React, { useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { UserNavbar } from "@/components/User/UserNavbar";
import { UserFooter } from "@/components/User/UserFooter";
import { Button } from "@/components/User/button";
import { ROUTES } from "@/config/env";
import { bookingService } from "@/services/User/bookingService";

export const BookingSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const confirmSentRef = useRef(false);

  useEffect(() => {
    if (!sessionId || confirmSentRef.current) return;
    confirmSentRef.current = true;
    bookingService.confirmBookingSuccess(sessionId).catch(() => {});
  }, [sessionId]);

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
            style={{ backgroundColor: "#E8F5E9" }}
          >
            <CheckCircle className="w-12 h-12" style={{ color: "#2E7D32" }} />
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: "#7C5A3B" }}
          >
            Payment Successful
          </h1>
          <p className="text-base mb-6" style={{ color: "#8B6F47" }}>
            Thank you for your booking. Your payment has been completed
            successfully.
            {sessionId && (
              <span className="block mt-2 text-sm opacity-80">
                Session: {sessionId.slice(0, 20)}...
              </span>
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={ROUTES.CLIENT_BOOKINGS}>
              <Button
                className="w-full sm:w-auto"
                style={{
                  backgroundColor: "#D4A574",
                  color: "#FFFFFF",
                }}
              >
                View My Bookings
              </Button>
            </Link>
            <Link to={ROUTES.CLIENT_PACKAGES}>
              <Button variant="outline" className="w-full sm:w-auto">
                Browse More Packages
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <UserFooter />
    </div>
  );
};
