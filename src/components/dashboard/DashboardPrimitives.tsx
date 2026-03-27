import React, { useId } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/User/card";

/** Agency: warm orange; Admin: cool indigo/cyan; Caretaker: brand browns/gold */
export type DashboardChartTheme = "agency" | "admin" | "caretaker";

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export interface BarItem {
  label: string;
  value: number;
  color?: string;
}

export interface GroupedBarItem {
  label: string;
  values: Array<{
    key: string;
    value: number;
    color: string;
  }>;
}

interface SectionCardProps {
  title: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, rightSlot, children, className }: SectionCardProps) {
  return (
    <Card
      className={`rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${className ?? ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
          {rightSlot}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  tone?: "emerald" | "blue" | "amber" | "rose" | "violet";
  sparkline?: number[];
  subLabel?: string;
  chartTheme?: DashboardChartTheme;
}

const toneMap: Record<NonNullable<StatCardProps["tone"]>, string> = {
  emerald: "from-emerald-500/15 to-emerald-200/5 text-emerald-700",
  blue: "from-blue-500/15 to-blue-200/5 text-blue-700",
  amber: "from-amber-500/15 to-amber-200/5 text-amber-700",
  rose: "from-rose-500/15 to-rose-200/5 text-rose-700",
  violet: "from-violet-500/15 to-violet-200/5 text-violet-700",
};

export function StatCard({ label, value, change, tone = "blue", sparkline, subLabel, chartTheme = "agency" }: StatCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className={`bg-linear-to-br ${toneMap[tone]} rounded-2xl p-5`}>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-slate-600">{change ?? "-"}</p>
          {subLabel ? <p className="text-xs text-slate-500">{subLabel}</p> : null}
        </div>
        {sparkline && sparkline.length > 1 ? (
          <div className="mt-3">
            <Sparkline data={sparkline} theme={chartTheme} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function LoadingGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
      ))}
    </div>
  );
}

function Sparkline({ data, theme = "agency" }: { data: number[]; theme?: DashboardChartTheme }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `spark-${theme}-${uid}`;
  const warmStops = { a: "#c2410c", b: "#f59e0b", c: "#fb923c" };
  const caretakerStops = { a: "#c2410c", b: "#f59e0b", c: "#10b981" };
  const coolStops = { a: "#4f46e5", b: "#06b6d4", c: "#2563eb" };
  const stops = theme === "caretaker" ? caretakerStops : theme === "agency" ? warmStops : coolStops;

  const width = 120;
  const height = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-9 w-28">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={stops.a} />
          <stop offset="50%" stopColor={stops.b} />
          <stop offset="100%" stopColor={stops.c} />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={`url(#${gradId})`} strokeWidth="2.5" className="drop-shadow-sm" />
    </svg>
  );
}

export function LineChart({
  primary,
  secondary,
  primaryColor = "#2563eb",
  secondaryColor = "#94a3b8",
  theme = "agency",
}: {
  primary: SeriesPoint[];
  secondary?: SeriesPoint[];
  primaryColor?: string;
  secondaryColor?: string;
  theme?: DashboardChartTheme;
}) {
  const uid = useId().replace(/:/g, "");
  const lineGradId = `line-pri-${theme}-${uid}`;
  const areaGradId = `line-area-${theme}-${uid}`;
  const secGradId = `line-sec-${theme}-${uid}`;

  const lineEnd = theme === "caretaker" ? "#f59e0b" : theme === "agency" ? "#fbbf24" : "#38bdf8";
  const areaBottom = theme === "caretaker" ? "#fffbeb" : theme === "agency" ? "#fff7ed" : "#f0f9ff";

  const width = 600;
  const height = 220;
  const allValues = [...primary.map((p) => p.value), ...(secondary?.map((p) => p.value) ?? [])];
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
  const range = Math.max(max - min, 1);

  const makePath = (points: SeriesPoint[]) =>
    points
      .map((p, i) => {
        const x = (i / Math.max(points.length - 1, 1)) * width;
        const y = height - ((p.value - min) / range) * (height - 20) - 10;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  if (!primary.length) {
    return <p className="py-16 text-center text-sm text-slate-500">No data for selected range</p>;
  }

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
        <title>Hover rows/cards for exact values and date details</title>
        <defs>
          <linearGradient id={lineGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={lineEnd} />
          </linearGradient>
          <linearGradient id={areaGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity={theme === "agency" || theme === "caretaker" ? 0.35 : 0.28} />
            <stop offset="100%" stopColor={areaBottom} stopOpacity={0.35} />
          </linearGradient>
          <linearGradient id={secGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={theme === "caretaker" ? "#E8C4A0" : theme === "agency" ? "#fdba74" : "#a5f3fc"} />
          </linearGradient>
        </defs>
        <path d={`${makePath(primary)} L ${width} ${height} L 0 ${height} Z`} fill={`url(#${areaGradId})`} />
        <path d={makePath(primary)} fill="none" stroke={`url(#${lineGradId})`} strokeWidth={3.5} className="drop-shadow-sm" />
        {secondary && secondary.length > 0 ? (
          <path
            d={makePath(secondary)}
            fill="none"
            stroke={`url(#${secGradId})`}
            strokeWidth={2.5}
            strokeDasharray="5 5"
          />
        ) : null}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{primary[0]?.label}</span>
        <span>{primary[primary.length - 1]?.label}</span>
      </div>
    </div>
  );
}

export function DonutChart({ slices, theme = "agency" }: { slices: DonutSlice[]; theme?: DashboardChartTheme }) {
  const uid = useId().replace(/:/g, "");
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (!total) return <p className="py-12 text-center text-sm text-slate-500">No data for selected range</p>;

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  let progress = 0;
  const donutEnd = theme === "caretaker" ? "#fff1e0" : theme === "agency" ? "#ffedd5" : "#e0f2fe";
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <svg viewBox="0 0 180 180" className="h-44 w-44 -rotate-90">
        <defs>
          {slices.map((slice, idx) => (
            <linearGradient key={`${slice.label}-grad-${uid}`} id={`donut-grad-${theme}-${uid}-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={slice.color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={donutEnd} stopOpacity="0.75" />
            </linearGradient>
          ))}
        </defs>
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="20" />
        {slices.map((slice, idx) => {
          const fraction = slice.value / total;
          const dash = `${fraction * circumference} ${circumference}`;
          const offset = -progress * circumference;
          progress += fraction;
          return (
            <circle
              key={slice.label}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={`url(#donut-grad-${theme}-${uid}-${idx})`}
              strokeWidth="20"
              strokeDasharray={dash}
              strokeDashoffset={offset}
              className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.10)]"
            >
              <title>{`${slice.label}: ${slice.value}`}</title>
            </circle>
          );
        })}
      </svg>
      <div className="space-y-2">
        {slices.map((slice) => (
          <div key={slice.label} className="flex items-center gap-2 text-sm">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
            <span className="text-slate-700">
              {slice.label}: {slice.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HorizontalBars({ items, theme = "agency" }: { items: BarItem[]; theme?: DashboardChartTheme }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  const barEnd = theme === "caretaker" ? "#D4A574" : theme === "agency" ? "#fbbf24" : "#67e8f9";
  if (!items.length) return <p className="py-12 text-center text-sm text-slate-500">No data for selected range</p>;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex justify-between text-sm text-slate-600">
            <span>{item.label}</span>
            <span>{item.value.toLocaleString()}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(item.value / max) * 100}%`,
                background: `linear-gradient(90deg, ${item.color ?? "#3b82f6"} 0%, ${barEnd} 100%)`,
              }}
              title={`${item.label}: ${item.value.toLocaleString()}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GroupedBars({ items, theme = "agency" }: { items: GroupedBarItem[]; theme?: DashboardChartTheme }) {
  const max = Math.max(...items.flatMap((item) => item.values.map((v) => v.value)), 1);
  const groupEnd = theme === "caretaker" ? "#fcd34d" : theme === "agency" ? "#fdba74" : "#a5f3fc";
  if (!items.length) return <p className="py-12 text-center text-sm text-slate-500">No data for selected range</p>;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <p className="mb-2 text-sm font-medium text-slate-700">{item.label}</p>
          <div className="space-y-2">
            {item.values.map((valueItem) => (
              <div key={`${item.label}-${valueItem.key}`} className="flex items-center gap-2">
                <span className="w-20 text-xs text-slate-500">{valueItem.key}</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(valueItem.value / max) * 100}%`,
                      background: `linear-gradient(90deg, ${valueItem.color} 0%, ${groupEnd} 100%)`,
                    }}
                    title={`${item.label} - ${valueItem.key}: ${valueItem.value}`}
                  />
                </div>
                <span className="w-10 text-right text-xs text-slate-600">{valueItem.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SimpleTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  if (!rows.length) return <p className="py-12 text-center text-sm text-slate-500">No data for selected range</p>;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left font-semibold text-slate-600">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-t border-slate-100">
              {row.map((cell, cellIdx) => (
                <td key={`${rowIdx}-${cellIdx}`} className="px-4 py-3 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
