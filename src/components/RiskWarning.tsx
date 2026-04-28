import { calculateRisk } from "@/lib/dss";

type Report = {
  severity?: string;
  estimated_area?: string;
  description?: string;
};

export const RiskWarning = ({ reports }: { reports: Report[] }) => {
  // =========================
  // 🔥 CONFIG (BIAR FLEXIBLE)
  // =========================
  const RISK_THRESHOLD = 70;

  // =========================
  // 🔥 HITUNG RISK TINGGI
  // =========================
  const highRiskReports = reports.filter((r) => {
    const risk = calculateRisk(
      r.severity ?? "Sedang",
      r.estimated_area ?? "5",
      r.description ?? ""
    );

    return risk >= RISK_THRESHOLD;
  });

  const highRiskCount = highRiskReports.length;

  // =========================
  // ❌ TIDAK ADA WARNING
  // =========================
  if (highRiskCount === 0) return null;

  // =========================
  // 🔥 LEVEL WARNING (BIAR DINAMIS)
  // =========================
  const isCritical = highRiskCount >= 5;

  // =========================
  // 🚨 WARNING UI
  // =========================
  return (
    <div
      className={`rounded-2xl text-white p-4 shadow-card ${
        isCritical ? "bg-red-700 animate-pulse" : "bg-red-500"
      }`}
    >
      <div className="font-bold">
        ⚠️ {highRiskCount} lokasi berisiko tinggi!
      </div>

      <div className="text-sm opacity-90">
        {isCritical
          ? "Kondisi kritis! Penanganan darurat diperlukan."
          : "Segera lakukan penanganan untuk mencegah kecelakaan."}
      </div>
    </div>
  );
};