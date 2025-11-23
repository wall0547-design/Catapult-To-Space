import React, { useState } from 'react';
import { X, Landmark, ShieldCheck, ArrowRight } from 'lucide-react';

interface CashOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  money: number;
  gems: number;
  onCashOut: () => void;
}

export const CashOutModal: React.FC<CashOutModalProps> = ({ isOpen, onClose, money, gems, onCashOut }) => {
  const [step, setStep] = useState<'info' | 'processing' | 'success'>('info');

  if (!isOpen) return null;

  const REQUIREMENT_MONEY = 1000000000000; // 1 Trillion
  const REQUIREMENT_GEMS = 1000;

  const handleCashOut = () => {
      setStep('processing');
      setTimeout(() => {
          setStep('success');
          onCashOut();
      }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-slate-50 rounded-xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden relative text-slate-900">
        
        <div className="bg-blue-900 p-6 text-white flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-serif flex items-center gap-2">
                    <Landmark className="w-6 h-6 text-yellow-400" /> The Void Bank
                </h2>
                <p className="text-blue-200 text-sm mt-1">Intergalactic Wire Transfer</p>
            </div>
            <button onClick={onClose} className="text-blue-300 hover:text-white"><X /></button>
        </div>

        <div className="p-8">
            {step === 'info' && (
                <>
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
                        <h3 className="font-bold text-blue-900 mb-2">Withdrawal Request</h3>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Amount:</span>
                            <span className="font-bold">$1.00 USD</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Fee:</span>
                            <span className="font-bold">$0.00 USD</span>
                        </div>
                        <div className="border-t border-blue-200 my-2" />
                        <div className="flex justify-between text-sm font-bold">
                            <span>Total:</span>
                            <span>$1.00 USD</span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Req. Balance:</span>
                            <span className={money >= REQUIREMENT_MONEY ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                $1.00T Game Cash
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Req. Gems:</span>
                            <span className={gems >= REQUIREMENT_GEMS ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                1,000 Gems
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleCashOut}
                        disabled={money < REQUIREMENT_MONEY || gems < REQUIREMENT_GEMS}
                        className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2
                            ${money >= REQUIREMENT_MONEY && gems >= REQUIREMENT_GEMS
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }
                        `}
                    >
                        {money < REQUIREMENT_MONEY ? "Insufficient Funds" : "Authorize Withdrawal"}
                    </button>
                </>
            )}

            {step === 'processing' && (
                <div className="flex flex-col items-center py-10">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                    <h3 className="text-xl font-bold text-slate-800">Processing...</h3>
                    <p className="text-slate-500 text-center mt-2">Contacting Earth financial institutions...</p>
                </div>
            )}

            {step === 'success' && (
                <div className="flex flex-col items-center py-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Transfer Complete!</h3>
                    <p className="text-slate-600 text-center mb-6">
                        $1.00 USD has been hypothetically transferred to your imaginary account. Thank you for banking with The Void.
                    </p>
                    <button onClick={onClose} className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold">
                        Close
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};