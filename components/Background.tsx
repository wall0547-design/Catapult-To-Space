import React from 'react';
import { WorldTheme } from '../types';

interface BackgroundProps {
  altitude: number;
  theme: WorldTheme;
}

export const Background: React.FC<BackgroundProps> = ({ altitude, theme }) => {
  // Calculate opacity for sky fade out
  // Sky is visible until ~20,000ft
  const skyOpacity = Math.max(0, 1 - altitude / 20000);
  
  // Space starts becoming visible around 10,000ft
  const spaceOpacity = Math.min(1, Math.max(0, (altitude - 10000) / 20000));

  const getThemeColors = () => {
    switch (theme) {
      case 'Mars': return 'from-red-950 via-orange-900 to-red-800';
      case 'Neon': return 'from-fuchsia-950 via-purple-900 to-indigo-900';
      case 'Void': return 'from-gray-950 via-slate-900 to-black';
      case 'Earth': default: return 'from-slate-950 via-indigo-950 to-sky-900';
    }
  };

  // Parallax calculation for stars
  // We use background-position to simulate movement. 
  // Dividing by different numbers creates depth.
  const starsY1 = altitude * 0.1;
  const starsY2 = altitude * 0.05;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none bg-black">
      
      {/* 1. Atmosphere Gradient (Fades out as you go up) */}
      <div 
        className={`absolute inset-0 w-full h-full bg-gradient-to-b ${getThemeColors()} transition-colors duration-1000`}
        style={{ opacity: skyOpacity }}
      />

      {/* 2. Deep Space Gradient (Fades in) */}
      <div 
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-black via-slate-900 to-indigo-950"
        style={{ opacity: spaceOpacity }}
      />

      {/* 3. Star Layers (Parallax) */}
      {/* Layer 1: Small Stars */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
            backgroundImage: 'radial-gradient(1px 1px at 10px 10px, white 1px, transparent 0), radial-gradient(1px 1px at 150px 250px, white 1px, transparent 0), radial-gradient(1px 1px at 300px 100px, white 1px, transparent 0), radial-gradient(2px 2px at 400px 400px, white 1px, transparent 0)',
            backgroundSize: '500px 500px',
            backgroundPosition: `0px ${starsY1}px` 
        }}
      />
      
      {/* Layer 2: Big Stars */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
            backgroundImage: 'radial-gradient(2px 2px at 50px 150px, white 1px, transparent 0), radial-gradient(2px 2px at 250px 50px, white 1px, transparent 0)',
            backgroundSize: '400px 400px',
            backgroundPosition: `0px ${starsY2}px`
        }}
      />

      {/* Decorative Celestial Body (Moves slightly) */}
      <div 
        className={`absolute right-10 w-32 h-32 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.2)] opacity-80 transition-colors duration-1000
          ${theme === 'Mars' ? 'bg-red-400' : theme === 'Neon' ? 'bg-cyan-400 shadow-cyan-500/50' : 'bg-slate-200'}
        `}
        style={{
            top: '10%',
            transform: `translateY(${altitude * 0.02}px)` // Moves very slowly
        }}
      />
    </div>
  );
};