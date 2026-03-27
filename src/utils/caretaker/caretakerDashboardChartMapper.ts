import type { BarItem, DonutSlice } from "@/components/dashboard/DashboardPrimitives";
import type { CaretakerDashboardIncome, CaretakerDashboardResponse } from "@/services/caretaker/caretakerService";

/**
 * Pure view-model helpers: chart props derived only from dashboard aggregates (no API changes).
 */

export function mapTripMixToDonutSlices(
  data: Pick<CaretakerDashboardResponse, "totalTrips" | "upcomingTripsCount" | "completedTripsCount">
): DonutSlice[] {
  const { totalTrips, upcomingTripsCount, completedTripsCount } = data;
  const other = Math.max(0, totalTrips - upcomingTripsCount - completedTripsCount);
  const slices: DonutSlice[] = [];
  if (upcomingTripsCount > 0) {
    slices.push({ label: "Upcoming", value: upcomingTripsCount, color: "#2563eb" });
  }
  if (completedTripsCount > 0) {
    slices.push({ label: "Completed", value: completedTripsCount, color: "#059669" });
  }
  if (other > 0) {
    slices.push({ label: "Other", value: other, color: "#c084fc" });
  }
  return slices;
}

export function mapIncomeToComparisonBars(income: CaretakerDashboardIncome): BarItem[] {
  return [
    { label: "Total income", value: income.totalIncome, color: "#b45309" },
    { label: "This month", value: income.monthlyIncome, color: "#ea580c" },
    { label: "This year", value: income.yearlyIncome, color: "#f59e0b" },
  ];
}
