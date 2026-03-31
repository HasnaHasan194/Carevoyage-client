import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/User/button";
import { agencyApi } from "@/services/agency/agencyService";
import { getAgencyReviews } from "@/services/agency/agencyReviewsService";
import { walletService } from "@/services/User/walletService";
import type { AgencySalesReportResponse } from "@/services/admin/adminService";
import {
  DonutChart,
  GroupedBars,
  HorizontalBars,
  LineChart,
  LoadingGrid,
  SectionCard,
  SimpleTable,
  StatCard,
  type GroupedBarItem,
  type SeriesPoint,
} from "@/components/dashboard/DashboardPrimitives";
import { Download } from "lucide-react";

type PeriodKey = "7D" | "30D" | "90D" | "CUSTOM";

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function buildRange(period: PeriodKey, customStart: string, customEnd: string) {
  if (period === "CUSTOM" && customStart && customEnd) {
    return { startDate: customStart, endDate: customEnd };
  }
  const end = new Date();
  const days = period === "7D" ? 7 : period === "30D" ? 30 : 90;
  const start = addDays(end, -(days - 1));
  return { startDate: formatDate(start), endDate: formatDate(end) };
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function AgencyHome() {
  const [period, setPeriod] = useState<PeriodKey>("30D");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [comparePrevious, setComparePrevious] = useState(true);
  const [exporting, setExporting] = useState(false);

  const range = useMemo(() => buildRange(period, customStart, customEnd), [period, customStart, customEnd]);
  const previousRange = useMemo(() => {
    const start = new Date(range.startDate);
    const end = new Date(range.endDate);
    const span = Math.max(Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1, 1);
    const previousEnd = addDays(start, -1);
    const previousStart = addDays(previousEnd, -(span - 1));
    return { startDate: formatDate(previousStart), endDate: formatDate(previousEnd) };
  }, [range.endDate, range.startDate]);

  const reportQuery = useQuery<AgencySalesReportResponse>({
    queryKey: ["agency", "dashboard", "sales", range],
    queryFn: () => agencyApi.getSalesReport(range),
  });
  const previousReportQuery = useQuery<AgencySalesReportResponse>({
    queryKey: ["agency", "dashboard", "sales", "previous", previousRange],
    queryFn: () => agencyApi.getSalesReport(previousRange),
    enabled: comparePrevious,
  });
  const reviewsQuery = useQuery({
    queryKey: ["agency", "dashboard", "reviews"],
    queryFn: () => getAgencyReviews(1, 50),
  });
  const refundsQuery = useQuery({
    queryKey: ["agency", "dashboard", "refunds"],
    queryFn: () => agencyApi.listRefundRequests({ page: 1, limit: 200 }),
  });
  const caretakerReqQuery = useQuery({
    queryKey: ["agency", "dashboard", "caretaker-requests"],
    queryFn: () => agencyApi.listCaretakerRequests({ page: 1, limit: 200 }),
  });
  const walletQuery = useQuery({
    queryKey: ["agency", "dashboard", "wallet"],
    queryFn: () => walletService.getMyWallet(),
  });
  const walletTxQuery = useQuery({
    queryKey: ["agency", "dashboard", "wallet-transactions"],
    queryFn: () => walletService.getMyTransactions({ page: 1, limit: 30, type: "all", sort: "newest" }),
  });

  const report = reportQuery.data;
  const previousReport = previousReportQuery.data;
  const totalRevenue = report?.summary.totalRevenue ?? 0;
  const totalBookings = report?.summary.totalBookings ?? 0;
  const previousRevenue = previousReport?.summary.totalRevenue ?? 0;
  const previousBookings = previousReport?.summary.totalBookings ?? 0;
  const revenueChange = percentageChange(totalRevenue, previousRevenue);
  const bookingsChange = percentageChange(totalBookings, previousBookings);

  const refundRate = useMemo(() => {
    const requested = refundsQuery.data?.requests.length ?? 0;
    if (!totalBookings) return 0;
    return (requested / totalBookings) * 100;
  }, [refundsQuery.data?.requests.length, totalBookings]);

  const statusSlices = useMemo(() => {
    const counts = {
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    (report?.rows ?? []).forEach((row) => {
      // Sales-report rows come from Booking.status (see backend booking schema/entity).
      // Use exact normalization instead of substring matching to avoid misclassification.
      const status = String(row.status ?? "").trim().toLowerCase();

      if (status === "confirmed") counts.confirmed += 1;
      else if (status === "completed") counts.completed += 1;
      else if (status === "cancelled_by_user" || status === "refunded") counts.cancelled += 1;
      // Intentionally ignore pending_payment (requested to remove from UI)
    });

    return [
      { label: "confirmed", value: counts.confirmed, color: "#3b82f6" },
      { label: "completed", value: counts.completed, color: "#10b981" },
      { label: "cancelled", value: counts.cancelled, color: "#f43f5e" },
    ];
  }, [report?.rows]);

  const revenueSeries = useMemo<SeriesPoint[]>(
    () => (report?.dateWiseSales ?? []).map((item) => ({ label: item.date.slice(5), value: item.revenue })),
    [report?.dateWiseSales]
  );
  const prevRevenueSeries = useMemo<SeriesPoint[]>(
    () => (previousReport?.dateWiseSales ?? []).map((item) => ({ label: item.date.slice(5), value: item.revenue })),
    [previousReport?.dateWiseSales]
  );

  const refundByWeek = useMemo<GroupedBarItem[]>(() => {
    const grouped = new Map<string, { requested: number; approved: number; rejected: number }>();
    (refundsQuery.data?.requests ?? []).forEach((item) => {
      const key = item.createdAt.slice(0, 10);
      const current = grouped.get(key) ?? { requested: 0, approved: 0, rejected: 0 };
      current.requested += 1;
      if (item.status.toUpperCase().includes("APPROVED")) current.approved += 1;
      if (item.status.toUpperCase().includes("REJECTED")) current.rejected += 1;
      grouped.set(key, current);
    });
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([label, value]) => ({
        label,
        values: [
          { key: "Requested", value: value.requested, color: "#3b82f6" },
          { key: "Approved", value: value.approved, color: "#10b981" },
          { key: "Rejected", value: value.rejected, color: "#f43f5e" },
        ],
      }));
  }, [refundsQuery.data?.requests]);

  const caretakerStats = useMemo(() => {
    const created = caretakerReqQuery.data?.requests.length ?? 0;
    const fulfilled =
      caretakerReqQuery.data?.requests.filter((item) => item.status.toUpperCase().includes("FULFILLED")).length ?? 0;
    const pending = Math.max(created - fulfilled, 0);
    return [
      { label: "Created", value: created, color: "#6366f1" },
      { label: "Fulfilled", value: fulfilled, color: "#10b981" },
      { label: "Pending", value: pending, color: "#f59e0b" },
    ];
  }, [caretakerReqQuery.data?.requests]);

  const walletMini = useMemo(
    () =>
      (walletTxQuery.data?.transactions ?? [])
        .slice(0, 8)
        .reverse()
        .map((item) => ({
          label: item.createdAt.slice(5, 10),
          value: item.type === "CREDIT" ? item.amount : -item.amount,
        })),
    [walletTxQuery.data?.transactions]
  );

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await agencyApi.exportSalesReportExcel(range);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `agency-dashboard-${range.startDate}-${range.endDate}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const isLoading = reportQuery.isLoading;

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-amber-50/40 to-white p-4 md:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Agency Dashboard</h1>
            <p className="text-sm text-slate-600">Performance overview</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["7D", "30D", "90D", "CUSTOM"] as const).map((item) => (
              <Button key={item} size="sm" variant={period === item ? "default" : "outline"} onClick={() => setPeriod(item)}>
                {item}
              </Button>
            ))}
            {period === "CUSTOM" ? (
              <>
                <input
                  type="date"
                  className="h-9 rounded-md border border-slate-300 px-2 text-sm"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
                <input
                  type="date"
                  className="h-9 rounded-md border border-slate-300 px-2 text-sm"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
              </>
            ) : null}
            <label className="ml-2 flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={comparePrevious} onChange={(e) => setComparePrevious(e.target.checked)} />
              Compare previous
            </label>
            <Button size="sm" onClick={handleExport} disabled={exporting}>
              <Download className="h-4 w-4" /> {exporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingGrid count={4} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Revenue"
              value={`${report?.summary.currency ?? "INR"} ${totalRevenue.toLocaleString()}`}
              change={`${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}%`}
              tone="emerald"
              sparkline={revenueSeries.map((item) => item.value).slice(-8)}
            />
            <StatCard
              label="Bookings"
              value={String(totalBookings)}
              change={`${bookingsChange >= 0 ? "+" : ""}${bookingsChange.toFixed(1)}%`}
              tone="blue"
            />
            <StatCard
              label="Avg Rating"
              value={`${(reviewsQuery.data?.averageRating ?? 0).toFixed(1)}/5`}
              subLabel={`${reviewsQuery.data?.totalItems ?? 0} reviews`}
              tone="amber"
            />
            <StatCard
              label="Refund Rate"
              value={`${refundRate.toFixed(1)}%`}
              change={`${refundsQuery.data?.requests.length ?? 0} requests`}
              tone="rose"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <SectionCard
            title="Revenue Trend"
            className="xl:col-span-8"
            rightSlot={
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-orange-600" />
                  Current
                </span>
                {comparePrevious ? (
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Previous
                  </span>
                ) : null}
              </div>
            }
          >
            <LineChart
              theme="agency"
              primary={revenueSeries}
              secondary={comparePrevious ? prevRevenueSeries : undefined}
              primaryColor="#ea580c"
              secondaryColor="#94a3b8"
            />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SectionCard title="Top Packages">
            <HorizontalBars
              items={(report?.topPackages ?? []).slice(0, 6).map((item) => ({
                label: item.packageName,
                value: item.revenue,
                color: "#8b5cf6",
              }))}
            />
          </SectionCard>
          <SectionCard title="Refund Overview">
            <GroupedBars theme="agency" items={refundByWeek} />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SectionCard title="Caretaker Requests Funnel">
            <HorizontalBars theme="agency" items={caretakerStats} />
          </SectionCard>
          <SectionCard title="Wallet Summary">
            <div className="mb-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Current balance</p>
              <p className="text-2xl font-bold text-slate-900">
                INR {(walletQuery.data?.balance ?? 0).toLocaleString()}
              </p>
            </div>
            <LineChart
              theme="agency"
              primary={walletMini.map((item) => ({ label: item.label, value: item.value }))}
              primaryColor="#d97706"
            />
          </SectionCard>
        </div>

        <SectionCard title="Recent Booking Activity">
          <SimpleTable
            headers={["Booking ID", "Package", "Client", "Amount", "Status", "Date"]}
            rows={(report?.rows ?? []).slice(0, 10).map((row) => [
              String(row.bookingId).slice(-8),
              row.packageName,
              "N/A",
              `${row.currency} ${row.totalAmount.toLocaleString()}`,
              row.status,
              row.createdAt.slice(0, 10),
            ])}
          />
        </SectionCard>
      </div>
    </div>
  );
}

