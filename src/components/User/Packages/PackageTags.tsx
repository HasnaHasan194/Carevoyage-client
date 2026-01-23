import React from "react";

interface PackageTagsProps {
  tags: string[];
  variant?: "default" | "light";
}

export const PackageTags: React.FC<PackageTagsProps> = ({ 
  tags, 
  variant = "default" 
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const isLight = variant === "light";

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="px-3 py-1 rounded-full text-xs font-medium border"
          style={
            isLight
              ? {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  color: "#FFFFFF",
                }
              : {
                  backgroundColor: "#FDFBF8",
                  borderColor: "#D4A574",
                  color: "#7C5A3B",
                }
          }
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

