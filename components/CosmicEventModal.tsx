import React from 'react';
import { Sparkles, Zap, Infinity } from 'lucide-react';

interface CosmicEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CosmicEventModal: React.FC<CosmicEventModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border-2 border-fuchsia-500 rounded-2xl w-full max-w-md shadow-[0_0_100px_rgba(192,38,211,0.5)] flex flex-col items-center text-center p-8 relative overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(192,38,211,0.2)_0%,transparent_70%)] animate-pulse" />
        </div>

        <div className="relative z-10">
            <div className="mb-6 inline-block p-6 rounded-full bg-black/50 border border-fuchsia-500 shadow-[0_0_30px_#d946ef] animate-bounce">
                <Infinity className="w-16 h-16 text-fuchsia-400" />
            </div>

            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-200 to-fuchsia-400 mb-2 tracking-tighter">
                COSMIC ALIGNMENT
            </h2>
            
            <div className="text-fuchsia-300 font-mono text-sm mb-8 tracking-[0.2em] uppercase border-b border-fuchsia-500/30 pb-2">
                10-Minute Cycle Complete
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 border border-fuchsia-500/30 mb-8">
                <p className="text-slate-300 mb-2 text-sm">The universe has granted a massive boon.</p>
                <div className="flex items-center justify-center gap-3 text-2xl font-bold text-white">
                    <Zap className="text-yellow-400 fill-yellow-400" />
                    <span>PERMANENT 2x EARNINGS</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">This effect stacks forever.</p>
            </div>

            <button
                onClick={onClose}
                className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-xl rounded-xl shadow-lg shadow-fuchsia-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                <Sparkles className="w-5 h-5" /> ACCEPT POWER
            </button>
        </div>
      </div>
    </div>
  );
};