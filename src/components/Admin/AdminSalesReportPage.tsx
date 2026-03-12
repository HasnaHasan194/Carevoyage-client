import React, { useState, useMemo } from "react";
import { useAdminSalesReport } from "@/hooks/admin/useAdminSalesReport";
import { adminApi, type GetSalesReportParams } from "@/services/admin/adminService";
import { Loader2, FileText, FileSpreadsheet, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const CREAM = {
  bg: "#FAF7F2",
  card: "#FFFEFB",
  border: "#E8E2D9",
  muted: "#8B7355",
  primary: "#6B5344",
  accent: "#A08060",
};

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const AdminSalesReportPage: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);

  const params: GetSalesReportParams | undefined = useMemo(() => {
    const start = startDate.trim() || undefined;
    const end = endDate.trim() || undefined;
    if (!start && !end) return undefined;
    return { startDate: start, endDate: end };
  }, [startDate, endDate]);

  const { data, isLoading, isError } = useAdminSalesReport(params);

  const handleExportPdf = async () => {
    setExporting("pdf");
    try {
      const blob = await adminApi.exportSalesReportPdf(params);
      const name = `admin-sales-report-${params?.startDate ?? "all"}-${params?.endDate ?? "all"}.pdf`;
      downloadBlob(blob, name);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = async () => {
    setExporting("excel");
    try {
      const blob = await adminApi.exportSalesReportExcel(params);
      const name = `admin-sales-report-${params?.startDate ?? "all"}-${params?.endDate ?? "all"}.xlsx`;
      downloadBlob(blob, name);
      toast.success("Excel downloaded");
    } catch {
      toast.error("Failed to download Excel");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div
      className="min-h-screen p-6 lg:p-8"
      style={{ backgroundColor: CREAM.bg }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: CREAM.primary }}
        >
          Sales Report
        </h1>
        <p className="text-sm" style={{ color: CREAM.muted }}>
          Platform-wide sales performance. Filter by date range and export to PDF or Excel.
        </p>

        <div
          className="rounded-xl border p-4 flex flex-wrap items-end gap-4"
          style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: CREAM.accent }} />
            <label className="text-sm font-medium" style={{ color: CREAM.muted }}>
              Start date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: CREAM.border }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium" style={{ color: CREAM.muted }}>
              End date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: CREAM.border }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportPdf}
              disabled={!!exporting}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{ borderColor: CREAM.border, color: CREAM.primary }}
            >
              {exporting === "pdf" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              disabled={!!exporting}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{ borderColor: CREAM.border, color: CREAM.primary }}
            >
              {exporting === "excel" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4" />
              )}
              Export Excel
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: CREAM.accent }} />
          </div>
        )}

        {isError && (
          <p className="text-sm" style={{ color: "#9D2B2B" }}>
            Failed to load sales report.
          </p>
        )}

        {data && !isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="rounded-xl border p-4"
                style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
              >
                <p className="text-sm font-medium" style={{ color: CREAM.muted }}>
                  Total bookings
                </p>
                <p className="text-2xl font-semibold" style={{ color: CREAM.primary }}>
                  {data.summary.totalBookings}
                </p>
              </div>
              <div
                className="rounded-xl border p-4"
                style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
              >
                <p className="text-sm font-medium" style={{ color: CREAM.muted }}>
                  Total revenue
                </p>
                <p className="text-2xl font-semibold" style={{ color: CREAM.primary }}>
                  {data.summary.currency.toUpperCase()} {data.summary.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {data.topPackages.length > 0 && (
              <div
                className="rounded-xl border overflow-hidden"
                style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
              >
                <h2 className="px-4 py-3 text-sm font-semibold border-b" style={{ color: CREAM.primary, borderColor: CREAM.border }}>
                  Top packages
                </h2>
                <ul className="divide-y" style={{ borderColor: CREAM.border }}>
                  {data.topPackages.map((p, i) => (
                    <li key={p.packageId} className="px-4 py-2 flex justify-between text-sm">
                      <span style={{ color: CREAM.primary }}>{i + 1}. {p.packageName}</span>
                      <span style={{ color: CREAM.muted }}>{p.bookingCount} bookings, {p.revenue.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.topAgencies.length > 0 && (
              <div
                className="rounded-xl border overflow-hidden"
                style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
              >
                <h2 className="px-4 py-3 text-sm font-semibold border-b" style={{ color: CREAM.primary, borderColor: CREAM.border }}>
                  Top agencies
                </h2>
                <ul className="divide-y" style={{ borderColor: CREAM.border }}>
                  {data.topAgencies.map((a, i) => (
                    <li key={a.agencyId} className="px-4 py-2 flex justify-between text-sm">
                      <span style={{ color: CREAM.primary }}>{i + 1}. {a.agencyName}</span>
                      <span style={{ color: CREAM.muted }}>{a.bookingCount} bookings, {a.revenue.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.rows.length > 0 && (
              <div
                className="rounded-xl border overflow-hidden overflow-x-auto"
                style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
              >
                <h2 className="px-4 py-3 text-sm font-semibold border-b" style={{ color: CREAM.primary, borderColor: CREAM.border }}>
                  Sales details
                </h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: CREAM.border }}>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: CREAM.muted }}>Booking</th>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: CREAM.muted }}>Package</th>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: CREAM.muted }}>Agency</th>
                      <th className="text-right px-4 py-2 font-medium" style={{ color: CREAM.muted }}>Amount</th>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: CREAM.muted }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.slice(0, 50).map((r) => (
                      <tr key={r.bookingId} className="border-b" style={{ borderColor: CREAM.border }}>
                        <td className="px-4 py-2" style={{ color: CREAM.primary }}>{String(r.bookingId).slice(-8)}</td>
                        <td className="px-4 py-2" style={{ color: CREAM.primary }}>{r.packageName}</td>
                        <td className="px-4 py-2" style={{ color: CREAM.primary }}>{r.agencyName}</td>
                        <td className="px-4 py-2 text-right" style={{ color: CREAM.primary }}>{r.totalAmount} {r.currency}</td>
                        <td className="px-4 py-2" style={{ color: CREAM.muted }}>{r.createdAt.slice(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.rows.length > 50 && (
                  <p className="px-4 py-2 text-sm" style={{ color: CREAM.muted }}>
                    Showing 50 of {data.rows.length} rows. Export for full data.
                  </p>
                )}
              </div>
            )}

            {data.summary.totalBookings === 0 && (
              <p className="text-sm" style={{ color: CREAM.muted }}>
                No confirmed bookings in the selected date range.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
