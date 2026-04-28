import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// 🔥 DSS
import {
  calculatePercentage,
  getLevel,
  getInstansi,
} from "@/lib/dss";

type Analysis = {
  severity: string;
  estimated_area: string;
  description: string;

  percentage?: number;
  level?: string;
  instansi?: string;
};

type Step = "idle" | "analyzing" | "review";

export const ReportFlow = ({ onSaved }: { onSaved: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setStep("idle");
    setPreviewUrl(null);
    setFile(null);
    setCoords(null);
    setAnalysis(null);
  };

  // ======================
  // 📍 GET LOCATION
  // ======================
  const getLocation = (): Promise<{ lat: number; lng: number }> =>
    new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: -6.2088, lng: 106.8456 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => resolve({ lat: -6.2088, lng: 106.8456 })
      );
    });

  // ======================
  // 📷 FILE → BASE64
  // ======================
  const fileToBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  // ======================
  // 🔍 ANALYZE
  // ======================
  const handleFile = async (f: File) => {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setStep("analyzing");

    try {
      const [location, base64] = await Promise.all([
        getLocation(),
        fileToBase64(f),
      ]);

      setCoords(location);

      const { data, error } = await supabase.functions.invoke(
        "analyze-damage",
        {
          body: { imageBase64: base64 },
        }
      );

      if (error) throw error;

      const base = data as Analysis;

      // 🔥 DSS (frontend only)
      const percentage = calculatePercentage(
        base.severity,
        base.estimated_area
      );

      const level = getLevel(percentage);
      const instansi = getInstansi(level);

      setAnalysis({
        ...base,
        percentage,
        level,
        instansi,
      });

      setStep("review");
    } catch (e) {
      console.error(e);
      toast.error("Gagal analisis AI");
      reset();
    }
  };

  // ======================
  // 💾 SAVE (FIX DI SINI)
  // ======================
  const handleSave = async () => {
    if (!file || !analysis || !coords) return;

    setSaving(true);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}.${ext}`;

      // upload
      const { error: uploadError } = await supabase.storage
        .from("damage-photos")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage
        .from("damage-photos")
        .getPublicUrl(path);

      // 🔥 INSERT (TANPA DSS FIELD)
      const { error: insertError } = await supabase
        .from("reports")
        .insert([
          {
            photo_url: pub.publicUrl,
            severity: analysis.severity,
            estimated_area: analysis.estimated_area,
            description: analysis.description,
            latitude: coords.lat,
            longitude: coords.lng,
          },
        ]);

      if (insertError) throw insertError;

      toast.success("Laporan berhasil disimpan!");
      onSaved();
      reset();
    } catch (e) {
      console.error(e);
      toast.error("Gagal simpan laporan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-3xl bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Camera className="text-primary" />
        <h2 className="font-bold">Laporkan Kerusakan</h2>
      </div>

      {/* STEP 1 */}
      {step === "idle" && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-2xl border p-6"
        >
          Ambil Foto
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {/* STEP 2 */}
      {step === "analyzing" && previewUrl && (
        <div className="space-y-2">
          <img src={previewUrl} className="rounded-xl" />
          <Loader2 className="animate-spin" />
        </div>
      )}

      {/* STEP 3 */}
      {step === "review" && analysis && previewUrl && (
        <div className="space-y-3">
          <img src={previewUrl} className="rounded-xl" />

          <div className="bg-secondary p-3 rounded-xl text-white space-y-2">
            <div>Severity: {analysis.severity}</div>
            <div>Persentase: {analysis.percentage}%</div>
            <div>Level: {analysis.level}</div>
            <div>Instansi: {analysis.instansi}</div>
            <div>{analysis.description}</div>

            {coords && (
              <div className="text-xs">
                {coords.lat}, {coords.lng}
              </div>
            )}
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="animate-spin mr-2" />}
            Simpan
          </Button>
        </div>
      )}
    </section>
  );
};