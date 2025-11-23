import React, { useState } from 'react';
import { X, Briefcase, Gem, User, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { ManagerState } from '../types';
import { MANAGER_HIRE_COST, MANAGER_GEM_INTERVAL, MANAGER_UPGRADE_COST_BASE, MANAGER_UPGRADE_COST_MULT } from '../constants';

interface ManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  money: number;
  manager: ManagerState;
  onHire: () => void;
  onUpgrade: () => void;
  onChat: (message: string) => void;
}

export const ManagerModal: React.FC<ManagerModalProps> = ({ isOpen, onClose, money, manager, onHire, onUpgrade, onChat }) => {
  const [chatHistory, setChatHistory] = useState<{sender: string, text: string}[]>([
    { sender: 'System', text: 'Connecting to secure channel...' }
  ]);

  if (!isOpen) return null;

  const upgradeCost = Math.floor(MANAGER_UPGRADE_COST_BASE * Math.pow(MANAGER_UPGRADE_COST_MULT, manager.level - 1));

  const chatOptions = [
    "How are our stocks?",
    "Any advice?",
    "Status Report",
    "Tell me a joke"
  ];

  const handleChatClick = (msg: string) => {
      setChatHistory(prev => [...prev, { sender: 'You', text: msg }]);
      
      let response = "";
      const randomVal = Math.random();
      
      if (msg.includes("stocks")) response = randomVal > 0.5 ? "Stonks are up 500% boss!" : "Market is volatile. Keep launching.";
      else if (msg.includes("advice")) response = "Invest in aerodynamics. It pays off.";
      else if (msg.includes("Status")) response = `Gem production is stable at ${manager.level} gems per cycle.`;
      else if (msg.includes("joke")) response = "Why did the ball go to space? Because it was propelled by market forces.";
      else response = "I'll look into it right away.";

      setTimeout(() => {
          setChatHistory(prev => [...prev, { sender: manager.name, text: response }]);
          onChat(response); // Optional callback effect
      }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-600 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="text-blue-400" /> Executive Suite
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            
            <div className="flex flex-col md:flex-row gap-6">
                {/* Portrait / ID Card */}
                <div className="w-full md:w-1/3 bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-blue-900 rounded-full mb-4 flex items-center justify-center border-4 border-blue-500 shadow-lg">
                        <User className="w-12 h-12 text-blue-200" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{manager.name}</h3>
                    <p className="text-sm text-blue-400 font-bold uppercase tracking-wider mb-4">
                        {manager.hired ? 'Director of Operations' : 'Available for Hire'}
                    </p>
                    
                    {manager.hired ? (
                        <div className="w-full bg-slate-900/50 rounded p-3 text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Level</span>
                                <span className="text-white font-bold">{manager.level}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Output</span>
                                <span className="text-fuchsia-400 font-bold">+{manager.level} Gems/10s</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-slate-500 italic">
                            Experienced manager looking for high-growth opportunities.
                        </div>
                    )}
                </div>

                {/* Action Panel */}
                <div className="w-full md:w-2/3 space-y-6">
                    
                    {!manager.hired ? (
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
                            <h4 className="text-lg font-bold text-white mb-2">Contract Offer</h4>
                            <p className="text-slate-400 text-sm mb-6">
                                Hiring {manager.name} will automate Gem collection. Gain 1 Gem every 10 seconds passively.
                            </p>
                            <button 
                                onClick={onHire}
                                disabled={money < MANAGER_HIRE_COST}
                                className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2
                                    ${money >= MANAGER_HIRE_COST 
                                        ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20' 
                                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    }
                                `}
                            >
                                <span>Hire for</span>
                                <span className="bg-black/20 px-2 py-0.5 rounded text-sm">${MANAGER_HIRE_COST.toLocaleString()}</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Upgrade Section */}
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-white flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-green-400" /> Gem Logistics
                                        </h4>
                                        <p className="text-xs text-slate-400">Increase passive gem income.</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs uppercase text-slate-500 font-bold">Current Rate</div>
                                        <div className="text-fuchsia-400 font-mono font-bold">{manager.level} Gems / 10s</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={onUpgrade}
                                    disabled={money < upgradeCost}
                                    className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2
                                        ${money >= upgradeCost 
                                            ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <span>Upgrade (Level {manager.level + 1})</span>
                                    <span className="text-green-300 bg-black/20 px-2 rounded">${upgradeCost.toLocaleString()}</span>
                                </button>
                            </div>

                            {/* Chat Section */}
                            <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col h-64">
                                <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Secure Comms</span>
                                </div>
                                
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {chatHistory.map((msg, idx) => (
                                        <div key={idx} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                                            <span className="text-[10px] text-slate-500 mb-1">{msg.sender}</span>
                                            <div className={`max-w-[80%] p-2 rounded-lg text-sm ${msg.sender === 'You' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Input Options */}
                                <div className="p-2 bg-slate-900 border-t border-slate-800 grid grid-cols-2 gap-2">
                                    {chatOptions.map((opt, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => handleChatClick(opt)}
                                            className="px-2 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors text-left truncate"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};