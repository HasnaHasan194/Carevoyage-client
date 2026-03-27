import React, { useMemo } from "react";
import { useCaretakerDashboard } from "@/hooks/caretaker/useCaretakerDashboard";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/env";
import { DonutChart, HorizontalBars, SectionCard } from "@/components/dashboard/DashboardPrimitives";
import { mapIncomeToComparisonBars, mapTripMixToDonutSlices } from "@/utils/caretaker/caretakerDashboardChartMapper";
import type { CaretakerDashboardIncome } from "@/services/caretaker/caretakerService";

const EMPTY_INCOME: CaretakerDashboardIncome = {
  totalIncome: 0,
  monthlyIncome: 0,
  yearlyIncome: 0,
};

export const CaretakerDashboard: React.FC = () => {
  const { data, isLoading } = useCaretakerDashboard();

  const tripMixSlices = useMemo(
    () =>
      mapTripMixToDonutSlices({
        totalTrips: data?.totalTrips ?? 0,
        upcomingTripsCount: data?.upcomingTripsCount ?? 0,
        completedTripsCount: data?.completedTripsCount ?? 0,
      }),
    [data?.totalTrips, data?.upcomingTripsCount, data?.completedTripsCount]
  );
  const incomeComparisonBars = useMemo(
    () => mapIncomeToComparisonBars(data?.income ?? EMPTY_INCOME),
    [data?.income]
  );

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
    <div className="min-h-screen bg-linear-to-b from-amber-50/40 via-[#FDFBF8] to-white p-6 lg:p-8 space-y-6">
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

      {/* Charts: same aggregates as above; trip "Other" = total − upcoming − completed (min 0) */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <SectionCard
          title="Trip mix"
          className="xl:col-span-5"
          rightSlot={<span className="text-xs text-slate-500">Hover segments for values</span>}
        >
          <DonutChart theme="caretaker" slices={tripMixSlices} />
        </SectionCard>
        <SectionCard title="Income overview (₹)" className="xl:col-span-7">
          <HorizontalBars theme="caretaker" items={incomeComparisonBars} />
        </SectionCard>
      </section>

      <SectionCard
        title="Your assignments & profile"
        rightSlot={
          <Link to={ROUTES.CARETAKER_TRIPS} className="text-xs font-semibold text-amber-800 underline underline-offset-2">
            View all trips
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-amber-300/60 bg-linear-to-br from-amber-100 via-orange-50 to-amber-50 p-5 shadow-sm ring-1 ring-amber-200/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/80">Daily rate</p>
            <p className="mt-2 text-3xl font-bold text-amber-950">₹{dailyWage.toLocaleString()}</p>
            <p className="mt-3 text-xs leading-relaxed text-amber-900/65">Your configured rate per day on assigned care packages.</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:min-h-[180px]">
            <h3 className="text-sm font-semibold text-slate-800">Next assignment</h3>
            {nextTrip ? (
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{nextTrip.packageName}</p>
                <p>
                  <span className="text-slate-500">Client:</span> {nextTrip.clientName}
                </p>
                <p>
                  {new Date(nextTrip.startDate).toLocaleDateString()} – {new Date(nextTrip.endDate).toLocaleDateString()}
                </p>
                <p className="text-xs font-medium text-emerald-700">Status: {nextTrip.status}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">No upcoming trips scheduled. Check back when an agency assigns you.</p>
            )}
          </div>

          <div className="rounded-xl border border-[#E4D4C3] bg-[#FFF9F3] p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#7C5A3B]">Your profile</h3>
            <p className="mt-3 text-sm font-medium text-[#4B3A29]">
              {basicInfo.firstName} {basicInfo.lastName}
            </p>
            <p className="mt-1 text-xs text-[#A1865A]">{basicInfo.email}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

