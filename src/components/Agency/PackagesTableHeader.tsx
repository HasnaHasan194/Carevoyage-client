import React from "react";

interface PackagesTableHeaderProps {
  isMobile?: boolean;
}

export const PackagesTableHeader: React.FC<PackagesTableHeaderProps> = ({
  isMobile = false,
}) => {
  if (isMobile) {
    return null;
  }

  return (
    <thead>
      <tr className="border-b" style={{ borderColor: "#E5E7EB" }}>
        <th
          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#7C5A3B", backgroundColor: "#FDFBF8" }}
        >
          Package Name
        </th>
        <th
          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#7C5A3B", backgroundColor: "#FDFBF8" }}
        >
          Price
        </th>
        <th
          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#7C5A3B", backgroundColor: "#FDFBF8" }}
        >
          Meeting Point
        </th>
        <th
          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#7C5A3B", backgroundColor: "#FDFBF8" }}
        >
          Status
        </th>
        <th
          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#7C5A3B", backgroundColor: "#FDFBF8" }}
        >
          Category
        </th>
        <th
          className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#7C5A3B", backgroundColor: "#FDFBF8" }}
        >
          Actions
        </th>
      </tr>
    </thead>
  );
};

