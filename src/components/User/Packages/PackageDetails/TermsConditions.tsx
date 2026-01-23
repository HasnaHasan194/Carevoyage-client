import React from "react";

interface TermsConditionsProps {
  terms?: string[];
}

export const TermsConditions: React.FC<TermsConditionsProps> = ({
  terms,
}) => {
  const defaultTerms = terms || [
    "All bookings are subject to availability and confirmation.",
    "Prices are per person and based on double occupancy unless stated otherwise.",
    "A valid passport is required for international travel.",
    "Travel insurance is recommended for all travelers.",
    "Cancellation policies apply as per the booking terms.",
    "The agency reserves the right to modify itineraries due to unforeseen circumstances.",
    "All travelers must comply with local laws and regulations.",
    "Special dietary requirements must be communicated at the time of booking.",
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Elements */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 blur-3xl"
        style={{ backgroundColor: "#7C5A3B" }}
      />

      <div
        className="relative p-10 md:p-12 lg:p-14 rounded-2xl border-2 shadow-lg"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E5E7EB",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="p-3 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #8B6F47 0%, #7C5A3B 100%)",
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
            Terms & Conditions
          </h2>
        </div>

        {/* Terms List with Enhanced Styling */}
        <ol className="space-y-5">
          {defaultTerms.map((term, index) => (
            <li
              key={index}
              className="flex items-start gap-5 p-5 rounded-xl border-2 transition-all hover:shadow-md hover:bg-[#FDFBF8]"
              style={{
                backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#FDFBF8",
                borderColor: "#E5E7EB",
              }}
            >
              <span
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base"
                style={{
                  background: "linear-gradient(135deg, #D4A574 0%, #C89564 100%)",
                  color: "#FFFFFF",
                }}
              >
                {index + 1}
              </span>
              <span
                className="text-base leading-relaxed flex-1 pt-1"
                style={{ color: "#5A4A3A" }}
              >
                {term}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

