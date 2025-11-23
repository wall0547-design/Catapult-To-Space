import React from 'react';
import { X, Radio, Crosshair, Rocket, DollarSign, Bird } from 'lucide-react';

interface ControlTowerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlTowerModal: React.FC<ControlTowerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-600 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
            <Radio className="text-cyan-400" /> FLIGHT MANUAL
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200">
          
          {/* Section 1: Goal */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
             <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Rocket className="text-orange-500 w-5 h-5" /> Mission Objective
             </h3>
             <p className="text-sm leading-relaxed">
                Your goal is to reach the <span className="text-fuchsia-400 font-bold">Edge of the Universe (1,000,000 ft)</span>. 
                Launch your vessel, earn money from altitude, and upgrade your catapult systems to reach new heights.
             </p>
          </div>

          {/* Section 2: Controls */}
          <div className="space-y-4">
             <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-2">Systems Guide</h3>
             
             <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start gap-3">
                    <div className="bg-slate-800 p-2 rounded text-cyan-400"><Rocket className="w-5 h-5" /></div>
                    <div>
                        <div className="font-bold text-white text-sm">Launching</div>
                        <div className="text-xs text-slate-400">Click the big red Launch button. Physics will take over. Gravity is your enemy.</div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="bg-slate-800 p-2 rounded text-green-400"><DollarSign className="w-5 h-5" /></div>
                    <div>
                        <div className="font-bold text-white text-sm">Economy</div>
                        <div className="text-xs text-slate-400">You earn money when you land. Higher flights = more money. Collect falling cash and gems for bonuses.</div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="bg-slate-800 p-2 rounded text-yellow-400"><Bird className="w-5 h-5" /></div>
                    <div>
                        <div className="font-bold text-white text-sm">Aerial Targets</div>
                        <div className="text-xs text-slate-400">Birds and other flying objects are known to carry loose change. Hit them mid-air for an instant cash reward!</div>
                    </div>
                </div>
             </div>
          </div>

          {/* Section 3: Tips */}
          <div className="bg-cyan-950/30 border border-cyan-900/50 p-4 rounded-xl">
             <h4 className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">Pro Tip</h4>
             <p className="text-sm text-cyan-100">
                Keep an eye on the <span className="font-bold text-white">Time Shop</span>. It occasionally sells powerful upgrades for cheap prices, or even rare asteroid data!
             </p>
          </div>

        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-800/50 text-center">
             <button 
                onClick={onClose}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all active:scale-95"
             >
                ACKNOWLEDGE
             </button>
        </div>

      </div>
    </div>
  );
};