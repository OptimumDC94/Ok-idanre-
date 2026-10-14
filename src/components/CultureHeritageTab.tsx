import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ORAL_HISTORY_CLIPS,
  IDANRE_DIALECT_GLOSSARY,
  CULTURAL_CALENDAR_EVENTS,
  HERITAGE_CARDS,
  INTERFAITH_INITIATIVES,
  UNESCO_BENCHMARK_CRITERIA,
  STEPS_ASCENT_WAYPOINTS,
  ECO_TOURISM_BENCHMARKS,
  DESCENT_1923_MILESTONES,
  OralHistoryClip,
  CulturalEvent,
  HeritageCard,
  StepAscentWaypoint,
  UnescoBenchmarkCriterion,
  EcoTourismBenchmark,
} from '../data/cultureData';
import {
  Compass,
  Play,
  Pause,
  Volume2,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  Mountain,
  Sun,
  Shield,
  Users,
  Search,
  BookOpen,
  Bell,
  Check,
  ChevronRight,
  ExternalLink,
  Flame,
  Award,
  Layers,
  ArrowRight,
  Info,
  Droplets,
  Globe2,
  Footprints,
  Trees,
} from 'lucide-react';
import { IdanreArchitectureUnescoSection } from './IdanreArchitectureUnescoSection';

