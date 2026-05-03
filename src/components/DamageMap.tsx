import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet.heat";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// 🔥 DSS
import {
  calculatePercentage,
  getLevel,
  getInstansi,
  calculateRisk,
} from "@/lib/dss";

// ==========================
// 🔥 FIX ICON (WAJIB)
// ==========================
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

// ==========================
// 🔥 TYPE
// ==========================
export type Report = {
  id: string;
  photo_url: string;
  severity: string;
  estimated_area: string | number;
  description: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  created_at: string;
};

// ==========================
// 🔥 NORMALIZE SEVERITY
// ==========================
const normalizeSeverity = (s: string = ""): string => {
  const val = s.toLowerCase();
  if (val.includes("ringan")) return "Ringan";
  if (val.includes("sedang")) return "Sedang";
  if (val.includes("berat")) return "Berat";
  return "Sedang";
};

// ==========================
// 🔥 PARSE AREA (SAFE)
// ==========================
const parseArea = (value: any): number => {
  if (!value) return 0;

  if (typeof value === "string") {
    if (value.includes("-")) {
      const [min, max] = value.split("-").map(Number);
      return (min + max) / 2 || 0;
    }

    const cleaned = value.replace(/[^\d.]/g, "");
    return Number(cleaned) || 0;
  }

  return Number(value) || 0;
};

// ==========================
// 🔥 COLOR
// ==========================
const getColor = (level: string) => {
  if (level === "Tinggi") return "#ef4444";
  if (level === "Sedang") return "#f59e0b";
  return "#10b981";
};

// ==========================
// 🔥 ICON CACHE (OPTIMAL)
// ==========================
const iconCache: Record<string, L.DivIcon> = {};

const getIcon = (color: string) => {
  if (!iconCache[color]) {
    iconCache[color] = L.divIcon({
      className: "",
      html: `<div style="
        background:${color};
        width:22px;
        height:22px;
        border-radius:50%;
        border:3px solid #1F2937;
        box-shadow:0 2px 6px rgba(0,0,0,0.4)
      "></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  }

  return iconCache[color];
};

// ==========================
// 🔥 HEATMAP FIX (NO DUPLICATE)
// ==========================
const HeatmapLayer = ({ reports }: { reports: Report[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || reports.length === 0) return;

    const points = reports.map((r) => {
      let risk = 0;

      try {
        risk = calculateRisk(
          normalizeSeverity(r.severity),
          String(r.estimated_area),
          r.description
        );
      } catch {
        risk = 0;
      }

      return [r.latitude, r.longitude, risk / 100];
    });

    const heatLayer = (L as any).heatLayer(points, {
      radius: 30,
      blur: 25,
      maxZoom: 17,
      gradient: {
        0.2: "green",
        0.5: "yellow",
        0.8: "orange",
        1.0: "red",
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, reports]);

  return null;
};

// ==========================
// 🔥 MAIN MAP
// ==========================
export const DamageMap = ({ reports }: { reports: Report[] }) => {
  const safeReports = reports?.filter(
    (r) =>
      r &&
      !isNaN(r.latitude) &&
      !isNaN(r.longitude)
  ) || [];

  const center: [number, number] =
    safeReports.length > 0
      ? [safeReports[0].latitude, safeReports[0].longitude]
      : [-6.2088, 106.8456];

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <HeatmapLayer reports={safeReports} />

      {safeReports.map((r) => {
        const severity = normalizeSeverity(r.severity);
        const area = parseArea(r.estimated_area);

        const percentage = calculatePercentage(
          severity,
          String(area)
        );

        const level = getLevel(percentage);
        const instansi = getInstansi(level);

        return (
          <Marker
            key={r.id}
            position={[r.latitude, r.longitude]}
            icon={getIcon(getColor(level))}
          >
            <Popup>
              <div className="space-y-1 text-sm">
                <div className="font-bold">{level}</div>

                <div>
                  <b>Persentase:</b> {percentage}%
                </div>

                <div>
                  <b>Instansi:</b> {instansi}
                </div>

                <div className="text-muted-foreground">
                  Luas: {area} m²
                </div>

                <img
                  src={r.photo_url}
                  alt="damage"
                  className="mt-1 h-24 w-full rounded object-cover"
                />
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};