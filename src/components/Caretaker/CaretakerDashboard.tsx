import React from "react";
import { useCaretakerDashboard } from "@/hooks/caretaker/useCaretakerDashboard";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/env";

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

  const { basicInfo, dailyWage, income, totalTrips, upcomingTripsCount, completedTripsCount, nextTrip } =
    data;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>
          Caretaker Dashboard
        </h1>
        <p className="text-sm" style={{ color: "#8B6F47" }}>
          Overview of your income, trips and upcoming assignments.
        </p>
      </header>

      {/* Top stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border px-4 py-3" style={{ borderColor: "#E4D4C3", backgroundColor: "#FFF9F3" }}>
          <div className="text-xs font-medium" style={{ color: "#A1865A" }}>
            Daily wage
          </div>
          <div className="mt-1 text-xl font-semibold" style={{ color: "#7C5A3B" }}>
            ₹{dailyWage.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl border px-4 py-3" style={{ borderColor: "#E4D4C3", backgroundColor: "#FFF9F3" }}>
          <div className="text-xs font-medium" style={{ color: "#A1865A" }}>
            Total income
          </div>
          <div className="mt-1 text-xl font-semibold" style={{ color: "#7C5A3B" }}>
            ₹{income.totalIncome.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl border px-4 py-3" style={{ borderColor: "#E4D4C3", backgroundColor: "#FFF9F3" }}>
          <div className="text-xs font-medium" style={{ color: "#A1865A" }}>
            This month
          </div>
          <div className="mt-1 text-xl font-semibold" style={{ color: "#7C5A3B" }}>
            ₹{income.monthlyIncome.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl border px-4 py-3" style={{ borderColor: "#E4D4C3", backgroundColor: "#FFF9F3" }}>
          <div className="text-xs font-medium" style={{ color: "#A1865A" }}>
            This year
          </div>
          <div className="mt-1 text-xl font-semibold" style={{ color: "#7C5A3B" }}>
            ₹{income.yearlyIncome.toLocaleString()}
          </div>
        </div>
      </section>

      {/* Trips summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border px-4 py-3" style={{ borderColor: "#E4D4C3" }}>
          <div className="text-xs font-medium" style={{ color: "#A1865A" }}>
            Total trips
          </div>
          <div className="mt-1 text-2xl font-semibold" style={{ color: "#7C5A3B" }}>
            {totalTrips}
          </div>
        </div>

        <div className="rounded-xl border px-4 py-3" style={{ borderColor: "#E4D4C3" }}>
          <div className="text-xs font-medium" style={{ color: "#A1865A" }}>
            Upcoming trips
          </div>
          <div className="mt-1 text-2xl font-semibold" style={{ color: "#7C5A3B" }}>
            {upcomingTripsCount}
          </div>
        </div>

        <div className="rounded-xl border px-4 py-3" style={{ borderColor: "#E4D4C3" }}>
          <div className="text-xs font-medium" style={{ color: "#A1865A" }}>
            Completed trips
          </div>
          <div className="mt-1 text-2xl font-semibold" style={{ color: "#7C5A3B" }}>
            {completedTripsCount}
          </div>
        </div>
      </section>

      {/* Upcoming trip + assigned trips link */}
      <section className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-4">
        <div className="rounded-xl border p-4" style={{ borderColor: "#E4D4C3" }}>
          <div className="flex items-center justify-between mb-2">
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
            <div className="mt-2 space-y-1 text-sm" style={{ color: "#4B3A29" }}>
              <div className="font-medium">{nextTrip.packageName}</div>
              <div>Client: {nextTrip.clientName}</div>
              <div>
                {new Date(nextTrip.startDate).toLocaleDateString()} -{" "}
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

        <div className="rounded-xl border p-4" style={{ borderColor: "#E4D4C3", backgroundColor: "#FFF9F3" }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: "#7C5A3B" }}>
            Profile
          </h2>
          <p className="text-sm" style={{ color: "#4B3A29" }}>
            {basicInfo.firstName} {basicInfo.lastName}
          </p>
          <p className="text-xs mt-1" style={{ color: "#A1865A" }}>
            {basicInfo.email}
          </p>
        </div>
      </section>
    </div>
  );
};

