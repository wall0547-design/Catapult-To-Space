import React, { useState } from 'react';
import { Rocket, Stars } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleStart = () => {
    setIsLaunching(true);
    setTimeout(() => {
      onStart();
    }, 2000);
  };

  return (
    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden transition-all duration-1000 ${isLaunching ? 'scale-150 opacity-0' : ''}`}>
      {isLaunching && (
         <div className="absolute inset-0 z-50 bg-white animate-pulse opacity-50 pointer-events-none" />
      )}
      
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 animate-pulse" />
      
      <div className={`z-10 text-center space-y-8 p-8 max-w-2xl animate-in fade-in zoom-in duration-700 ${isLaunching ? 'translate-y-[-500px] transition-transform duration-1000' : ''}`}>
        <div className="flex justify-center mb-4">
          <div className="p-6 bg-indigo-600/20 rounded-full border-4 border-indigo-500 shadow-[0_0_50px_rgba(99,102,241,0.5)]">
            <Rocket className={`w-20 h-20 text-indigo-400 ${isLaunching ? 'animate-ping' : ''}`} />
          </div>
        </div>
        
        <div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-sm">
            SPACE
            <br />
            CATAPULT
          </h1>
          <p className="mt-4 text-xl text-slate-300 font-light tracking-widest uppercase">
            Launch. Earn. Upgrade. Ascend.
          </p>
        </div>

        <div className="pt-8">
          <button
            onClick={handleStart}
            disabled={isLaunching}
            className="group relative px-12 py-6 bg-white text-slate-950 text-2xl font-bold uppercase tracking-wider rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              Start Mission <Stars className="w-6 h-6 group-hover:spin-slow" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-slate-500 text-sm">
        Reaching the Edge of the Universe (1,000,000 ft)
      </div>
    </div>
  );
};