import { Search, Link as LinkIcon, FileText } from 'lucide-react';

export default function Header({ activeTab, gantiTab }) {
  return (
    <header className="sticky top-0 z-50 bg-[#f6faff]/80 backdrop-blur-md border-b border-[#bfc8cb] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-2xl font-bold text-[#00505e] tracking-tight">
        Automaton Pro
      </div>

      <div className="flex items-center bg-[#e6eff9] p-1 rounded-full border border-[#bfc8cb]">
        <button 
          onClick={() => gantiTab('auto')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-[14px] font-semibold transition-all ${activeTab === 'auto' ? 'bg-[#ffffff] text-[#00505e] shadow-[0_2px_8px_rgba(22,105,122,0.08)]' : 'text-[#3f484b] hover:text-[#00505e]'}`}
        >
          <Search size={18} /> Cari Topik
        </button>
        <button 
          onClick={() => gantiTab('link')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-[14px] font-semibold transition-all ${activeTab === 'link' ? 'bg-[#ffffff] text-[#00505e] shadow-[0_2px_8px_rgba(22,105,122,0.08)]' : 'text-[#3f484b] hover:text-[#00505e]'}`}
        >
          <LinkIcon size={18} /> Analisis Link
        </button>
        <button 
          onClick={() => gantiTab('file')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-[14px] font-semibold transition-all ${activeTab === 'file' ? 'bg-[#ffffff] text-[#00505e] shadow-[0_2px_8px_rgba(22,105,122,0.08)]' : 'text-[#3f484b] hover:text-[#00505e]'}`}
        >
          <FileText size={18} /> Upload PDF
        </button>
      </div>
    </header>
  );
}