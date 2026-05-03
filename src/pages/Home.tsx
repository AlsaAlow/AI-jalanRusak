import { Link } from "react-router-dom";
import { Camera, Sparkles, MapPin, MessageSquare, ArrowRight, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-asphalt text-secondary-foreground">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Gemini 2.5 Flash
          </div>

          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Laporkan jalan rusak <span className="text-primary">dalam hitungan detik</span>
          </h1>

          <p className="mt-3 text-sm text-secondary-foreground/80 sm:text-base">
            Foto kerusakan, AI langsung menganalisis tingkat keparahan.
          </p>

          <div className="mt-6 flex gap-3">
            <Link to="/dashboard">
              <Button>
                Mulai Lapor <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>

            <Link to="/about">
              <Button variant="outline">
                About
              </Button>
            </Link>
          </div>
        </div>

        <div className="hazard-stripes h-2" />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-xl font-bold">Cara kerjanya</h2>

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
  <div className="rounded-2xl bg-card p-5 shadow-card">
    <Icon className="h-5 w-5 text-primary" />
    <h3 className="mt-3 font-bold">{title}</h3>
    <p className="text-sm">{text}</p>
  </div>
);

export default Home;