import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metode tidak diizinkan' });

  const { mode, input, fileName, modelType } = req.body;
  if (!input) return res.status(400).json({ error: 'Input tidak boleh kosong!' });

  const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: modelType || 'gemini-3.5-flash' });

  let prompt = "";
  let response; // Kita buat variabel penampung respon

  try {
    if (mode === 'link') {
      const jinaResponse = await fetch(`https://r.jina.ai/${input}`);
      const extractedText = await jinaResponse.text();
      
      prompt = `Kamu adalah asisten riset. Baca dan rangkum artikel ini: "${extractedText.substring(0, 30000)}". 
      Balas WAJIB murni dalam format JSON: 
      {
        "jurnal": [{"judul": "Judul Asli Artikel", "penulis": "Nama Penulis", "tahun": "-", "ringkasan": "Rangkuman mendalam 1-2 paragraf"}], 
        "kesimpulan_gabungan": "Intisari keseluruhan."
      }`;
      response = await model.generateContent(prompt);
      
    } else if (mode === 'auto') {
      prompt = `Kamu adalah asisten riset akademik profesional. Tugasmu mencari 3 jurnal ilmiah NYATA dan VALID tentang "${input}".
      ATURAN KETAT DILARANG MELANGGAR:
      1. Dilarang keras berhalusinasi atau mengarang judul! Jurnal HARUS benar-benar ada di indeks Google Scholar.
      2. Wajib terbitan maksimal 5 tahun terakhir.
      3. Sebutkan nama Penulis utamanya.
      4. Balas WAJIB format JSON murni:
      {
        "jurnal": [
          { "judul": "Judul Jurnal Nyata", "penulis": "Nama Penulis", "tahun": "202x", "ringkasan": "Rangkuman spesifik 1 paragraf" }
        ],
        "kesimpulan_gabungan": "Satu paragraf analitis yang menyimpulkan ketiga jurnal di atas."
      }`;
      response = await model.generateContent(prompt);
      
    } else if (mode === 'file') {
      prompt = `Kamu adalah asisten riset. Baca dan rangkum dokumen PDF yang dilampirkan ini.
      Balas WAJIB format JSON murni: 
      {
        "jurnal": [{"judul": "Judul Asli Dokumen", "penulis": "Nama Penulis", "tahun": "-", "ringkasan": "Rangkuman eksekutif isi dokumen yang komprehensif"}], 
        "kesimpulan_gabungan": "Kesimpulan akhir."
      }`;
      
      // KUNCINYA DI SINI: Kita kirim prompt DAN file PDF-nya secara bersamaan
      response = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: input, // input sekarang berisi kode Base64 dari frontend
            mimeType: "application/pdf"
          }
        }
      ]);
    }

    let textResult = response.response.text().trim();
    if (textResult.startsWith('```json')) {
      textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const data = JSON.parse(textResult);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Gagal memproses. Pastikan server tidak sibuk atau file terlalu besar.' });
  }
}