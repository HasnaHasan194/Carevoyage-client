import React from "react";
import { Check } from "lucide-react";

interface InclusionsCardProps {
  inclusions: string[];
}

export const InclusionsCard: React.FC<InclusionsCardProps> = ({
  inclusions,
}) => {
  if (!inclusions || inclusions.length === 0) {
    return null;
  }

  return (
    <div className="relative h-full overflow-hidden">
      {/* Decorative Background */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-5 blur-3xl"
        style={{ backgroundColor: "#7C5A3B" }}
      />

      <div
        className="relative p-8 md:p-10 rounded-2xl border-2 h-full shadow-lg transition-all hover:shadow-xl"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#D4A574",
          background: "linear-gradient(135deg, #FFFFFF 0%, #FDFBF8 100%)",
        }}
      >
        {/* Header with Gradient Icon */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 rounded-xl shadow-md"
              style={{
                background: "linear-gradient(135deg, #7C5A3B 0%, #8B6F47 100%)",
              }}
            >
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3
              className="text-2xl font-bold"
              style={{
                background: "linear-gradient(135deg, #7C5A3B 0%, #8B6F47 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Inclusions
            </h3>
          </div>
          <div
            className="h-0.5 rounded-full"
            style={{
              background: "linear-gradient(90deg, #D4A574, transparent)",
            }}
          />
        </div>

        {/* List with Enhanced Styling */}
        <ul className="space-y-4">
          {inclusions.map((inclusion, index) => (
            <li
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg transition-all hover:bg-[#FDFBF8] group"
            >
              <div
                className="p-2 rounded-full shrink-0 mt-0.5 transition-transform group-hover:scale-110"
                style={{ backgroundColor: "#F5E6D3" }}
              >
                <Check className="w-5 h-5" style={{ color: "#7C5A3B" }} />
              </div>
              <span className="text-base leading-relaxed flex-1" style={{ color: "#5A4A3A" }}>
                {inclusion}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