export const CultureHeritageTab: React.FC = () => {
  const {
    culturalEvents,
    toggleCulturalReminder,
    interfaithInitiatives,
    toggleSupportInterfaith,
    selectedLGA,
  } = useApp();

  const [activeCultureSubTab, setActiveCultureSubTab] = useState<'architecture-unesco' | 'museum' | 'calendar' | 'cards' | 'interfaith'>('architecture-unesco');
  const [playingClipId, setPlayingClipId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speakingTextId, setSpeakingTextId] = useState<string | null>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<StepAscentWaypoint>(STEPS_ASCENT_WAYPOINTS[0]);
  const [selectedUnescoCriterion, setSelectedUnescoCriterion] = useState<UnescoBenchmarkCriterion | null>(null);
  const [ecoFilter, setEcoFilter] = useState<string>('All');
  const [selectedHeritageCard, setSelectedHeritageCard] = useState<HeritageCard | null>(null);
  const [calendarCategory, setCalendarCategory] = useState<string>('All');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [nowTime, setNowTime] = useState<Date>(new Date());

  // Dialect search
  const [dialectQuery, setDialectQuery] = useState('');

  // Update clock every minute for accurate countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // General audio narration helper for elders, non-literate residents, and audio learners
  const handleSpeakNarrative = (id: string, text: string, title?: string) => {
    if (speakingTextId === id) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setSpeakingTextId(null);
      return;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 0.98;
      utterance.onend = () => setSpeakingTextId(null);
      utterance.onerror = () => setSpeakingTextId(null);
      window.speechSynthesis.speak(utterance);
      setSpeakingTextId(id);
      showToast(`Listening: "${title || 'Narration'}" (Click again to pause)`);
    } else {
      showToast('Audio narration is not supported on this browser');
    }
  };

  // Web Speech / Audio player simulation for oral history clips
  const handleTogglePlayAudio = (clip: OralHistoryClip) => {
    if (playingClipId === clip.id && isPlayingAudio) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      setPlayingClipId(null);
      return;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Oral history excerpt from ${clip.elderName}, ${clip.elderTitle}: ${clip.englishTranslation}`
      );
      utterance.rate = 0.92;
      utterance.pitch = 0.95;
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setPlayingClipId(null);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setPlayingClipId(null);
      };
      window.speechSynthesis.speak(utterance);
    }

    setPlayingClipId(clip.id);
    setIsPlayingAudio(true);
    showToast(`Playing elder oral history clip: "${clip.title}"`);
  };

  const getCountdownString = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const diff = target - nowTime.getTime();
    if (diff <= 0) return 'Happening Now / Concluded';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h countdown`;
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold backdrop-blur-xs border border-amber-400/30">
            <Mountain className="w-3.5 h-3.5" />
            <span>1923 Centenary Heritage & Interfaith Harmony</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Culture & Heritage Preservation
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            In 1923, our ancestors made the historic descent from ancient hilltop <em>Ufe Oke</em> to the Odode valley. Explore our living audio museum of elders recounting folklore, discover festival traditions like Orosun, Mare, and Osu Ise, and connect across Christian, Muslim, and indigenous youth fellowships.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <div className="text-[10px] text-amber-200 uppercase tracking-wider font-bold">1923 Descent</div>
              <div className="text-base sm:text-xl font-mono font-extrabold text-amber-300 mt-0.5">
                Centenary Era
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <div className="text-[10px] text-amber-200 uppercase tracking-wider font-bold">Oral Archives</div>
              <div className="text-base sm:text-xl font-mono font-extrabold text-white mt-0.5">
                {ORAL_HISTORY_CLIPS.length} Elder Clips
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <div className="text-[10px] text-amber-200 uppercase tracking-wider font-bold">Festivals Tracked</div>
              <div className="text-base sm:text-xl font-mono font-extrabold text-emerald-300 mt-0.5">
                {culturalEvents.length} Gatherings
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <div className="text-[10px] text-amber-200 uppercase tracking-wider font-bold">Interfaith Peace</div>
              <div className="text-base sm:text-xl font-mono font-extrabold text-white mt-0.5">
                3 Joint Drives
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none text-white">
          <Mountain className="w-80 h-80" />
        </div>
      </div>

      {/* Primary Sub-Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCultureSubTab('architecture-unesco')}
          className={`flex-1 min-w-[220px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeCultureSubTab === 'architecture-unesco'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Globe2 className="w-4 h-4 text-amber-300" />
          <span>Living Architecture & UNESCO</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-950/60 text-amber-200 font-mono">
            682 Steps
          </span>
        </button>

        <button
          onClick={() => setActiveCultureSubTab('museum')}
          className={`flex-1 min-w-[210px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeCultureSubTab === 'museum'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Volume2 className="w-4 h-4 text-amber-300" />
          <span>Oral History Audio Museum</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-950/60 text-amber-200 font-mono">
            {ORAL_HISTORY_CLIPS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveCultureSubTab('calendar')}
          className={`flex-1 min-w-[210px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeCultureSubTab === 'calendar'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Celebrations & Religion Calendar</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-950/60 text-amber-200 font-mono">
            {culturalEvents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveCultureSubTab('cards')}
          className={`flex-1 min-w-[210px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeCultureSubTab === 'cards'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Heritage Explainer Cards</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-950/60 text-amber-200 font-mono">
            {HERITAGE_CARDS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveCultureSubTab('interfaith')}
          className={`flex-1 min-w-[210px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeCultureSubTab === 'interfaith'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Interfaith & Peace Forum</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-950/60 text-amber-200 font-mono">
            Peace
          </span>
        </button>
      </div>

      {/* ========================================================
          SUB-TAB 0: LIVING ARCHITECTURE & UNESCO ECO-SANCTUARY
         ======================================================== */}
      {activeCultureSubTab === 'architecture-unesco' && (
        <IdanreArchitectureUnescoSection
          onSpeak={handleSpeakNarrative}
          speakingId={speakingTextId}
          onToast={showToast}
        />
      )}

      {/* ========================================================
          SUB-TAB 1: ORAL HISTORY AUDIO MUSEUM & 1923 DESCENT
         ======================================================== */}
      {activeCultureSubTab === 'museum' && (
        <div className="space-y-6">
          {/* Section Overview */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>Voices of Our Ancestors · Living Sound Archives</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              The 1923 Great Descent & Hilltop Legends
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl">
              Listen to respected elders recounting the 1923 transition from the ancient summit of Ufe Oke to Odode valley, the engineering of the 682 stone steps, Queen Orosun’s mountain blessings, and the ancient bat-hunting bravery of Osu Ise.
            </p>
          </div>

          {/* Audio Clips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ORAL_HISTORY_CLIPS.map(clip => {
              const isThisPlaying = playingClipId === clip.id && isPlayingAudio;
              return (
                <div
                  key={clip.id}
                  className={`bg-white dark:bg-stone-900 rounded-2xl border shadow-xs p-5 space-y-4 transition-all flex flex-col justify-between ${
                    isThisPlaying
                      ? 'border-amber-600 ring-2 ring-amber-500/20 bg-amber-50/20 dark:bg-amber-950/20'
                      : 'border-stone-200 dark:border-stone-800 hover:border-amber-600/40'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 uppercase">
                          {clip.topic}
                        </span>
                        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 pt-1.5 leading-snug">
                          {clip.title}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                          Recounted by <strong>{clip.elderName}</strong> ({clip.elderTitle})
                        </p>
                      </div>

                      {/* Play/Pause Button */}
                      <button
                        onClick={() => handleTogglePlayAudio(clip)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-95 ${
                          isThisPlaying
                            ? 'bg-amber-700 text-white animate-pulse'
                            : 'bg-stone-100 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}
                        title={isThisPlaying ? 'Pause audio clip' : 'Listen to elder voice narrative'}
                      >
                        {isThisPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>
                    </div>

                    {/* Animated Waveform Indicator when playing */}
                    {isThisPlaying && (
                      <div className="p-2.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
                        <div className="flex items-center gap-1.5 font-bold text-[11px]">
                          <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                          <span>Now Spoken ({clip.duration})</span>
                        </div>
                        <div className="flex items-center gap-1 h-3">
                          <span className="w-1 bg-amber-600 h-full rounded-full animate-pulse" />
                          <span className="w-1 bg-amber-500 h-2/3 rounded-full animate-bounce" />
                          <span className="w-1 bg-amber-700 h-full rounded-full animate-pulse" />
                          <span className="w-1 bg-amber-600 h-1/2 rounded-full animate-bounce" />
                        </div>
                      </div>
                    )}

                    {/* Yoruba Dialect Excerpt */}
                    <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/80 dark:border-stone-800 space-y-1">
                      <div className="text-[10px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                        Original Yoruba / Idanre Oral Excerpt:
                      </div>
                      <p className="text-xs italic text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                        "{clip.yorubaExcerpt}"
                      </p>
                    </div>

                    {/* English Translation */}
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        English Translation:
                      </span>
                      <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                        {clip.englishTranslation}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
                    <span>Recorded: {clip.yearRecorded}</span>
                    <span className="font-mono text-stone-500">Duration: {clip.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Idanre Dialect Interactive Glossary */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>The Idanre Dialect & Indigenous Proverbs</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Preserving indigenous linguistic identity across youth in Odode, Alade, and Atosin.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={dialectQuery}
                  onChange={e => setDialectQuery(e.target.value)}
                  placeholder="Search Idanre dialect phrase..."
                  className="w-full pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {IDANRE_DIALECT_GLOSSARY.filter(d =>
                !dialectQuery ||
                d.phrase.toLowerCase().includes(dialectQuery.toLowerCase()) ||
                d.englishMeaning.toLowerCase().includes(dialectQuery.toLowerCase())
              ).map((d, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif">
                      {d.phrase}
                    </span>
                    <button
                      onClick={() => {
                        if (window.speechSynthesis) {
                          const utt = new SpeechSynthesisUtterance(d.phrase);
                          utt.rate = 0.9;
                          window.speechSynthesis.speak(utt);
                        }
                        showToast(`Pronouncing: "${d.phrase}"`);
                      }}
                      className="p-1 rounded-md text-stone-400 hover:text-amber-700 hover:bg-stone-200/60 dark:hover:bg-stone-700 transition-colors"
                      title="Listen to dialect audio pronunciation"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono">
                    Standard Yoruba: {d.standardYoruba}
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold">
                    Meaning: {d.englishMeaning}
                  </p>
                  <p className="text-[10px] text-stone-400 italic">
                    Context: {d.usageContext}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: CULTURAL CELEBRATIONS & RELIGION TRACKER
         ======================================================== */}
      {activeCultureSubTab === 'calendar' && (
        <div className="space-y-6">
          {/* Header & Filter Controls */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  Interactive Celebrations & Religion Tracker
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Real-time countdowns, venue directions, and reminders for traditional festivals (Mare, Orosun, Osu Ise) alongside Christian and Islamic youth gatherings.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {['All', 'Traditional Heritage', 'Christian', 'Muslim', 'Interfaith Coalition'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCalendarCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      calendarCategory === cat
                        ? 'bg-amber-800 text-white shadow-2xs font-bold'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cultural Events List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {culturalEvents
              .filter(e => calendarCategory === 'All' || e.faithOrTradition === calendarCategory)
              .map(evt => (
                <div
                  key={evt.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden flex flex-col justify-between hover:border-amber-600/50 transition-all"
                >
                  <div>
                    {evt.imageUrl && (
                      <div className="relative h-44 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                        <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-amber-300 font-mono backdrop-blur-xs">
                            {evt.faithOrTradition}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-800/90 text-white backdrop-blur-xs">
                            {evt.lga} LGA
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-3 px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs font-bold font-mono backdrop-blur-xs flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{getCountdownString(evt.countdownTargetDate)}</span>
                        </div>
                      </div>
                    )}

                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{evt.date} · {evt.time}</span>
                        </div>
                        <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 leading-snug">
                          {evt.title}
                        </h3>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs space-y-1 border border-stone-100 dark:border-stone-800">
                        <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{evt.venue}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 pl-5">
                          Landmark: {evt.directionsLandmark}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 pt-0 flex items-center justify-between gap-3 border-t border-stone-100 dark:border-stone-800 mt-2">
                    <button
                      onClick={() => {
                        toggleCulturalReminder(evt.id);
                        showToast(
                          evt.isReminderSet
                            ? 'Removed reminder'
                            : `Reminder set for ${evt.title.slice(0, 24)}...`
                        );
                      }}
                      className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        evt.isReminderSet
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                          : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <Bell className={`w-3.5 h-3.5 ${evt.isReminderSet ? 'fill-current' : ''}`} />
                      <span>{evt.isReminderSet ? 'Reminder Set' : 'Set Reminder'}</span>
                      <span className="font-mono text-[10px] text-stone-500">({evt.remindersCount})</span>
                    </button>

                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${evt.venue}, ${evt.lga}, Ondo State, Nigeria`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[40px] px-3 py-2 text-stone-500 hover:text-emerald-800 dark:hover:text-emerald-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Get Directions</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: CULTURAL HISTORY & HERITAGE CARDS
         ======================================================== */}
      {activeCultureSubTab === 'cards' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              Cultural Heritage & Landmarks Dossier
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Deep historical backgrounders keeping modern youth connected to sacred sites, ancient architecture, and heroic traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HERITAGE_CARDS.map(card => (
              <div
                key={card.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden flex flex-col justify-between hover:border-amber-700/50 transition-all"
              >
                <div>
                  {card.imageUrl && card.imageUrl.trim() !== '' ? (
                    <div className="relative h-48 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                      <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/75 text-amber-300 font-mono text-[10px] font-bold backdrop-blur-xs">
                        {card.yearOrEra}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-white">
                      <div className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                        {card.yearOrEra}
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                        Historic Milestone
                      </span>
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] text-amber-800 dark:text-amber-400 font-mono uppercase font-bold">
                        {card.subtitle}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug">
                        {card.title}
                      </h3>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {card.summary}
                    </p>

                    <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs space-y-1.5 border border-stone-100 dark:border-stone-800">
                      <div className="font-bold text-[11px] text-stone-900 dark:text-stone-100">
                        Historical Significance:
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                        {card.detailedHistory}
                      </p>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Preserved Key Sites:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {card.keySpots.map((spot, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium"
                          >
                            {spot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast(`Copied link to "${card.title}"`);
                    }}
                    className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Heritage Story</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: INTERFAITH & PEACE FORUM
         ======================================================== */}
      {activeCultureSubTab === 'interfaith' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>Interfaith Harmony & Collective Action</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              Christian, Muslim & Traditional Youth United
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
              Idanre and Ifedore thrive when youth from all faith traditions join hands for community charity drives, mountain cleanups, orphan support, and peaceful elections.
            </p>
          </div>

          <div className="space-y-4">
            {interfaithInitiatives.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 font-mono">
                      {item.theme}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 pt-1">
                      {item.title}
                    </h3>
                  </div>

                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 self-start sm:self-auto">
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-100 dark:border-stone-800">
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Faith Coalition Partners</span>
                    <div className="text-stone-800 dark:text-stone-200 font-medium">
                      {item.faithPartners.join(' · ')}
                    </div>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Beneficiaries</span>
                    <div className="text-stone-800 dark:text-stone-200 font-medium">
                      {item.beneficiaries}
                    </div>
                  </div>
                </div>

                {/* Funding Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-stone-500">Community Raised: ₦{item.raisedBudget.toLocaleString()}</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-400">
                      Goal: ₦{item.targetBudget.toLocaleString()} ({Math.round((item.raisedBudget / item.targetBudget) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 dark:bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((item.raisedBudget / item.targetBudget) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[11px] text-stone-400">
                    Coordinators: <strong>{item.coordinatorNames.join(', ')}</strong>
                  </span>

                  <button
                    onClick={() => {
                      toggleSupportInterfaith(item.id);
                      showToast(
                        item.isSupported
                          ? 'Removed support'
                          : `Supported interfaith peace project! (+10 Points)`
                      );
                    }}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      item.isSupported
                        ? 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200'
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${item.isSupported ? 'fill-current' : ''}`} />
                    <span>{item.isSupported ? 'Supported' : 'Support Drive'}</span>
                    <span className="font-mono text-[10px]">({item.supportersCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
