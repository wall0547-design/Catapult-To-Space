
import React from 'react';
import { X, BarChart3, TrendingUp, Zap, Anchor, Wind, DollarSign } from 'lucide-react';
import { GameState } from '../types';
import { GRAVITY } from '../constants';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, gameState }) => {
  if (!isOpen) return null;

  const { detailedStats, upgrades, omega, permanentMultipliers } = gameState;

  // Formatting helper
  const fmt = (num: number) => num.toLocaleString();

  // Calculated Multipliers
  const totalMoneyMult = (1 + (upgrades.catapult.level * upgrades.catapult.effectMultiplier)) * permanentMultipliers.money;
  const gravityReduc = omega.gravity_dampener.level * omega.gravity_dampener.effect * 100;
  const dragReduc = upgrades.ball.level * upgrades.ball.effectMultiplier * 100;
  
  const formatTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      return `${h}h ${m}m`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-600 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-cyan-400" /> Statistical Index
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* General Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox label="Total Launches" value={fmt(gameState.totalLaunches)} />
                <StatBox label="Max Height" value={`${fmt(gameState.recordHeight)} ft`} />
                <StatBox label="Lifetime Earnings" value={`$${fmt(gameState.lifetimeEarnings)}`} color="text-green-400" />
                <StatBox label="Total Gems" value={fmt(detailedStats.totalGemsEarned)} color="text-fuchsia-400" />
                <StatBox label="Time Played" value={formatTime(detailedStats.timePlayed)} />
                <StatBox label="Items Found" value={fmt(detailedStats.itemsFound)} />
                <StatBox label="Targets Hit" value={fmt(detailedStats.hazardsHit)} />
                <StatBox label="Rare Events" value={fmt(detailedStats.rareEventsFound)} color="text-yellow-400" />
            </div>

            {/* Multipliers Section */}
            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <TrendingUp className="w-4 h-4" /> System Efficiency
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <MultiplierCard 
                        icon={<Zap className="text-orange-400" />}
                        label="Launch Power"
                        value={fmt(24 + upgrades.power.level)}
                        subtext="Velocity Units"
                    />

                    <MultiplierCard 
                        icon={<DollarSign className="text-green-400" />}
                        label="Income Multiplier"
                        value={`x${totalMoneyMult.toFixed(2)}`}
                        subtext={`Base x${(1 + (upgrades.catapult.level * upgrades.catapult.effectMultiplier)).toFixed(1)} * Perm x${permanentMultipliers.money}`}
                    />

                    <MultiplierCard 
                        icon={<Anchor className="text-fuchsia-400" />}
                        label="Gravity Scale"
                        value={`${(100 - gravityReduc).toFixed(1)}%`}
                        subtext={`Base: ${GRAVITY} (-${gravityReduc.toFixed(1)}%)`}
                    />

                    <MultiplierCard 
                        icon={<Wind className="text-blue-400" />}
                        label="Drag Coefficient"
                        value={`${(100 - dragReduc).toFixed(1)}%`}
                        subtext={`Air resistance reduced by ${dragReduc.toFixed(0)}%`}
                    />

                </div>
            </div>

            {/* Detailed Inventory Breakdown */}
             <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
                    Collection Log
                </h3>
                <div className="bg-slate-800/50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Inventory Items</span>
                        <span className="text-white font-mono">{gameState.inventory.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Supply Drops</span>
                        <span className="text-white font-mono">{detailedStats.airdropsCollected}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Manager Level</span>
                        <span className="text-white font-mono">{gameState.manager.hired ? gameState.manager.level : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Worlds Unlocked</span>
                        <span className="text-white font-mono">{gameState.unlockedWorlds.length}/4</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{label: string, value: string, color?: string}> = ({ label, value, color = 'text-white' }) => (
    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-col items-center text-center">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">{label}</span>
        <span className={`font-mono font-bold text-lg ${color}`}>{value}</span>
    </div>
);

const MultiplierCard: React.FC<{icon: React.ReactNode, label: string, value: string, subtext: string}> = ({ icon, label, value, subtext }) => (
    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
        <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 shadow-inner">
            {React.isValidElement(icon) 
              ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })
              : icon}
        </div>
        <div>
            <div className="text-xs text-slate-400 uppercase font-bold">{label}</div>
            <div className="text-xl font-mono font-bold text-white">{value}</div>
            <div className="text-[10px] text-slate-500">{subtext}</div>
        </div>
    </div>
);
