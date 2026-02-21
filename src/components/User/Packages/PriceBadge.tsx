import React from "react";

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
      <span
        className={`font-bold ${sizeClasses[size]}`}
        style={{ color: "#7C5A3B" }}
      >
        ₹{price.toLocaleString()}
      </span>
    </div>
  );
};




