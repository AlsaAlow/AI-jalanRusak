import { Sparkles, Shield, Code2, Heart, Mail, Github, Globe2, Building2, Wrench, Users } from "lucide-react";

const About = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {/* Intro */}
      <section className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Tentang aplikasi
        </div>
        <h1 className="mt-3 text-2xl font-extrabold text-secondary sm:text-3xl">
          Lapor Jalan Rusak AI
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Aplikasi pelaporan kerusakan jalan berbasis kecerdasan buatan. Tujuannya sederhana:
          memudahkan masyarakat melapor dan membantu instansi terkait merespons lebih cepat
          dengan data yang akurat.
        </p>
      </section>

      {/* Tech */}
      <section className="rounded-3xl bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-secondary" />
          <h2 className="text-lg font-bold text-secondary">Teknologi</h2>
        </div>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <Item>React + Vite + TypeScript</Item>
          <Item>Tailwind CSS</Item>
          <Item>Leaflet (peta interaktif)</Item>
          <Item>Google Gemini 2.5 Flash</Item>
          <Item>Lovable Cloud (database & storage)</Item>
          <Item>Fonnte (WhatsApp gateway)</Item>
        </ul>
      </section>

      {/* Values */}
      <section className="grid gap-4 sm:grid-cols-2">
        <ValueCard
          icon={Shield}
          title="Akurat & Cepat"
          text="AI menganalisis tingkat kerusakan dalam hitungan detik berdasarkan foto."
        />
        <ValueCard
          icon={Heart}
          title="Untuk warga"
          text="Antarmuka mobile-first, ringan, dan mudah digunakan siapa saja."
        />
      </section>

      {/* SDG Impact */}
      <section className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-secondary" />
          <h2 className="text-lg font-bold text-secondary">Dampak terhadap SDG</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Aplikasi ini mendukung Sustainable Development Goals (SDGs) — 17 tujuan global PBB
          untuk mengakhiri kemiskinan, melindungi planet, dan memastikan kemakmuran pada 2030.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <SdgCard
            number={9}
            color="bg-[hsl(25,90%,55%)]"
            icon={Building2}
            title="Industri, Inovasi & Infrastruktur"
            text="Mempercepat perbaikan infrastruktur jalan melalui pelaporan berbasis AI dan data yang akurat."
          />
          <SdgCard
            number={11}
            color="bg-[hsl(35,85%,55%)]"
            icon={Wrench}
            title="Kota & Komunitas Berkelanjutan"
            text="Menciptakan kota yang lebih aman, tangguh, dan layak huni dengan jalan yang terawat."
          />
          <SdgCard
            number={3}
            color="bg-[hsl(120,55%,40%)]"
            icon={Shield}
            title="Kehidupan Sehat & Sejahtera"
            text="Mengurangi kecelakaan lalu lintas akibat jalan rusak, menyelamatkan nyawa pengguna jalan."
          />
          <SdgCard
            number={17}
            color="bg-[hsl(215,60%,35%)]"
            icon={Users}
            title="Kemitraan untuk Tujuan"
            text="Menjembatani warga, pemerintah, dan teknologi untuk kolaborasi penanganan jalan rusak."
          />
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-3xl bg-secondary p-6 text-secondary-foreground shadow-card">
        <h2 className="text-lg font-bold">Kontak & Kontribusi</h2>
        <p className="mt-1 text-sm text-secondary-foreground/70">
          Punya saran atau ingin berkontribusi? Hubungi kami.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="mailto:alsa.alow277@gmail.com"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-secondary shadow-warm"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
          <a
            href="https://github.com/AlsaAlow"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-bold"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
        </div>
      </section>

      <p className="pt-2 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Lapor Jalan Rusak AI
      </p>
    </div>
  );
};

const Item = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {children}
  </li>
);

const ValueCard = ({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) => (
  <div className="rounded-2xl bg-card p-5 shadow-card">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <h3 className="mt-3 font-bold text-secondary">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
  </div>
);

const SdgCard = ({
  number,
  color,
  icon: Icon,
  title,
  text,
}: {
  number: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) => (
  <div className="flex gap-3 rounded-2xl border border-border bg-background/50 p-4">
    <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl text-white ${color}`}>
      <span className="text-lg font-extrabold leading-none">{number}</span>
      <Icon className="mt-1 h-3.5 w-3.5" />
    </div>
    <div>
      <h3 className="text-sm font-bold text-secondary">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{text}</p>
    </div>
  </div>
);

export default About;