import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mountain, Footprints, Award, Flag, Sparkles, CheckCircle2 } from 'lucide-react';

interface Waypoint {
  step: number;
  name: string;
  nativeName: string;
  desc: string;
}

const WAYPOINTS: Waypoint[] = [
  { step: 1, name: 'Great Arch Entrance', nativeName: 'Ẹnu Ọ̀nà Òkè', desc: 'Base gate at Odode where the ancient stone steps begin' },
  { step: 192, name: 'Dagunro Rest Spot', nativeName: 'Ìsinmi Dágunró', desc: 'Fresh mountain breeze & shade trees for weary climbers' },
  { step: 320, name: "Owa's Royal Resting Stone", nativeName: 'Àpáta Ìsinmi Ọba', desc: 'Where the monarch historically rested during coronation ascent' },
  { step: 540, name: 'Bat Sanctuary Vista', nativeName: 'Ojú Òkè Àdán', desc: 'High elevation cliffside overlook of ancient flora and wildlife' },
  { step: 682, name: 'Ufe Oke Summit Plateau', nativeName: 'Orí Òkè Ufe Oke', desc: 'Ancient 800-year palace plateau & UNESCO tentative sanctuary' },
];

export const InteractiveClimbTracker: React.FC = () => {
  const { user, awardPoints, playSound, themeConfig } = useApp();
  const [justClimbed, setJustClimbed] = useState(false);

  // Derive steps from user points (every 1 point = 2 steps climbed, capped at 682 or looping)
  const totalStepsClimbed = Math.min(682, Math.max(12, Math.floor(user.points * 1.6)));
  const percentage = Math.min(100, Math.round((totalStepsClimbed / 682) * 100));

  // Determine current waypoint
  const currentWaypoint = [...WAYPOINTS].reverse().find(w => totalStepsClimbed >= w.step) || WAYPOINTS[0];
  const nextWaypoint = WAYPOINTS.find(w => w.step > totalStepsClimbed) || WAYPOINTS[WAYPOINTS.length - 1];

  const handleClimbStep = () => {
    playSound('upvote');
    setJustClimbed(true);
    awardPoints(5, 'Climbed +8 steps up Oke Idanre through community action!');
    setTimeout(() => setJustClimbed(false), 1200);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-500/10 via-stone-50/90 to-teal-500/10 dark:from-emerald-950/40 dark:via-stone-900/90 dark:to-teal-950/20 shadow-sm backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Oke Idanre 682 Steps Climb Challenge
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                {percentage}% Ascended
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Your points power your ascent up Nigeria's most famous ancient granite staircase
            </p>
          </div>
        </div>

        <button
          onClick={handleClimbStep}
          className={`min-h-[42px] px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 ${
            justClimbed ? 'scale-105 ring-4 ring-emerald-500/30' : ''
          }`}
        >
          <Footprints className={`w-4 h-4 ${justClimbed ? 'animate-bounce' : ''}`} />
          <span>Ascend +8 Steps (+5 Pts)</span>
        </button>
      </div>

      {/* Main Metric Bar */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-800/70 border border-stone-200/60 dark:border-stone-700/60 shadow-2xs space-y-3">
        <div className="flex items-baseline justify-between text-xs">
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-stone-900 dark:text-stone-100">
              {totalStepsClimbed}
            </span>
            <span className="text-stone-400 text-xs font-mono ml-1">/ 682 Ancient Steps</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              Current Altitude: {currentWaypoint.name}
            </span>
            <div className="text-[10px] text-stone-400">
              Next milestone at Step {nextWaypoint.step}
            </div>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-stone-100 dark:bg-stone-700 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200 dark:border-stone-600">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 transition-all duration-700 relative"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/60 animate-pulse rounded-full" />
          </div>
        </div>

        {/* Waypoints Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-stone-100 dark:border-stone-700/60 text-[11px]">
          {WAYPOINTS.map(wp => {
            const isReached = totalStepsClimbed >= wp.step;
            return (
              <div
                key={wp.step}
                className={`p-2 rounded-xl transition-colors ${
                  isReached
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-800/60'
                    : 'bg-stone-50/50 dark:bg-stone-850 text-stone-400 border border-stone-100 dark:border-stone-800'
                }`}
              >
                <div className="flex items-center gap-1 font-mono font-bold text-[10px]">
                  {isReached ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Flag className="w-3 h-3 text-stone-400 shrink-0" />
                  )}
                  <span>Step {wp.step}</span>
                </div>
                <div className="font-semibold truncate text-[10px] mt-0.5" title={wp.name}>
                  {wp.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
