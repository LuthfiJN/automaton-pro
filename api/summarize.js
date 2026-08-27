import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metode tidak diizinkan' });

  // Menerima input teks/link, jenis mode, dan model AI yang dipilih dari dropdown
  const { mode, input, fileName, modelType } = req.body;
  if (!input) return res.status(400).json({ error: 'Input tidak boleh kosong!' });

  const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
  // Menggunakan model yang dipilih (Jika gagal/kosong, otomatis pakai 3.5-flash)
  const model = genAI.getGenerativeModel({ model: modelType || 'gemini-3.5-flash' });

  let prompt = "";
  
  if (mode === 'auto') {
    prompt = `Kamu adalah asisten riset akademik. Cari 3 jurnal ilmiah nyata tentang "${input}".
    Aturan wajib:
    1. Tahun terbit harus 5 tahun terakhir.
    2. Format balasanmu WAJIB murni JSON dengan struktur ini, tanpa teks pengantar atau markdown block:
    {
      "jurnal": [
        { "judul": "Judul Asli Jurnal", "tahun": "202x", "ringkasan": "Rangkuman spesifik 1 paragraf" }
      ],
      "kesimpulan_gabungan": "Satu paragraf solid yang membandingkan dan menyimpulkan ketiga jurnal di atas."
    }`;
  } else if (mode === 'link') {
    prompt = `Kamu adalah asisten riset. Baca, ekstrak, dan rangkum isi artikel dari link berikut: "${input}". 
    Balas WAJIB murni dalam format JSON tanpa teks markdown: 
    {
      "jurnal": [
        {"judul": "Judul dari Link", "tahun": "-", "ringkasan": "Rangkuman mendalam dari artikel ini"}
      ], 
      "kesimpulan_gabungan": "Intisari keseluruhan."
    }`;
  } else if (mode === 'file') {
    prompt = `Kamu adalah asisten riset. Baca teks dokumen berikut: "${input}". 
    Balas WAJIB murni dalam format JSON tanpa teks markdown: 
    {
      "jurnal": [
        {"judul": "Dokumen: ${fileName || 'Upload Manual'}", "tahun": "-", "ringkasan": "Rangkuman eksekutif dari isi dokumen"}
      ], 
      "kesimpulan_gabungan": "Kesimpulan akhir dokumen."
    }`;
  }

  try {
    const response = await model.generateContent(prompt);
    let textResult = response.response.text().trim();
    
    // Pembersihan jika AI masih menyelipkan format markdown JSON
    if (textResult.startsWith('```json')) {
      textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const data = JSON.parse(textResult);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Gagal merangkum. Pastikan teks valid, server sedang tidak sibuk, atau ganti model AI.' });
  }
}