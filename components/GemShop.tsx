import React from 'react';
import { Diamond, X, Zap, DollarSign, Rocket } from 'lucide-react';

interface GemShopProps {
  isOpen: boolean;
  onClose: () => void;
  gems: number;
  onBuy: (item: string, cost: number) => void;
}

export const GemShop: React.FC<GemShopProps> = ({ isOpen, onClose, gems, onBuy }) => {
  if (!isOpen) return null;

  const items = [
    { id: 'cash_small', name: 'Small Cash Bundle', description: 'Get $10,000 instantly.', cost: 5, icon: <DollarSign className="text-green-400" /> },
    { id: 'cash_large', name: 'Large Cash Bundle', description: 'Get $1,000,000 instantly.', cost: 25, icon: <DollarSign className="text-green-400" /> },
    { id: 'multiplier', name: 'Golden Paint', description: 'Permanently doubles all money earned.', cost: 100, icon: <Zap className="text-yellow-400" /> },
    { id: 'boost', name: 'Mega Boost', description: 'Next launch is 5x more powerful.', cost: 10, icon: <Rocket className="text-red-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-fuchsia-500 rounded-2xl w-full max-w-lg shadow-2xl shadow-fuchsia-900/20 flex flex-col">
        
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Diamond className="text-fuchsia-400 fill-fuchsia-400/20" /> Gem Store
          </h2>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-700">
             <Diamond className="w-4 h-4 text-fuchsia-400" />
             <span className="font-mono text-white">{gems}</span>
          </div>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-slate-400 hover:text-white" />
          </button>
        </div>

        <div className="p-6 grid gap-4">
          {items.map(item => (
             <div key={item.id} className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                        {item.icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{item.name}</h3>
                        <p className="text-xs text-slate-400">{item.description}</p>
                    </div>
                </div>
                <button 
                    onClick={() => onBuy(item.id, item.cost)}
                    disabled={gems < item.cost}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all
                        ${gems >= item.cost 
                            ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-900/20' 
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                    `}
                >
                    {item.cost} Gems
                </button>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};