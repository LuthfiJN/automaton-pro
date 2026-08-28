import { useState } from 'react';
import { Link as LinkIcon, FileText, Globe } from 'lucide-react';

export default function TabLink({ hasil, isLoading, error, eksekusi }) {
  const [query, setQuery] = useState('');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-[32px] md:text-[40px] font-bold text-[#00505e] tracking-tight mb-4">
          Analisis Link Jurnal
        </h1>
        <p className="text-[18px] text-[#3f484b]">
          Masukkan tautan jurnal untuk mendapatkan ringkasan komprehensif.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1 group">
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6f797c] group-focus-within:text-[#00505e]" size={20} />
          <input 
            type="url" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="https://..."
            className="w-full bg-[#ffffff] border border-[#bfc8cb] text-[#141d24] text-[16px] pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#00505e] focus:ring-4 focus:ring-[#00505e]/10 transition-all shadow-sm"
          />
        </div>
        <button 
          onClick={() => eksekusi('link', query)}
          disabled={isLoading}
          className="bg-[#00505e] hover:bg-[#9b4500] disabled:bg-[#6f797c] text-[#ffffff] px-8 py-4 rounded-xl font-semibold text-[16px] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(22,105,122,0.15)]"
        >
          {isLoading ? 'Memproses...' : <><FileText size={20} /> Rangkum Jurnal</>}
        </button>
      </div>

      {error && <div className="mb-8 p-4 bg-[#ffdad6] text-[#ba1a1a] rounded-xl font-medium text-center">❌ {error}</div>}

      {hasil && (
        <div className="bg-[#ffffff] p-8 md:p-10 rounded-2xl shadow-[0_4px_16px_rgba(22,105,122,0.06)] border border-[#e0e9f3] animate-in fade-in">
          <div className="inline-flex items-center gap-1.5 bg-[#e8f2f4] text-[#00505e] px-3 py-1.5 rounded-md text-[12px] font-bold mb-6">
            <Globe size={14} /> Sumber Eksternal
          </div>
          <h3 className="text-[24px] font-bold text-[#00505e] mb-6 leading-tight">
            {hasil.jurnal?.[0]?.judul || 'Hasil Analisis Link'}
          </h3>
          <div className="text-[16px] text-[#3f484b] leading-relaxed whitespace-pre-wrap text-justify">
            {hasil.jurnal?.[0]?.ringkasan || hasil.kesimpulan_gabungan}
          </div>
        </div>
      )}
    </div>
  );
}