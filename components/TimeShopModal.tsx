import React, { useState, useEffect } from 'react';
import { Clock, Gift, Star, X } from 'lucide-react';
import { TimeShopItem, Rarity } from '../types';

interface TimeShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TimeShopItem | null;
  nextRefresh: number;
  money: number;
  onBuy: (item: TimeShopItem) => void;
}

export const TimeShopModal: React.FC<TimeShopModalProps> = ({ isOpen, onClose, item, nextRefresh, money, onBuy }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.max(0, nextRefresh - Date.now());
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
      
      if (diff <= 0) {
        // Trigger a refresh callback if needed, handled by App usually
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextRefresh]);

  if (!isOpen) return null;

  const getRarityColor = (rarity: Rarity) => {
    switch (rarity) {
      case 'Common': return 'text-slate-400 border-slate-400';
      case 'Rare': return 'text-blue-400 border-blue-400';
      case 'Epic': return 'text-purple-400 border-purple-400';
      case 'Legendary': return 'text-yellow-400 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]';
      case '???': return 'text-red-500 border-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]';
      default: return 'text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-600 rounded-2xl w-full max-w-md shadow-2xl flex flex-col">
        
        <div className="flex items-center justify-between p-4 bg-slate-800/80 border-b border-slate-700 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="text-cyan-400" /> Time Shop
          </h2>
          <div className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">
             Refresh: {timeLeft}
          </div>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-slate-400 hover:text-white" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-6">
          {!item ? (
            <div className="text-slate-400 py-10">Out of stock. Wait for refresh.</div>
          ) : (
            <>
              <div className={`w-full border-2 rounded-xl p-6 bg-slate-800/50 flex flex-col items-center text-center gap-3 ${getRarityColor(item.rarity)}`}>
                <div className="p-4 rounded-full bg-slate-900 border border-current">
                   <Gift className="w-12 h-12" />
                </div>
                <div>
                    <div className="uppercase text-xs tracking-widest font-bold mb-1">{item.rarity}</div>
                    <h3 className="text-2xl font-bold text-white">{item.name}</h3>
                </div>
                <p className="text-sm text-slate-300">{item.description}</p>
                
                <div className="mt-4 flex items-center gap-1 text-yellow-400 font-bold">
                   {item.type === 'cash' && <span className="text-lg">+{item.value.toLocaleString()} $</span>}
                   {item.type !== 'cash' && <span className="text-lg">Upgrade Boost!</span>}
                </div>
              </div>

              <button
                onClick={() => onBuy(item)}
                disabled={money < item.cost}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                    ${money >= item.cost 
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-105 text-white shadow-lg shadow-cyan-900/20' 
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
              >
                <span>Buy for</span>
                <span className="bg-black/20 px-2 py-0.5 rounded flex items-center">
                    ${item.cost.toLocaleString()}
                </span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};