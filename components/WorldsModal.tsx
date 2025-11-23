import React from 'react';
import { Globe, X, Lock, Check } from 'lucide-react';
import { WorldTheme } from '../types';
import { WORLD_COSTS } from '../constants';

interface WorldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWorld: WorldTheme;
  unlockedWorlds: WorldTheme[];
  onSelectWorld: (world: WorldTheme) => void;
  onBuyWorld: (world: WorldTheme, cost: number) => void;
  money: number;
}

export const WorldsModal: React.FC<WorldsModalProps> = ({ isOpen, onClose, currentWorld, unlockedWorlds, onSelectWorld, onBuyWorld, money }) => {
  if (!isOpen) return null;

  const worlds: { id: WorldTheme; name: string; colors: string }[] = [
    { id: 'Earth', name: 'Earth', colors: 'bg-gradient-to-br from-blue-500 to-green-500' },
    { id: 'Mars', name: 'Mars', colors: 'bg-gradient-to-br from-red-500 to-orange-600' },
    { id: 'Neon', name: 'Neon City', colors: 'bg-gradient-to-br from-fuchsia-600 to-purple-700' },
    { id: 'Void', name: 'The Void', colors: 'bg-gradient-to-br from-gray-800 to-black' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="text-emerald-400" /> Select World
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {worlds.map((world) => {
                const isUnlocked = unlockedWorlds.includes(world.id);
                const isSelected = currentWorld === world.id;
                const cost = WORLD_COSTS[world.id];
                const canAfford = money >= cost;

                return (
                    <div
                        key={world.id}
                        className={`relative h-36 rounded-xl overflow-hidden border-2 transition-all group text-left p-4 flex flex-col justify-between
                            ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-700'}
                            ${!isUnlocked ? 'opacity-90' : ''}
                        `}
                    >
                        <div className={`absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity ${world.colors}`} />
                        
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-black text-white drop-shadow-md">{world.name}</h3>
                                {!isUnlocked && (
                                    <div className="flex items-center gap-1 mt-1">
                                       <Lock className="w-4 h-4 text-slate-300" />
                                       <span className="text-sm font-mono font-bold text-slate-200">${cost.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                            {isSelected && (
                                <div className="bg-emerald-500 text-emerald-950 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <Check className="w-3 h-3" /> SELECTED
                                </div>
                            )}
                        </div>

                        <div className="relative z-10 mt-2">
                            {isUnlocked ? (
                                <button
                                    onClick={() => onSelectWorld(world.id)}
                                    disabled={isSelected}
                                    className={`w-full py-2 rounded font-bold text-sm transition-colors
                                        ${isSelected ? 'bg-white/20 text-white cursor-default' : 'bg-white text-slate-900 hover:bg-slate-200'}
                                    `}
                                >
                                    {isSelected ? 'Active' : 'Select World'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => onBuyWorld(world.id, cost)}
                                    disabled={!canAfford}
                                    className={`w-full py-2 rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors
                                        ${canAfford ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-slate-800/50 text-slate-400 cursor-not-allowed border border-slate-600'}
                                    `}
                                >
                                    {canAfford ? `Buy for $${cost.toLocaleString()}` : 'Insufficient Funds'}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};