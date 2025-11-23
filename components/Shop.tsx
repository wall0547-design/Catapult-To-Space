import React, { useState } from 'react';
import { ArrowUpCircle, DollarSign, Rocket, X, Hammer, CircleDot, Zap, Gem } from 'lucide-react';
import { UpgradeStats, OmegaUpgrade } from '../types';

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
  money: number;
  gems: number;
  upgrades: {
    power: UpgradeStats;
    economy: UpgradeStats;
    catapult: UpgradeStats;
    ball: UpgradeStats;
  };
  omega: {
    gravity_dampener: OmegaUpgrade;
    gem_finder: OmegaUpgrade;
  };
  onBuyUpgrade: (type: 'power' | 'economy' | 'catapult' | 'ball') => void;
  onBuyMaxUpgrade: (type: 'power' | 'economy' | 'catapult' | 'ball') => void;
  onBuyOmega: (type: 'gravity_dampener' | 'gem_finder') => void;
}

export const Shop: React.FC<ShopProps> = ({ isOpen, onClose, money, gems, upgrades, omega, onBuyUpgrade, onBuyMaxUpgrade, onBuyOmega }) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'structure' | 'omega'>('standard');

  if (!isOpen) return null;

  const getCost = (upgrade: UpgradeStats) => Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level - 1));
  
  const getOmegaCost = (u: OmegaUpgrade) => ({
      money: u.baseMoneyCost * Math.pow(2.5, u.level),
      gems: u.baseGemCost * Math.pow(1.5, u.level)
  });

  // Display the linear power value (24 + level)
  const getPowerDisplay = (level: number) => {
      return 24 + level;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="text-yellow-400" /> Upgrade Shop
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Resources Display */}
        <div className="p-4 bg-slate-900/50 grid grid-cols-2 gap-4 border-b border-slate-800">
          <div className="bg-slate-800 rounded p-2 text-center border border-slate-700">
              <div className="text-slate-400 text-[10px] uppercase tracking-wider">Funds</div>
              <div className="text-green-400 font-mono font-bold">${money.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800 rounded p-2 text-center border border-slate-700">
              <div className="text-slate-400 text-[10px] uppercase tracking-wider">Gems</div>
              <div className="text-fuchsia-400 font-mono font-bold flex items-center justify-center gap-1">
                 <Gem className="w-3 h-3" /> {gems.toLocaleString()}
              </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
            <button 
                onClick={() => setActiveTab('standard')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'standard' ? 'bg-slate-800 text-white border-b-2 border-blue-500' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
                Standard
            </button>
            <button 
                onClick={() => setActiveTab('structure')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'structure' ? 'bg-slate-800 text-white border-b-2 border-orange-500' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
                Visuals
            </button>
            <button 
                onClick={() => setActiveTab('omega')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'omega' ? 'bg-slate-800 text-fuchsia-400 border-b-2 border-fuchsia-500' : 'text-slate-500 hover:bg-slate-800/50'}`}
            >
                OMEGA
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-950/50">
          
          {activeTab === 'standard' && (
              <>
                <UpgradeCard 
                    icon={<Rocket className="w-8 h-8 text-orange-500" />}
                    upgrade={upgrades.power}
                    cost={getCost(upgrades.power)}
                    canAfford={money >= getCost(upgrades.power)}
                    onBuy={() => onBuyUpgrade('power')}
                    onBuyMax={() => onBuyMaxUpgrade('power')}
                    valueLabel="Power Level"
                    currentValue={`${getPowerDisplay(upgrades.power.level)}`}
                />
                <UpgradeCard 
                    icon={<ArrowUpCircle className="w-8 h-8 text-blue-500" />}
                    upgrade={upgrades.economy}
                    cost={getCost(upgrades.economy)}
                    canAfford={money >= getCost(upgrades.economy)}
                    onBuy={() => onBuyUpgrade('economy')}
                    onBuyMax={() => onBuyMaxUpgrade('economy')}
                    valueLabel="Base Income"
                    currentValue={`$${(upgrades.economy.level * upgrades.economy.effectMultiplier).toFixed(0)}`}
                />
              </>
          )}

          {activeTab === 'structure' && (
              <>
                <UpgradeCard 
                    icon={<Hammer className="w-8 h-8 text-stone-400" />}
                    upgrade={upgrades.catapult}
                    cost={getCost(upgrades.catapult)}
                    canAfford={money >= getCost(upgrades.catapult)}
                    onBuy={() => onBuyUpgrade('catapult')}
                    onBuyMax={() => onBuyMaxUpgrade('catapult')}
                    valueLabel="Earnings Multiplier"
                    currentValue={`x${(1 + (upgrades.catapult.level * upgrades.catapult.effectMultiplier)).toFixed(1)}`}
                    isMaxed={upgrades.catapult.level >= (upgrades.catapult.maxLevel || 5)}
                />
                <UpgradeCard 
                    icon={<CircleDot className="w-8 h-8 text-red-500" />}
                    upgrade={upgrades.ball}
                    cost={getCost(upgrades.ball)}
                    canAfford={money >= getCost(upgrades.ball)}
                    onBuy={() => onBuyUpgrade('ball')}
                    onBuyMax={() => onBuyMaxUpgrade('ball')}
                    valueLabel="Drag Reduction"
                    currentValue={`${(upgrades.ball.level * upgrades.ball.effectMultiplier * 100).toFixed(0)}%`}
                    isMaxed={upgrades.ball.level >= (upgrades.ball.maxLevel || 5)}
                />
              </>
          )}

          {activeTab === 'omega' && (
              <>
                <OmegaCard 
                    item={omega.gravity_dampener}
                    currentCost={getOmegaCost(omega.gravity_dampener)}
                    canAfford={money >= getOmegaCost(omega.gravity_dampener).money && gems >= getOmegaCost(omega.gravity_dampener).gems}
                    onBuy={() => onBuyOmega('gravity_dampener')}
                    icon={<Rocket className="w-8 h-8 text-fuchsia-400" />}
                />
                <OmegaCard 
                    item={omega.gem_finder}
                    currentCost={getOmegaCost(omega.gem_finder)}
                    canAfford={money >= getOmegaCost(omega.gem_finder).money && gems >= getOmegaCost(omega.gem_finder).gems}
                    onBuy={() => onBuyOmega('gem_finder')}
                    icon={<Gem className="w-8 h-8 text-cyan-400" />}
                />
              </>
          )}

        </div>
      </div>
    </div>
  );
};

interface UpgradeCardProps {
  icon: React.ReactNode;
  upgrade: UpgradeStats;
  cost: number;
  canAfford: boolean;
  onBuy: () => void;
  onBuyMax: () => void;
  valueLabel: string;
  currentValue: string;
  isMaxed?: boolean;
}

const UpgradeCard: React.FC<UpgradeCardProps> = ({ icon, upgrade, cost, canAfford, onBuy, onBuyMax, valueLabel, currentValue, isMaxed }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col gap-3 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 shadow-inner">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100">{upgrade.name}</h3>
            <p className="text-xs text-slate-400">Lvl {upgrade.level} {isMaxed && '(MAX)'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase">{valueLabel}</p>
          <p className="font-mono font-medium text-slate-300">{currentValue}</p>
        </div>
      </div>
      
      <p className="text-sm text-slate-400">{upgrade.description}</p>

      {isMaxed ? (
          <div className="mt-2 w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center bg-slate-700 text-green-400 border border-slate-600">
              MAX LEVEL REACHED
          </div>
      ) : (
        <div className="flex gap-2 mt-2">
            <button
                onClick={onBuy}
                disabled={!canAfford}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm flex flex-col items-center justify-center transition-all border
                ${canAfford 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20 active:scale-95 border-transparent' 
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed border-slate-600'
                }`}
            >
                <span>Buy 1</span>
                <span className="text-[10px] opacity-80 font-mono">
                 ${cost.toLocaleString()}
                </span>
            </button>

            <button
                onClick={onBuyMax}
                disabled={!canAfford}
                className={`w-20 py-3 rounded-lg font-bold text-sm flex items-center justify-center transition-all border
                ${canAfford 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20 active:scale-95 border-transparent' 
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed border-slate-600'
                }`}
                title="Buy Max Levels"
            >
                MAX
            </button>
        </div>
      )}
    </div>
  );
};

