import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Giveaway } from '../types';
import {
  Gift,
  Clock,
  Sparkles,
  CheckCircle2,
  Users,
  ShieldCheck,
  Award,
  Check,
} from 'lucide-react';

export const GiveawaysTab: React.FC = () => {
  const { giveaways, enterGiveaway, user } = useApp();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-200 bg-amber-950/40 px-2.5 py-1 rounded-md mb-2">
            <Gift className="w-3.5 h-3.5" />
            Youth Rewards & Growth Opportunities
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">
            Giveaways, Grants & Rewards
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
            Rewarding active participation, constructive ideas, and volunteering. Win mobile data bundles, agribusiness micro-grants, and vocational tour guide sponsorships.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[11px] text-amber-200">Your Entries</div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {giveaways.filter(g => g.isEntered).length} Active
            </div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <div className="text-[11px] text-amber-200">Eligibility Status</div>
            <div className="text-xs font-bold text-emerald-300">Active Member</div>
          </div>
        </div>
      </div>

      {/* Giveaways Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {giveaways.map(gw => (
          <article
            key={gw.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 flex flex-col justify-between hover:shadow-xs transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="font-semibold text-emerald-900">{gw.category}</span>
                <span className="flex items-center gap-1 text-amber-700 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {gw.deadline}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                {gw.title}
              </h2>

              <div className="my-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-stone-800">
                <div className="text-[11px] text-amber-900 font-semibold mb-0.5">Reward Package:</div>
                <div className="font-bold text-stone-900 text-sm">{gw.reward}</div>
              </div>

              <div className="space-y-2 text-xs text-stone-600">
                <div>
                  <strong className="text-stone-800">Sponsored by:</strong> {gw.sponsor}
                </div>
                <div>
                  <strong className="text-stone-800">Rules / Criteria:</strong> {gw.requirements}
                </div>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-mono tabular-nums font-bold text-emerald-900">{gw.entriesCount}</span>
                  <span>entries submitted</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{gw.slots} winners</span>
                </div>
              </div>

              {gw.winners && gw.winners.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100 text-xs">
                  <div className="font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Recent Winners:
                  </div>
                  <div className="flex flex-wrap gap-1 text-[11px] text-stone-600">
                    {gw.winners.map(w => (
                      <span key={w} className="bg-stone-100 px-2 py-0.5 rounded">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100">
              <button
                disabled={gw.isEntered}
                onClick={() => {
                  enterGiveaway(gw.id);
                  showToast('You have entered this giveaway! Good luck!');
                }}
                className={`w-full h-11 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  gw.isEntered
                    ? 'bg-emerald-100 text-emerald-900 cursor-default'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                }`}
              >
                {gw.isEntered ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Entered Successfully
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Enter Giveaway (Free)
                  </>
                )}
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Community Transparency Pledge */}
      <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
        <div className="text-xs text-stone-600 leading-relaxed">
          <strong className="text-stone-900 block font-semibold mb-0.5">
            Transparent Selection Process:
          </strong>
          All community draws and data grants are selected via transparent, verifiable random criteria or reviewed by our joint Idanre-Ifedore youth committee. No fee is ever requested to enter or receive rewards.
        </div>
      </div>
    </div>
  );
};
