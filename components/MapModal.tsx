import React from 'react';
import { X, Flag, Map as MapIcon } from 'lucide-react';
import { GOAL_HEIGHT } from '../constants';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHeight: number;
  recordHeight: number;
}

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, currentHeight, recordHeight }) => {
  if (!isOpen) return null;

  const progress = Math.min(100, (recordHeight / GOAL_HEIGHT) * 100);
  const currentProgress = Math.min(100, (currentHeight / GOAL_HEIGHT) * 100);

  const landmarks = [
    { name: 'Stratosphere', height: 50000, color: 'bg-blue-400' },
    { name: 'Karman Line', height: 328000, color: 'bg-indigo-500' }, // ~100km
    { name: 'High Orbit', height: 600000, color: 'bg-purple-500' },
    { name: 'The Moon', height: 800000, color: 'bg-slate-300' },
    { name: 'Edge of Universe', height: GOAL_HEIGHT, color: 'bg-fuchsia-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapIcon className="text-blue-400" /> Mission Map
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="relative h-[500px] w-full ml-8 border-l-4 border-slate-700">
            
            {/* Progress Bar Fill */}
            <div 
              className="absolute bottom-0 left-[-4px] w-1 bg-gradient-to-t from-blue-500 to-fuchsia-500 transition-all duration-1000"
              style={{ height: `${progress}%` }}
            />

            {/* Current Height Indicator */}
            <div 
               className="absolute left-[-18px] flex items-center gap-2 transition-all duration-300 z-10"
               style={{ bottom: `${currentProgress}%` }}
            >
                <div className="w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 shadow-lg animate-pulse" />
                <span className="bg-green-600 text-xs px-2 py-1 rounded text-white font-bold whitespace-nowrap">You</span>
            </div>

            {/* Record Height Indicator */}
            {recordHeight > 0 && (
                <div 
                className="absolute left-[-14px] flex items-center gap-2 transition-all duration-300 opacity-70"
                style={{ bottom: `${progress}%` }}
                >
                    <div className="w-6 h-6 bg-yellow-500 rounded-full border-4 border-slate-900" />
                    <span className="bg-yellow-600 text-[10px] px-2 py-0.5 rounded text-white whitespace-nowrap">Best</span>
                </div>
            )}

            {/* Landmarks */}
            {landmarks.map((mark) => {
               const bottomPct = (mark.height / GOAL_HEIGHT) * 100;
               return (
                 <div 
                    key={mark.name}
                    className="absolute left-[-12px] flex items-center gap-4 w-full"
                    style={{ bottom: `${bottomPct}%` }}
                 >
                    <div className={`w-5 h-5 rounded-full border-2 border-slate-900 ${mark.color}`} />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-200">{mark.name}</span>
                        <span className="text-xs text-slate-500 font-mono">{mark.height.toLocaleString()} ft</span>
                    </div>
                    <div className="h-px flex-1 bg-slate-800 ml-2" />
                 </div>
               );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};