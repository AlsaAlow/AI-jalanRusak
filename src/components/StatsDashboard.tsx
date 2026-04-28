import type { Report } from "./DamageMap";
import { calculatePercentage, getLevel } from "@/lib/dss";

export const StatsDashboard = ({ reports }: { reports: Report[] }) => {
  // =========================
  // 🔥 HITUNG STATISTIK
  // =========================
  const stats = reports.reduce(
    (acc, r) => {
      const percentage = calculatePercentage(
        r.severity,
        r.estimated_area
      );

      const level = getLevel(percentage);

      if (level === "Tinggi") acc.tinggi += 1;
      else if (level === "Sedang") acc.sedang += 1;
      else acc.rendah += 1;

      return acc;
    },
    { tinggi: 0, sedang: 0, rendah: 0 }
  );

  const total = reports.length || 1;

  const percent = (val: number) =>
    Math.round((val / total) * 100);

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* 🔴 TINGGI */}
      <div className="rounded-2xl bg-red-50 p-4 text-center shadow-card">
        <div className="text-2xl font-bold text-red-600">
          {stats.tinggi}
        </div>
        <div className="text-sm font-medium text-red-600">
          Tinggi
        </div>
        <div className="text-xs text-muted-foreground">
          {percent(stats.tinggi)}%
        </div>
      </div>

      {/* 🟡 SEDANG */}
      <div className="rounded-2xl bg-yellow-50 p-4 text-center shadow-card">
        <div className="text-2xl font-bold text-yellow-600">
          {stats.sedang}
        </div>
        <div className="text-sm font-medium text-yellow-600">
          Sedang
        </div>
        <div className="text-xs text-muted-foreground">
          {percent(stats.sedang)}%
        </div>
      </div>

      {/* 🟢 RENDAH */}
      <div className="rounded-2xl bg-green-50 p-4 text-center shadow-card">
        <div className="text-2xl font-bold text-green-600">
          {stats.rendah}
        </div>
        <div className="text-sm font-medium text-green-600">
          Rendah
        </div>
        <div className="text-xs text-muted-foreground">
          {percent(stats.rendah)}%
        </div>
      </div>
    </div>
  );
};