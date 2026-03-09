import { AnalysisResult } from '@/services/analysisService';
import { AlertTriangle, CheckCircle, Info, AlertOctagon } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'High': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Low': return <CheckCircle className="w-5 h-5" />;
      case 'Medium': return <AlertTriangle className="w-5 h-5" />;
      case 'High': return <AlertOctagon className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">{result.condition}</h2>
            <p className="text-slate-400 text-sm">AI Analysis Result</p>
          </div>
          <div className={`px-3 py-1 rounded-full border flex items-center gap-2 text-sm font-medium ${getRiskColor(result.riskLevel)}`}>
            {getRiskIcon(result.riskLevel)}
            {result.riskLevel} Risk
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-1">Visual Evidence</h3>
            <p className="text-slate-400 leading-relaxed">{result.description}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-1">Recommendation</h3>
            <p className="text-slate-400 leading-relaxed">{result.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Disclaimer Footer */}
      <div className="p-4 bg-slate-950/50 border-t border-slate-800">
        <div className="flex gap-3 items-start">
          <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            {result.disclaimer}
          </p>
        </div>
        <button
          onClick={onReset}
          className="mt-4 w-full py-2 px-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-sm transition-colors"
        >
          Analyze Another Photo
        </button>
      </div>
    </motion.div>
  );
}
