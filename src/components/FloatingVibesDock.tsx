import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Palette, Volume2, VolumeX, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

export const FloatingVibesDock: React.FC = () => {
  const {
    themeConfig,
    setIsThemeModalOpen,
    soundEnabled,
    toggleSound,
    playSound,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside aria-label="Theme and Audio Controls" className="fixed bottom-20 lg:bottom-6 right-4 z-30 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Expanded quick actions pop */}
      {isExpanded && (
        <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 flex flex-col gap-1.5 animate-in slide-in-from-bottom-2 fade-in duration-150 mb-1">
          {/* Audio toggle button */}
          <button
            onClick={() => {
              toggleSound();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
          </button>

          {/* Open full palette modal button */}
          <button
            onClick={() => {
              playSound('click');
              setIsThemeModalOpen(true);
              setIsExpanded(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>All 6 Palettes</span>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Pill */}
      <div className="flex items-center bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-1 rounded-full shadow-lg border border-stone-200/90 dark:border-stone-800 transition-all hover:scale-105 active:scale-95">
        <button
          onClick={() => {
            playSound('click');
            setIsThemeModalOpen(true);
          }}
          className="flex items-center gap-2 pl-2.5 pr-2 py-1 rounded-full text-xs font-bold text-stone-800 dark:text-stone-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          title={`Theme: ${themeConfig.name}. Click to change background palette!`}
        >
          {/* Animated Glowing Color Swatch Dot */}
          <span className="relative flex h-3.5 w-3.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ backgroundColor: themeConfig.primaryColor }}
            />
            <span
              className="relative inline-flex rounded-full h-3.5 w-3.5 border border-white dark:border-stone-900 shadow-2xs"
              style={{ backgroundColor: themeConfig.primaryColor }}
            />
          </span>

          <span className="hidden sm:inline font-mono text-[11px]">
            {themeConfig.name.split(' ')[0]}
          </span>
          <Palette className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-6 h-6 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          aria-label="Expand quick settings"
        >
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      </div>
    </aside>
  );
};
