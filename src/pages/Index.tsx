import { useEffect, useState } from "react";
import { Construction, Map as MapIcon, ListChecks } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DamageMap, type Report } from "@/components/DamageMap";
import { ReportCard } from "@/components/ReportCard";
import { ReportFlow } from "@/components/ReportFlow";
import { StatsDashboard } from "@/components/StatsDashboard";

// 🔥 DSS
import { calculatePercentage, getLevel } from "@/lib/dss";

const Index = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

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
  // 🔥 DSS STATS (BARU)
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
              <h1 className="text-xl font-extrabold leading-tight">
                Lapor Jalan Rusak AI
              </h1>
              <p className="text-xs text-secondary-foreground/70">
                Analisis kerusakan jalan dengan DSS berbasis AI
              </p>
            </div>
          </div>

          {/* 🔥 STATS HEADER (DSS) */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            <Stat label="Tinggi" value={stats.tinggi} accent />
            <Stat label="Sedang" value={stats.sedang} />
            <Stat label="Rendah" value={stats.rendah} />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <ReportFlow onSaved={load} />

        {/* 🔥 DASHBOARD DSS (BARU) */}
        <StatsDashboard reports={reports} />

        {/* MAP */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <MapIcon className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-bold text-secondary">
              Peta Sebaran
            </h2>
          </div>

          <div className="h-72 overflow-hidden rounded-2xl shadow-card">
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

          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Memuat...
            </p>
          ) : reports.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Belum ada laporan. Jadilah yang pertama melaporkan! 🚧
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {reports.map((r) => (
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

// 🔥 COMPONENT STAT
const Stat = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) => (
  <div
    className={`rounded-xl p-3 ${
      accent
        ? "bg-red-500 text-white"
        : "bg-white/5 text-secondary-foreground"
    }`}
  >
    <div className="text-2xl font-extrabold leading-none">
      {value}
    </div>
    <div className="mt-1 text-[10px] uppercase tracking-wide opacity-70">
      {label}
    </div>
  </div>
);

export default Index;