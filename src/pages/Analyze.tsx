import { useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { analyzeSkinImage, AnalysisResult } from '@/services/analysisService';
import { motion, AnimatePresence } from 'motion/react';
import { useGamification } from '@/hooks/useGamification';
import { Plus, ChevronLeft, User, ArrowRight } from 'lucide-react';

const BODY_PARTS = [
  { id: 'face', label: 'Face', icon: '👤' },
  { id: 'neck', label: 'Neck', icon: '🧣' },
  { id: 'chest', label: 'Chest', icon: '👕' },
  { id: 'back', label: 'Back', icon: '🔙' },
  { id: 'arms', label: 'Arms', icon: '💪' },
  { id: 'hands', label: 'Hands', icon: '✋' },
  { id: 'legs', label: 'Legs', icon: '🦵' },
  { id: 'feet', label: 'Feet', icon: '🦶' },
  { id: 'other', label: 'Other', icon: '❓' },
];

export default function Analyze() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addXP } = useGamification();
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [step, setStep] = useState<'select-part' | 'upload' | 'result'>('select-part');

  const handleBodyPartSelect = (partId: string) => {
    setSelectedBodyPart(partId);
    setStep('upload');
  };

  const handleBackToSelect = () => {
    setStep('select-part');
    setSelectedBodyPart(null);
    setError(null);
  };

  const handleAnalyze = async (base64Image: string) => {
    if (!selectedBodyPart) {
      setError("Please select a body part first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setXpAwarded(null);
    try {
      const data = await analyzeSkinImage(base64Image, selectedBodyPart);
      setResult(data);
      setStep('result');
      
      // Save to history
      const historyItem = {
        ...data,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        image: base64Image,
        bodyPart: selectedBodyPart
      };
      const savedHistory = JSON.parse(localStorage.getItem('derma_history') || '[]');
      localStorage.setItem('derma_history', JSON.stringify([historyItem, ...savedHistory]));

      // Award XP
      const xpAmount = 50;
      addXP(xpAmount);
      setXpAwarded(xpAmount);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setXpAwarded(null);
    setStep('select-part');
    setSelectedBodyPart(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] relative w-full max-w-4xl mx-auto px-4">
      {/* XP Animation Overlay */}
      <AnimatePresence>
        {xpAwarded && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex flex-col items-center"
          >
            <div className="flex items-center gap-2 text-amber-400 font-black text-4xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              <Plus size={32} strokeWidth={4} />
              {xpAwarded} XP
            </div>
            <div className="text-white font-bold text-lg mt-2 drop-shadow-md">Scan Complete!</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-8 w-full">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          {step === 'select-part' ? 'Where is the issue?' : 
           step === 'upload' ? 'Capture Image' : 'Analysis Results'}
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          {step === 'select-part' ? 'Select the body part you want to analyze to help the AI focus.' :
           step === 'upload' ? `Take a clear photo of your ${selectedBodyPart} for analysis.` :
           'Review the AI analysis and recommendations below.'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-medium text-center"
          >
            {error}
          </motion.div>
        )}

        {step === 'select-part' && (
          <motion.div
            key="select-part"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3 w-full max-w-md"
          >
            {BODY_PARTS.map((part) => (
              <button
                key={part.id}
                onClick={() => handleBodyPartSelect(part.id)}
                className="flex flex-col items-center justify-center p-4 bg-slate-800/50 hover:bg-indigo-500/20 border border-slate-700 hover:border-indigo-500/50 rounded-xl transition-all group aspect-square"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{part.icon}</span>
                <span className="text-sm font-medium text-slate-300 group-hover:text-indigo-300">{part.label}</span>
              </button>
            ))}
          </motion.div>
        )}

        {step === 'upload' && (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center"
          >
            <button 
              onClick={handleBackToSelect}
              className="self-start mb-4 flex items-center text-slate-400 hover:text-white text-sm transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to selection
            </button>
            
            <ImageUploader 
              onAnalyze={handleAnalyze} 
              isAnalyzing={isAnalyzing} 
            />
          </motion.div>
        )}

        {step === 'result' && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-center"
          >
            <ResultsDisplay 
              result={result} 
              onReset={handleReset} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
