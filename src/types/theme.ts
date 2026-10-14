export type ThemeId =
  | 'oke-emerald'
  | 'golden-cocoa'
  | 'royal-indigo'
  | 'orosun-sunset'
  | 'granite-monolith'
  | 'tropical-fest';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  nativeTitle: string;
  description: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  previewGradient: string;
  ambientLightGlow: string;
  ambientDarkGlow: string;
  bgLightClass: string;
  bgDarkClass: string;
  cardLightClass: string;
  cardDarkClass: string;
  accentTextClass: string;
  accentBgClass: string;
  accentBorderClass: string;
  primaryButtonClass: string;
}

export const COMMUNITY_THEMES: Record<ThemeId, ThemeConfig> = {
  'oke-emerald': {
    id: 'oke-emerald',
    name: 'Oke Emerald & Mist',
    nativeTitle: 'Èjìgbèdé Òkè Ìdànrè',
    description: 'Lush rainforest hills, 682 ancient steps, canopy mist & golden dawn light',
    tagline: 'Preserving our sacred mountains and green wealth',
    primaryColor: '#047857',
    accentColor: '#f59e0b',
    previewGradient: 'from-emerald-600 via-teal-600 to-green-700',
    ambientLightGlow: 'rgba(5, 150, 105, 0.18)',
    ambientDarkGlow: 'rgba(5, 150, 105, 0.28)',
    bgLightClass: 'bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-stone-100',
    bgDarkClass: 'bg-gradient-to-br from-emerald-950 via-teal-950/80 to-stone-950',
    cardLightClass: 'bg-white/85 backdrop-blur-md border-emerald-200/80 shadow-emerald-950/5',
    cardDarkClass: 'bg-stone-900/85 backdrop-blur-md border-emerald-800/40 shadow-black/30',
    accentTextClass: 'text-emerald-700 dark:text-emerald-400',
    accentBgClass: 'bg-emerald-50 dark:bg-emerald-950/60',
    accentBorderClass: 'border-emerald-200 dark:border-emerald-800/60',
    primaryButtonClass: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20',
  },
  'golden-cocoa': {
    id: 'golden-cocoa',
    name: 'Golden Cocoa Harvest',
    nativeTitle: 'Kòkó Wúrà & Ilẹ̀ Dídán',
    description: 'Rich roasted cocoa beans, warm terra cotta soil & fertile sunshine',
    tagline: 'Ondo State cocoa heritage & agricultural prosperity',
    primaryColor: '#d97706',
    accentColor: '#b45309',
    previewGradient: 'from-amber-600 via-orange-600 to-yellow-600',
    ambientLightGlow: 'rgba(217, 119, 6, 0.20)',
    ambientDarkGlow: 'rgba(217, 119, 6, 0.26)',
    bgLightClass: 'bg-gradient-to-br from-amber-50/95 via-orange-50/60 to-yellow-50/80',
    bgDarkClass: 'bg-gradient-to-br from-amber-950/90 via-stone-950 to-orange-950/80',
    cardLightClass: 'bg-white/85 backdrop-blur-md border-amber-200/80 shadow-amber-950/5',
    cardDarkClass: 'bg-stone-900/85 backdrop-blur-md border-amber-800/40 shadow-black/30',
    accentTextClass: 'text-amber-700 dark:text-amber-400',
    accentBgClass: 'bg-amber-50 dark:bg-amber-950/60',
    accentBorderClass: 'border-amber-200 dark:border-amber-800/60',
    primaryButtonClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
  },
  'royal-indigo': {
    id: 'royal-indigo',
    name: 'Royal Adire & Twilight',
    nativeTitle: 'Àdìrẹ Ọba & Òkè Alẹ́',
    description: 'Traditional Yoruba Adire indigo dyeing, midnight ridge & starry skies',
    tagline: 'Cultural royalty and nocturnal mountain majesty',
    primaryColor: '#4f46e5',
    accentColor: '#06b6d4',
    previewGradient: 'from-indigo-600 via-blue-600 to-sky-600',
    ambientLightGlow: 'rgba(79, 70, 229, 0.18)',
    ambientDarkGlow: 'rgba(79, 70, 229, 0.28)',
    bgLightClass: 'bg-gradient-to-br from-indigo-50/90 via-blue-50/50 to-slate-100',
    bgDarkClass: 'bg-gradient-to-br from-indigo-950/95 via-slate-950 to-blue-950/90',
    cardLightClass: 'bg-white/85 backdrop-blur-md border-indigo-200/80 shadow-indigo-950/5',
    cardDarkClass: 'bg-slate-900/85 backdrop-blur-md border-indigo-800/40 shadow-black/30',
    accentTextClass: 'text-indigo-700 dark:text-indigo-400',
    accentBgClass: 'bg-indigo-50 dark:bg-indigo-950/60',
    accentBorderClass: 'border-indigo-200 dark:border-indigo-800/60',
    primaryButtonClass: 'bg-indigo-700 hover:bg-indigo-800 text-white shadow-indigo-700/20',
  },
  'orosun-sunset': {
    id: 'orosun-sunset',
    name: 'Orosun Peak Sunset',
    nativeTitle: 'Ìwọòrùn Òkè Ọ̀rọ̀sun',
    description: 'Fiery coral skies, dusk warmth & sacred glowing granite monoliths',
    tagline: 'The dramatic evening glow over ancient peaks',
    primaryColor: '#e11d48',
    accentColor: '#f97316',
    previewGradient: 'from-rose-600 via-pink-600 to-orange-500',
    ambientLightGlow: 'rgba(225, 29, 72, 0.18)',
    ambientDarkGlow: 'rgba(225, 29, 72, 0.26)',
    bgLightClass: 'bg-gradient-to-br from-rose-50/90 via-pink-50/50 to-orange-50/80',
    bgDarkClass: 'bg-gradient-to-br from-rose-950/90 via-stone-950 to-orange-950/85',
    cardLightClass: 'bg-white/85 backdrop-blur-md border-rose-200/80 shadow-rose-950/5',
    cardDarkClass: 'bg-stone-900/85 backdrop-blur-md border-rose-800/40 shadow-black/30',
    accentTextClass: 'text-rose-700 dark:text-rose-400',
    accentBgClass: 'bg-rose-50 dark:bg-rose-950/60',
    accentBorderClass: 'border-rose-200 dark:border-rose-800/60',
    primaryButtonClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
  },
  'granite-monolith': {
    id: 'granite-monolith',
    name: 'Ancient Granite Obsidian',
    nativeTitle: 'Àpáta Àtijọ́ Ufe Oke',
    description: '800-year inselberg rock monoliths, silver mica veins & crisp tech focus',
    tagline: 'Enduring as the rock of ages, sharp as modern vision',
    primaryColor: '#3f3f46',
    accentColor: '#10b981',
    previewGradient: 'from-stone-700 via-zinc-800 to-neutral-900',
    ambientLightGlow: 'rgba(82, 82, 91, 0.15)',
    ambientDarkGlow: 'rgba(82, 82, 91, 0.25)',
    bgLightClass: 'bg-gradient-to-br from-stone-100 via-zinc-100 to-neutral-200/90',
    bgDarkClass: 'bg-gradient-to-br from-stone-950 via-zinc-950 to-neutral-950',
    cardLightClass: 'bg-white/90 backdrop-blur-md border-stone-300/80 shadow-stone-950/5',
    cardDarkClass: 'bg-zinc-900/85 backdrop-blur-md border-zinc-700/60 shadow-black/30',
    accentTextClass: 'text-stone-800 dark:text-stone-200',
    accentBgClass: 'bg-stone-100 dark:bg-zinc-800/60',
    accentBorderClass: 'border-stone-300 dark:border-zinc-700',
    primaryButtonClass: 'bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-white shadow-zinc-900/20',
  },
  'tropical-fest': {
    id: 'tropical-fest',
    name: 'Mare Carnival Fest',
    nativeTitle: 'Àjọ̀dún Mare & Ilé Ayẹyẹ',
    description: 'Vibrant festival flags, mountain climbing carnival & joyous youth spirit',
    tagline: 'Celebrating arts, mountain endurance & community friendship',
    primaryColor: '#9333ea',
    accentColor: '#f59e0b',
    previewGradient: 'from-fuchsia-600 via-purple-600 to-amber-500',
    ambientLightGlow: 'rgba(147, 51, 234, 0.18)',
    ambientDarkGlow: 'rgba(147, 51, 234, 0.28)',
    bgLightClass: 'bg-gradient-to-br from-purple-50/90 via-fuchsia-50/50 to-amber-50/70',
    bgDarkClass: 'bg-gradient-to-br from-purple-950/90 via-stone-950 to-fuchsia-950/85',
    cardLightClass: 'bg-white/85 backdrop-blur-md border-purple-200/80 shadow-purple-950/5',
    cardDarkClass: 'bg-stone-900/85 backdrop-blur-md border-purple-800/40 shadow-black/30',
    accentTextClass: 'text-purple-700 dark:text-purple-400',
    accentBgClass: 'bg-purple-50 dark:bg-purple-950/60',
    accentBorderClass: 'border-purple-200 dark:border-purple-800/60',
    primaryButtonClass: 'bg-purple-700 hover:bg-purple-800 text-white shadow-purple-700/20',
  },
};
