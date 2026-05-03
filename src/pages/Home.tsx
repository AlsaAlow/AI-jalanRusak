import { useNavigate } from "react-router-dom";
import {
  Camera,
  Sparkles,
  MapPin,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* 🔥 HERO */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-semibold text-yellow-400">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Gemini 2.5 Flash
          </div>

          {/* Title */}
          <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl leading-tight">
            Laporkan jalan rusak{" "}
            <span className="text-yellow-400">
              dalam hitungan detik
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base text-gray-300">
            Foto kerusakan, AI langsung menganalisis tingkat keparahan.
          </p>

          {/* 🔥 BUTTON */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition"
            >
              Mulai Lapor
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => navigate("/about")}
              className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition"
            >
              About
            </button>
          </div>
        </div>

        {/* 🔥 STRIPE */}
        <div className="h-2 bg-[repeating-linear-gradient(45deg,#facc15,#facc15_10px,#111827_10px,#111827_20px)]" />
      </section>

      {/* 🔥 FEATURES */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-xl font-bold text-slate-800">
          Cara kerjanya
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Feature icon={Camera} title="Foto" text="Ambil gambar jalan rusak" />
          <Feature icon={Sparkles} title="AI" text="Analisis otomatis" />
          <Feature icon={MapPin} title="Lokasi" text="GPS otomatis" />
          <Feature icon={MessageSquare} title="Kirim" text="Via WhatsApp" />
        </div>
      </section>
    </div>
  );
};

const Feature = ({ icon: Icon, title, text }: any) => (
  <div className="rounded-2xl bg-white p-5 shadow-md hover:shadow-lg transition">
    <Icon className="h-5 w-5 text-yellow-500" />
    <h3 className="mt-3 font-bold text-slate-800">{title}</h3>
    <p className="text-sm text-slate-600">{text}</p>
  </div>
);

export default Home;