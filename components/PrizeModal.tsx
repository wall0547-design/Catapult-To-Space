


import React from 'react';
import { X, Gift, Zap, DollarSign, Gem, Package } from 'lucide-react';

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'money' | 'gems' | 'power' | 'economy' | 'item';
}

const CARTOON_MONEY_IMG = "https://cdn-icons-png.flaticon.com/512/2454/2454269.png";

export const PrizeModal: React.FC<PrizeModalProps> = ({ isOpen, onClose, title, message, type }) => {
  if (!isOpen) return null;

  const getIcon = () => {
      switch(type) {
          case 'money': return <img src={CARTOON_MONEY_IMG} className="w-16 h-16 object-contain" alt="Money" />;
          case 'gems': return <Gem className="w-16 h-16 text-fuchsia-400" />;
          case 'power': return <Zap className="w-16 h-16 text-red-400" />;
          case 'economy': return <DollarSign className="w-16 h-16 text-blue-400" />;
          case 'item': return <Package className="w-16 h-16 text-yellow-400" />;
      }
  };

  const getColor = () => {
      switch(type) {
          case 'money': return 'border-green-500 shadow-green-500/50';
          case 'gems': return 'border-fuchsia-500 shadow-fuchsia-500/50';
          case 'power': return 'border-red-500 shadow-red-500/50';
          case 'economy': return 'border-blue-500 shadow-blue-500/50';
          case 'item': return 'border-yellow-500 shadow-yellow-500/50';
      }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in zoom-in duration-300">
      <div className={`bg-slate-900 border-4 rounded-3xl p-8 flex flex-col items-center text-center max-w-sm w-full relative shadow-[0_0_50px_rgba(0,0,0,0.5)] ${getColor()}`}>
        
        {/* Glow effect background */}
        <div className="absolute inset-0 bg-white/5 rounded-3xl animate-pulse" />

        <div className="relative z-10 mb-6 p-6 bg-slate-950 rounded-full border border-slate-700 shadow-xl">
            {getIcon()}
        </div>

        <h2 className="relative z-10 text-3xl font-black text-white italic tracking-wider mb-2 uppercase drop-shadow-lg">
            {title}
        </h2>
        
        <p className="relative z-10 text-xl font-mono text-slate-300 mb-8">
            {message}
        </p>

        <button 
            onClick={onClose}
            className="relative z-10 w-full py-4 bg-white text-slate-950 font-bold text-xl rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
            CLAIM REWARD
        </button>
      </div>
    </div>
  );
};
