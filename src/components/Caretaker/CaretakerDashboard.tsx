import React from "react";
import { Link } from "react-router-dom";
import { useCaretakerDashboard } from "@/hooks/caretaker/useCaretakerDashboard";
import { ROUTES } from "@/config/env";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/User/card";
import {
  Loader2,
  User,
  IndianRupee,
  Calendar,
  MapPin,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  Briefcase,
} from "lucide-react";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function VerificationBadge({
  status,
}: {
  status: "pending" | "verified" | "rejected";
}) {
  const config =
    status === "verified"
      ? { bg: "#DCFCE7", text: "#16A34A", icon: CheckCircle, label: "Verified" }
      : status === "rejected"
        ? { bg: "#FEE2E2", text: "#DC2626", icon: XCircle, label: "Rejected" }
        : { bg: "#FEF3C7", text: "#D97706", icon: Clock, label: "Pending" };
  const Icon = config.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

function AvailabilityBadge({
  status,
}: {
  status: "AVAILABLE" | "BUSY" | "INACTIVE";
}) {
  const config =
    status === "AVAILABLE"
      ? { bg: "#DCFCE7", text: "#16A34A" }
      : status === "BUSY"
        ? { bg: "#DBEAFE", text: "#2563EB" }
        : { bg: "#F3F4F6", text: "#6B7280" };
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {status}
    </span>
  );
}

export const CaretakerDashboard: React.FC = () => {
  const { data, isLoading, error } = useCaretakerDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2
            className="w-12 h-12 animate-spin mx-auto mb-4"
            style={{ color: "#D4A574" }}
          />
          <p style={{ color: "#7C5A3B" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <p className="text-xl font-semibold mb-2" style={{ color: "#7C5A3B" }}>
            Error loading dashboard
          </p>
          <p className="text-sm" style={{ color: "#8B6F47" }}>
            {(error as { message?: string })?.message ||
              "Failed to load dashboard data"}
          </p>
        </div>
      </div>
    );
  }

  const { basicInfo, dailyWage, income, totalTrips, upcomingTripsCount, completedTripsCount, nextTrip } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#8B6F47" }}>
          Overview of your activity and earnings
        </p>
      </div>

      {/* Basic info + daily wage */}
      <Card className="border-border shadow-sm bg-white mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {basicInfo.profileImage ? (
                <img
                  src={basicInfo.profileImage}
                  alt={`${basicInfo.firstName} ${basicInfo.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-2"
                  style={{ borderColor: "#F5E6D3" }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center border-2"
                  style={{ backgroundColor: "#F5E6D3", borderColor: "#E5DDD5" }}
                >
                  <User className="w-8 h-8" style={{ color: "#8B6F47" }} />
                </div>
              )}
              <div>
                <CardTitle className="text-lg" style={{ color: "#7C5A3B" }}>
                  {basicInfo.firstName} {basicInfo.lastName}
                </CardTitle>
                <CardDescription className="text-sm mt-0.5">
                  {basicInfo.email}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  <VerificationBadge status={basicInfo.verificationStatus} />
                  <AvailabilityBadge status={basicInfo.availabilityStatus} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl px-4 py-2 bg-[#FDFBF8] border" style={{ borderColor: "#E5DDD5" }}>
              <IndianRupee className="w-5 h-5" style={{ color: "#7C5A3B" }} />
              <span className="font-semibold" style={{ color: "#7C5A3B" }}>
                {formatCurrency(dailyWage)}
              </span>
              <span className="text-sm" style={{ color: "#8B6F47" }}>/ day</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Income overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total income", value: income.totalIncome },
          { label: "This week", value: income.weeklyIncome },
          { label: "This month", value: income.monthlyIncome },
          { label: "This year", value: income.yearlyIncome },
        ].map((item) => (
          <Card key={item.label} className="border-border shadow-sm bg-white">
            <CardContent className="pt-6">
              <p className="text-sm font-medium" style={{ color: "#8B6F47" }}>
                {item.label}
              </p>
              <p className="text-xl font-bold mt-1" style={{ color: "#7C5A3B" }}>
                {formatCurrency(item.value)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trip counts */}
      <Card className="border-border shadow-sm bg-white mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#7C5A3B" }}>
            <Briefcase className="w-5 h-5" />
            Trips
          </CardTitle>
          <CardDescription>Summary of your assigned trips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg p-4 bg-[#FAF7F2] border" style={{ borderColor: "#E5DDD5" }}>
              <p className="text-sm" style={{ color: "#8B6F47" }}>Total trips</p>
              <p className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>{totalTrips}</p>
            </div>
            <div className="rounded-lg p-4 bg-[#FAF7F2] border" style={{ borderColor: "#E5DDD5" }}>
              <p className="text-sm" style={{ color: "#8B6F47" }}>Upcoming</p>
              <p className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>{upcomingTripsCount}</p>
            </div>
            <div className="rounded-lg p-4 bg-[#FAF7F2] border" style={{ borderColor: "#E5DDD5" }}>
              <p className="text-sm" style={{ color: "#8B6F47" }}>Completed</p>
              <p className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>{completedTripsCount}</p>
            </div>
          </div>
          <Link
            to={ROUTES.CARETAKER_TRIPS}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
            style={{ color: "#7C5A3B" }}
          >
            View all assigned trips
            <ChevronRight className="w-4 h-4" />
          </Link>
        </CardContent>
      </Card>

      {/* Next trip */}
      <Card className="border-border shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#7C5A3B" }}>
            <Calendar className="w-5 h-5" />
            Next trip
          </CardTitle>
          <CardDescription>
            {nextTrip ? "Your nearest upcoming assignment" : "No upcoming trips"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {nextTrip ? (
            <div className="rounded-xl p-4 border bg-[#FDFBF8]" style={{ borderColor: "#E5DDD5" }}>
              <p className="font-semibold" style={{ color: "#7C5A3B" }}>
                {nextTrip.packageName}
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: "#8B6F47" }}>
                <MapPin className="w-4 h-4 shrink-0" />
                Client: {nextTrip.clientName}
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm" style={{ color: "#8B6F47" }}>
                <span>Start: {formatDate(nextTrip.startDate)}</span>
                <span>End: {formatDate(nextTrip.endDate)}</span>
              </div>
              <div className="mt-2">
                <span
                  className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: "#E5DDD5", color: "#7C5A3B" }}
                >
                  {nextTrip.status}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm" style={{ color: "#8B6F47" }}>
              When you have an upcoming trip, it will appear here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
