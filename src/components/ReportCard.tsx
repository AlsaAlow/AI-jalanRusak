import { useState } from "react";
import { MapPin, Clock, Send, Loader2 } from "lucide-react";
import type { Report } from "./DamageMap";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// 🔥 DSS
import { calculatePercentage, getLevel, getInstansi } from "@/lib/dss";

// 🔥 STYLE SEVERITY
const severityStyle = (s: string) => {
  if (s === "Berat") return "bg-destructive text-destructive-foreground";
  if (s === "Sedang") return "bg-warning text-secondary";
  return "bg-success text-white";
};

// 🔥 STYLE LEVEL
const levelStyle = (level: string) => {
  if (level === "Tinggi") return "text-red-600 font-bold";
  if (level === "Sedang") return "text-yellow-500 font-bold";
  return "text-green-600 font-bold";
};

export const ReportCard = ({ report }: { report: Report }) => {
  const [sending, setSending] = useState(false);

  const date = new Date(report.created_at).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  // 🔥 HITUNG DSS (WAJIB)
  const percentage = calculatePercentage(
    report.severity,
    report.estimated_area
  );
  const level = getLevel(percentage);
  const instansi = getInstansi(level);

  // =========================
  // 🔥 SEND WA
  // =========================
  const handleSend = async () => {
    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "send-fonnte",
        {
          body: {
            severity: report.severity,
            estimated_area: report.estimated_area,
            description: report.description,
            latitude: report.latitude,
            longitude: report.longitude,
            photo_url: report.photo_url,

            // 🔥 DSS HASIL HITUNG
            percentage,
            level,
            instansi,
          },
        }
      );

      if (error) throw error;
      if (data?.success === false) throw new Error(data.error);

      toast.success("Laporan terkirim via WhatsApp");
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Gagal kirim");
    } finally {
      setSending(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl bg-card shadow-card">
      {/* IMAGE */}
      <div className="relative">
        <img
          src={report.photo_url}
          alt="Kerusakan jalan"
          className="h-44 w-full object-cover"
        />

        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${severityStyle(
            report.severity
          )}`}
        >
          {report.severity}
        </span>
      </div>

      {/* CONTENT */}
      <div className="space-y-3 p-4 text-sm">
        {/* DSS INFO */}
        <div className="space-y-1">
          <div>
            <b>Persentase:</b> {percentage}%
          </div>

          <div className={levelStyle(level)}>
            Level: {level}
          </div>

          <div>
            <b>Instansi:</b> {instansi}
          </div>
        </div>

        {/* DESKRIPSI */}
        <p className="text-muted-foreground leading-relaxed">
          {report.description}
        </p>

        {/* META */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
          </span>

          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {date}
          </span>
        </div>

        <div className="text-xs font-medium text-secondary">
          Luas: {report.estimated_area}
        </div>

        {/* BUTTON WA */}
        <Button
          onClick={handleSend}
          disabled={sending}
          className="w-full bg-[#25D366] text-white hover:bg-[#1ebd5a]"
        >
          {sending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Kirim via WhatsApp
        </Button>
      </div>
    </article>
  );
};