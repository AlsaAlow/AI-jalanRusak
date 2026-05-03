<!-- ====== HEADER ====== -->
<h1 align="center">🚧 Lapor Jalan Rusak AI (DSS + Computer Vision)</h1>
<p align="center">
  Aplikasi berbasis web untuk <b>melaporkan kerusakan jalan</b> dengan bantuan AI.<br/>
  Sistem ini menganalisis gambar jalan rusak, menghitung tingkat risiko, dan memberikan 
  <b>rekomendasi penanganan serta estimasi biaya</b>.
</p>

<p align="center">
  <a href="https://lapor-jalan-ai.vercel.app"><b>🌐 Live Demo</b></a> •
  <a href="#-fitur-utama"><b>Fitur</b></a> •
  <a href="#-tech-stack"><b>Tech Stack</b></a> •
  <a href="#-instalasi"><b>Instalasi</b></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-UI-38BDF8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase" />
  <img src="https://img.shields.io/badge/AI-Gemini-orange" />
</p>

---

## 📸 Preview

> Letakkan screenshot project kamu di `/public/preview.png`

<p align="center">
  <img src="./public/preview.png" width="700" alt="preview"/>
</p>

---

## ✨ Fitur Utama

- 📸 **Analisis Gambar (AI)**
  - Deteksi jenis kerusakan (lubang, retak, dll)
  - Klasifikasi tingkat keparahan

- 🧠 **Decision Support System (DSS)**
  - Persentase kerusakan
  - Level risiko (Rendah / Sedang / Tinggi)
  - Rekomendasi instansi (PUPR / Bina Marga)

- 💰 **Estimasi Biaya Perbaikan**
  - Berdasarkan luas & tingkat kerusakan
  - Material & metode otomatis

- 🗺 **Peta Sebaran (Leaflet + Heatmap)**
  - Marker berdasarkan level kerusakan
  - Heatmap area prioritas

- 📊 **Dashboard Statistik**
  - Distribusi kerusakan
  - Grafik pie chart

- 📤 **Kirim Laporan (WhatsApp)**
  - Format profesional siap kirim ke instansi terkait

---

## 🧱 Tech Stack

| Layer       | Tools |
|------------|------|
| Frontend   | React + TypeScript |
| Styling    | Tailwind CSS |
| Map        | Leaflet + Heatmap |
| Chart      | Recharts |
| Backend    | Supabase |
| AI         | Google Gemini API |

---

## ⚙️ Instalasi

```bash
git clone https://github.com/AlsaAlow/AI-jalanRusak.git
cd AI-jalanRusak
npm install
npm run dev