// ==========================
// 🔥 NORMALISASI SEVERITY
// ==========================
const normalizeSeverity = (s: string = "") => {
    const val = s.toLowerCase();
  
    if (val.includes("tidak")) return "Tidak ada";
    if (val.includes("ringan") || val.includes("rendah")) return "Ringan";
    if (val.includes("sedang")) return "Sedang";
    if (val.includes("berat")) return "Berat";
  
    return "Sedang"; // fallback aman
  };
  
  // ==========================
  // 🔥 PARSE AREA (ANTI ERROR)
  // ==========================
  const parseArea = (area: string = "") => {
    const numbers = area.match(/\d+/g);
  
    if (!numbers) return 5;
  
    return numbers.reduce((a, b) => a + parseInt(b, 10), 0);
  };
  
  // ==========================
  // 🔥 HITUNG PERSENTASE
  // ==========================
  export const calculatePercentage = (severity: string, area: string) => {
    const sizeRaw = parseArea(area);
  
    // 🔥 NORMALISASI AREA (lebih smooth)
    let size = 0;
  
    if (sizeRaw <= 5) size = 5;
    else if (sizeRaw <= 20) size = 10;
    else if (sizeRaw <= 50) size = 15;
    else size = 20;
  
    const sev = normalizeSeverity(severity);
  
    let base = 0;
  
    switch (sev) {
      case "Tidak ada":
        base = 5;
        break;
      case "Ringan":
        base = 20;
        break;
      case "Sedang":
        base = 45;
        break;
      case "Berat":
        base = 70;
        break;
      default:
        base = 50;
    }
  
    return Math.min(100, base + size);
  };
  
  // ==========================
  // 🔥 LEVEL
  // ==========================
  export const getLevel = (p: number) => {
    if (p < 30) return "Rendah";
    if (p < 60) return "Sedang";
    return "Tinggi";
  };
  
  // ==========================
  // 🔥 INSTANSI
  // ==========================
  export const getInstansi = (level: string) => {
    if (level === "Tinggi") return "Dinas PUPR Kota Manado";
    if (level === "Sedang") return "Dinas Bina Marga";
    return "Petugas lokal";
  };
  
  // ==========================
  // 🔥 DSS HELPER
  // ==========================
  export const getDSS = (severity: string, area: string) => {
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
    area: string,
    description?: string
  ) => {
    const size = parseArea(area);
    const sev = normalizeSeverity(severity);
  
    // 🔥 severity weight (lebih realistis)
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
  
    // 🔥 area weight (dibatasi biar tidak over)
    const areaScore = Math.min(40, size * 1.5);
  
    // 🔥 lokasi (lebih aman)
    const desc = description?.toLowerCase() || "";
  
    let locationScore = 20;
  
    if (desc.includes("jalan utama")) locationScore = 40;
    else if (desc.includes("jalan besar")) locationScore = 30;
  
    // 🔥 final weighted (lebih balance)
    const risk =
      severityScore * 0.6 +
      areaScore * 0.25 +
      locationScore * 0.15;
  
    return Math.round(Math.min(100, risk));
  };
  
  // ==========================
  // 🔥 RISK LEVEL
  // ==========================
  export const getRiskLevel = (risk: number) => {
    if (risk >= 70) return "Tinggi";
    if (risk >= 40) return "Sedang";
    return "Rendah";
  };
  
  // ==========================
  // 🔥 RISK RECOMMENDATION
  // ==========================
  export const getRiskRecommendation = (risk: number) => {
    if (risk >= 70)
      return "Perbaikan darurat segera (risiko kecelakaan tinggi)";
    if (risk >= 40)
      return "Perbaikan dalam waktu dekat";
    return "Monitoring berkala";
  };
  // ==========================
// 💰 ESTIMASI BIAYA
// ==========================
export const parseAreaToM2 = (area: string): number => {
  if (!area) return 1;

  // ambil angka dari string (contoh: "2 x 1 m")
  const nums = area.match(/\d+(\.\d+)?/g);

  if (!nums) return 1;

  const values = nums.map(Number);

  // kalau ada 2 angka → anggap panjang x lebar
  if (values.length >= 2) {
    return values[0] * values[1];
  }

  // kalau cuma 1 angka → anggap luas langsung
  return values[0];
};

export const estimateRepairCost = (
  severity: string,
  area: string
) => {
  const luas = parseAreaToM2(area);

  const percentage = calculatePercentage(severity, area);
  const level = getLevel(percentage);

  const basePrice = 300_000; // Rp/m2

  let factor = 1;

  if (level === "Sedang") factor = 1.5;
  if (level === "Tinggi") factor = 2.2;

  const total = Math.round(luas * basePrice * factor);

  return {
    luas,
    level,
    total,
  };
};