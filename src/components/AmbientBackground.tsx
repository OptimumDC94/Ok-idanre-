import React from 'react';
import { useApp } from '../context/AppContext';

export const AmbientBackground: React.FC = () => {
  const { currentTheme, themeConfig, isDarkMode, ambientMotion } = useApp();

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-colors duration-700">
      {/* Dynamic Background Base Gradient */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          isDarkMode ? themeConfig.bgDarkClass : themeConfig.bgLightClass
        }`}
      />

      {/* Ambient Glow Orbs (Fluid, organic motion matching theme glow) */}
      {ambientMotion && (
        <>
          {/* Top-Right Mountain Sunrise / Twilight Orb */}
          <div
            className="absolute -top-32 -right-32 w-96 sm:w-[540px] h-96 sm:h-[540px] rounded-full blur-3xl opacity-75 dark:opacity-60 animate-ambient-1 transition-all duration-1000"
            style={{
              backgroundColor: themeConfig.primaryColor,
              filter: 'blur(90px)',
            }}
          />

          {/* Bottom-Left Valley & Rainforest Mist Orb */}
          <div
            className="absolute -bottom-32 -left-32 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full blur-3xl opacity-60 dark:opacity-50 animate-ambient-2 transition-all duration-1000"
            style={{
              backgroundColor: themeConfig.accentColor,
              filter: 'blur(100px)',
            }}
          />

          {/* Center Subtle Aura for Depth */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[360px] rounded-full blur-3xl opacity-20 dark:opacity-30 pointer-events-none transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, ${themeConfig.primaryColor} 0%, transparent 70%)`,
            }}
          />
        </>
      )}

      {/* Topographic Contour Elevation Overlay (Oke Idanre 682 Steps Ridge Lines) */}
      <svg
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${
          ambientMotion ? 'animate-hill-pulse' : ''
        } ${isDarkMode ? 'opacity-[0.06]' : 'opacity-[0.05]'}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="M-50,320 C180,240 320,410 580,310 C840,210 1020,380 1260,280 C1380,230 1460,290 1520,310"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M-50,460 C210,380 380,540 680,440 C980,340 1140,510 1360,430 C1440,400 1500,430 1550,450"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M-50,600 C240,520 440,680 760,570 C1080,460 1240,630 1420,560 C1490,530 1530,550 1580,570"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path
          d="M-50,740 C280,660 520,820 860,710 C1200,600 1320,760 1480,700 C1530,680 1560,690 1600,710"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>

      {/* Gentle Dot Grid Texture */}
      <div className="absolute inset-0 bg-topo-pattern opacity-[0.035] dark:opacity-[0.05] pointer-events-none" />
    </div>
  );
};
