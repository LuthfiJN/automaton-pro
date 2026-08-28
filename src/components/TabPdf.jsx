import { useState } from 'react';
import { FileText, Wand2, Copy, Check, User } from 'lucide-react';

export default function TabPdf({ hasil, isLoading, error, eksekusi }) {
  const [query, setQuery] = useState('');
  const [fileName, setFileName] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      // Mengambil format Base64 dari file (membuang prefix "data:application/pdf;base64,")
      const base64Data = event.target.result.split(',')[1];
      setQuery(base64Data); 
    };
    // KUNCINYA DI SINI: Jangan pakai readAsText, tapi readAsDataURL
    reader.readAsDataURL(file); 
  };

  const handleCopy = () => {
    const teks = hasil?.jurnal?.[0]?.ringkasan || hasil?.kesimpulan_gabungan;
    if (teks) {
      navigator.clipboard.writeText(teks);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-[32px] md:text-[40px] font-bold text-[#00505e] tracking-tight mb-4">
          Ekstrak & Rangkum Dokumen
        </h1>
        <p className="text-[18px] text-[#3f484b]">
          Unggah dokumen teks Anda untuk ekstraksi data dan ringkasan otomatis.
        </p>
      </div>

      <div className="relative bg-[#ecf5ff]/50 border-2 border-dashed border-[#00505e]/30 hover:border-[#00505e] hover:bg-[#ecf5ff] transition-all rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer mb-12 group">
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="w-16 h-16 rounded-full bg-[#ffffff] shadow-sm flex items-center justify-center text-[#00505e] mb-6 group-hover:scale-110 transition-transform">
          <FileText size={32} />
        </div>
        <h3 className="text-[18px] font-bold text-[#141d24] mb-2">
           {fileName ? `File Terpilih: ${fileName}` : "Drag & Drop File di sini atau Klik untuk Browse"}
        </h3>
        <p className="text-[14px] text-[#6f797c] mb-8">
          Mendukung file teks untuk demonstrasi portofolio
        </p>
        <button 
          onClick={() => eksekusi('file', query, fileName)}
          disabled={isLoading || !fileName}
          className="bg-[#00505e] hover:bg-[#9b4500] disabled:bg-[#6f797c] text-[#ffffff] px-8 py-3.5 rounded-xl font-semibold text-[16px] transition-colors flex items-center gap-2 shadow-[0_4px_12px_rgba(22,105,122,0.15)] relative z-10"
        >
          {isLoading ? 'Mengekstrak...' : <><Wand2 size={20} /> Ekstrak & Rangkum</>}
        </button>
      </div>

      {error && <div className="mb-8 p-4 bg-[#ffdad6] text-[#ba1a1a] rounded-xl font-medium text-center">❌ {error}</div>}

      {hasil && (
        <div className="animate-in fade-in">
          <h4 className="text-[12px] font-bold text-[#6f797c] tracking-wider mb-4 uppercase">
            HASIL EKSTRAKSI TERAKHIR
          </h4>
          <div className="bg-[#ffffff] p-6 rounded-2xl shadow-[0_4px_16px_rgba(22,105,122,0.06)] border border-[#e0e9f3]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#e8f2f4] flex items-center justify-center text-[#00505e]">
                <FileText size={24} />
              </div>
              <div>
                <h5 className="text-[16px] font-bold text-[#141d24]">{hasil.jurnal?.[0]?.judul || fileName}</h5>
                <p className="text-[14px] text-[#6f797c]">Data Berhasil Diekstrak</p>
              </div>
            </div>

            {hasil.jurnal?.[0]?.penulis && (
              <p className="text-[14px] font-semibold text-[#9b4500] mt-2 mb-2 flex items-center gap-1.5">
                <User size={14} />
                {hasil.jurnal[0].penulis}
              </p>
            )}

            <hr className="border-[#bfc8cb]/50 my-4" />
            <div>
              <span className="font-bold text-[#141d24] text-[16px] block mb-2">Ringkasan Eksekutif: </span>
              <span className="text-[#3f484b] text-[16px] leading-relaxed text-justify block whitespace-pre-wrap">
                {hasil.jurnal?.[0]?.ringkasan || hasil.kesimpulan_gabungan}
              </span>
            </div>

            <div className="mt-8 flex justify-end border-t border-[#bfc8cb]/50 pt-4">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-semibold text-[#00505e] hover:bg-[#e6eff9] transition-colors border border-[#00505e]/20"
              >
                {isCopied ? <><Check size={16} className="text-[#00505e]"/> Tersalin</> : <><Copy size={16} /> Salin Rangkuman</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}