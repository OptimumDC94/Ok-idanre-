import React from 'react';
import { useApp } from '../context/AppContext';
import { COMMUNITY_THEMES, ThemeId } from '../types/theme';
import {
  Palette,
  X,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  Sun,
  Moon,
  Mountain,
  Compass,
  Flame,
} from 'lucide-react';

export const ThemeSelectorModal: React.FC = () => {
  const {
    currentTheme,
    setCurrentTheme,
    themeConfig,
    isThemeModalOpen,
    setIsThemeModalOpen,
    isDarkMode,
    toggleDarkMode,
    soundEnabled,
    toggleSound,
    ambientMotion,
    toggleAmbientMotion,
    playSound,
  } = useApp();

  if (!isThemeModalOpen) return null;

  const themesList = Object.values(COMMUNITY_THEMES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-600 text-white flex items-center justify-center shadow-md">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Community Color Themes & Vibes
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  IdanVibe
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Custom palettes inspired by Idanre hills, Ondo cocoa soil, and Yoruba heritage
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click');
              setIsThemeModalOpen(false);
            }}
            className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Environment Controls (Light/Dark, Sound, Ambient Motion) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Dark / Light Toggle */}
            <button
              onClick={() => {
                playSound('click');
                toggleDarkMode();
              }}
              className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/60 hover:border-emerald-500/60 transition-all text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {isDarkMode ? 'Night Mode' : 'Day Mode'}
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400">
                    {isDarkMode ? 'Deep dark tones' : 'Warm bright tones'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold">
                Toggle
              </span>
            </button>

            {/* Sound Effects Toggle */}
            <button
              onClick={() => {
                toggleSound();
              }}
              className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/60 hover:border-emerald-500/60 transition-all text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Audio Chimes
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400">
                    {soundEnabled ? 'Synthesizer enabled' : 'Muted'}
                  </div>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                  soundEnabled
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                }`}
              >
                {soundEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Ambient Motion Toggle */}
            <button
              onClick={() => {
                playSound('click');
                toggleAmbientMotion();
              }}
              className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/60 hover:border-emerald-500/60 transition-all text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Ambient Glow
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400">
                    {ambientMotion ? 'Organic hill orbs' : 'Static background'}
                  </div>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                  ambientMotion
                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                }`}
              >
                {ambientMotion ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {/* Theme Palette Cards Grid */}
          <div>
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Choose Your Landscape Palette</span>
              <span className="text-[11px] font-normal text-stone-500">6 Authentic Colorways</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {themesList.map(theme => {
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setCurrentTheme(theme.id)}
                    className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-400 ring-2 ring-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-md'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50/50 dark:hover:bg-stone-850'
                    }`}
                  >
                    {/* Color Swatch Banner */}
                    <div
                      className={`h-12 w-full rounded-xl bg-gradient-to-r ${theme.previewGradient} mb-3 shadow-inner flex items-center justify-between px-3 text-white`}
                    >
                      <span className="text-xs font-bold drop-shadow-sm flex items-center gap-1.5">
                        <Mountain className="w-3.5 h-3.5 opacity-80" />
                        <span>{theme.name}</span>
                      </span>
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-white text-emerald-800 flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs text-white/90">
                          Preview
                        </span>
                      )}
                    </div>

                    {/* Metadata & Native Cultural Title */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          {theme.nativeTitle}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full ring-1 ring-white/50"
                            style={{ backgroundColor: theme.primaryColor }}
                            title="Primary"
                          />
                          <span
                            className="w-2.5 h-2.5 rounded-full ring-1 ring-white/50"
                            style={{ backgroundColor: theme.accentColor }}
                            title="Accent"
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1 line-clamp-2">
                        {theme.description}
                      </p>

                      <div className="mt-2 text-[10px] text-stone-500 dark:text-stone-400 italic">
                        "{theme.tagline}"
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cultural Footer Note */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px]">
              <strong>Idanre Cultural Palette Tradition:</strong> Every color in Ok Idanre reflects an authentic aspect of our community: from the emerald canopy of the 682 stone steps, to the rich brown of sundried cocoa pods and sacred twilight across the Orosun monoliths.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/60 flex items-center justify-between">
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Active: <strong>{themeConfig.name}</strong></span>
          </div>

          <button
            onClick={() => {
              playSound('success');
              setIsThemeModalOpen(false);
            }}
            className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
