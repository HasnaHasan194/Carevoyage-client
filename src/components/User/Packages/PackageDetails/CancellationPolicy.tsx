import React from "react";
import { AlertTriangle } from "lucide-react";

export const CancellationPolicy: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #FFF8F0 0%, #F5E6D3 50%, #FFF8F0 100%)",
        }}
      />

      <div
        className="relative p-10 md:p-12 lg:p-14 rounded-2xl border-2 shadow-xl"
        style={{
          backgroundColor: "rgba(255, 248, 240, 0.8)",
          borderColor: "#D4A574",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header with Icon */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className="p-3 rounded-xl shadow-md"
            style={{
              background: "linear-gradient(135deg, #D4A574 0%, #C89564 100%)",
            }}
          >
            <AlertTriangle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2
              className="text-3xl font-bold mb-2"
              style={{
                background: "linear-gradient(135deg, #7C5A3B 0%, #8B6F47 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Cancellation Policy
            </h2>
            <p className="text-sm" style={{ color: "#8B6F47" }}>
              Important information about cancellations
            </p>
          </div>
        </div>

        {/* Policy Items with Varied Cards */}
        <div className="space-y-5">
          <div
            className="p-6 rounded-xl border-2 transition-all hover:shadow-lg"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#D4A574",
            }}
          >
            <div className="flex items-center gap-4 mb-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#7C5A3B" }}
              />
              <p
                className="text-lg font-bold"
                style={{ color: "#7C5A3B" }}
              >
                Free Cancellation
              </p>
            </div>
            <p className="text-base leading-relaxed ml-8" style={{ color: "#5A4A3A" }}>
              Cancel up to 7 days before the start date for a full refund.
            </p>
          </div>

          <div
            className="p-6 rounded-xl border-2 transition-all hover:shadow-lg"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E5E7EB",
            }}
          >
            <div className="flex items-center gap-4 mb-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#8B6F47" }}
              />
              <p
                className="text-lg font-bold"
                style={{ color: "#7C5A3B" }}
              >
                50% Refund
              </p>
            </div>
            <p className="text-base leading-relaxed ml-8" style={{ color: "#5A4A3A" }}>
              Cancel between 3-7 days before the start date for a 50% refund.
            </p>
          </div>

          <div
            className="p-6 rounded-xl border-2 transition-all hover:shadow-lg"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E5E7EB",
            }}
          >
            <div className="flex items-center gap-4 mb-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#8B6F47" }}
              />
              <p
                className="text-lg font-bold"
                style={{ color: "#7C5A3B" }}
              >
                No Refund
              </p>
            </div>
            <p className="text-base leading-relaxed ml-8" style={{ color: "#5A4A3A" }}>
              Cancellations made less than 3 days before the start date are not eligible for a refund.
            </p>
          </div>

          {/* Note Section */}
          <div
            className="mt-6 pt-6 border-t-2 p-5 rounded-xl"
            style={{
              borderColor: "#D4A574",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <p className="text-xs leading-relaxed" style={{ color: "#6B5B4A" }}>
              <strong style={{ color: "#7C5A3B" }}>Note:</strong> Refunds will be processed to the original payment method within 5-10 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

