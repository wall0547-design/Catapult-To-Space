import React from 'react';
import { Radio, AlertTriangle, Info } from 'lucide-react';
import { LogMessage } from '../types';

interface ControlTowerProps {
  logs: LogMessage[];
  onClick: () => void;
}

export const ControlTower: React.FC<ControlTowerProps> = ({ logs, onClick }) => {
  const getTypeStyles = (type: LogMessage['type']) => {
    switch (type) {
      case 'danger': return 'text-red-400 border-red-900/50 bg-red-950/30';
      case 'warning': return 'text-orange-400 border-orange-900/50 bg-orange-950/30';
      case 'success': return 'text-green-400 border-green-900/50 bg-green-950/30';
      case 'glitch': return 'text-fuchsia-400 border-fuchsia-900/50 bg-fuchsia-950/80 font-mono tracking-tighter glitch-text';
      default: return 'text-cyan-400 border-cyan-900/50 bg-cyan-950/30';
    }
  };

  // Most recent log for system status
  const latestLog = logs[logs.length - 1];
  const isGlitching = latestLog?.type === 'glitch';

  return (
    <button 
        onClick={onClick}
        className={`absolute top-20 left-4 z-20 w-72 text-left group font-mono text-xs transition-transform active:scale-95 ${isGlitching ? 'animate-pulse' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2 opacity-80 group-hover:opacity-100 transition-opacity bg-slate-900/50 p-2 rounded border border-slate-700 hover:border-cyan-500/50">
        <div className="flex items-center gap-2">
            {isGlitching ? (
                <AlertTriangle className="w-4 h-4 text-red-500 animate-ping" />
            ) : (
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            )}
            <span className={`uppercase tracking-widest font-bold ${isGlitching ? 'text-red-500' : 'text-slate-300'}`}>
                {isGlitching ? 'SYSTEM FAILURE' : 'Control Tower'}
            </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-cyan-400 border border-cyan-900 px-1.5 py-0.5 rounded bg-cyan-950/30">
            <Info className="w-3 h-3" /> INFO
        </div>
      </div>
      
      {/* Logs Container */}
      <div className="flex flex-col gap-1.5 pointer-events-none">
        {logs.slice(-5).map((log) => (
          <div 
            key={log.id}
            className={`p-2 rounded border-l-2 backdrop-blur-sm animate-in slide-in-from-left-2 duration-300 shadow-sm ${getTypeStyles(log.type)}`}
          >
             <span className="opacity-50 mr-2 font-mono">
                {log.type === 'glitch' ? '??:??:??' : `[${new Date(log.timestamp).toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}]`}
             </span>
             <span className="font-bold">{log.text}</span>
          </div>
        ))}
      </div>
      <style>{`
        .glitch-text {
            text-shadow: 2px 0 red, -2px 0 blue;
            animation: shake 0.5s infinite;
        }
        @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
      `}</style>
    </button>
  );
};