import { AnalysisResult } from '@/services/analysisService';
import { Clock, AlertTriangle, CheckCircle, AlertOctagon, Trash2, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export default function History() {
  const [history, setHistory] = useState<(AnalysisResult & { id: string, date: string, image: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('derma_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('derma_history');
    setHistory([]);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-400';
      case 'Medium': return 'text-amber-400';
      case 'High': return 'text-rose-400';
      default: return 'text-slate-400';
    }
  };

  const filteredHistory = history.filter(item => {
    const term = searchTerm.toLowerCase();
    const dateStr = new Date(item.date).toLocaleDateString().toLowerCase();
    return item.condition.toLowerCase().includes(term) || dateStr.includes(term);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <Clock className="text-teal-500" />
          Scan History
        </h1>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors text-sm"
          >
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by condition or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
        />
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-slate-500">No scans recorded yet.</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-slate-500">No matching scans found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredHistory.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:border-slate-700 transition-colors"
            >
              <div className="flex p-4 gap-4">
                <img 
                  src={item.image} 
                  alt="Scan thumbnail" 
                  className="w-20 h-20 object-cover rounded-lg bg-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-100 truncate">{item.condition}</h3>
                    <span className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <p className={`text-sm font-medium mt-1 ${getRiskColor(item.riskLevel)}`}>
                    {item.riskLevel} Risk
                  </p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
