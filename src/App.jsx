import { useState } from 'react';

function App() {
  const [mode, setMode] = useState('auto');
  const [input, setInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [hasil, setHasil] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State baru untuk menyimpan pilihan dropdown model
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');

  // Menangani proses upload file teks lokal
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(event.target.result);
    };
    reader.readAsText(file); 
  };

  const jalankanAutomaton = async () => {
    if (!input.trim()) return setError("Input atau file tidak boleh kosong!");
    
    setIsLoading(true);
    setHasil(null);
    setError('');

    try {
      // Mengirim semua data (termasuk model pilihan) ke Vercel API Backend
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, input, fileName, modelType: selectedModel }),
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

  // Fungsi untuk mengganti mode dan mereset layar
  const gantiMode = (modeBaru) => {
    setMode(modeBaru);
    setInput('');
    setFileName('');
    setHasil(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header & Navigasi Tab */}
        <div className="bg-slate-900 p-8 text-white text-center">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Automaton Pro</h1>
          <p className="text-slate-400 font-medium">Asisten Riset berbasis AI dengan Pemilihan Model</p>
          
          <div className="flex justify-center mt-8 gap-3 flex-wrap">
            <button onClick={() => gantiMode('auto')} className={`px-5 py-2.5 rounded-lg font-bold transition-all ${mode === 'auto' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
              🔍 Riset Topik
            </button>
            <button onClick={() => gantiMode('link')} className={`px-5 py-2.5 rounded-lg font-bold transition-all ${mode === 'link' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
              🔗 Analisis Link
            </button>
            <button onClick={() => gantiMode('file')} className={`px-5 py-2.5 rounded-lg font-bold transition-all ${mode === 'file' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
              📄 Upload File
            </button>
          </div>
        </div>

        {/* Area Input & Pemilih Model */}
        <div className="p-8 md:p-10">
          
          {/* Dropdown Pemilih Model */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-sm font-semibold text-slate-600">🧠 Engine AI:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-sm font-bold text-indigo-700 outline-none cursor-pointer"
              >
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Paling Cerdas)</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Cepat & Stabil)</option>
                <option value="gemini-pro">Gemini Pro (Standar)</option>
              </select>
            </div>
          </div>

          {/* Input Berdasarkan Mode */}
          {mode === 'auto' && (
            <input 
              type="text" 
              placeholder="Masukkan topik riset... (Contoh: Dampak IoT di Smart City)"
              className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          )}

          {mode === 'link' && (
            <input 
              type="url" 
              placeholder="Paste URL / Link artikel di sini..."
              className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          )}

          {mode === 'file' && (
            <div className="w-full p-8 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer relative">
              <input 
                type="file" 
                accept=".txt,.csv,.md" 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="text-4xl mb-3 block">📂</span>
              <p className="font-bold text-slate-700">
                {fileName ? `File Terpilih: ${fileName}` : "Klik atau Seret File (.txt) ke Sini"}
              </p>
            </div>
          )}

          <button 
            onClick={jalankanAutomaton}
            disabled={isLoading || (!input && !fileName)}
            className="w-full mt-6 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isLoading ? '⏳ Memproses dengan AI...' : 'Jalankan Automaton'}
          </button>

          {error && <div className="mt-6 p-4 bg-red-50 text-red-600 border border-red-200 font-semibold rounded-xl">❌ {error}</div>}
        </div>

        {/* Bagian Hasil Ekstraksi */}
        {hasil && (
          <div className="p-8 md:p-10 bg-slate-50 border-t border-slate-200 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">📑 Hasil Ekstraksi & Ringkasan</h2>
            
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mb-10">
              {hasil.jurnal.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-md w-max mb-4">
                    Tahun: {item.tahun}
                  </span>
                  <h3 className="font-bold text-slate-800 mb-3">{item.judul}</h3>
                  <p className="text-slate-600 text-sm mb-6 flex-grow">{item.ringkasan}</p>
                  
                  {/* Hanya munculkan link Scholar di mode 'auto' */}
                  {mode === 'auto' && (
                    <a 
                      href={`[https://scholar.google.com/scholar?q=$](https://scholar.google.com/scholar?q=$){encodeURIComponent(item.judul)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-auto block text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-lg text-sm transition-colors"
                    >
                      Cari di Scholar ↗
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 border border-indigo-200 p-8 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-indigo-900 mb-3">💡 Kesimpulan Gabungan</h3>
              <p className="text-indigo-950 leading-relaxed text-justify">{hasil.kesimpulan_gabungan}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;