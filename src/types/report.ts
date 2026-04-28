export type Report = {
  id: string;

  // ======================
  // 🔹 DATA UTAMA
  // ======================
  photo_url: string;
  severity: string;
  estimated_area: string;
  description: string;

  latitude: number;
  longitude: number;
  address?: string | null;
  created_at: string;

  // ======================
  // 🔥 DSS CORE (AKTIF DIPAKAI)
  // ======================
  percentage?: number;     // hasil perhitungan DSS (0–100)
  level?: string;          // Rendah | Sedang | Tinggi
  instansi?: string;       // tujuan pelaporan

  // ======================
  // 🔹 OPSIONAL (UNTUK UPGRADE)
  // ======================
  priority?: string;       // Urgent | High | Medium | Low
  recommendation?: string; // saran tindakan
};