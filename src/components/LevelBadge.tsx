import { motion } from 'motion/react';
import { Trophy, Star, Zap } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

export function LevelBadge() {
  const { progress, getProgressToNextLevel } = useGamification();

  return (
    <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-full pl-2 pr-4 py-1.5">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-slate-900 font-bold text-xs shadow-lg shadow-teal-500/20">
          {progress.level}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-0.5 border-2 border-slate-900">
          <Star size={8} fill="currentColor" className="text-amber-900" />
        </div>
      </div>
      
      <div className="flex flex-col gap-0.5 min-w-[80px]">
        <div className="flex justify-between items-center text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          <span>Level {progress.level}</span>
          <span className="text-teal-400">{Math.floor(getProgressToNextLevel())}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${getProgressToNextLevel()}%` }}
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
