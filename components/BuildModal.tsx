
import React from 'react';
import { X, Hammer, MonitorPlay, Rocket, FlaskConical, Construction, CheckCircle2 } from 'lucide-react';
import { Structure } from '../types';

interface BuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  money: number;
  structures: {
    mission_control: Structure;
    launch_gantry: Structure;
    xeno_lab: Structure;
  };
  onBuild: (id: string) => void;
}

export const BuildModal: React.FC<BuildModalProps> = ({ isOpen, onClose, money, structures, onBuild }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border-2 border-amber-600 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-amber-600/50">
          <h2 className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-tighter">
            <Hammer className="text-amber-500 fill-amber-500/20" /> Base Construction
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
           
           <StructureCard 
              structure={structures.mission_control} 
              money={money} 
              onBuild={() => onBuild('mission_control')} 
              icon={<MonitorPlay className="w-8 h-8 text-blue-400" />}
           />
           
           <StructureCard 
              structure={structures.launch_gantry} 
              money={money} 
              onBuild={() => onBuild('launch_gantry')} 
              icon={<Rocket className="w-8 h-8 text-red-400" />}
           />
           
           <StructureCard 
              structure={structures.xeno_lab} 
              money={money} 
              onBuild={() => onBuild('xeno_lab')} 
              icon={<FlaskConical className="w-8 h-8 text-green-400" />}
           />

        </div>
      </div>
    </div>
  );
};

interface StructureCardProps {
    structure: Structure;
    money: number;
    onBuild: () => void;
    icon: React.ReactNode;
}

const StructureCard: React.FC<StructureCardProps> = ({ structure, money, onBuild, icon }) => {
    const cost = Math.floor(structure.baseCost * Math.pow(structure.costMultiplier, structure.level));
    const canAfford = money >= cost;
    const isMaxed = structure.level >= structure.maxLevel;

    return (
        <div className="relative bg-slate-800 rounded-xl overflow-hidden border border-slate-600 group hover:border-amber-500 transition-colors">
            
            {/* Background Tech Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

            {/* Construction Overlay Animation */}
            {structure.isConstructing && (
                <div className="absolute inset-0 z-20 bg-amber-500/90 flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="w-full h-full absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#00000010_10px,#00000010_20px)]" />
                    <Construction className="w-12 h-12 text-black mb-2 animate-bounce" />
                    <h3 className="text-2xl font-black text-black uppercase tracking-widest animate-pulse">Constructing</h3>
                    
                    {/* Progress Bar */}
                    <div className="w-64 h-4 bg-black/30 rounded-full mt-4 overflow-hidden border border-black/20">
                        <div 
                            className="h-full bg-white transition-all ease-linear duration-100" 
                            style={{ width: `${structure.constructionProgress || 0}%` }} 
                        />
                    </div>
                </div>
            )}

            <div className="relative z-10 p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg border border-slate-600 bg-slate-900 ${isMaxed ? 'shadow-[0_0_15px_#10b981]' : ''}`}>
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {structure.name}
                                {isMaxed && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            </h3>
                            <div className="text-xs text-amber-500 font-mono font-bold uppercase tracking-wider">
                                Level {structure.level} / {structure.maxLevel}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-slate-400 mb-3">{structure.description}</p>
                <div className="bg-slate-900/50 p-2 rounded text-xs text-cyan-400 font-mono mb-4 border border-slate-700/50">
                    Effect: {structure.effectDescription}
                </div>

                {!isMaxed ? (
                    <button
                        onClick={onBuild}
                        disabled={!canAfford || structure.isConstructing}
                        className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2
                            ${canAfford && !structure.isConstructing
                                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20 active:translate-y-1' 
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }
                        `}
                    >
                        <span>Build Sector</span>
                        <div className="bg-black/20 px-2 py-0.5 rounded font-mono text-xs">
                            ${cost.toLocaleString()}
                        </div>
                    </button>
                ) : (
                    <div className="w-full py-3 bg-green-900/20 border border-green-900/50 text-green-500 rounded-lg text-center font-bold uppercase text-sm">
                        Max Level Achieved
                    </div>
                )}
            </div>
        </div>
    );
};
