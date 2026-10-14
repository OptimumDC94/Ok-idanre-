import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  X,
  CheckCircle2,
  Sparkles,
  Trophy,
  Calendar,
  Gift,
  ArrowRight,
} from 'lucide-react';

export const CheckInModal: React.FC = () => {
  const {
    user,
    isCheckInModalOpen,
    setIsCheckInModalOpen,
    dailyCheckIn,
    hasCheckedInToday,
  } = useApp();

  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  if (!isCheckInModalOpen) return null;

  const currentStreak = user.checkInStreak || 1;
  const streakDayInWeek = ((currentStreak - 1) % 7) + 1; // 1 to 7

  const weeklyRewards = [
    { day: 1, points: 20, isBonus: false },
    { day: 2, points: 20, isBonus: false },
    { day: 3, points: 30, isBonus: true, bonusLabel: 'Streak!' },
    { day: 4, points: 20, isBonus: false },
    { day: 5, points: 20, isBonus: false },
    { day: 6, points: 20, isBonus: false },
    { day: 7, points: 50, isBonus: true, bonusLabel: 'Mega Reward' },
  ];

  const handleClaim = () => {
    const res = dailyCheckIn();
    setCelebrationMessage(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
        onClick={() => setIsCheckInModalOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden text-center flex flex-col">
        {/* Top Header decorative gradient glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-amber-500 via-emerald-600 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={() => setIsCheckInModalOpen(false)}
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Streak Badge */}
        <div className="mx-auto mt-2 mb-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-inner relative">
            <Flame className="w-9 h-9 text-amber-500 fill-amber-500 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 bg-emerald-800 text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
              +{weeklyRewards[streakDayInWeek - 1]?.points || 20}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-stone-900 tracking-tight">
          Daily Community Check-in
        </h2>
        <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
          Visit Ok Idanre daily to earn points, unlock civic badges, and enter bi-weekly youth rewards.
        </p>

        {/* Streak Counter Stat */}
        <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-around text-center">
          <div>
            <div className="text-[11px] text-stone-400 uppercase font-bold tracking-wider">
              Current Streak
            </div>
            <div className="text-lg font-extrabold text-stone-900 font-mono flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{user.checkInStreak || 1} { (user.checkInStreak || 1) === 1 ? 'Day' : 'Days' }</span>
            </div>
          </div>

          <div className="h-8 w-px bg-stone-200" />

          <div>
            <div className="text-[11px] text-stone-400 uppercase font-bold tracking-wider">
              Total Points
            </div>
            <div className="text-lg font-extrabold text-emerald-900 font-mono">
              {user.points} pts
            </div>
          </div>

          <div className="h-8 w-px bg-stone-200" />

          <div>
            <div className="text-[11px] text-stone-400 uppercase font-bold tracking-wider">
              Lifetime Check-ins
            </div>
            <div className="text-lg font-extrabold text-stone-800 font-mono">
              {user.totalCheckIns || 1}
            </div>
          </div>
        </div>

        {/* 7-Day Weekly Streak Track */}
        <div className="mt-5 text-left">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-stone-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-800" />
              7-Day Streak Rewards
            </span>
            <span className="text-[11px] text-stone-400">
              Day {streakDayInWeek} of 7
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {weeklyRewards.map(reward => {
              const isPast = reward.day < streakDayInWeek;
              const isCurrent = reward.day === streakDayInWeek;
              const isFuture = reward.day > streakDayInWeek;

              return (
                <div
                  key={reward.day}
                  className={`rounded-xl p-2 text-center transition-all flex flex-col justify-between items-center text-xs border ${
                    isCurrent
                      ? hasCheckedInToday
                        ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-700/20'
                        : 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20 shadow-xs'
                      : isPast
                      ? 'border-stone-200 bg-stone-100 text-stone-500'
                      : 'border-stone-200/70 bg-white text-stone-400'
                  }`}
                >
                  <div className="text-[10px] font-bold text-stone-500">
                    D{reward.day}
                  </div>

                  <div className="my-1">
                    {isPast || (isCurrent && hasCheckedInToday) ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 mx-auto" />
                    ) : reward.isBonus ? (
                      <Gift className="w-4 h-4 text-amber-500 mx-auto" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-stone-400 mx-auto" />
                    )}
                  </div>

                  <div
                    className={`font-mono text-[11px] font-bold ${
                      isCurrent
                        ? hasCheckedInToday
                          ? 'text-emerald-900'
                          : 'text-amber-800'
                        : 'text-stone-600'
                    }`}
                  >
                    +{reward.points}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Message or Celebration */}
        {celebrationMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{celebrationMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-5 pt-2">
          {!hasCheckedInToday ? (
            <button
              onClick={handleClaim}
              className="w-full min-h-[48px] py-3 px-4 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Flame className="w-5 h-5 fill-amber-200 text-amber-200" />
              <span>Claim Today's +{weeklyRewards[streakDayInWeek - 1]?.points || 20} Points</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="space-y-2">
              <div className="py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Checked In for Today! Next check-in ready tomorrow.</span>
              </div>
              <button
                onClick={() => setIsCheckInModalOpen(false)}
                className="w-full py-2.5 text-xs text-stone-600 hover:text-stone-900 font-semibold"
              >
                Close & Explore Community
              </button>
            </div>
          )}
        </div>

        {/* Footer Civic Tip */}
        <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400">
          Youth from Idanre & Ifedore check in daily to build collective civic awareness and earn micro-grant vouchers.
        </div>
      </div>
    </div>
  );
};
