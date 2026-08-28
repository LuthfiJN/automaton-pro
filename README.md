```markdown
# Automaton Pro 🤖📖

Automaton Pro adalah platform riset jurnal ilmiah berbasis AI yang dirancang untuk membantu mahasiswa, akademisi, dan peneliti dalam mencari, merangkum, dan menganalisis literatur akademik secara otomatis, cepat, dan presisi.

Aplikasi ini menggunakan perpaduan **Google Gemini AI** untuk analisis bahasa alami dan **Jina Reader** untuk ekstraksi web, dibalut dalam antarmuka *Modern Minimalist* yang memprioritaskan produktivitas dan kenyamanan mata (*calm productivity*).

---

## ✨ Fitur Utama

- **🔍 Eksplorasi Jurnal Cerdas:** Mencari 3 jurnal ilmiah nyata dan valid (maksimal 5 tahun terakhir) berdasarkan topik, lengkap dengan rangkuman, nama penulis, dan tautan langsung ke Google Scholar.
- **🔗 Analisis Link Jurnal:** Mengekstrak teks asli dari tautan *website* eksternal secara otomatis dan menyajikannya dalam bentuk ringkasan komprehensif.
- **📄 Ekstraksi & Rangkum PDF:** Mendukung pembacaan *file* dokumen PDF secara *native* (Base64) tanpa perlu dekompresi manual, untuk menghasilkan ringkasan eksekutif secara instan.
- **🔖 Manajemen Riwayat (Tersimpan):** Fitur *bookmark* terintegrasi dengan `localStorage` *browser* untuk menyimpan dan mengelola jurnal penting tanpa memerlukan *database* eksternal.
- **📋 Salin Cerdas:** Tombol salin dinamis satu kali klik untuk memindahkan hasil analisis ke *clipboard*.

---

## 🛠️ Teknologi yang Digunakan

**Frontend (Client-Side):**
- [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- [Tailwind CSS](https://tailwindcss.com/) (Styling & Animasi)
- [Lucide React](https://lucide.dev/) (Ikon Modern & Dinamis)
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Tipografi)

**Backend & API (Server-Side):**
- **Vercel Serverless Functions** (`/api`)
- **Google Generative AI SDK** (Gemini 1.5 Flash)
- **Jina Reader API** (Ekstraksi Konten Web)

---

## 🚀 Cara Instalasi & Menjalankan (Local Development)

Ikuti langkah-langkah berikut untuk menjalankan Automaton Pro secara lokal, lengkap dengan simulasi *serverless backend* Vercel:

### 1. Kloning Repositori
```bash
git clone [https://github.com/username-anda/automaton-pro.git](https://github.com/username-anda/automaton-pro.git)
cd automaton-pro

```

### 2. Instalasi Dependensi

Pastikan [Node.js](https://nodejs.org/) sudah terinstal di komputer Anda, lalu jalankan:

```bash
npm install

```

### 3. Pengaturan Environment Variable (.env)

Buat sebuah file bernama `.env` di folder utama proyek (sejajar dengan `package.json`), dan masukkan API Key Gemini Anda:

```env
VITE_GEMINI_API_KEY=masukkan_api_key_gemini_anda_di_sini

```

### 4. Menjalankan Simulator Vercel (Wajib untuk API)

Karena proyek ini memproses AI di backend (folder `/api`), kita tidak bisa menggunakan perintah Vite standar (`npm run dev`). Gunakan **Vercel CLI** untuk menjalankan server lokal:

```bash
npx vercel dev

```

*Jika ini pertama kalinya Anda menjalankan perintah tersebut, ikuti instruksi konfigurasi awal di terminal:*

* **Set up and develop?** ➔ Ketik `Y` lalu Enter.
* **Which scope do you want to deploy to?** ➔ Tekan `Enter`.
* **Link to existing project?** ➔ Ketik `N` (atau `Y` jika Anda ingin menyambungkannya ke *project* Vercel yang sudah ada).
* **What's your project's name?** ➔ Ketik `automaton-pro` lalu Enter.
* In which directory is your code located? ./  ➔ Tekan `Enter`.

Setelah proses sinkronisasi selesai, buka **`http://localhost:3000`** di *browser* Anda untuk mulai menggunakan Automaton Pro!

---

## 📂 Struktur Direktori (Arsitektur Modular)

Arsitektur kode dipisahkan secara modular agar bersih dan mudah dikelola:

```text
automaton-pro/
├── api/
│   └── summarize.js           # Backend: Otak AI (Gemini & Jina Reader)
├── src/
│   ├── components/            # UI Terpisah (Modular Components)
│   │   ├── Header.jsx         # Navigasi Tab
│   │   ├── TabRiset.jsx       # Logika & UI Pencarian Topik
│   │   ├── TabLink.jsx        # Logika & UI Analisis Link
│   │   ├── TabPdf.jsx         # Logika & UI Upload/Ekstrak PDF
│   │   └── TabRiwayat.jsx     # Logika & UI Jurnal Tersimpan (LocalStorage)
│   ├── App.jsx                # State Manager & Route Controller Utama
│   ├── index.css              # Konfigurasi Global Tailwind
│   └── main.jsx               # React Entry Point
├── tailwind.config.js         # Pengaturan Palet Warna & Font Kustom
└── package.json

```

---

## 🎨 Design System

Proyek ini menggunakan *design system* yang konsisten untuk menjaga estetika *Modern Minimalist*:

* **Primary:** Deep Teal (`#00505e`)
* **Secondary / Aksen:** Burnt Orange (`#9b4500`)
* **Background:** Soft Off-White (`#f6faff`)
* **Shadows:** Diwarnai halus dengan warna *teal* kustom (`rgba(22, 105, 122, 0.08)`) untuk memberikan efek kedalaman (*tactile*) yang bersih.

---
