import React from "react";

interface PackageDescriptionProps {
  description: string;
}

export const PackageDescription: React.FC<PackageDescriptionProps> = ({
  description,
}) => {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: "#D4A574" }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: "#D4A574" }}
      />

      <div
        className="relative p-10 md:p-12 lg:p-14 rounded-2xl border-2 shadow-xl backdrop-blur-sm"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E5E7EB",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Section Header with Icon */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="p-3 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #D4A574 0%, #C89564 100%)",
            }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2
            className="text-3xl font-bold"
            style={{
              background: "linear-gradient(135deg, #7C5A3B 0%, #8B6F47 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            About This Package
          </h2>
        </div>

        {/* Description with Enhanced Typography */}
        <div className="prose prose-lg max-w-none">
          <p
            className="text-lg md:text-xl leading-relaxed whitespace-pre-line"
            style={{ color: "#5A4A3A" }}
          >
            {description}
          </p>
        </div>

        {/* Decorative Bottom Border */}
        <div className="mt-6 pt-6 border-t-2" style={{ borderColor: "#F5E6D3" }}>
          <div className="flex items-center gap-2">
            <div
              className="h-1 rounded-full"
              style={{
                width: "40px",
                background: "linear-gradient(90deg, #D4A574, transparent)",
              }}
            />
            <div
              className="h-1 rounded-full flex-1"
              style={{
                background: "linear-gradient(90deg, rgba(212, 165, 116, 0.3), transparent)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

