import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

interface TutorialOverlayProps {
  step: number;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ step }) => {
  if (step === 0) return null;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
      {step === 1 && (
        <div className="absolute bottom-32 right-8 flex flex-col items-end animate-bounce">
           <div className="bg-white text-black p-4 rounded-xl rounded-br-none shadow-lg mb-2 max-w-[200px]">
              <p className="font-bold text-sm">Start your journey!</p>
              <p className="text-xs">Click here to launch your ball.</p>
           </div>
           <ArrowDown className="w-12 h-12 text-white" />
        </div>
      )}

      {step === 3 && (
        <div className="absolute top-20 right-20 flex flex-col items-end animate-bounce">
           <ArrowRight className="w-12 h-12 text-white rotate-[-45deg] mb-2 mr-4" />
           <div className="bg-white text-black p-4 rounded-xl rounded-tr-none shadow-lg max-w-[200px]">
              <p className="font-bold text-sm">Upgrade!</p>
              <p className="text-xs">Use money to buy upgrades and reach the stars.</p>
           </div>
        </div>
      )}
    </div>
  );
};