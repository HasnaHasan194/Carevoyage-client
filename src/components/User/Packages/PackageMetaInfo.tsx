import React from "react";
import { MapPin, Users, Clock, Calendar } from "lucide-react";
import type { BrowsePackage } from "../../../services/User/packageService"

interface PackageMetaInfoProps {
  package: BrowsePackage;
}

export const PackageMetaInfo: React.FC<PackageMetaInfoProps> = ({
  package: pkg,
}) => {
  // Calculate duration in days
  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const duration = calculateDuration(pkg.startDate, pkg.endDate);

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {/* Meeting Point */}
      <div className="flex items-center gap-1.5">
        <MapPin className="w-4 h-4 shrink-0" style={{ color: "#8B6F47" }} />
        <span className="text-xs" style={{ color: "#7C5A3B" }}>
          {pkg.meetingPoint}
        </span>
      </div>

      {/* Max People */}
      <div className="flex items-center gap-1.5">
        <Users className="w-4 h-4 shrink-0" style={{ color: "#8B6F47" }} />
        <span className="text-xs" style={{ color: "#7C5A3B" }}>
          {pkg.maxGroupSize} {pkg.maxGroupSize === 1 ? "person" : "people"}
        </span>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-1.5">
        <Clock className="w-4 h-4 shrink-0" style={{ color: "#8B6F47" }} />
        <span className="text-xs" style={{ color: "#7C5A3B" }}>
          {duration} {duration === 1 ? "Day" : "Days"}
        </span>
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-1.5">
        <Calendar className="w-4 h-4 shrink-0" style={{ color: "#8B6F47" }} />
        <span className="text-xs" style={{ color: "#7C5A3B" }}>
          {formatDate(pkg.startDate)} - {formatDate(pkg.endDate)}
        </span>
      </div>
    </div>
  );
};

