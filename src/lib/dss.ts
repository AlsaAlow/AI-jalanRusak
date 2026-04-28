// ==========================
// 🔥 HITUNG PERSENTASE (FIX FINAL)
// ==========================
export const calculatePercentage = (severity: string, area: string) => {
    const numbers = area?.match(/\d+/g);
  
    const sizeRaw = numbers
      ? numbers.reduce((a, b) => a + parseInt(b, 10), 0)
      : 5;
  
    // 🔥 NORMALISASI AREA (PENTING)
    let size = 0;
  
    if (sizeRaw <= 5) size = 5;
    else if (sizeRaw <= 20) size = 10;
    else if (sizeRaw <= 50) size = 15;
    else size = 20;
  
    let base = 0;
  
    switch (severity) {
      case "Tidak ada":
        base = 5;
        break;
      case "Rendah":
        base = 15;
        break;
      case "Sedang":
        base = 40;
        break;
      case "Berat":
        base = 70;
        break;
      default:
        base = 80;
    }
  
    return Math.min(100, base + size);
  };
  
  // ==========================
  // 🔥 LEVEL KERUSAKAN
  // ==========================
  export const getLevel = (p: number) => {
    if (p < 30) return "Rendah";
    if (p < 60) return "Sedang";
    return "Tinggi";
  };
  
  // ==========================
  // 🔥 INSTANSI TUJUAN
  // ==========================
  export const getInstansi = (level: string) => {
    switch (level) {
      case "Tinggi":
        return "Dinas PUPR Kota Manado";
      case "Sedang":
        return "Dinas Bina Marga";
      default:
        return "Petugas lokal";
    }
  };
  
  // ==========================
  // 🔥 HELPER DSS
  // ==========================
  export const getDSS = (severity: string, area: string) => {
    const percentage = calculatePercentage(severity, area);
    const level = getLevel(percentage);
    const instansi = getInstansi(level);
  
    return {
      percentage,
      level,
      instansi,
    };
  };