import React from "react";
import { DollarSign } from "lucide-react";

interface PriceBadgeProps {
  price: number;
  size?: "sm" | "md" | "lg";
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({
  price,
  size = "lg",
}) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex items-center gap-2">
      <DollarSign
        className={`${size === "lg" ? "w-6 h-6" : size === "md" ? "w-5 h-5" : "w-4 h-4"}`}
        style={{ color: "#D4A574" }}
      />
      <span
        className={`font-bold ${sizeClasses[size]}`}
        style={{ color: "#7C5A3B" }}
      >
        {price.toLocaleString()}
      </span>
    </div>
  );
};

