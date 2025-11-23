import React, { useState } from 'react';
import { X, Loader2, Gem } from 'lucide-react';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  gems: number;
  onSpin: (cost: number) => void;
}

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({ isOpen, onClose, gems, onSpin }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  
  if (!isOpen) return null;

  const handleSpin = () => {
      if (gems < 100 || isSpinning) return;
      setIsSpinning(true);
      setTimeout(() => {
          onSpin(100);
          setIsSpinning(false);
      }, 2000); // Fake spin duration
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-fuchsia-600 rounded-2xl w-full max-w-sm shadow-[0_0_50px_rgba(192,38,211,0.3)] flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent animate-pulse" />
        
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-black italic text-fuchsia-400 tracking-wider uppercase">
            Galactic Wheel
          </h2>
          <button onClick={onClose} disabled={isSpinning} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center gap-8">
            {/* Visual representation of wheel */}
            <div className={`w-48 h-48 rounded-full border-8 border-slate-800 relative flex items-center justify-center overflow-hidden bg-slate-950 shadow-inner
                 ${isSpinning ? 'animate-spin duration-75' : ''}
            `}>
                <div className="absolute inset-0 bg-[conic-gradient(var(--tw-gradient-stops))] from-fuchsia-900 via-purple-900 to-indigo-900 opacity-50" />
                <div className="absolute w-full h-0.5 bg-slate-800 rotate-0" />
                <div className="absolute w-full h-0.5 bg-slate-800 rotate-45" />
                <div className="absolute w-full h-0.5 bg-slate-800 rotate-90" />
                <div className="absolute w-full h-0.5 bg-slate-800 rotate-[135deg]" />
                <div className="z-10 w-12 h-12 bg-slate-800 rounded-full border-4 border-fuchsia-500 flex items-center justify-center">
                    <Gem className="w-6 h-6 text-fuchsia-400" />
                </div>
            </div>
            
            {/* Pointer */}
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-white absolute top-[120px]" />

            <button 
                onClick={handleSpin}
                disabled={gems < 100 || isSpinning}
                className={`w-full py-4 rounded-xl font-black text-xl uppercase tracking-widest transition-all
                    ${gems >= 100 && !isSpinning
                        ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:scale-105 text-white shadow-lg shadow-fuchsia-900/40' 
                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
            >
                {isSpinning ? (
                    <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> SPINNING...</span>
                ) : (
                    <span className="flex items-col items-center justify-center gap-2">
                        SPIN <span className="text-xs bg-black/30 px-2 py-1 rounded font-mono">100 GEMS</span>
                    </span>
                )}
            </button>
            
            <div className="text-xs text-center text-slate-500">
                Prizes: Massive Cash, Free Upgrades, Rare Items, or Jackpots!
            </div>
        </div>
      </div>
    </div>
  );
};