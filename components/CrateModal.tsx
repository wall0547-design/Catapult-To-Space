



import React, { useState, useEffect } from 'react';
import { X, Package, Hexagon, Loader2, DollarSign, Gem, Star } from 'lucide-react';
import { InventoryItem } from '../types';

interface PrizeResult {
  type: 'money' | 'gems' | 'item';
  name: string;
  val: number;
  item?: InventoryItem;
}

interface CrateModalProps {
  isOpen: boolean;
  onClose: () => void;
  money: number;
  gems: number;
  onSpin: () => PrizeResult | null;
}

const CARTOON_MONEY_IMG = "https://cdn-icons-png.flaticon.com/512/2454/2454269.png";

export const CrateModal: React.FC<CrateModalProps> = ({ isOpen, onClose, money, gems, onSpin }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<PrizeResult | null>(null);
  const [displayIcon, setDisplayIcon] = useState<React.ReactNode>(<Package className="w-20 h-20 text-slate-600" />);
  
  const COST_MONEY = 1000000;
  const COST_GEMS = 1000;

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
        setPrize(null);
        setIsSpinning(false);
        setDisplayIcon(<Package className="w-20 h-20 text-slate-600" />);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (money < COST_MONEY || gems < COST_GEMS || isSpinning) return;

    const result = onSpin();
    if (!result) return;

    setIsSpinning(true);
    setPrize(null);

    // Animation Sequence
    let ticks = 0;
    const maxTicks = 20;
    const interval = setInterval(() => {
        ticks++;
        // Cycle icons randomly
        const rand = Math.random();
        if (rand < 0.33) setDisplayIcon(<img src={CARTOON_MONEY_IMG} className="w-20 h-20 object-contain" alt="$" />);
        else if (rand < 0.66) setDisplayIcon(<Gem className="w-20 h-20 text-fuchsia-400" />);
        else setDisplayIcon(<Star className="w-20 h-20 text-yellow-400" />);

        if (ticks >= maxTicks) {
            clearInterval(interval);
            setIsSpinning(false);
            setPrize(result);
            
            // Set final icon
            if (result.type === 'money') setDisplayIcon(<img src={CARTOON_MONEY_IMG} className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]" alt="$" />);
            else if (result.type === 'gems') setDisplayIcon(<Gem className="w-24 h-24 text-fuchsia-400 drop-shadow-[0_0_15px_rgba(232,121,249,0.8)]" />);
            else setDisplayIcon(<Hexagon className="w-24 h-24 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />);
        }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="relative bg-slate-900 border-2 border-purple-500/50 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col overflow-hidden">
        
        {/* Background FX */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        
        <div className="flex items-center justify-between p-4 bg-slate-900/80 border-b border-purple-500/30 relative z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2 italic tracking-wider">
            <Package className="text-purple-400" /> ELITE CRATE
          </h2>
          <button onClick={onClose} disabled={isSpinning} className="p-2 hover:bg-slate-800 rounded-full transition-colors disabled:opacity-50">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center gap-8 relative z-10">
            
            {/* Crate Display */}
            <div className={`w-48 h-48 bg-slate-950 rounded-2xl border-4 border-slate-800 flex items-center justify-center shadow-inner relative
                ${isSpinning ? 'animate-pulse border-purple-500' : ''}
                ${prize ? 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]' : ''}
            `}>
                {isSpinning ? (
                    <div className="animate-spin-slow transform transition-all duration-100">{displayIcon}</div>
                ) : prize ? (
                    <div className="animate-in zoom-in duration-300">{displayIcon}</div>
                ) : (
                    <div className="opacity-50"><Package className="w-24 h-24 text-slate-700" /></div>
                )}
            </div>

            {/* Prize Text */}
            <div className="h-16 text-center">
                {prize ? (
                    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                        <div className="text-yellow-400 font-black text-xl uppercase tracking-widest mb-1">ACQUIRED</div>
                        <div className="text-white font-bold text-lg shadow-black drop-shadow-md">{prize.name}</div>
                    </div>
                ) : (
                    <div className="text-slate-500 text-sm flex flex-col items-center">
                        <span>Contains Legendary Items,</span>
                        <span>Millions in Cash, or Gem Packs.</span>
                    </div>
                )}
            </div>

            {/* Action Button */}
            {!prize ? (
                <button 
                    onClick={handleSpin}
                    disabled={money < COST_MONEY || gems < COST_GEMS || isSpinning}
                    className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1
                        ${money >= COST_MONEY && gems >= COST_GEMS && !isSpinning
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 text-white shadow-lg shadow-purple-900/40' 
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                        }`}
                >
                    {isSpinning ? (
                        <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> DECRYPTING...</span>
                    ) : (
                        <>
                            <span>UNLOCK CRATE</span>
                            <div className="flex items-center gap-3 text-xs font-mono opacity-80 bg-black/30 px-3 py-1 rounded-full">
                                <span className={money >= COST_MONEY ? 'text-green-400' : 'text-red-400'}>${COST_MONEY.toLocaleString()}</span>
                                <span className="text-slate-500">+</span>
                                <span className={gems >= COST_GEMS ? 'text-fuchsia-400' : 'text-red-400'}>{COST_GEMS.toLocaleString()} Gems</span>
                            </div>
                        </>
                    )}
                </button>
            ) : (
                <button 
                    onClick={() => { setPrize(null); setDisplayIcon(<Package className="w-20 h-20 text-slate-600" />); }}
                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors border border-slate-600"
                >
                    OPEN ANOTHER
                </button>
            )}

        </div>
      </div>
    </div>
  );
};
