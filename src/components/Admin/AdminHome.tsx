import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/User/button";
import { adminApi } from "@/services/admin/adminService";
import { agencyApi as adminAgencyApi } from "@/services/admin/agencyService";
import {
  DonutChart,
  HorizontalBars,
  LineChart,
  LoadingGrid,
  SectionCard,
  SimpleTable,
  StatCard,
  type SeriesPoint,
} from "@/components/dashboard/DashboardPrimitives";
import { Download } from "lucide-react";

type PeriodKey = "7D" | "30D" | "90D" | "CUSTOM";
type AdminTab = "HIGH_VALUE" | "REFUND_EVENTS" | "ATTENTION";

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

export function AdminHome() {
  const [period, setPeriod] = useState<PeriodKey>("30D");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [tab, setTab] = useState<AdminTab>("HIGH_VALUE");
  const [exporting, setExporting] = useState(false);

  const range = useMemo(() => buildRange(period, customStart, customEnd), [period, customStart, customEnd]);
  const reportQuery = useQuery({
    queryKey: ["admin", "dashboard", "sales", range],
    queryFn: () => adminApi.getSalesReport(range),
  });
  const agenciesQuery = useQuery({
    queryKey: ["admin", "dashboard", "agencies"],
    queryFn: () => adminAgencyApi.getAgencies({ page: 1, limit: 500, status: "all", verificationStatus: "all" }),
  });
  const walletTxQuery = useQuery({
    queryKey: ["admin", "dashboard", "wallet-transactions"],
    queryFn: () => adminApi.getWalletTransactions({ page: 1, limit: 300, type: "all", source: "all", sort: "newest" }),
  });

  const report = reportQuery.data;
  const gmv = report?.summary.totalRevenue ?? 0;
  const commission = gmv * 0.1;
  const totalBookings = report?.summary.totalBookings ?? 0;
  const activeAgencies = agenciesQuery.data?.agencies.filter((item) => !item.isBlocked).length ?? 0;
  const refundEvents = walletTxQuery.data?.transactions.filter((item) => item.transaction.source === "REFUND") ?? [];
  const refundRatio = totalBookings ? (refundEvents.length / totalBookings) * 100 : 0;

  const trendSeries = useMemo<SeriesPoint[]>(
    () => (report?.dateWiseSales ?? []).map((item) => ({ label: item.date.slice(5), value: item.revenue })),
    [report?.dateWiseSales]
  );
  const commissionSeries = useMemo<SeriesPoint[]>(
    () => trendSeries.map((item) => ({ label: item.label, value: item.value * 0.1 })),
    [trendSeries]
  );

  const bookingLifecycle = useMemo(() => {
    const counts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    report?.rows.forEach((row) => {
      const s = row.status.toLowerCase();
      if (s.includes("pending")) counts.pending += 1;
      else if (s.includes("confirm")) counts.confirmed += 1;
      else if (s.includes("complete")) counts.completed += 1;
      else if (s.includes("cancel")) counts.cancelled += 1;
    });
    return [
      { label: "pending", value: counts.pending, color: "#f59e0b" },
      { label: "confirmed", value: counts.confirmed, color: "#3b82f6" },
      { label: "completed", value: counts.completed, color: "#10b981" },
      { label: "cancelled", value: counts.cancelled, color: "#f43f5e" },
    ];
  }, [report?.rows]);

  const verificationPipeline = useMemo(() => {
    const pending = agenciesQuery.data?.agencies.filter((a) => a.verificationStatus === "pending").length ?? 0;
    const verified = agenciesQuery.data?.agencies.filter((a) => a.verificationStatus === "verified").length ?? 0;
    const rejected = agenciesQuery.data?.agencies.filter((a) => a.verificationStatus === "rejected").length ?? 0;
    return [
      { label: "Pending", value: pending, color: "#f59e0b" },
      { label: "Verified", value: verified, color: "#10b981" },
      { label: "Rejected", value: rejected, color: "#f43f5e" },
    ];
  }, [agenciesQuery.data?.agencies]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await adminApi.exportSalesReportExcel(range);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `admin-dashboard-${range.startDate}-${range.endDate}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-violet-50 via-indigo-50/30 to-white p-4 md:p-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-600">Platform insights and control</p>
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
            <Button size="sm" onClick={handleExport} disabled={exporting}>
              <Download className="h-4 w-4" /> {exporting ? "Exporting..." : "Export report"}
            </Button>
          </div>
        </div>

        {reportQuery.isLoading ? (
          <LoadingGrid count={5} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
            <StatCard label="GMV" value={`${report?.summary.currency ?? "INR"} ${gmv.toLocaleString()}`} tone="emerald" chartTheme="admin" />
            <StatCard label="Platform Commission" value={`${report?.summary.currency ?? "INR"} ${commission.toLocaleString()}`} tone="violet" chartTheme="admin" />
            <StatCard label="Total Bookings" value={String(totalBookings)} tone="blue" chartTheme="admin" />
            <StatCard label="Active Agencies" value={String(activeAgencies)} tone="amber" chartTheme="admin" />
            <StatCard label="Refund Ratio" value={`${refundRatio.toFixed(1)}%`} tone="rose" chartTheme="admin" />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <SectionCard
            title="GMV vs Commission Trend"
            className="xl:col-span-8"
            rightSlot={
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  GMV
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Commission
                </span>
              </div>
            }
          >
            <LineChart theme="admin" primary={trendSeries} secondary={commissionSeries} primaryColor="#4f46e5" secondaryColor="#0ea5e9" />
          </SectionCard>
          <SectionCard
            title="Booking Lifecycle"
            className="xl:col-span-4"
            rightSlot={<span className="text-xs text-slate-500">Hover segments for exact values</span>}
          >
            <DonutChart theme="admin" slices={bookingLifecycle} />
          </SectionCard>
        </div>

        <SectionCard title="Agency Verification Pipeline">
          <HorizontalBars theme="admin" items={verificationPipeline} />
        </SectionCard>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SectionCard title="Top Agencies Leaderboard">
            <HorizontalBars
              theme="admin"
              items={(report?.topAgencies ?? []).slice(0, 8).map((agency) => ({
                label: `${agency.agencyName} (${agency.bookingCount})`,
                value: agency.revenue,
                color: "#4f46e5",
              }))}
            />
          </SectionCard>
          <SectionCard title="Category Demand">
            <HorizontalBars
              theme="admin"
              items={(report?.topPackages ?? []).slice(0, 8).map((pkg) => ({
                label: pkg.packageName,
                value: pkg.bookingCount,
                color: "#0284c7",
              }))}
            />
          </SectionCard>
        </div>

        <SectionCard
          title="Recent Events"
          rightSlot={
            <div className="flex gap-2">
              <Button size="sm" variant={tab === "HIGH_VALUE" ? "default" : "outline"} onClick={() => setTab("HIGH_VALUE")}>
                High-Value Bookings
              </Button>
              <Button size="sm" variant={tab === "REFUND_EVENTS" ? "default" : "outline"} onClick={() => setTab("REFUND_EVENTS")}>
                Refund Events
              </Button>
              <Button size="sm" variant={tab === "ATTENTION" ? "default" : "outline"} onClick={() => setTab("ATTENTION")}>
                Attention Needed
              </Button>
            </div>
          }
        >
          {tab === "HIGH_VALUE" ? (
            <SimpleTable
              headers={["Booking ID", "Package", "Agency", "Amount", "Status", "Date"]}
              rows={(report?.rows ?? [])
                .slice()
                .sort((a, b) => b.totalAmount - a.totalAmount)
                .slice(0, 12)
                .map((row) => [
                  String(row.bookingId).slice(-8),
                  row.packageName,
                  row.agencyName,
                  `${row.currency} ${row.totalAmount.toLocaleString()}`,
                  row.status,
                  row.createdAt.slice(0, 10),
                ])}
            />
          ) : null}
          {tab === "REFUND_EVENTS" ? (
            <SimpleTable
              headers={["Tx ID", "Owner", "Type", "Amount", "Source", "Date"]}
              rows={refundEvents.slice(0, 12).map((item) => [
                item.transaction.id.slice(-8),
                item.ownerName ?? item.ownerType,
                item.transaction.type,
                String(item.transaction.amount),
                item.transaction.source,
                item.transaction.createdAt.slice(0, 10),
              ])}
            />
          ) : null}
          {tab === "ATTENTION" ? (
            <SimpleTable
              headers={["Agency", "Verification", "Blocked", "Created At"]}
              rows={(agenciesQuery.data?.agencies ?? [])
                .filter((agency) => agency.isBlocked || agency.verificationStatus !== "verified")
                .slice(0, 12)
                .map((agency) => [
                  agency.agencyName,
                  agency.verificationStatus,
                  agency.isBlocked ? "Yes" : "No",
                  agency.createdAt.slice(0, 10),
                ])}
            />
          ) : null}
        </SectionCard>
      </div>
    </div>
  );
}

