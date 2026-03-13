import React, { useState } from "react";
import { useCaretakerTrips } from "@/hooks/caretaker/useCaretakerTrips";

export const CaretakerTripsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = useCaretakerTrips({ page, limit });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  const canPrev = page > 1;
  const canNext = totalPages > 0 && page < totalPages;

  return (
    <div className="p-6 lg:p-8 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>
          Assigned Trips
        </h1>
        <p className="text-sm" style={{ color: "#8B6F47" }}>
          View your upcoming and completed trips with income details.
        </p>
      </header>

      <div className="rounded-xl border" style={{ borderColor: "#E4D4C3", backgroundColor: "#FFF9F3" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left" style={{ backgroundColor: "#F5E8D8", color: "#5C432D" }}>
                <th className="px-4 py-2">Package</th>
                <th className="px-4 py-2">Client</th>
                <th className="px-4 py-2">Start</th>
                <th className="px-4 py-2">End</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Daily wage</th>
                <th className="px-4 py-2">Total income</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-4" style={{ color: "#8B6F47" }}>
                    Loading trips…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-4" style={{ color: "#8B6F47" }}>
                    You have no assigned trips yet.
                  </td>
                </tr>
              ) : (
                items.map((trip) => (
                  <tr key={trip.bookingId} className="border-t" style={{ borderColor: "#E4D4C3", color: "#4B3A29" }}>
                    <td className="px-4 py-2 whitespace-nowrap">{trip.packageName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{trip.clientName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(trip.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(trip.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs" style={{ color: "#A1865A" }}>
                      {trip.status}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      ₹{trip.dailyWage.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap font-medium">
                      ₹{trip.totalIncome.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "#E4D4C3" }}>
            <button
              type="button"
              onClick={() => canPrev && setPage(page - 1)}
              disabled={!canPrev}
              className="px-3 py-1 rounded text-xs border disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: "#E4D4C3",
                color: canPrev ? "#7C5A3B" : "#A1865A",
              }}
            >
              Previous
            </button>
            <div className="text-xs" style={{ color: "#8B6F47" }}>
              Page {page} of {totalPages}
            </div>
            <button
              type="button"
              onClick={() => canNext && setPage(page + 1)}
              disabled={!canNext}
              className="px-3 py-1 rounded text-xs border disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: "#E4D4C3",
                color: canNext ? "#7C5A3B" : "#A1865A",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

