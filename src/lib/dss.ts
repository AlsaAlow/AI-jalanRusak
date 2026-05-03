// ==========================
// 🔥 TYPE
// ==========================
export type SeverityLabel = "Tidak ada" | "Ringan" | "Sedang" | "Berat";

// ==========================
// 🔥 NORMALISASI SEVERITY
// ==========================
export const normalizeSeverity = (s: string = ""): SeverityLabel => {
  const val = s.toLowerCase();

  if (val.includes("tidak")) return "Tidak ada";
  if (val.includes("ringan") || val.includes("rendah")) return "Ringan";
  if (val.includes("sedang")) return "Sedang";
  if (val.includes("berat")) return "Berat";

  return "Sedang";
};

// ==========================
// 🔥 PARSE AREA (SMART FIX)
// ==========================
export const parseArea = (area: string | number = 0): number => {
  if (!area) return 5;

  if (typeof area === "number") return area;

  // contoh: "10-20 m2"
  if (area.includes("-")) {
    const [min, max] = area
      .split("-")
      .map((v) => parseFloat(v.replace(/[^\d.]/g, "")));

    if (!isNaN(min) && !isNaN(max)) {
      return (min + max) / 2; // 🔥 FIX: rata-rata, bukan jumlah
    }
  }

  const cleaned = area.replace(/[^\d.]/g, "");
  const num = Number(cleaned);

  return isNaN(num) || num <= 0 ? 5 : num;
};

// ==========================
// 🔥 HITUNG PERSENTASE (STABIL)
// ==========================
export const calculatePercentage = (
  severity: string,
  areaInput: string | number
): number => {
  const sizeRaw = parseArea(areaInput);

  let sizeScore = 0;

  if (sizeRaw <= 5) sizeScore = 5;
  else if (sizeRaw <= 20) sizeScore = 10;
  else if (sizeRaw <= 50) sizeScore = 15;
  else sizeScore = 20;

  const sev = normalizeSeverity(severity);

  let severityScore = 0;

  switch (sev) {
    case "Tidak ada":
      severityScore = 5;
      break;
    case "Ringan":
      severityScore = 20;
      break;
    case "Sedang":
      severityScore = 45;
      break;
    case "Berat":
      severityScore = 70;
      break;
    default:
      severityScore = 50;
  }

  return Math.min(100, severityScore + sizeScore);
};

// ==========================
// 🔥 LEVEL
// ==========================
export const getLevel = (p: number): "Rendah" | "Sedang" | "Tinggi" => {
  if (p < 30) return "Rendah";
  if (p < 60) return "Sedang";
  return "Tinggi";
};

// ==========================
// 🔥 INSTANSI
// ==========================
export const getInstansi = (level: string): string => {
  if (level === "Tinggi") return "Dinas PUPR Kota Manado";
  if (level === "Sedang") return "Dinas Bina Marga";
  return "Petugas lokal";
};

// ==========================
// 🔥 DSS HELPER
// ==========================
export const getDSS = (severity: string, area: string | number) => {
  const percentage = calculatePercentage(severity, area);
  const level = getLevel(percentage);
  const instansi = getInstansi(level);

  return { percentage, level, instansi };
};

// ==========================
// 🔥 RISK ANALYSIS (UPGRADE)
// ==========================
export const calculateRisk = (
  severity: string,
  areaInput: string | number,
  description?: string
): number => {
  const size = parseArea(areaInput);
  const sev = normalizeSeverity(severity);

  let severityScore = 0;

  switch (sev) {
    case "Tidak ada":
      severityScore = 5;
      break;
    case "Ringan":
      severityScore = 25;
      break;
    case "Sedang":
      severityScore = 60;
      break;
    case "Berat":
      severityScore = 85;
      break;
    default:
      severityScore = 70;
  }

  // 🔥 AREA DIBATASI BIAR GA OVER
  const areaScore = Math.min(40, size * 1.2);

  const desc = description?.toLowerCase() || "";

  let locationScore = 20;

  if (desc.includes("jalan utama")) locationScore = 40;
  else if (desc.includes("jalan besar")) locationScore = 30;

  // 🔥 BONUS: genangan air (penting banget)
  if (desc.includes("air") || desc.includes("genangan")) {
    locationScore += 10;
  }

  const risk =
    severityScore * 0.6 +
    areaScore * 0.25 +
    locationScore * 0.15;

  return Math.min(100, Math.round(risk));
};

// ==========================
// 🔥 RISK LEVEL
// ==========================
export const getRiskLevel = (
  risk: number
): "Rendah" | "Sedang" | "Tinggi" => {
  if (risk >= 70) return "Tinggi";
  if (risk >= 40) return "Sedang";
  return "Rendah";
};

// ==========================
// 🔥 REKOMENDASI
// ==========================
export const getRiskRecommendation = (risk: number): string => {
  if (risk >= 70)
    return "Perbaikan darurat segera (≤ 3 hari)";
  if (risk >= 40)
    return "Perbaikan dalam waktu dekat";
  return "Monitoring berkala";
};