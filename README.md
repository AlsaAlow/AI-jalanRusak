# 🚧 Lapor Jalan Rusak AI (DSS + Computer Vision)

Aplikasi berbasis web untuk **melaporkan kerusakan jalan** dengan bantuan AI.  
Sistem ini menganalisis gambar jalan rusak, menghitung tingkat risiko, dan memberikan **rekomendasi penanganan serta estimasi biaya**.

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

- 🗺 **Peta Sebaran (Leaflet)**
  - Marker + Heatmap
  - Visualisasi area prioritas

- 📊 **Dashboard Statistik**
  - Distribusi kerusakan
  - Grafik pie chart

- 📤 **Kirim Laporan (WhatsApp)**
  - Format profesional siap kirim ke instansi

---

## 🧱 Tech Stack

- ⚛️ React + TypeScript
- 🎨 Tailwind CSS
- 🗺 Leaflet + Heatmap
- 📊 Recharts
- 🧠 Google Gemini API
- 🗄 Supabase (DB + Functions)

---

## ⚙️ Instalasi

```bash
git clone https://github.com/AlsaAlow/AI-jalanRusak.git
cd project-kamu
npm install
npm run dev