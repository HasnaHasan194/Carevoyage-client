import React, { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";

interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  priceIncluded: boolean;
}

interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  activities: Activity[];
  accommodation: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  transfers: string[];
}

interface ItineraryAccordionProps {
  days: ItineraryDay[];
}

export const ItineraryAccordion: React.FC<ItineraryAccordionProps> = ({
  days,
}) => {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(
    new Set([1]) // First day expanded by default
  );

  const toggleDay = (dayNumber: number) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayNumber)) {
        newSet.delete(dayNumber);
      } else {
        newSet.add(dayNumber);
      }
      return newSet;
    });
  };

  if (!days || days.length === 0) {
    return (
      <div
        className="p-6 rounded-xl border"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E5E7EB",
        }}
      >
        <p style={{ color: "#8B6F47" }}>No itinerary available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background Decoration */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-5 blur-2xl"
        style={{ backgroundColor: "#D4A574" }}
      />

      <div
        className="relative p-10 md:p-12 lg:p-14 rounded-2xl border-2 shadow-xl"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E5E7EB",
        }}
      >
        {/* Section Header with Modern Design */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div
              className="h-1 rounded-full"
              style={{
                width: "60px",
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
              Itinerary
            </h2>
          </div>
          <p className="text-sm" style={{ color: "#8B6F47" }}>
            Explore each day of your journey
          </p>
        </div>
      <div className="space-y-4">
        {days.map((day) => {
          const isExpanded = expandedDays.has(day.dayNumber);
          return (
            <div
              key={day.dayNumber}
              className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                isExpanded ? "shadow-lg" : "shadow-md"
              }`}
              style={{
                borderColor: isExpanded ? "#D4A574" : "#E5E7EB",
                backgroundColor: isExpanded ? "#FDFBF8" : "#FFFFFF",
                transform: isExpanded ? "scale(1.01)" : "scale(1)",
              }}
            >
              {/* Day Header with Enhanced Design */}
              <button
                onClick={() => toggleDay(day.dayNumber)}
                className="w-full p-6 md:p-7 flex items-center justify-between transition-all hover:bg-[#FDFBF8] group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 transition-all group-hover:scale-110 ${
                      isExpanded ? "shadow-lg" : "shadow-md"
                    }`}
                    style={{
                      background: isExpanded
                        ? "linear-gradient(135deg, #D4A574 0%, #C89564 100%)"
                        : "linear-gradient(135deg, #F5E6D3 0%, #E8D4B8 100%)",
                      color: isExpanded ? "#FFFFFF" : "#7C5A3B",
                    }}
                  >
                    {day.dayNumber}
                  </div>
                  <div className="text-left">
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ color: "#7C5A3B" }}
                    >
                      {day.title}
                    </h3>
                    <p
                      className="text-sm line-clamp-1"
                      style={{ color: "#8B6F47" }}
                    >
                      {day.description}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform shrink-0 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  style={{ color: "#8B6F47" }}
                />
              </button>

              {/* Day Content */}
              {isExpanded && (
                <div className="px-6 md:px-7 pb-6 md:pb-7 space-y-5 border-t border-[#E5E7EB] pt-6 md:pt-7">
                  {/* Description */}
                  <div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#8B6F47" }}
                    >
                      {day.description}
                    </p>
                  </div>

                  {/* Activities */}
                  {day.activities && day.activities.length > 0 && (
                    <div>
                      <h4
                        className="text-sm font-semibold mb-3 uppercase tracking-wide"
                        style={{ color: "#7C5A3B" }}
                      >
                        Activities
                      </h4>
                      <div className="space-y-3">
                        {day.activities.map((activity) => (
                          <div
                            key={activity.id}
                            className="p-3 rounded-lg border"
                            style={{
                              backgroundColor: "#FFFFFF",
                              borderColor: "#E5E7EB",
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5
                                    className="font-semibold text-sm"
                                    style={{ color: "#7C5A3B" }}
                                  >
                                    {activity.name}
                                  </h5>
                                  {activity.priceIncluded && (
                                    <span
                                      className="px-2 py-0.5 rounded text-xs font-medium"
                                      style={{
                                        backgroundColor: "#F5E6D3",
                                        color: "#7C5A3B",
                                      }}
                                    >
                                      Included
                                    </span>
                                  )}
                                </div>
                                {activity.description && (
                                  <p
                                    className="text-xs mb-2"
                                    style={{ color: "#8B6F47" }}
                                  >
                                    {activity.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 text-xs">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" style={{ color: "#8B6F47" }} />
                                    <span style={{ color: "#8B6F47" }}>
                                      {activity.duration} min
                                    </span>
                                  </div>
                                  <span
                                    className="px-2 py-0.5 rounded text-xs"
                                    style={{
                                      backgroundColor: "#F5E6D3",
                                      color: "#7C5A3B",
                                    }}
                                  >
                                    {activity.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accommodation */}
                  {day.accommodation && (
                    <div>
                      <h4
                        className="text-sm font-semibold mb-2 uppercase tracking-wide"
                        style={{ color: "#7C5A3B" }}
                      >
                        Accommodation
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: "#8B6F47" }}
                      >
                        {day.accommodation}
                      </p>
                    </div>
                  )}

                  {/* Meals */}
                  {(day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                    <div>
                      <h4
                        className="text-sm font-semibold mb-2 uppercase tracking-wide"
                        style={{ color: "#7C5A3B" }}
                      >
                        Meals
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {day.meals.breakfast && (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: "#F5E6D3",
                              color: "#7C5A3B",
                            }}
                          >
                            Breakfast
                          </span>
                        )}
                        {day.meals.lunch && (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: "#F5E6D3",
                              color: "#7C5A3B",
                            }}
                          >
                            Lunch
                          </span>
                        )}
                        {day.meals.dinner && (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: "#F5E6D3",
                              color: "#7C5A3B",
                            }}
                          >
                            Dinner
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Transfers */}
                  {day.transfers && day.transfers.length > 0 && (
                    <div>
                      <h4
                        className="text-sm font-semibold mb-2 uppercase tracking-wide"
                        style={{ color: "#7C5A3B" }}
                      >
                        Transfers
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {day.transfers.map((transfer, index) => (
                          <li
                            key={index}
                            className="text-sm"
                            style={{ color: "#8B6F47" }}
                          >
                            {transfer}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};

