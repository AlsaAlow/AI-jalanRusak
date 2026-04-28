import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
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

// Fix marker Vite
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

export type Report = {
  id: string;
  photo_url: string;
  severity: string;
  estimated_area: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  created_at: string;
};

// ==========================
// 🔥 HEATMAP LAYER (INI YANG KAMU BELUM PUNYA)
// ==========================
const HeatmapLayer = ({ reports }: { reports: Report[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || reports.length === 0) return;

    const points = reports.map((r) => {
      const risk = calculateRisk(
        r.severity,
        r.estimated_area,
        r.description
      );

      return [r.latitude, r.longitude, risk / 100];
    });

    const heat = (L as any).heatLayer(points, {
      radius: 30,
      blur: 25,
      maxZoom: 17,
      gradient: {
        0.2: "green",
        0.5: "yellow",
        0.8: "orange",
        1.0: "red",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, reports]);

  return null;
};

// ==========================
// 🔥 WARNA MARKER
// ==========================
const getColor = (level: string) => {
  if (level === "Tinggi") return "#ef4444";
  if (level === "Sedang") return "#f59e0b";
  return "#10b981";
};

// ==========================
// 🔥 ICON CUSTOM
// ==========================
const makeIcon = (color: string) =>
  L.divIcon({
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

// ==========================
// 🔥 MAIN MAP
// ==========================
export const DamageMap = ({ reports }: { reports: Report[] }) => {
  const center: [number, number] =
    reports.length > 0
      ? [reports[0].latitude, reports[0].longitude]
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

      {/* 🔥 HEATMAP */}
      <HeatmapLayer reports={reports} />

      {/* 🔵 MARKER */}
      {reports.map((r) => {
        const percentage = calculatePercentage(
          r.severity,
          r.estimated_area
        );

        const level = getLevel(percentage);
        const instansi = getInstansi(level);

        return (
          <Marker
            key={r.id}
            position={[r.latitude, r.longitude]}
            icon={makeIcon(getColor(level))}
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
                  {r.estimated_area}
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