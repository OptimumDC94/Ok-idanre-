import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VolunteerOpportunity } from '../types';
import {
  HeartHandshake,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  Check,
  Plus,
  X,
} from 'lucide-react';

export const VolunteeringTab: React.FC = () => {
  const { volunteering, toggleEnrollVolunteer, selectedLGA, user } = useApp();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // New initiative state
  const [projTitle, setProjTitle] = useState('');
  const [projOrg, setProjOrg] = useState('');
  const [projLocation, setProjLocation] = useState('');
  const [projHours, setProjHours] = useState('6');
  const [projDesc, setProjDesc] = useState('');

  const filteredOpportunities = volunteering.filter(v => {
    if (selectedLGA !== 'All' && v.lga !== 'Both' && v.lga !== selectedLGA) {
      return false;
    }
    return true;
  });

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

      {/* Volunteer Impact Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-emerald-950/60 px-2.5 py-1 rounded-md mb-2">
            <Award className="w-3.5 h-3.5" />
            Civic Action & Community Service
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">
            Youth Volunteering & Community Action
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl">
            Give back to Idanre and Ifedore. Protect our historic hills, mentor younger pupils, plant trees, and inspect neighborhood utilities.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-5 shrink-0">
          <div>
            <div className="text-[11px] text-stone-300">Your Impact Hours</div>
            <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
              {user.volunteerHours} hrs
            </div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <div className="text-[11px] text-stone-300">Community Rank</div>
            <div className="text-sm font-bold text-white">Tier 1 Steward</div>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base sm:text-lg font-bold text-stone-900">
          Active Opportunities ({filteredOpportunities.length})
        </h2>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="min-h-[44px] px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Propose Initiative
        </button>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOpportunities.map(opp => {
          const percentFull = Math.min(100, Math.round((opp.enrolledCount / opp.capacity) * 100));

          return (
            <article
              key={opp.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col hover:shadow-xs transition-shadow"
            >
              {opp.imageUrl && (
                <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={opp.imageUrl}
                    alt={opp.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                    {opp.organization}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-900/90 backdrop-blur-xs text-amber-300 text-[11px] font-mono px-2 py-1 rounded-md">
                    +{opp.targetHours} Hours Earned
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Zero-Pill Unboxed Metadata */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                    <span className="font-semibold text-emerald-900">{opp.lga === 'Both' ? 'Idanre & Ifedore' : `${opp.lga} LGA`}</span>
                    <span aria-hidden="true">·</span>
                    <span>Starts {opp.startDate}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    {opp.title}
                  </h3>

                  <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                      <span>{opp.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span>Target Commitment: <strong className="font-semibold text-stone-800">{opp.targetHours} hours</strong></span>
                    </div>

                    {/* Progress Bar of Capacity */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                        <span>Team Capacity</span>
                        <span className="font-mono tabular-nums">{opp.enrolledCount} of {opp.capacity} volunteers</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-700 rounded-full transition-all"
                          style={{ width: `${percentFull}%` }}
                        />
                      </div>
                    </div>

                    {/* Skills tags */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {opp.skillsNeeded.map(sk => (
                        <span key={sk} className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enroll CTA */}
                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">Certificates awarded upon completion</span>

                  <button
                    onClick={() => {
                      toggleEnrollVolunteer(opp.id);
                      showToast(opp.isEnrolled ? 'Volunteer withdrawal logged' : 'Enrolled! +50 points added to your profile');
                    }}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                      opp.isEnrolled
                        ? 'bg-emerald-800 text-white'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {opp.isEnrolled ? 'Enrolled Active Volunteer' : 'Join Volunteer Team'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Propose Initiative Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsSubmitModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-stone-900 mb-1">
              Propose a Youth Community Project
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Gather other young people to clean, build, plant, or teach in Idanre or Ifedore.
            </p>

            <form
              onSubmit={e => {
                e.preventDefault();
                showToast('Initiative submitted! Reviewed by youth coordinators.');
                setIsSubmitModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={projTitle}
                  onChange={e => setProjTitle(e.target.value)}
                  placeholder="e.g. Drainage Clean-up at Owena Market Junction"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Youth Group / Lead</label>
                  <input
                    type="text"
                    required
                    value={projOrg}
                    onChange={e => setProjOrg(e.target.value)}
                    placeholder="e.g. Owena Youth Action Group"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={projHours}
                    onChange={e => setProjHours(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Location / Ward</label>
                <input
                  type="text"
                  required
                  value={projLocation}
                  onChange={e => setProjLocation(e.target.value)}
                  placeholder="e.g. Owena, Idanre"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Project Goals & Tasks</label>
                <textarea
                  rows={3}
                  required
                  value={projDesc}
                  onChange={e => setProjDesc(e.target.value)}
                  placeholder="What will volunteers do, and what materials are needed?"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Submit for Volunteer Enrolment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
