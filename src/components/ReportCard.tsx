import { useState } from "react";
import { MapPin, Clock, Send, Loader2, Trash2 } from "lucide-react";
import type { Report } from "./DamageMap";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import {
  calculatePercentage,
  getLevel,
  getInstansi,
  parseArea as parseAreaDSS,
} from "@/lib/dss";

import { estimateRoadRepair } from "@/lib/costEstimator";

// =========================
// 🔥 NORMALIZE
// =========================
const normalizeSeverity = (s: string = ""): "Ringan" | "Sedang" | "Berat" => {
  const val = s.toLowerCase();
  if (val.includes("berat")) return "Berat";
  if (val.includes("sedang")) return "Sedang";
  return "Ringan";
};

// =========================
// 🔥 STYLE
// =========================
const severityStyle = (s: string) => {
  if (s === "Berat") return "bg-red-500 text-white";
  if (s === "Sedang") return "bg-yellow-400 text-black";
  return "bg-green-500 text-white";
};

const levelStyle = (level: string) => {
  if (level === "Tinggi") return "text-red-600 font-bold";
  if (level === "Sedang") return "text-yellow-500 font-bold";
  return "text-green-600 font-bold";
};

// =========================
// 🔥 HANDLING TIME
// =========================
const getHandlingTime = (severity: string) => {
  const s = severity.toLowerCase();

  if (s === "berat") {
    return {
      label: "Darurat",
      time: "≤ 1-3 hari",
      style: "bg-red-500 text-white",
    };
  }

  if (s === "sedang") {
    return {
      label: "Segera",
      time: "3-7 hari",
      style: "bg-yellow-400 text-black",
    };
  }

  return {
    label: "Monitoring",
    time: "1-4 minggu",
    style: "bg-green-500 text-white",
  };
};

// =========================
// 🔥 DAMAGE TYPE DETECTOR
// =========================
type DamageType = "lubang" | "retak buaya" | "retak" | "alur";

const detectDamageType = (desc: string = "", severity: string): DamageType => {
  const text = desc.toLowerCase();

  if (text.includes("lubang")) return "lubang";
  if (text.includes("retak buaya")) return "retak buaya";
  if (text.includes("alur")) return "alur";

  if (severity === "Berat") return "lubang";
  if (severity === "Sedang") return "retak buaya";

  return "retak";
};

// =========================
// 🔥 MAIN
// =========================
export const ReportCard = ({ report }: { report: Report }) => {
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const severity = normalizeSeverity(report.severity);

  const date = new Date(report.created_at).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  // =========================
  // 🔥 AREA
  // =========================
  const area = parseAreaDSS(report.estimated_area);

  // =========================
  // 🔥 DAMAGE TYPE
  // =========================
  const damageType = detectDamageType(
    report.description,
    severity
  );

  // =========================
  // 🔥 DSS (FIXED)
  // =========================
  const percentage = calculatePercentage(
    severity,
    area
  );

  const level = getLevel(percentage);
  const instansi = getInstansi(level);

  // =========================
  // 🔥 HANDLING
  // =========================
  const handling = getHandlingTime(severity);

  // =========================
  // 🔥 COST
  // =========================
  let cost = {
    method: "-",
    pricePerM2: 0,
    materials: [] as string[],
    totalCost: 0,
  };

  try {
    cost = estimateRoadRepair({
      roadType: "lentur",
      damageType,
      severity: severity.toLowerCase() as "ringan" | "sedang" | "berat",
      area: area || 0,
    });
  } catch (e) {
    console.error("Estimator error:", e);
  }

  // =========================
  // 🔥 SEND WA
  // =========================
  const handleSend = async () => {
    setSending(true);

    try {
      const { error } = await supabase.functions.invoke(
        "send-fonnte",
        {
          body: {
            ...report,
            percentage,
            level,
            instansi,
            handling: handling.label,
            handling_time: handling.time,
            total_cost: cost.totalCost,
          },
        }
      );

      if (error) throw error;

      toast.success("Laporan terkirim");
    } catch (e) {
      console.error(e);
      toast.error("Gagal kirim");
    } finally {
      setSending(false);
    }
  };

  // =========================
  // 🔥 DELETE
  // =========================
  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus laporan?")) return;

    setDeleting(true);

    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", report.id);

      if (error) throw error;

      toast.success("Laporan dihapus");
      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error("Gagal hapus");
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // 🔥 UI
  // =========================
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-lg border">
      {/* IMAGE */}
      <div className="relative">
        <img
          src={report.photo_url}
          alt="Kerusakan"
          className="h-44 w-full object-cover"
        />

        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${severityStyle(
            severity
          )}`}
        >
          {severity}
        </span>
      </div>

      <div className="space-y-3 p-4 text-sm">
        {/* DSS */}
        <div>
          <div><b>Persentase:</b> {percentage}%</div>
          <div className={levelStyle(level)}>Level: {level}</div>
          <div><b>Instansi:</b> {instansi}</div>

          {/* HANDLING */}
          <div className="mt-3 rounded-xl border p-3 bg-gray-50">
            <div className="text-xs text-gray-500 mb-2">
              Rekomendasi Penanganan
            </div>

            <div className="flex justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${handling.style}`}>
                {handling.label}
              </span>
              <span className="text-xs">{handling.time}</span>
            </div>
          </div>
        </div>

        {/* DESC */}
        <p className="text-gray-600">{report.description}</p>

        {/* META */}
        <div className="flex gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
          </span>

          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {date}
          </span>
        </div>

        {/* AREA */}
        <div className="text-xs font-medium">
          Luas: {area} m²
        </div>

        {/* COST */}
        <div className="rounded-xl border p-3 bg-gray-50">
          <div className="text-xs text-gray-500">
            Estimasi Perbaikan
          </div>

          <div><b>Metode:</b> {cost.method}</div>

          <div>
            Harga/m²: Rp {cost.pricePerM2.toLocaleString("id-ID")}
          </div>

          <div className="mt-2">
            <b>Material:</b>
            <ul className="list-disc ml-4 text-xs">
              {cost.materials.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>

          <div className="font-bold text-green-600 mt-2">
            Total: Rp {cost.totalCost.toLocaleString("id-ID")}
          </div>
        </div>

        {/* BUTTON */}
        <div className="space-y-2">
          <Button
            onClick={handleSend}
            disabled={sending}
            className="w-full bg-green-600 text-white"
          >
            {sending ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" />}
            Kirim via WhatsApp
          </Button>

          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="destructive"
            className="w-full"
          >
            {deleting ? <Loader2 className="animate-spin mr-2" /> : <Trash2 className="mr-2" />}
            Hapus Laporan
          </Button>
        </div>
      </div>
    </article>
  );
};