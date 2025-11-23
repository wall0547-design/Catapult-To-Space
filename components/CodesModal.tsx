
import React, { useState } from 'react';
import { X, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

interface CodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedeem: (code: string) => boolean;
}

export const CodesModal: React.FC<CodesModalProps> = ({ isOpen, onClose, onRedeem }) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const success = onRedeem(code);
    if (success) {
        setStatus('success');
        setMessage('Code Redeemed!');
        setCode('');
        setTimeout(() => setStatus('idle'), 2000);
    } else {
        setStatus('error');
        setMessage('Invalid or Expired Code');
        setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-green-500/50 rounded-2xl w-full max-w-sm shadow-[0_0_30px_rgba(34,197,94,0.1)] flex flex-col overflow-hidden">
        
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
            <Terminal className="text-green-400" /> SYSTEM ACCESS
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
            <p className="text-slate-400 text-sm mb-4">Enter secure access codes to override system parameters and receive supply drops.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                    <input 
                        type="text" 
                        value={code}
                        onChange={(e) => { setCode(e.target.value); setStatus('idle'); }}
                        placeholder="ENTER_CODE..."
                        className="w-full bg-black border border-slate-600 rounded-lg px-4 py-3 text-green-400 font-mono focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none uppercase tracking-wider"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {status === 'success' && <CheckCircle2 className="text-green-500 w-5 h-5 animate-bounce" />}
                        {status === 'error' && <AlertCircle className="text-red-500 w-5 h-5 animate-shake" />}
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full py-3 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-green-900/50 font-mono"
                >
                    EXECUTE
                </button>
            </form>

            {status !== 'idle' && (
                <div className={`mt-4 text-center text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
