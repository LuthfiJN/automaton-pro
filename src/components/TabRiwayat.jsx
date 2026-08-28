import { useState, useEffect } from 'react';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';

export default function TabRiwayat() {
  const [riwayat, setRiwayat] = useState([]);

  useEffect(() => {
    const dataSimpanan = JSON.parse(localStorage.getItem('automaton_bookmarks')) || [];
    setRiwayat(dataSimpanan);
  }, []);

  const hapusRiwayat = (judul) => {
    const dataBaru = riwayat.filter((item) => item.judul !== judul);
    setRiwayat(dataBaru);
    localStorage.setItem('automaton_bookmarks', JSON.stringify(dataBaru));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#00505e] mb-4">Jurnal Tersimpan</h1>
        <p className="text-[#3f484b]">Koleksi jurnal dan artikel yang telah Anda tandai.</p>
      </div>

      {riwayat.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-[#bfc8cb]">
          <Bookmark size={48} className="mx-auto text-[#bfc8cb] mb-4" />
          <p className="text-[#6f797c] font-medium">Belum ada jurnal yang disimpan.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {riwayat.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-[#ecf5ff] flex flex-col md:flex-row gap-6 items-start md:items-center transition-all hover:border-[#00505e]/20">
              <div className="flex-1">
                <span className="bg-[#fc7c23]/10 text-[#9b4500] px-2.5 py-1 rounded-md text-[12px] font-bold mb-3 inline-block">
                  {item.tahun || '-'}
                </span>
                <h3 className="text-[18px] font-bold text-[#00505e] mb-2">{item.judul}</h3>
                <p className="text-[14px] text-[#3f484b] line-clamp-2">{item.ringkasan}</p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-[#bfc8cb]/50 pt-4 md:pt-0 mt-4 md:mt-0">
                <a 
                  href={`https://scholar.google.com/scholar?q=${encodeURIComponent(item.judul)}`} 
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 text-[#00505e] hover:bg-[#e6eff9] rounded-lg transition-colors"
                >
                  <ExternalLink size={20} />
                </a>
                <button 
                  onClick={() => hapusRiwayat(item.judul)}
                  className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}