import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Volume2, RefreshCw, Award, Heart, Share2 } from 'lucide-react';

interface ProverbItem {
  id: string;
  yoruba: string;
  literal: string;
  meaning: string;
  category: string;
}

const IDANRE_PROVERBS: ProverbItem[] = [
  {
    id: 'prv_1',
    yoruba: 'Àgbájọ ọwọ́ la fi ń sọ̀yà, ọwọ́ kan kò gbẹ́rù dé orí.',
    literal: 'It is with a clenched fist in unity that we beat our chest; a single hand cannot lift a heavy load to the head.',
    meaning: 'Collective youth solidarity achieves what individual ambition never can alone. Together we build Idanre and Ifedore.',
    category: 'Unity & Civic Power',
  },
  {
    id: 'prv_2',
    yoruba: 'Ilé la ti ń kọ́ ẹ̀ṣọ́ ròde.',
    literal: 'Good character and valor begin at home before going out into the world.',
    meaning: 'Integrity and community responsibility in our wards is the foundation of national leadership.',
    category: 'Integrity & Character',
  },
  {
    id: 'prv_3',
    yoruba: 'Bí ẹ̀kẹ́ ba wọ́, ilé a wó; ọ̀dọ́ tó gbọ́n ní ń tún ìlú ṣe.',
    literal: 'If the foundation pillar tilts, the building collapses; it is the wise youth that restores the town.',
    meaning: 'Youth are the structural pillar of community survival and economic innovation.',
    category: 'Youth Leadership',
  },
  {
    id: 'prv_4',
    yoruba: 'Ẹni tó gùn orí àpáta Oke Idanre kò ní bẹ̀rù ìṣubú bí ó bá tọrọ ìmọ̀ràn.',
    literal: 'He who ascends the steep rocks of Oke Idanre will not fear falling if he seeks guidance from those ahead.',
    meaning: 'Always seek counsel from experienced mentors, elders, and peers before launching ventures.',
    category: 'Wisdom & Mentorship',
  },
  {
    id: 'prv_5',
    yoruba: 'Ọwọ́ tó gbin igi kòkó lónìí, ọmọ rẹ̀ yóò jẹ́ ànfàní rẹ̀ lólá.',
    literal: 'The hands that plant the cocoa tree today will feed the generations of tomorrow.',
    meaning: 'Patience and long-term agricultural investments create lasting multigenerational prosperity.',
    category: 'Agribusiness & Foresight',
  },
  {
    id: 'prv_6',
    yoruba: 'A kì í fi ojú tẹ́ńbẹ́lú ọmọdé, kókó igi kéré ṣùgbọ́n ó ń fọ́ àáké.',
    literal: 'Never look down upon the youth; a small wood knot can break a heavy iron axe.',
    meaning: 'Youth possess untapped explosive potential capable of overcoming massive systemic hurdles.',
    category: 'Empowerment',
  },
];

export const InteractiveProverbCard: React.FC = () => {
  const { awardPoints, playSound, themeConfig } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const currentProverb = IDANRE_PROVERBS[currentIndex];

  const handleDrawNext = () => {
    setIsSpinning(true);
    playSound('proverb');

    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % IDANRE_PROVERBS.length);
      setIsSpinning(false);
      awardPoints(5, 'Drew a Yoruba Wisdom Proverb (+5 Wisdom Points)');
    }, 350);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    playSound('click');

    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${currentProverb.yoruba}. Meaning: ${currentProverb.meaning}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleShare = () => {
    playSound('click');
    const shareText = `"${currentProverb.yoruba}" — ${currentProverb.meaning} (Via Ok Idanre Youth Platform)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-br from-amber-500/10 via-stone-50/80 to-emerald-500/10 dark:from-amber-950/30 dark:via-stone-900/90 dark:to-emerald-950/20 shadow-sm backdrop-blur-md">
      {/* Toast */}
      {copiedToast && (
        <div className="absolute top-4 right-4 z-20 bg-stone-900 text-white text-[11px] px-3 py-1.5 rounded-xl shadow-lg animate-in fade-in">
          Proverb copied to clipboard!
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                Òwe Ìdànrè · Wisdom of the Elders
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                +5 Pts
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Interactive Yoruba Proverbs & Youth Moral Teachings
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-stone-400">
          {currentIndex + 1} / {IDANRE_PROVERBS.length}
        </span>
      </div>

      {/* Proverb Content with Smooth Flip Animation */}
      <div
        className={`p-5 rounded-2xl bg-white/90 dark:bg-stone-800/80 border border-amber-200/50 dark:border-amber-900/30 shadow-xs space-y-3 transition-all duration-300 ${
          isSpinning ? 'opacity-40 scale-98' : 'opacity-100 scale-100'
        }`}
      >
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          {currentProverb.category}
        </div>

        <blockquote className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug tracking-tight font-serif italic">
          "{currentProverb.yoruba}"
        </blockquote>

        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          <strong className="text-stone-900 dark:text-stone-100 font-sans">Translation:</strong> {currentProverb.literal}
        </p>

        <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <Award className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          <p className="leading-relaxed">
            <strong>Youth Lesson:</strong> {currentProverb.meaning}
          </p>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeak}
            className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSpeaking
                ? 'bg-amber-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
            }`}
            title="Listen to Yoruba proverb spoken aloud"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse' : ''}`} />
            <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
          </button>

          <button
            onClick={handleShare}
            className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors"
            title="Copy and share proverb"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Draw Next Button */}
        <button
          onClick={handleDrawNext}
          disabled={isSpinning}
          className="min-h-[40px] px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>Draw Another (+5 Pts)</span>
        </button>
      </div>
    </div>
  );
};
