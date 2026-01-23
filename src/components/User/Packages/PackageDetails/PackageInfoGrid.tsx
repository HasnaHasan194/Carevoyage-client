import React from "react";
import { Calendar, Users, MapPin, Clock } from "lucide-react";
import type { PackageDetails } from "../../../../services/User/packageService"

interface PackageInfoGridProps {
  package: PackageDetails;
}

export const PackageInfoGrid: React.FC<PackageInfoGridProps> = ({
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
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const infoItems = [
    {
      icon: Clock,
      label: "Duration",
      value: `${duration} ${duration === 1 ? "Day" : "Days"}`,
    },
    {
      icon: Users,
      label: "Group Size",
      value: `Up to ${pkg.maxGroupSize} ${pkg.maxGroupSize === 1 ? "person" : "people"}`,
    },
    {
      icon: Calendar,
      label: "Start Date",
      value: formatDate(pkg.startDate),
    },
    {
      icon: Calendar,
      label: "End Date",
      value: formatDate(pkg.endDate),
    },
    {
      icon: MapPin,
      label: "Meeting Point",
      value: pkg.meetingPoint,
    },
  ];

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 rounded-2xl opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #D4A574 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div
        className="relative p-10 md:p-12 lg:p-14 rounded-2xl border-2 shadow-lg"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E5E7EB",
        }}
      >
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="h-1 rounded-full"
              style={{
                width: "50px",
                background: "linear-gradient(90deg, #D4A574, transparent)",
              }}
            />
            <h2
              className="text-3xl font-bold"
              style={{
                background: "linear-gradient(135deg, #7C5A3B 0%, #8B6F47 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Package Details
            </h2>
          </div>
        </div>

        {/* Varied Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  isEven
                    ? "border-2"
                    : "border-2 shadow-md"
                }`}
                style={{
                  backgroundColor: isEven ? "#FDFBF8" : "#FFFFFF",
                  borderColor: isEven ? "#E5E7EB" : "#D4A574",
                }}
              >
                {/* Hover Gradient Effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(135deg, rgba(212, 165, 116, 0.05) 0%, transparent 100%)",
                  }}
                />

                <div className="relative flex items-start gap-4">
                  {/* Icon with Gradient Background */}
                  <div
                    className="p-3 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: isEven
                        ? "linear-gradient(135deg, #D4A574 0%, #C89564 100%)"
                        : "linear-gradient(135deg, #F5E6D3 0%, #E8D4B8 100%)",
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: isEven ? "#FFFFFF" : "#7C5A3B" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-bold mb-2 uppercase tracking-wider"
                      style={{ color: "#8B6F47" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-lg font-bold"
                      style={{ color: "#7C5A3B" }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

