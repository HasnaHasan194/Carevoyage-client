import React from "react";
import { useCaretakerDashboard } from "@/hooks/caretaker/useCaretakerDashboard";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/env";
import { CalendarDays, Briefcase, DollarSign, TrendingUp } from "lucide-react";

export const CaretakerDashboard: React.FC = () => {
  const { data, isLoading } = useCaretakerDashboard();

  if (isLoading && !data) {
    return (
      <div className="p-6 lg:p-8">
        <p style={{ color: "#8B6F47" }}>Loading dashboard…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 lg:p-8">
        <p style={{ color: "#8B6F47" }}>No dashboard data available.</p>
      </div>
    );
  }

  const {
    basicInfo,
    dailyWage,
    income,
    totalTrips,
    upcomingTripsCount,
    completedTripsCount,
    nextTrip,
  } = data;

  return (
    <div
      className="min-h-screen p-6 lg:p-8"
      style={{
        background: "linear-gradient(135deg, #FFF8EC 0%, #F6EEE5 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#7C5A3B" }}>
              Caretaker Dashboard
            </h1>
            <p className="text-sm" style={{ color: "#8B6F47" }}>
              Overview of your income, trips and upcoming assignments.
            </p>
          </div>
          <div className="rounded-2xl px-4 py-3 shadow-sm border flex items-center gap-3"
               style={{ borderColor: "#E4D4C3", backgroundColor: "#FFFBF5" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg,#D4A574,#C89564)", color: "#FFFBF5" }}>
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase" style={{ color: "#A1865A" }}>
                Daily wage
              </p>
              <p className="text-lg font-semibold" style={{ color: "#7C5A3B" }}>
                ₹{dailyWage.toLocaleString()}
              </p>
            </div>
          </div>
        </header>

        {/* Top stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border px-4 py-3 shadow-sm"
               style={{ borderColor: "#E4D4C3", background: "linear-gradient(135deg,#FFF5E5,#FFE9CC)" }}>
            <div className="flex items-center justify-between text-xs font-medium" style={{ color: "#A1865A" }}>
              <span>Total income</span>
              <DollarSign className="w-3 h-3" />
            </div>
            <div className="mt-1 text-xl font-semibold" style={{ color: "#7C5A3B" }}>
              ₹{income.totalIncome.toLocaleString()}
            </div>
          </div>

          <div className="rounded-2xl border px-4 py-3 shadow-sm"
               style={{ borderColor: "#E4D4C3", background: "linear-gradient(135deg,#FDF5FF,#F6E6FF)" }}>
            <div className="flex items-center justify-between text-xs font-medium" style={{ color: "#A1865A" }}>
              <span>This month</span>
              <CalendarDays className="w-3 h-3" />
            </div>
            <div className="mt-1 text-xl font-semibold" style={{ color: "#7C5A3B" }}>
              ₹{income.monthlyIncome.toLocaleString()}
            </div>
          </div>

          <div className="rounded-2xl border px-4 py-3 shadow-sm"
               style={{ borderColor: "#E4D4C3", background: "linear-gradient(135deg,#EAF9FF,#D7F0FF)" }}>
            <div className="flex items-center justify-between text-xs font-medium" style={{ color: "#A1865A" }}>
              <span>This year</span>
              <TrendingUp className="w-3 h-3" />
            </div>
            <div className="mt-1 text-xl font-semibold" style={{ color: "#7C5A3B" }}>
              ₹{income.yearlyIncome.toLocaleString()}
            </div>
          </div>

          <div className="rounded-2xl border px-4 py-3 shadow-sm"
               style={{ borderColor: "#E4D4C3", backgroundColor: "#FFFBF5" }}>
            <div className="text-xs font-medium" style={{ color: "#A1865A" }}>
              Total trips
            </div>
            <div className="mt-1 text-2xl font-semibold" style={{ color: "#7C5A3B" }}>
              {totalTrips}
            </div>
          </div>
        </section>

        {/* Trips summary */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border px-4 py-3 shadow-sm"
               style={{ borderColor: "#E4D4C3", backgroundColor: "#FFFEFB" }}>
            <div className="text-xs font-medium" style={{ color: "#A1865A" }}>
              Upcoming trips
            </div>
            <div className="mt-1 text-2xl font-semibold" style={{ color: "#7C5A3B" }}>
              {upcomingTripsCount}
            </div>
          </div>

          <div className="rounded-2xl border px-4 py-3 shadow-sm"
               style={{ borderColor: "#E4D4C3", backgroundColor: "#FFFEFB" }}>
            <div className="text-xs font-medium" style={{ color: "#A1865A" }}>
              Completed trips
            </div>
            <div className="mt-1 text-2xl font-semibold" style={{ color: "#7C5A3B" }}>
              {completedTripsCount}
            </div>
          </div>
        </section>

        {/* Upcoming trip + profile */}
        <section className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-4">
          <div className="rounded-2xl border p-5 shadow-sm"
               style={{ borderColor: "#E4D4C3", backgroundColor: "#FFFBF5" }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold" style={{ color: "#7C5A3B" }}>
                Next upcoming trip
              </h2>
              <Link
                to={ROUTES.CARETAKER_TRIPS}
                className="text-xs font-medium underline"
                style={{ color: "#8B6F47" }}
              >
                View assigned trips
              </Link>
            </div>
            {nextTrip ? (
              <div className="mt-1 space-y-1.5 text-sm" style={{ color: "#4B3A29" }}>
                <div className="font-medium">{nextTrip.packageName}</div>
                <div>Client: {nextTrip.clientName}</div>
                <div>
                  {new Date(nextTrip.startDate).toLocaleDateString()} –{" "}
                  {new Date(nextTrip.endDate).toLocaleDateString()}
                </div>
                <div className="text-xs" style={{ color: "#A1865A" }}>
                  Status: {nextTrip.status}
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#8B6F47" }}>
                You have no upcoming trips scheduled.
              </p>
            )}
          </div>

          <div className="rounded-2xl border p-5 shadow-sm"
               style={{ borderColor: "#E4D4C3", background: "linear-gradient(135deg,#FFF5E5,#FFEFE0)" }}>
            <h2 className="text-sm font-semibold mb-2" style={{ color: "#7C5A3B" }}>
              Profile
            </h2>
            <p className="text-sm font-medium" style={{ color: "#4B3A29" }}>
              {basicInfo.firstName} {basicInfo.lastName}
            </p>
            <p className="text-xs mt-1" style={{ color: "#A1865A" }}>
              {basicInfo.email}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