interface OmegaCardProps {
    item: OmegaUpgrade;
    currentCost: { money: number; gems: number };
    canAfford: boolean;
    onBuy: () => void;
    icon: React.ReactNode;
}

const OmegaCard: React.FC<OmegaCardProps> = ({ item, currentCost, canAfford, onBuy, icon }) => {
    if (item.level >= item.maxLevel) {
        return (
            <div className="bg-slate-900/80 rounded-xl p-4 border border-fuchsia-900/50 opacity-75">
                <div className="flex items-center gap-3 mb-2">
                    {icon}
                    <div className="font-bold text-fuchsia-400">{item.name} (MAXED)</div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-slate-900 rounded-xl p-4 border border-fuchsia-900 shadow-[0_0_15px_rgba(192,38,211,0.1)]">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-fuchsia-950 rounded border border-fuchsia-800">{icon}</div>
                    <div>
                        <div className="font-bold text-fuchsia-200">{item.name}</div>
                        <div className="text-xs text-fuchsia-500/80">Lvl {item.level}</div>
                    </div>
                </div>
            </div>
            <p className="text-sm text-slate-400 mb-3">{item.description}</p>
            <button
                onClick={onBuy}
                disabled={!canAfford}
                className={`w-full py-3 rounded-lg font-bold text-sm flex flex-col items-center justify-center transition-all border
                ${canAfford 
                    ? 'bg-fuchsia-950 hover:bg-fuchsia-900 text-fuchsia-200 border-fuchsia-500 shadow-lg shadow-fuchsia-900/20' 
                    : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                }`}
            >
                <span>INITIALIZE UPGRADE</span>
                <div className="flex gap-3 text-xs mt-1 opacity-80">
                    <span className={canAfford ? 'text-green-400' : ''}>${currentCost.money.toLocaleString()}</span>
                    <span>+</span>
                    <span className={canAfford ? 'text-fuchsia-400' : ''}>{currentCost.gems.toLocaleString()} Gems</span>
                </div>
            </button>
        </div>
    );
}