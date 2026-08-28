import { useState } from 'react';
import Header from './components/Header';
import TabRiset from './components/TabRiset';
import TabLink from './components/TabLink';
import TabPdf from './components/TabPdf';

function App() {
  const [activeTab, setActiveTab] = useState('auto');
  const [hasil, setHasil] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const gantiTab = (tabBaru) => {
    setActiveTab(tabBaru);
    setHasil(null);
    setError('');
  };

  const jalankanAutomaton = async (modeEksekusi, inputQuery, fileName = '') => {
    if (!inputQuery.trim()) return setError("Data tidak boleh kosong!");
    setIsLoading(true); setHasil(null); setError('');

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: modeEksekusi, input: inputQuery, fileName, modelType: 'gemini-3.5-flash' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal memproses di server");
      setHasil(data);
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
        {activeTab === 'auto' && <TabRiset hasil={hasil} isLoading={isLoading} error={error} eksekusi={jalankanAutomaton} />}
        {activeTab === 'link' && <TabLink hasil={hasil} isLoading={isLoading} error={error} eksekusi={jalankanAutomaton} />}
        {activeTab === 'file' && <TabPdf hasil={hasil} isLoading={isLoading} error={error} eksekusi={jalankanAutomaton} />}
      </main>
    </div>
  );
}

export default App;