import { useState } from 'react';
import Header from './components/Header';
import TabRiset from './components/TabRiset';
import TabLink from './components/TabLink';
import TabPdf from './components/TabPdf';
import TabRiwayat from './components/TabRiwayat';

function App() {
  const [activeTab, setActiveTab] = useState('auto');
  
  // Pisahkan state hasil agar tiap tab punya datanya sendiri
  const [hasilRiset, setHasilRiset] = useState(null);
  const [hasilLink, setHasilLink] = useState(null);
  const [hasilPdf, setHasilPdf] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const gantiTab = (tabBaru) => {
    setActiveTab(tabBaru);
    setError(''); // Hanya hapus error, jangan hapus hasil
  };

  const jalankanAutomaton = async (modeEksekusi, inputQuery, fileName = '') => {
    if (!inputQuery.trim()) return setError("Data tidak boleh kosong!");
    setIsLoading(true); setError('');

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: modeEksekusi, input: inputQuery, fileName, modelType: 'gemini-3.5-flash' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal memproses di server");
      
      // Simpan hasil ke tab yang sesuai
      if (modeEksekusi === 'auto') setHasilRiset(data);
      if (modeEksekusi === 'link') setHasilLink(data);
      if (modeEksekusi === 'file') setHasilPdf(data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#f6faff] text-[#141d24]">
      <Header activeTab={activeTab} gantiTab={gantiTab} />
      <main className="max-w-[1200px] mx-auto px-4 md:px-12 py-10 md:py-16">
        {/* Menggunakan CSS block/hidden agar komponen tidak reset saat ganti tab */}
        <div className={activeTab === 'auto' ? 'block' : 'hidden'}>
          <TabRiset hasil={hasilRiset} isLoading={isLoading} error={error} eksekusi={jalankanAutomaton} />
        </div>
        <div className={activeTab === 'link' ? 'block' : 'hidden'}>
          <TabLink hasil={hasilLink} isLoading={isLoading} error={error} eksekusi={jalankanAutomaton} />
        </div>
        <div className={activeTab === 'file' ? 'block' : 'hidden'}>
          <TabPdf hasil={hasilPdf} isLoading={isLoading} error={error} eksekusi={jalankanAutomaton} />
        </div>
        <div className={activeTab === 'riwayat' ? 'block' : 'hidden'}>
          <TabRiwayat />
        </div>
      </main>
    </div>
  );
}

export default App;