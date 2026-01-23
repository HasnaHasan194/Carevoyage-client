import React from "react";
import { X } from "lucide-react";

interface ExclusionsCardProps {
  exclusions: string[];
}

export const ExclusionsCard: React.FC<ExclusionsCardProps> = ({
  exclusions,
}) => {
  if (!exclusions || exclusions.length === 0) {
    return null;
  }

  return (
    <div className="relative h-full overflow-hidden">
      {/* Decorative Background */}
      <div
        className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-5 blur-3xl"
        style={{ backgroundColor: "#8B6F47" }}
      />

      <div
        className="relative p-8 md:p-10 rounded-2xl border-2 h-full shadow-lg transition-all hover:shadow-xl"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E5E7EB",
          background: "linear-gradient(135deg, #FDFBF8 0%, #FFFFFF 100%)",
        }}
      >
        {/* Header with Different Style */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 rounded-xl border-2"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E5E7EB",
              }}
            >
              <X className="w-6 h-6" style={{ color: "#8B6F47" }} />
            </div>
            <h3
              className="text-2xl font-bold"
              style={{ color: "#7C5A3B" }}
            >
              Exclusions
            </h3>
          </div>
          <div
            className="h-0.5 rounded-full"
            style={{
              background: "linear-gradient(90deg, rgba(139, 111, 71, 0.3), transparent)",
            }}
          />
        </div>

        {/* List with Different Styling */}
        <ul className="space-y-4">
          {exclusions.map((exclusion, index) => (
            <li
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg transition-all hover:bg-[#FAF7F2] group"
            >
              <div
                className="p-2 rounded-full shrink-0 mt-0.5 transition-transform group-hover:rotate-90"
                style={{
                  backgroundColor: "#F5E6D3",
                  border: "1px solid #E5E7EB",
                }}
              >
                <X className="w-5 h-5" style={{ color: "#8B6F47" }} />
              </div>
              <span className="text-base leading-relaxed flex-1" style={{ color: "#6B5B4A" }}>
                {exclusion}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

