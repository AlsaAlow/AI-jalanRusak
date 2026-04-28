// ==========================
// 🔥 NORMALISASI SEVERITY
// ==========================
const normalizeSeverity = (s: string) => {
    const val = s.toLowerCase();
  
    if (val.includes("tidak")) return "Tidak ada";
    if (val.includes("ringan") || val.includes("rendah")) return "Ringan";
    if (val.includes("sedang")) return "Sedang";
    if (val.includes("berat")) return "Berat";
  
    return "Sedang";
  };
  
  // ==========================
  // 🔥 HITUNG PERSENTASE
  // ==========================
  export const calculatePercentage = (severity: string, area: string) => {
    const numbers = area?.match(/\d+/g);
  
    const sizeRaw = numbers
      ? numbers.reduce((a, b) => a + parseInt(b, 10), 0)
      : 5;
  
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
  // 🔥 RISK ANALYSIS
  // ==========================
  export const calculateRisk = (
    severity: string,
    area: string,
    description?: string
  ) => {
    const numbers = area?.match(/\d+/g);
  
    const size = numbers
      ? numbers.reduce((a, b) => a + parseInt(b, 10), 0)
      : 5;
  
    const sev = normalizeSeverity(severity);
  
    let severityScore = 0;
  
    if (sev === "Tidak ada") severityScore = 5;
    else if (sev === "Ringan") severityScore = 25;
    else if (sev === "Sedang") severityScore = 60;
    else if (sev === "Berat") severityScore = 85;
    else severityScore = 80;
  
    const areaScore = Math.min(100, size * 2);
  
    let locationScore = 20;
  
    if (description?.toLowerCase().includes("jalan utama"))
      locationScore = 90;
    else if (description?.toLowerCase().includes("jalan besar"))
      locationScore = 70;
  
    const risk =
      severityScore * 0.5 +
      areaScore * 0.3 +
      locationScore * 0.2;
  
    return Math.round(Math.min(100, risk));
  };
  
  // ==========================
  // 🔥 RISK LEVEL
  // ==========================
  export const getRiskLevel = (risk: number) => {
    if (risk >= 75) return "Tinggi";
    if (risk >= 40) return "Sedang";
    return "Rendah";
  };
  
  // ==========================
  // 🔥 RISK RECOMMENDATION
  // ==========================
  export const getRiskRecommendation = (risk: number) => {
    if (risk >= 75)
      return "Perbaikan darurat segera (risiko tinggi)";
    if (risk >= 40)
      return "Perbaikan dalam waktu dekat";
    return "Monitoring berkala";
  };