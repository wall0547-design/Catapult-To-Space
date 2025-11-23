
import React, { useState } from 'react';
import { Package, X, Database, ArrowRight, Trash2 } from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  onSellItem: (itemId: string, name: string) => void;
  onSellAll: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, inventory, onSellItem, onSellAll }) => {
  if (!isOpen) return null;

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [customName, setCustomName] = useState('');

  const handleSellClick = (item: InventoryItem) => {
      setSelectedItem(item);
      setCustomName('');
  };

  const handleConfirmSell = () => {
      if (selectedItem) {
          onSellItem(selectedItem.id, customName || selectedItem.name);
          setSelectedItem(null);
      }
  };

  const totalValue = inventory.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh]">
        
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="text-orange-400" /> Cargo Hold
          </h2>
          <div className="text-sm text-slate-400 font-mono">
             Capacity: {inventory.length} / ∞
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 relative">
            {inventory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                    <Database className="w-16 h-16 opacity-20" />
                    <p>No items collected yet.</p>
                    <p className="text-xs">Catch asteroids in space to fill your cargo!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-20">
                    {inventory.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleSellClick(item)}
                            className="bg-slate-800 border border-slate-700 hover:border-orange-500 p-4 rounded-xl flex flex-col items-center gap-3 transition-all active:scale-95 group"
                        >
                            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center shadow-inner group-hover:bg-orange-900/20 transition-colors">
                                <div className="w-8 h-8 bg-stone-500 rounded-full shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.5)] border border-stone-400" />
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-orange-400 font-bold uppercase tracking-wider">{item.rarity}</div>
                                <div className="text-sm font-bold text-white">{item.name}</div>
                            </div>
                            <div className="mt-2 text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded font-mono">
                                Val: ${item.value.toLocaleString()}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Footer with Sell All */}
        {inventory.length > 0 && (
            <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-between items-center">
                <div className="text-sm text-slate-400">
                    Total Value: <span className="text-green-400 font-bold font-mono">${totalValue.toLocaleString()}</span>
                </div>
                <button 
                    onClick={onSellAll}
                    className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-red-900/20"
                >
                    <Trash2 className="w-4 h-4" /> SELL ALL
                </button>
            </div>
        )}

        {/* Sell/Rename Dialog Overlay */}
        {selectedItem && (
            <div className="absolute inset-0 bg-black/90 z-10 flex items-center justify-center p-6">
                <div className="bg-slate-800 border border-slate-600 p-6 rounded-xl w-full max-w-sm space-y-4 animate-in zoom-in-95 duration-200">
                    <h3 className="text-lg font-bold text-white text-center">
                        {selectedItem.category === 'asteroid' ? 'Analyze Asteroid' : 'Sell Cargo'}
                    </h3>
                    <div className="flex justify-center py-4">
                        <div className={`w-20 h-20 bg-stone-500 rounded-full shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.5)] border-4 border-slate-700 ${selectedItem.category === 'asteroid' ? 'animate-spin-slow' : ''}`} />
                    </div>
                    
                    {selectedItem.category === 'asteroid' ? (
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Name Discovery</label>
                            <input 
                                type="text" 
                                autoFocus
                                placeholder="Enter name..."
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-orange-500 outline-none mt-1"
                            />
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-slate-300">Sell <span className="font-bold text-white">{selectedItem.name}</span>?</p>
                            <p className="text-green-400 font-bold text-xl mt-1">${selectedItem.value.toLocaleString()}</p>
                        </div>
                    )}

                    <div className="pt-2 grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setSelectedItem(null)}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 font-bold text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirmSell}
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold text-sm flex items-center justify-center gap-2"
                        >
                            Sell <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
