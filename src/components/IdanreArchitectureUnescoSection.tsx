import React, { useState } from 'react';
import {
  UNESCO_BENCHMARK_CRITERIA,
  STEPS_ASCENT_WAYPOINTS,
  ECO_TOURISM_BENCHMARKS,
  DESCENT_1923_MILESTONES,
  StepAscentWaypoint,
  UnescoBenchmarkCriterion,
  EcoTourismBenchmark,
} from '../data/cultureData';
import {
  Mountain,
  Globe2,
  Footprints,
  Trees,
  Volume2,
  Clock,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Droplets,
  Award,
  Layers,
  ArrowRight,
  Info,
  Calendar,
  Sparkles,
  BookOpen,
  MapPin,
  Heart,
} from 'lucide-react';

interface Props {
  onSpeak: (id: string, text: string, title?: string) => void;
  speakingId: string | null;
  onToast: (msg: string) => void;
}

export const IdanreArchitectureUnescoSection: React.FC<Props> = ({
  onSpeak,
  speakingId,
  onToast,
}) => {
  const [selectedWaypoint, setSelectedWaypoint] = useState<StepAscentWaypoint>(
    STEPS_ASCENT_WAYPOINTS[0]
  );
  const [selectedCriterion, setSelectedCriterion] = useState<UnescoBenchmarkCriterion | null>(
    UNESCO_BENCHMARK_CRITERIA[0]
  );
  const [ecoCategoryFilter, setEcoCategoryFilter] = useState<string>('All');
  const [activeArchitecturalFocus, setActiveArchitecturalFocus] = useState<'trail' | 'unesco' | '1923' | 'eco'>('trail');

  const filteredEcoBenchmarks = ecoCategoryFilter === 'All'
    ? ECO_TOURISM_BENCHMARKS
    : ECO_TOURISM_BENCHMARKS.filter(b => b.category === ecoCategoryFilter);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Editorial Overview Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-400">
            <Globe2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>UNESCO World Heritage Tentative List (Ref: 5169 · Oct 8, 2007)</span>
            <span aria-hidden="true">·</span>
            <span>Cultural Landscape</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Idanre Living Architecture & UNESCO Eco-Sanctuary
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Perched 3,000 feet (914m) above sea level, ancient <em>Ufe Oke</em> thrived for over 800 years as an impenetrable Yoruba inselberg fortress. In 1923, under the visionary decree of <strong>Owa Towobola</strong>, our people orchestrated a peaceful descent into the fertile cocoa plains of Odode, Alade, and Atosin, while sanctifying the ancient mountain as a living archaeological monument.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() =>
                onSpeak(
                  'arch-overview',
                  'Idanre Living Architecture and UNESCO Eco-Sanctuary. Perched 3,000 feet above sea level, ancient Ufe Oke thrived for over eight centuries. In 1923, Owa Towobola led the peaceful descent to Odode valley. The cultural landscape was inscribed on the UNESCO Tentative List on October 8, 2007 under Criteria 2, 3, 5, 6, and 7.',
                  'Living Architecture & UNESCO Overview'
                )
              }
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                speakingId === 'arch-overview'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 dark:text-amber-200 border border-amber-300/60 dark:border-amber-800/60'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${speakingId === 'arch-overview' ? 'animate-pulse' : ''}`} />
              <span>{speakingId === 'arch-overview' ? 'Pause Audio' : '🔊 Gbo / Listen in Voice'}</span>
            </button>

            <span className="text-xs text-stone-500 dark:text-stone-400">
              Inscribed on Nigeria's National Heritage Registry & UNESCO World Heritage Tentative List
            </span>
          </div>
        </div>

        {/* Decorative Mountain Monolith Silhouette */}
        <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none text-stone-900 dark:text-stone-100">
          <Mountain className="w-64 h-64" />
        </div>
      </div>

      {/* Segmented Architectural View Mode Selector */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-100 dark:bg-stone-900/80 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveArchitecturalFocus('trail')}
          className={`flex-1 min-w-[190px] py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeArchitecturalFocus === 'trail'
              ? 'bg-white dark:bg-stone-800 text-emerald-900 dark:text-emerald-300 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <Footprints className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>Interactive 682 Steps Ascent</span>
        </button>

        <button
          onClick={() => setActiveArchitecturalFocus('unesco')}
          className={`flex-1 min-w-[190px] py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeArchitecturalFocus === 'unesco'
              ? 'bg-white dark:bg-stone-800 text-amber-900 dark:text-amber-300 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <Globe2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>UNESCO Criteria Dossier</span>
        </button>

        <button
          onClick={() => setActiveArchitecturalFocus('1923')}
          className={`flex-1 min-w-[190px] py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeArchitecturalFocus === '1923'
              ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <Clock className="w-4 h-4 text-stone-600 dark:text-stone-400" />
          <span>1923 Descent Timeline</span>
        </button>

        <button
          onClick={() => setActiveArchitecturalFocus('eco')}
          className={`flex-1 min-w-[190px] py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeArchitecturalFocus === 'eco'
              ? 'bg-white dark:bg-stone-800 text-teal-900 dark:text-teal-300 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <Trees className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Inselberg Eco-Sanctuary</span>
        </button>
      </div>

      {/* ========================================================
          MODULE 1: INTERACTIVE 682-STEP ASCENT TRAIL EXPLORER
         ======================================================== */}
      {activeArchitecturalFocus === 'trail' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 dark:bg-stone-900/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Footprints className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>The 682 Granite Steps · Waypoints & Resting Stations (Àwọn Ibi Ìsinmi)</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Ascend 580 vertical meters across 5 historical rest clearings from Base Camp (334m) to Summit Plateau (914m).
              </p>
            </div>

            <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto shrink-0">
              Selected: {selectedWaypoint.stepRange} ({selectedWaypoint.elevationMeters}m Alt.)
            </div>
          </div>

          {/* Step Selector Horizontal Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {STEPS_ASCENT_WAYPOINTS.map((wp, idx) => {
              const isSelected = selectedWaypoint.id === wp.id;
              return (
                <button
                  key={wp.id}
                  onClick={() => setSelectedWaypoint(wp)}
                  className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[90px] ${
                    isSelected
                      ? 'bg-emerald-900 text-white border-emerald-800 shadow-sm'
                      : 'bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-850 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-emerald-300' : 'text-stone-400'}`}>
                      Station {idx + 1}
                    </span>
                    {wp.restingStationNumber && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${isSelected ? 'bg-emerald-800 text-amber-300' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'}`}>
                        Rest #{wp.restingStationNumber}
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="text-xs font-bold leading-tight line-clamp-1">
                      {wp.name.split('(')[0]}
                    </div>
                    <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`}>
                      {wp.stepRange} · {wp.elevationMeters}m
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Waypoint Spotlight View */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-900 flex flex-col justify-end p-6 text-white border-b lg:border-b-0 lg:border-r border-stone-800 overflow-hidden">
              {selectedWaypoint.photoUrl ? (
                <img
                  src={selectedWaypoint.photoUrl}
                  alt={selectedWaypoint.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                  <Mountain className="w-48 h-48 text-emerald-300" />
                </div>
              )}
              <div className="relative z-10 space-y-1">
                <div className="text-[11px] font-mono text-amber-300 uppercase font-bold tracking-wider">
                  {selectedWaypoint.yorubaName}
                </div>
                <h4 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                  {selectedWaypoint.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-stone-300 mt-2">
                  <span className="flex items-center gap-1 font-mono">
                    <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                    {selectedWaypoint.elevationMeters} Meters Elevation
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-amber-300">{selectedWaypoint.stepRange}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Architectural & Cultural Waypoint Profile
                  </span>

                  <button
                    onClick={() =>
                      onSpeak(
                        selectedWaypoint.id,
                        `${selectedWaypoint.name}, in Yoruba known as ${selectedWaypoint.yorubaName}. Located at ${selectedWaypoint.stepRange}, elevation ${selectedWaypoint.elevationMeters} meters. ${selectedWaypoint.description} Architectural features: ${selectedWaypoint.architecturalFeature}. Historical significance: ${selectedWaypoint.folkloreOrHistoricNote}. Visitor guidance: ${selectedWaypoint.visitorsGuidance}`,
                        selectedWaypoint.name
                      )
                    }
                    className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      speakingId === selectedWaypoint.id
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${speakingId === selectedWaypoint.id ? 'animate-pulse' : ''}`} />
                    <span>{speakingId === selectedWaypoint.id ? 'Pause Voice' : '🔊 Listen to Waypoint History'}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {selectedWaypoint.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Architectural Feature
                    </span>
                    <p className="text-xs font-medium text-stone-800 dark:text-stone-200">
                      {selectedWaypoint.architecturalFeature}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block">
                      Folklore & Archival Memory
                    </span>
                    <p className="text-xs font-medium text-amber-900 dark:text-amber-200">
                      {selectedWaypoint.folkloreOrHistoricNote}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
                      Trail Guidance & Visitor Protocol
                    </span>
                    <p className="text-xs text-emerald-900 dark:text-emerald-200 mt-0.5">
                      {selectedWaypoint.visitorsGuidance}
                    </p>
                  </div>
                </div>
              </div>

              {/* Waypoint Nav controls */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
                <span className="text-stone-400">
                  Step Station {STEPS_ASCENT_WAYPOINTS.findIndex(w => w.id === selectedWaypoint.id) + 1} of {STEPS_ASCENT_WAYPOINTS.length}
                </span>

                <div className="flex items-center gap-2">
                  {STEPS_ASCENT_WAYPOINTS.findIndex(w => w.id === selectedWaypoint.id) < STEPS_ASCENT_WAYPOINTS.length - 1 && (
                    <button
                      onClick={() => {
                        const nextIdx = STEPS_ASCENT_WAYPOINTS.findIndex(w => w.id === selectedWaypoint.id) + 1;
                        setSelectedWaypoint(STEPS_ASCENT_WAYPOINTS[nextIdx]);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Next Station</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODULE 2: UNESCO WORLD HERITAGE CRITERIA DOSSIER
         ======================================================== */}
      {activeArchitecturalFocus === 'unesco' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  International World Heritage Benchmark
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
                  Oke Idanre Cultural Landscape UNESCO Criteria (Ref: 5169)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                  Tentative List: Oct 8, 2007
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl">
              Nigeria nominated Oke Idanre to the UNESCO World Heritage Tentative List under five rigorous criteria encompassing architectural ingenuity, centuries of living cultural continuity, extreme topographical adaptation, and extraordinary natural inselberg beauty.
            </p>
          </div>

          {/* Criteria Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {UNESCO_BENCHMARK_CRITERIA.map(criterion => {
              const isSelected = selectedCriterion?.id === criterion.id;
              return (
                <div
                  key={criterion.id}
                  onClick={() => setSelectedCriterion(criterion)}
                  className={`bg-white dark:bg-stone-900 rounded-3xl p-6 border shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'border-amber-600 ring-2 ring-amber-500/20'
                      : 'border-stone-200 dark:border-stone-800 hover:border-amber-500/50'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {criterion.criterionNumber}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400">
                        {criterion.category} Value
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
                      {criterion.title}
                    </h4>

                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {criterion.justification}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">
                      <strong>Tangible Evidence:</strong> {criterion.heritageEvidence}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {criterion.conservationStatus}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSpeak(
                            criterion.id,
                            `${criterion.criterionNumber}: ${criterion.title}. ${criterion.justification}. Heritage evidence: ${criterion.heritageEvidence}. Conservation status: ${criterion.conservationStatus}`,
                            criterion.title
                          );
                        }}
                        className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          MODULE 3: 1923 DESCENT ARCHIVAL TIMELINE & CONTRAST
         ======================================================== */}
      {activeArchitecturalFocus === '1923' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100">
              The 1923 Centenary: From Hilltop Fortress to Valley Prosperity
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl">
              Unlike many African historic settlements that were forcibly dislocated or destroyed, Idanre’s migration from Ufe Oke was a peaceful, strategic royal transition led by <strong>Owa Towobola</strong> to maximize cocoa agriculture and modern transportation while keeping the sacred mountain preserved.
            </p>
          </div>

          {/* Architectural Contrast Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 space-y-4">
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                <h4 className="text-base font-extrabold text-amber-950 dark:text-amber-200">
                  Ancient Ufe Oke (Hilltop Era: ~1100 – 1923)
                </h4>
              </div>

              <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span><strong>Defensive Courtyard Palace (Aafin Owa)</strong>: 25 successive kings reigned within mud-brick structures featuring three dedicated royal gateways (King, Queen, Visitors).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span><strong>Natural Fortress Engineering</strong>: Monolithic inselbergs provided 360-degree surveillance; the secret Arokunso pass offered royal emergency egress.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span><strong>Sacred Trial of Agbooogun</strong>: Miraculous granite footprint used as an ancestral court of truth and conscience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span><strong>Arun Mountain River</strong>: High-altitude freshwater cascades revered for healing and year-round flow.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 space-y-4">
              <div className="flex items-center gap-2">
                <Trees className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h4 className="text-base font-extrabold text-emerald-950 dark:text-emerald-200">
                  Modern Odode & Subtowns (Valley Era: 1923 – Present)
                </h4>
              </div>

              <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span><strong>Cocoa Capital of Ondo State</strong>: Expansive fertile groves producing premium Nigerian cocoa for export.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span><strong>Flourishing Subtown Communities</strong>: Alade Idanre, Atosin, Odode, Owena, alongside neighboring Ifedore hubs (Igbara-Oke, Ilara-Mokin, Ijare).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span><strong>Educational & Civic Institutions</strong>: Secondary schools, health centers, and interfaith youth organizations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span><strong>Mare Mountaineering & Eco-Fest</strong>: International climbing festival uniting sport, youth concerts, and mountain stewardship.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Chronological Historical Milestones
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {DESCENT_1923_MILESTONES.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                      {m.year}
                    </span>
                    <button
                      onClick={() => onSpeak(`mile-${idx}`, `${m.year}: ${m.title}. ${m.historicalDetail}. Significance: ${m.significance}`, m.title)}
                      className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                      title="Listen"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {m.title}
                  </h5>
                  <div className="text-[10px] text-amber-800 dark:text-amber-400 font-medium">
                    {m.yorubaTitle}
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                    {m.historicalDetail}
                  </p>
                  <div className="text-[10px] text-stone-400 border-t border-stone-200 dark:border-stone-700 pt-1.5">
                    <strong>Significance:</strong> {m.significance}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODULE 4: INSELBERG ECO-SANCTUARY & BIODIVERSITY
         ======================================================== */}
      {activeArchitecturalFocus === 'eco' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
                  Ecological Integrity & Biodiversity
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
                  Inselberg Sanctuary & Sustainable Eco-Tourism Benchmarks
                </h3>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl overflow-x-auto no-scrollbar">
                {['All', 'Fauna Protection', 'Watershed Preservation', 'Agroforestry Buffer', 'Sustainable Trail Code'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setEcoCategoryFilter(cat)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                      ecoCategoryFilter === cat
                        ? 'bg-white dark:bg-stone-700 text-teal-900 dark:text-teal-200 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl">
              Oke Idanre’s high-altitude granite biome harbors unique flora and fauna, including the tailless rock hyrax, cold mountain freshwater streams, and certified shade-grown cocoa buffers that protect the foothills against erosion.
            </p>
          </div>

          {/* Eco Benchmarks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredEcoBenchmarks.map(b => (
              <div
                key={b.id}
                className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-teal-800 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-0.5 rounded-full">
                      {b.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.threatLevel === 'Protected'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : b.threatLevel === 'Moderate Vigilance'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                    }`}>
                      {b.threatLevel}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
                    {b.title}
                  </h4>

                  <div className="text-xs font-mono font-semibold text-emerald-800 dark:text-emerald-400">
                    Status: {b.statusMetric}
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {b.protocolDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 dark:text-stone-400">
                    Guardians: <strong>{b.communityGuardians}</strong>
                  </span>

                  <button
                    onClick={() =>
                      onSpeak(
                        b.id,
                        `${b.title}. Target: ${b.targetSpeciesOrAsset}. Status: ${b.statusMetric}. Protocol: ${b.protocolDescription}. Community guardians: ${b.communityGuardians}`,
                        b.title
                      )
                    }
                    className="text-teal-700 dark:text-teal-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
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
