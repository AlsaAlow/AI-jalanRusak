import { useEffect, useState } from "react";
import { Construction, Map as MapIcon, ListChecks } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DamageMap, type Report } from "@/components/DamageMap";
import { ReportCard } from "@/components/ReportCard";
import { ReportFlow } from "@/components/ReportFlow";
import { StatsDashboard } from "@/components/StatsDashboard";

// DSS
import { calculatePercentage, getLevel } from "@/lib/dss";

const Index = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<
    "all" | "Rendah" | "Sedang" | "Tinggi"
  >("all");

  const load = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setReports(data as Report[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // =========================
  // 🔥 DSS STATS
  // =========================
  const stats = reports.reduce(
    (acc, r) => {
      const p = calculatePercentage(r.severity, r.estimated_area);
      const level = getLevel(p);

      if (level === "Tinggi") acc.tinggi++;
      else if (level === "Sedang") acc.sedang++;
      else acc.rendah++;

      return acc;
    },
    { tinggi: 0, sedang: 0, rendah: 0 }
  );

  // =========================
  // 🔥 FILTER
  // =========================
  const filteredReports = reports.filter((r) => {
    if (filter === "all") return true;
    const level = getLevel(
      calculatePercentage(r.severity, r.estimated_area)
    );
    return level === filter;
  });

  // =========================
  // 🔥 RANKING (TOP 5)
  // =========================
  const topReports = [...reports]
    .map((r) => ({
      ...r,
      percentage: calculatePercentage(r.severity, r.estimated_area),
    }))
    .sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* HEADER */}
      <header className="gradient-asphalt text-secondary-foreground">
        <div className="hazard-stripes h-2" />

        <div className="mx-auto max-w-3xl px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-warm">
              <Construction className="h-6 w-6 text-secondary" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold">
                Lapor Jalan Rusak AI
              </h1>
              <p className="text-xs text-secondary-foreground/70">
                DSS Analisis Kerusakan Jalan
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <Stat label="Tinggi" value={stats.tinggi} accent />
            <Stat label="Sedang" value={stats.sedang} />
            <Stat label="Rendah" value={stats.rendah} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <ReportFlow onSaved={load} />

        <StatsDashboard reports={reports} />

        {/* 🔥 RANKING */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-secondary">
            🔥 Lokasi Paling Parah
          </h2>

          <div className="space-y-2">
            {topReports.map((r, i) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-xl bg-card p-3 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="font-bold text-primary">
                    #{i + 1}
                  </div>

                  <div>
                    <div className="text-sm font-semibold">
                      {r.severity}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.estimated_area}
                    </div>
                  </div>
                </div>

                <div className="font-bold text-red-500">
                  {r.percentage}%
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MAP */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <MapIcon className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-bold text-secondary">
              Peta Sebaran
            </h2>
          </div>

          <div className="h-72 rounded-2xl shadow-card overflow-hidden">
            <DamageMap reports={reports} />
          </div>
        </section>

        {/* REPORT LIST */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-bold text-secondary">
              Riwayat Laporan
            </h2>
          </div>

          {/* FILTER */}
          <div className="flex gap-2 flex-wrap">
            {["all", "Rendah", "Sedang", "Tinggi"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border
                ${
                  filter === f
                    ? f === "Tinggi"
                      ? "bg-red-500 text-white"
                      : f === "Sedang"
                      ? "bg-yellow-400 text-black"
                      : f === "Rendah"
                      ? "bg-green-500 text-white"
                      : "bg-primary text-secondary"
                    : "bg-white text-muted-foreground"
                }`}
              >
                {f === "all" ? "Semua" : f}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-center py-8">Memuat...</p>
          ) : filteredReports.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Tidak ada data
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredReports.map((r) => (
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const Stat = ({ label, value, accent }: any) => (
  <div
    className={`rounded-xl p-3 ${
      accent ? "bg-red-500 text-white" : "bg-white/5"
    }`}
  >
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs">{label}</div>
  </div>
);

export default Index;