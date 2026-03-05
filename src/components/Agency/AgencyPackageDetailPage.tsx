import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/User/button";
import { useGetPackageById } from "@/hooks/agency/useAgencyPackages";
import { ROUTES } from "@/config/env";
import { Loader2, ArrowLeft, Calendar, MapPin, Users, IndianRupee, BookOpen, Check, X, ImageIcon } from "lucide-react";

const formatDate = (value: string | undefined) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const getStatusBadge = (status: string) => {
  const styles: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    draft: { bg: "#FEF3C7", text: "#92400E", label: "Draft" },
    published: { bg: "#D1FAE5", text: "#065F46", label: "Published" },
    completed: { bg: "#DBEAFE", text: "#1E40AF", label: "Completed" },
    cancelled: { bg: "#FEE2E2", text: "#991B1B", label: "Cancelled" },
  };
  const style = styles[status] ?? {
    bg: "#E5E7EB",
    text: "#374151",
    label: status,
  };
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
};

export function AgencyPackageDetailPage() {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();

  const { data: pkg, isLoading, isError } = useGetPackageById(packageId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#D4A574" }} />
          <p className="text-sm" style={{ color: "#8B6F47" }}>
            Loading package details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !pkg) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.AGENCY_PACKAGES)}
            className="border-[#D4A574] text-[#8B6F47] hover:bg-[#F5E6D3]"
          >
            Back to Packages
          </Button>
          <p className="text-sm" style={{ color: "#8B6F47" }}>
            We couldn&apos;t load this package. It may have been removed or you
            may not have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#8B6F47] hover:bg-[#F5E6D3] hover:text-[#7C5A3B]"
            onClick={() => navigate(ROUTES.AGENCY_PACKAGES)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Packages
          </Button>
          <Button
            className="bg-[#C4956A] text-white hover:bg-[#B4855A] shadow-sm"
            onClick={() => navigate(`${ROUTES.AGENCY_PACKAGE_BOOKINGS}/${pkg.id}`)}
          >
            View bookings
          </Button>
        </div>

        {/* Hero card */}
        <div
          className="rounded-2xl overflow-hidden shadow-lg border"
          style={{ backgroundColor: "#FFFDF9", borderColor: "#E8DFD4" }}
        >
          {pkg.images && pkg.images.length > 0 ? (
            <div className="aspect-video bg-[#F5E6D3]">
              <img
                src={pkg.images[0]}
                alt={pkg.PackageName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="aspect-video flex items-center justify-center"
              style={{ backgroundColor: "#F5E6D3" }}
            >
              <ImageIcon className="w-12 h-12 opacity-40" style={{ color: "#8B6F47" }} />
            </div>
          )}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {getStatusBadge(pkg.status)}
              <span
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{ backgroundColor: "#F5E6D3", color: "#7C5A3B" }}
              >
                {pkg.category}
              </span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-4"
              style={{ color: "#5C4033" }}
            >
              {pkg.PackageName}
            </h1>
            <p className="text-[#6B5B4F] leading-relaxed max-w-3xl">
              {pkg.description}
            </p>
          </div>
        </div>

        {/* Key details grid */}
        <div
          className="rounded-2xl border p-5 sm:p-6 shadow-sm"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E8DFD4" }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "#8B6F47" }}>
            Trip details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg p-2 shrink-0" style={{ backgroundColor: "#FDF8F3" }}>
                <Calendar className="w-5 h-5" style={{ color: "#C4956A" }} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8B6F47" }}>
                  Start date
                </p>
                <p className="font-semibold mt-0.5" style={{ color: "#5C4033" }}>
                  {formatDate(pkg.startDate)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg p-2 shrink-0" style={{ backgroundColor: "#FDF8F3" }}>
                <Calendar className="w-5 h-5" style={{ color: "#C4956A" }} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8B6F47" }}>
                  End date
                </p>
                <p className="font-semibold mt-0.5" style={{ color: "#5C4033" }}>
                  {formatDate(pkg.endDate)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg p-2 shrink-0" style={{ backgroundColor: "#FDF8F3" }}>
                <MapPin className="w-5 h-5" style={{ color: "#C4956A" }} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8B6F47" }}>
                  Meeting point
                </p>
                <p className="font-semibold mt-0.5" style={{ color: "#5C4033" }}>
                  {pkg.meetingPoint}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg p-2 shrink-0" style={{ backgroundColor: "#FDF8F3" }}>
                <Users className="w-5 h-5" style={{ color: "#C4956A" }} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8B6F47" }}>
                  Max group size
                </p>
                <p className="font-semibold mt-0.5" style={{ color: "#5C4033" }}>
                  {pkg.maxGroupSize} people
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <div className="rounded-lg p-2 shrink-0" style={{ backgroundColor: "#FDF8F3" }}>
                <IndianRupee className="w-5 h-5" style={{ color: "#C4956A" }} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8B6F47" }}>
                  Base price
                </p>
                <p className="font-semibold mt-0.5 text-lg" style={{ color: "#5C4033" }}>
                  ₹{pkg.basePrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary */}
        {pkg.itinerary && pkg.itinerary.days.length > 0 && (
          <div
            className="rounded-2xl border p-5 sm:p-6 shadow-sm"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E8DFD4" }}
          >
            <h2 className="flex items-center gap-2 text-base font-semibold mb-4" style={{ color: "#5C4033" }}>
              <BookOpen className="w-5 h-5" style={{ color: "#C4956A" }} />
              Itinerary
            </h2>
            <div className="space-y-4">
              {pkg.itinerary.days.map((day, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border-l-4 pl-4 pr-4 py-3"
                  style={{ borderLeftColor: "#C4956A", backgroundColor: "#FDFBF8", borderColor: "#E8DFD4" }}
                >
                  <h3 className="font-semibold mb-1" style={{ color: "#5C4033" }}>
                    Day {day.dayNumber}: {day.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B5B4F" }}>
                    {day.description}
                  </p>
                  {day.accommodation && (
                    <p className="text-xs mt-2" style={{ color: "#8B6F47" }}>
                      Accommodation: {day.accommodation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inclusions & Exclusions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            className="rounded-2xl border p-5 sm:p-6 shadow-sm"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E8DFD4" }}
          >
            <h2 className="flex items-center gap-2 text-base font-semibold mb-3" style={{ color: "#5C4033" }}>
              <Check className="w-5 h-5" style={{ color: "#059669" }} />
              Inclusions
            </h2>
            {pkg.inclusions.length > 0 ? (
              <ul className="space-y-2">
                {pkg.inclusions.map((inc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: "#6B5B4F" }}>
                    <span className="text-emerald-600 mt-0.5">•</span>
                    {inc}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: "#8B6F47" }}>None listed.</p>
            )}
          </div>
          <div
            className="rounded-2xl border p-5 sm:p-6 shadow-sm"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E8DFD4" }}
          >
            <h2 className="flex items-center gap-2 text-base font-semibold mb-3" style={{ color: "#5C4033" }}>
              <X className="w-5 h-5" style={{ color: "#B45309" }} />
              Exclusions
            </h2>
            {pkg.exclusions.length > 0 ? (
              <ul className="space-y-2">
                {pkg.exclusions.map((exc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: "#6B5B4F" }}>
                    <span className="mt-0.5" style={{ color: "#B45309" }}>•</span>
                    {exc}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: "#8B6F47" }}>None listed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

