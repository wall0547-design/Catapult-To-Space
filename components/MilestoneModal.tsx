
import React from 'react';
import { Flag, Star, ArrowRight } from 'lucide-react';

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  height: number;
  reward: number;
  message: string;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({ isOpen, onClose, height, reward, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black border-4 border-indigo-400 rounded-3xl p-8 max-w-md w-full flex flex-col items-center text-center shadow-[0_0_100px_rgba(99,102,241,0.5)] relative overflow-hidden">
        
        {/* Animated Background Rays */}
        <div className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg,transparent_0deg,transparent_20deg,rgba(255,255,255,0.05)_20deg,rgba(255,255,255,0.05)_40deg)] animate-[spin_20s_linear_infinite]" />

        <div className="relative z-10">
            <div className="inline-block p-4 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50 mb-6 animate-bounce">
                <Flag className="w-12 h-12 text-white fill-white" />
            </div>

            <h2 className="text-3xl font-black text-white italic uppercase tracking-wider mb-2 drop-shadow-lg">
                ALTITUDE RECORD
            </h2>

            <div className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
                {height.toLocaleString()} FT
            </div>

            <div className="bg-white/10 p-4 rounded-xl border border-white/20 mb-8 backdrop-blur-sm">
                <p className="text-slate-300 text-sm mb-2">{message}</p>
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-400">
                    <Star className="w-6 h-6 fill-green-400 text-green-400" />
                    +${reward.toLocaleString()}
                </div>
            </div>

            <button
                onClick={onClose}
                className="w-full py-4 bg-white hover:bg-indigo-50 text-indigo-950 font-black text-xl rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2"
            >
                CONTINUE MISSION <ArrowRight className="w-6 h-6" />
            </button>
        </div>
      </div>
    </div>
  );
};
