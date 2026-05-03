// =========================
// 🔥 TYPE
// =========================
export type RoadType = "lentur" | "kaku";

export type DamageType =
  | "lubang"
  | "retak buaya"
  | "retak"
  | "alur"
  | "bleeding";

export type Severity = "ringan" | "sedang" | "berat";

export interface EstimateInput {
  roadType: RoadType;
  damageType: DamageType;
  severity: Severity;
  area: number;
}

export interface EstimateResult {
  method: string;
  pricePerM2: number;
  materials: string[];
  totalCost: number;
}

// =========================
// 🔥 MATERIAL DATABASE
// =========================
const MATERIALS: Record<RoadType, Record<Severity, string[]>> = {
  lentur: {
    ringan: [
      "Cold mix asphalt",
      "Pasir",
      "Tack coat",
    ],
    sedang: [
      "Hotmix",
      "Agregat (split)",
      "Tack coat",
    ],
    berat: [
      "Hotmix tebal",
      "Base layer (agregat)",
      "Prime coat",
      "Tack coat",
    ],
  },
  kaku: {
    ringan: [
      "Semen",
      "Pasir",
      "Air",
    ],
    sedang: [
      "Beton",
      "Agregat",
      "Semen",
    ],
    berat: [
      "Rekonstruksi beton",
      "Tulangan baja",
      "Semen",
      "Agregat",
    ],
  },
};

// =========================
// 🔥 PRICE (REALISTIS INDONESIA)
// =========================
const PRICE: Record<RoadType, Record<Severity, number>> = {
  lentur: {
    ringan: 150000,
    sedang: 250000,
    berat: 400000,
  },
  kaku: {
    ringan: 200000,
    sedang: 350000,
    berat: 600000,
  },
};

// =========================
// 🔥 METHOD LOGIC (SMART & URUT)
// =========================
const getMethod = (
  roadType: RoadType,
  damageType: DamageType,
  severity: Severity
): string => {
  // PRIORITAS: damageType dulu
  if (roadType === "lentur") {
    if (damageType === "lubang") return "Tambal Cepat (Patching)";
    if (damageType === "retak buaya") return "Patching / Overlay";
    if (damageType === "retak") return "Crack Sealing";
    if (damageType === "alur") return "Perataan ulang (Leveling)";
    if (damageType === "bleeding") return "Surface treatment";

    if (severity === "berat") return "Overlay / Rekonstruksi";
  }

  if (roadType === "kaku") {
    if (severity === "ringan") return "Seal joint beton";
    if (severity === "sedang") return "Perbaikan slab beton";
    return "Rekonstruksi beton penuh";
  }

  return "Perbaikan umum";
};

// =========================
// 🔥 VALIDASI AREA
// =========================
const normalizeArea = (area: any): number => {
  const num = Number(area);
  if (isNaN(num) || num <= 0) return 0;
  return num;
};

// =========================
// 🔥 MAIN FUNCTION
// =========================
export const estimateRoadRepair = (
  input: EstimateInput
): EstimateResult => {
  const roadType = input.roadType;
  const severity = input.severity;
  const damageType = input.damageType;
  const area = normalizeArea(input.area);

  // 🔥 SAFETY GUARD
  if (area === 0) {
    return {
      method: "-",
      pricePerM2: 0,
      materials: [],
      totalCost: 0,
    };
  }

  const pricePerM2 =
    PRICE?.[roadType]?.[severity] ?? 0;

  const materials =
    MATERIALS?.[roadType]?.[severity] ?? [];

  const method = getMethod(
    roadType,
    damageType,
    severity
  );



  // 🔥 TAMBAHAN REALISTIS (10% overhead)
  const overheadFactor = 1.1;

  const totalCost = Math.round(
    area * pricePerM2 * overheadFactor
  );

  return {
    method,
    pricePerM2,
    materials,
    totalCost,
  };
};

// =========================
// 🔥 HANDLING TIME (NEW)
// =========================
export const getHandlingTime = (severity: string) => {
    const s = severity.toLowerCase();
  
    if (s === "berat") {
      return {
        label: "Darurat",
        time: "≤ 1-3 hari",
        color: "text-red-500",
      };
    }
  
    if (s === "sedang") {
      return {
        label: "Segera",
        time: "3-7 hari",
        color: "text-yellow-500",
      };
    }
  
    return {
      label: "Monitoring",
      time: "1-4 minggu",
      color: "text-green-500",
    };
  };