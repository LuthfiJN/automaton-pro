import { useState, useEffect } from 'react';
import { Search, Bookmark, CheckCircle, ArrowRight, Sparkles, Copy, Check, FileText, User } from 'lucide-react';

export default function TabRiset({ hasil, isLoading, error, eksekusi }) {
  const [query, setQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [savedJournals, setSavedJournals] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('automaton_bookmarks')) || [];
    const initialSaved = {};
    saved.forEach(item => {
      initialSaved[item.judul] = true;
    });
    setSavedJournals(initialSaved);
  }, [hasil]);

  const handleCopy = () => {
    if (hasil?.kesimpulan_gabungan) {
      navigator.clipboard.writeText(hasil.kesimpulan_gabungan);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const toggleBookmark = (item) => {
    let savedList = JSON.parse(localStorage.getItem('automaton_bookmarks')) || [];
    const isSaved = savedJournals[item.judul];
    
    if (isSaved) {
      savedList = savedList.filter(savedItem => savedItem.judul !== item.judul);
    } else {
      savedList.push(item);
    }
    
    localStorage.setItem('automaton_bookmarks', JSON.stringify(savedList));
    setSavedJournals(prev => ({ ...prev, [item.judul]: !isSaved }));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h1 className="text-[32px] md:text-[40px] font-bold text-[#00505e] tracking-tight mb-4">
          Eksplorasi Jurnal Cerdas
        </h1>
        <p className="text-[18px] text-[#3f484b]">
          Masukkan topik penelitian untuk menemukan dan merangkum jurnal maksimal 5 tahun terakhir.
        </p>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 mb-16">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6f797c] group-focus-within:text-[#00505e]" size={20} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && eksekusi('auto', query)}
            placeholder="Contoh: Dampak AI pada pendidikan..."
            className="w-full bg-[#ffffff] border border-[#bfc8cb] text-[#141d24] text-[16px] pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#00505e] focus:ring-4 focus:ring-[#00505e]/10 transition-all shadow-sm"
          />
        </div>
        <button 
          onClick={() => eksekusi('auto', query)}
          disabled={isLoading}
          className="bg-[#00505e] hover:bg-[#9b4500] disabled:bg-[#6f797c] text-[#ffffff] px-8 py-4 rounded-xl font-semibold text-[16px] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(22,105,122,0.15)]"
        >
          {isLoading ? 'Menganalisis...' : 'Mulai Riset'}
        </button>
      </div>

      {error && <div className="mb-8 p-4 bg-[#ffdad6] text-[#ba1a1a] rounded-xl font-medium text-center">❌ {error}</div>}

      {hasil && (
        <div className="mb-10 animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[24px] font-semibold text-[#00505e]">Hasil Temuan Teratas</h2>
            <div className="bg-[#895400] text-[#ffffff] px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1">
              <FileText size={14} /> {hasil.jurnal?.length || 0} Jurnal Ditemukan
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {hasil.jurnal?.map((item, index) => (
              <div key={index} className="bg-[#ffffff] p-6 rounded-2xl shadow-[0_4px_16px_rgba(22,105,122,0.06)] border border-[#ecf5ff] hover:border-[#00505e]/20 transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-[#fc7c23]/10 text-[#9b4500] px-2.5 py-1 rounded-md text-[12px] font-bold">
                    {item.tahun}
                  </span>
                  <button onClick={() => toggleBookmark(item)}>
                    <Bookmark 
                      size={18} 
                      className={`cursor-pointer transition-colors ${savedJournals[item.judul] ? 'fill-[#9b4500] text-[#9b4500]' : 'text-[#bfc8cb] hover:text-[#00505e]'}`} 
                    />
                  </button>
                </div>
                
                <h3 className="text-[18px] font-bold text-[#00505e] mb-1 leading-snug">{item.judul}</h3>
                
                <p className="text-[14px] font-semibold text-[#9b4500] mb-3 flex items-center gap-1.5">
                  <User size={14} />
                  {item.penulis || 'Penulis tidak diketahui'}
                </p>

                <p className="text-[14px] text-[#3f484b] mb-6 flex-grow leading-relaxed">{item.ringkasan}</p>
                
                <hr className="border-[#bfc8cb]/50 mb-4" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#16697a]">
                    <CheckCircle size={16} className="text-[#9b4500]" /> Relevansi Tinggi
                  </div>
                  <a 
                    href={`https://scholar.google.com/scholar?q=${encodeURIComponent(item.judul)}`} 
                    target="_blank" rel="noopener noreferrer"
                    className="text-[12px] font-bold text-[#00505e] hover:text-[#9b4500] flex items-center gap-1"
                  >
                    Cari di Scholar <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#fc7c23]/10 border border-[#fc7c23]/20 rounded-2xl p-8 md:p-10 shadow-[0_4px_16px_rgba(22,105,122,0.04)] relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#9b4500] flex items-center justify-center text-[#ffffff]">
                <Sparkles size={20} />
              </div>
              <h3 className="text-[24px] font-bold text-[#00505e]">Kesimpulan Gabungan AI</h3>
            </div>
            <div className="text-[16px] text-[#3f484b] leading-relaxed mb-8 text-justify whitespace-pre-wrap">
              {hasil.kesimpulan_gabungan}
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-semibold text-[#00505e] hover:bg-[#e6eff9] transition-colors border border-[#00505e]/20"
              >
                {isCopied ? <><Check size={16} className="text-[#00505e]"/> Berhasil Disalin</> : <><Copy size={16} /> Salin Teks</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}