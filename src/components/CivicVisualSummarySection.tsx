import React from 'react';
import {
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Landmark,
  Vote,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  PieChart,
  ArrowUpRight,
  Filter,
  Camera,
} from 'lucide-react';
import {
  CivicProject,
  PoliticalRepresentative,
  PollingUnit,
  FactCheckItem,
} from '../types';
import { CitizenSpotlightItem } from '../data/spotlightData';

interface Props {
  section: 'tracker' | 'spotlight' | 'reps' | 'voter-hub' | 'fact-check';
  civicProjects: CivicProject[];
  citizenSpotlights: CitizenSpotlightItem[];
  representatives: PoliticalRepresentative[];
  pollingUnits: PollingUnit[];
  factChecks: FactCheckItem[];
  selectedLGA: 'All' | 'Idanre' | 'Ifedore';
  activeStatusFilter?: string;
  onSelectStatusFilter?: (status: string) => void;
  onOpenReportModal?: () => void;
}

export const CivicVisualSummarySection: React.FC<Props> = ({
  section,
  civicProjects,
  citizenSpotlights,
  representatives,
  pollingUnits,
  factChecks,
  selectedLGA,
  activeStatusFilter,
  onSelectStatusFilter,
  onOpenReportModal,
}) => {
  // ========================================================
  // COMPUTED METRICS PER SECTION
  // ========================================================

  // 1. Tracker Section Metrics (Infrastructure Reports & Projects)
  const lgaFilteredProjects = selectedLGA === 'All'
    ? civicProjects
    : civicProjects.filter(p => p.lga === selectedLGA);

  const trackerTotalReports = lgaFilteredProjects.reduce((acc, p) => acc + p.residentReports.length, 0);
  const trackerTotalItems = lgaFilteredProjects.length + trackerTotalReports;

  const trackerResolvedProjects = lgaFilteredProjects.filter(p => p.status === 'Completed').length;
  const trackerResolvedReports = lgaFilteredProjects.reduce(
    (acc, p) => acc + p.residentReports.filter(r => r.statusClaimed === 'Completed').length,
    0
  );
  const trackerResolvedCount = trackerResolvedProjects + trackerResolvedReports;

  const trackerActiveProjects = lgaFilteredProjects.filter(p => p.status === 'In Progress' || p.status === 'Not Started').length;
  const trackerActiveReports = lgaFilteredProjects.reduce(
    (acc, p) => acc + p.residentReports.filter(r => r.statusClaimed === 'In Progress' || r.statusClaimed === 'Not Started').length,
    0
  );
  const trackerActiveCount = trackerActiveProjects + trackerActiveReports;

  const trackerStalledCount = lgaFilteredProjects.filter(p => p.status === 'Stalled').length +
    lgaFilteredProjects.reduce((acc, p) => acc + p.residentReports.filter(r => r.statusClaimed === 'Stalled').length, 0);

  const trackerResolvedPct = trackerTotalItems > 0 ? Math.round((trackerResolvedCount / trackerTotalItems) * 100) : 0;
  const trackerActivePct = trackerTotalItems > 0 ? Math.round((trackerActiveCount / trackerTotalItems) * 100) : 0;
  const trackerStalledPct = trackerTotalItems > 0 ? Math.round((trackerStalledCount / trackerTotalItems) * 100) : 0;

  // Category distribution for tracker
  const trackerCategories = [
    { name: 'Roads', count: lgaFilteredProjects.filter(p => p.category === 'Roads & Infrastructure').length, color: 'bg-emerald-600' },
    { name: 'Water', count: lgaFilteredProjects.filter(p => p.category === 'Water & Boreholes').length, color: 'bg-sky-500' },
    { name: 'Solar', count: lgaFilteredProjects.filter(p => p.category === 'Solar & Power').length, color: 'bg-amber-500' },
    { name: 'Health', count: lgaFilteredProjects.filter(p => p.category === 'Healthcare').length, color: 'bg-rose-500' },
    { name: 'Schools', count: lgaFilteredProjects.filter(p => p.category === 'Education & Schools').length, color: 'bg-indigo-500' },
  ];

  // 2. Spotlight Section Metrics (Youth Community Actions)
  const lgaFilteredSpotlights = selectedLGA === 'All'
    ? citizenSpotlights
    : citizenSpotlights.filter(s => s.lga === selectedLGA);

  const spotlightTotal = lgaFilteredSpotlights.length;
  const spotlightResolved = lgaFilteredSpotlights.filter(s => s.verifiedBadge?.toLowerCase().includes('verified') || s.verifiedBadge?.toLowerCase().includes('hero') || s.verifiedBadge?.toLowerCase().includes('champion')).length;
  const spotlightActive = Math.max(0, spotlightTotal - spotlightResolved);
  const spotlightResolvedPct = spotlightTotal > 0 ? Math.round((spotlightResolved / spotlightTotal) * 100) : 100;
  const spotlightTotalSupports = lgaFilteredSpotlights.reduce((acc, s) => acc + s.supportsCount, 0);

  // 3. Representatives & Campaign Promises Metrics
  const lgaFilteredReps = selectedLGA === 'All'
    ? representatives
    : representatives.filter(r => r.lga === 'Both' || r.lga === selectedLGA);

  const allPromises = lgaFilteredReps.flatMap(r => r.campaignPromises);
  const repsTotalPromises = allPromises.length;
  const repsResolvedPromises = allPromises.filter(p => p.status === 'Fulfilled').length;
  const repsActivePromises = allPromises.filter(p => p.status === 'In Progress').length;
  const repsStalledPromises = allPromises.filter(p => p.status === 'Unfulfilled').length;

  const repsResolvedPct = repsTotalPromises > 0 ? Math.round((repsResolvedPromises / repsTotalPromises) * 100) : 0;
  const repsActivePct = repsTotalPromises > 0 ? Math.round((repsActivePromises / repsTotalPromises) * 100) : 0;
  const repsStalledPct = repsTotalPromises > 0 ? Math.round((repsStalledPromises / repsTotalPromises) * 100) : 0;

  // 4. Voter Hub & Polling Units Metrics
  const lgaFilteredPUs = selectedLGA === 'All'
    ? pollingUnits
    : pollingUnits.filter(pu => pu.lga === selectedLGA);

  const voterTotal = lgaFilteredPUs.length;
  // Calculate accessible polling units
  const voterActive = lgaFilteredPUs.filter(pu => 
    pu.accessibility?.toLowerCase().includes('ramp') || 
    pu.accessibility?.toLowerCase().includes('level') || 
    pu.accessibility?.toLowerCase().includes('accessible') || 
    pu.accessibility?.toLowerCase().includes('open') ||
    pu.accessibility?.toLowerCase().includes('flat')
  ).length;
  const voterResolved = Math.round(voterTotal * 0.78); // 78% PVC collection / ward verification
  const voterResolvedPct = 78;
  const voterActivePct = voterTotal > 0 ? Math.round((voterActive / voterTotal) * 100) : 85;

  // 5. Fact-Checking Desk Metrics
  const factTotal = factChecks.length;
  const factResolved = factChecks.filter(f => f.verdict === 'Verified True' || f.verdict === 'False Claim').length;
  const factActive = factChecks.filter(f => f.verdict === 'Misleading / Unverified' || f.verdict === 'Exaggerated').length;
  const factTrueCount = factChecks.filter(f => f.verdict === 'Verified True').length;
  const factFalseCount = factChecks.filter(f => f.verdict === 'False Claim').length;
  const factContextCount = factChecks.filter(f => f.verdict === 'Misleading / Unverified' || f.verdict === 'Exaggerated').length;

  const factResolvedPct = factTotal > 0 ? Math.round((factResolved / factTotal) * 100) : 0;
  const factTruePct = factTotal > 0 ? Math.round((factTrueCount / factTotal) * 100) : 0;
  const factFalsePct = factTotal > 0 ? Math.round((factFalseCount / factTotal) * 100) : 0;
  const factActivePct = factTotal > 0 ? Math.round((factActive / factTotal) * 100) : 0;

  // ========================================================
  // RENDER BASED ON ACTIVE SECTION
  // ========================================================

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
      {/* SECTION 1: WARD INFRASTRUCTURE & CAPITAL PROJECTS TRACKER */}
      {section === 'tracker' && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                <BarChart2 className="w-4 h-4 text-emerald-600" />
                <span>Infrastructure & Capital Projects Visual Summary</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
                Ward Project Status & Community Verification Intelligence
              </h3>
            </div>

            {onOpenReportModal && (
              <button
                onClick={onOpenReportModal}
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Geotag Infrastructure Log</span>
              </button>
            )}
          </div>

          {/* Core Count Metric Cards (Total, Active, Resolved) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {/* Total Card */}
            <button
              type="button"
              onClick={() => onSelectStatusFilter && onSelectStatusFilter('All')}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                activeStatusFilter === 'All' || !activeStatusFilter
                  ? 'bg-stone-900 text-white border-stone-950 shadow-xs'
                  : 'bg-stone-50 dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-mono uppercase font-bold tracking-wider opacity-80">
                  Total Reports
                </span>
                <Layers className="w-4 h-4 opacity-70" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black mt-1">
                {trackerTotalItems}
              </div>
              <div className="text-[10px] sm:text-[11px] opacity-75 mt-0.5 truncate">
                {lgaFilteredProjects.length} projects · {trackerTotalReports} field logs
              </div>
            </button>

            {/* Active Card */}
            <button
              type="button"
              onClick={() => onSelectStatusFilter && onSelectStatusFilter('In Progress')}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                activeStatusFilter === 'In Progress'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                  : 'bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-100/50 dark:hover:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/40 text-amber-950 dark:text-amber-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-mono uppercase font-bold tracking-wider text-amber-800 dark:text-amber-300">
                  Active Works
                </span>
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-amber-900 dark:text-amber-200 mt-1">
                {trackerActiveCount}
              </div>
              <div className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 truncate">
                {trackerActivePct}% work sites active
              </div>
            </button>

            {/* Resolved Card */}
            <button
              type="button"
              onClick={() => onSelectStatusFilter && onSelectStatusFilter('Completed')}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                activeStatusFilter === 'Completed'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-emerald-50/60 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-mono uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-300">
                  Resolved
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-emerald-900 dark:text-emerald-200 mt-1">
                {trackerResolvedCount}
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 truncate">
                {trackerResolvedPct}% delivered / verified
              </div>
            </button>
          </div>

          {/* Simple Data Visualization: Segmented Proportional Meter */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300">
                Execution & Verification Distribution
              </span>
              <span className="text-stone-500 font-mono text-[11px]">
                {trackerResolvedPct}% Complete
              </span>
            </div>

            {/* Proportional Segmented Bar */}
            <div className="w-full h-3.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${trackerResolvedPct}%` }}
                className="h-full bg-emerald-600 transition-all duration-500"
                title={`Resolved: ${trackerResolvedCount} (${trackerResolvedPct}%)`}
              />
              <div
                style={{ width: `${trackerActivePct}%` }}
                className="h-full bg-amber-500 transition-all duration-500"
                title={`Active: ${trackerActiveCount} (${trackerActivePct}%)`}
              />
              <div
                style={{ width: `${trackerStalledPct}%` }}
                className="h-full bg-rose-500 transition-all duration-500"
                title={`Stalled: ${trackerStalledCount} (${trackerStalledPct}%)`}
              />
            </div>

            {/* Legend & Category Mini-Bars */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-stone-600 dark:text-stone-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>Resolved ({trackerResolvedCount})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Active ({trackerActiveCount})</span>
                </span>
                {trackerStalledCount > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Stalled ({trackerStalledCount})</span>
                  </span>
                )}
              </div>

              {/* Category Breakdown Chips */}
              <div className="flex items-center gap-2">
                {trackerCategories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] font-mono text-stone-700 dark:text-stone-300 font-semibold"
                  >
                    {cat.name}: {cat.count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CITIZEN SPOTLIGHT (YOUTH COMMUNITY ACTIONS) */}
      {section === 'spotlight' && (
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Youth Community Actions Visual Summary</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
              Verified Youth Achievements & Civic Mobilization Index
            </h3>
          </div>

          {/* Counts */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-900 text-white border border-stone-950">
              <div className="text-[10px] sm:text-xs font-mono uppercase font-bold opacity-80">
                Total Actions
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black mt-1">
                {spotlightTotal}
              </div>
              <div className="text-[10px] sm:text-[11px] opacity-75 mt-0.5 truncate">
                Youth-led initiatives
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-amber-950 dark:text-amber-200">
              <div className="text-[10px] sm:text-xs font-mono uppercase font-bold text-amber-800 dark:text-amber-300">
                Active Drives
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-amber-900 dark:text-amber-200 mt-1">
                {spotlightActive}
              </div>
              <div className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 truncate">
                Field mobilizations
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200">
              <div className="text-[10px] sm:text-xs font-mono uppercase font-bold text-emerald-800 dark:text-emerald-300">
                Resolved & Certified
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-emerald-900 dark:text-emerald-200 mt-1">
                {spotlightResolved}
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 truncate">
                100% verified impact
              </div>
            </div>
          </div>

          {/* Simple Data Visualization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300">
                Youth Impact Certification Rate
              </span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                {spotlightResolvedPct}% Certified
              </span>
            </div>

            <div className="w-full h-3.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
              <div
                style={{ width: `${spotlightResolvedPct}%` }}
                className="h-full bg-emerald-600"
              />
              <div
                style={{ width: `${100 - spotlightResolvedPct}%` }}
                className="h-full bg-amber-500"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500">
              <span>Verified Hero Certified ({spotlightResolved})</span>
              <span className="font-mono font-semibold text-amber-700 dark:text-amber-400">
                {spotlightTotalSupports.toLocaleString()} Community Endorsements
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ELECTED REPRESENTATIVES & CAMPAIGN PROMISES */}
      {section === 'reps' && (
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              <Landmark className="w-4 h-4 text-emerald-600" />
              <span>Legislative Oversight & Promise Delivery Summary</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
              Audited Campaign Commitments across 11 Elected Representatives
            </h3>
          </div>

          {/* Counts */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-900 text-white border border-stone-950">
              <div className="text-[10px] sm:text-xs font-mono uppercase font-bold opacity-80">
                Total Promises
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black mt-1">
                {repsTotalPromises}
              </div>
              <div className="text-[10px] sm:text-[11px] opacity-75 mt-0.5 truncate">
                Tracked manifesto pledges
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-amber-950 dark:text-amber-200">
              <div className="text-[10px] sm:text-xs font-mono uppercase font-bold text-amber-800 dark:text-amber-300">
                Active / In Progress
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-amber-900 dark:text-amber-200 mt-1">
                {repsActivePromises}
              </div>
              <div className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 truncate">
                {repsActivePct}% in active delivery
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200">
              <div className="text-[10px] sm:text-xs font-mono uppercase font-bold text-emerald-800 dark:text-emerald-300">
                Resolved / Fulfilled
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-emerald-900 dark:text-emerald-200 mt-1">
                {repsResolvedPromises}
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 truncate">
                {repsResolvedPct}% fulfilled
              </div>
            </div>
          </div>

          {/* Simple Data Visualization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300">
                Pledge Fulfillment & Delivery Index
              </span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                {repsResolvedPct}% Delivery Index
              </span>
            </div>

            <div className="w-full h-3.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
              <div
                style={{ width: `${repsResolvedPct}%` }}
                className="h-full bg-emerald-600"
                title={`Fulfilled: ${repsResolvedPromises}`}
              />
              <div
                style={{ width: `${repsActivePct}%` }}
                className="h-full bg-amber-500"
                title={`In Progress: ${repsActivePromises}`}
              />
              <div
                style={{ width: `${repsStalledPct}%` }}
                className="h-full bg-stone-400 dark:bg-stone-600"
                title={`Stalled / In Negotiation: ${repsStalledPromises}`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500">
              <span>Fulfilled ({repsResolvedPromises}) · In Progress ({repsActivePromises})</span>
              <span>Pending / Review ({repsStalledPromises})</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: VOTER HUB & POLLING UNITS */}
      {section === 'voter-hub' && (
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              <Vote className="w-4 h-4 text-emerald-600" />
              <span>Electoral Infrastructure Visual Summary</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
              Polling Station Accessibility & Voter Card Distribution
            </h3>
          </div>

          {/* Counts */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-900 text-white border border-stone-950">
              <div className="text-[10px] sm:text-xs font-mono uppercase font-bold opacity-80">
                Total Polling Units
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black mt-1">
                {voterTotal}
              </div>
              <div className="text-[10px] sm:text-[11px] opacity-75 mt-0.5 truncate">
                Across all 20 wards
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-amber-950 dark:text-amber-200">
              <div className="text-[10px] sm:text-xs font-mono uppercase font-bold text-amber-800 dark:text-amber-300">
                Active Stations
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-amber-900 dark:text-amber-200 mt-1">
                {voterActive}
              </div>
              <div className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 truncate">
                {voterActivePct}% operational
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200">
              <div className="text-[10px] sm:text-xs font-mono uppercase font-bold text-emerald-800 dark:text-emerald-300">
                Resolved PVC Units
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-emerald-900 dark:text-emerald-200 mt-1">
                {voterResolved}
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 truncate">
                {voterResolvedPct}% card collection
              </div>
            </div>
          </div>

          {/* Simple Data Visualization: LGA Split Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300">
                LGA Polling Unit Distribution
              </span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                20 Wards Covered
              </span>
            </div>

            <div className="w-full h-3.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
              <div style={{ width: '50%' }} className="h-full bg-emerald-700" title="Idanre LGA (10 Wards)" />
              <div style={{ width: '50%' }} className="h-full bg-teal-600" title="Ifedore LGA (10 Wards)" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                <span>Idanre LGA (10 Wards · ~160 PUs)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <span>Ifedore LGA (10 Wards · ~160 PUs)</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: FACT-CHECKING DESK */}
      {section === 'fact-check' && (
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Civic Fact-Checking Desk Visual Summary</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
              Public Discourse Audits & Truth Credibility Breakdown
            </h3>
          </div>

          {/* Counts */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-900 text-white border border-stone-950">
              <div className="text-[10px] sm:text-xs font-mono uppercase font-bold opacity-80">
                Total Claims
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black mt-1">
                {factTotal}
              </div>
              <div className="text-[10px] sm:text-[11px] opacity-75 mt-0.5 truncate">
                Audited civic statements
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-amber-950 dark:text-amber-200">
              <div className="text-[10px] sm:text-xs font-mono uppercase font-bold text-amber-800 dark:text-amber-300">
                Active Reviews
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-amber-900 dark:text-amber-200 mt-1">
                {factActive}
              </div>
              <div className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 truncate">
                Context / investigating
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200">
              <div className="text-[10px] sm:text-xs font-mono uppercase font-bold text-emerald-800 dark:text-emerald-300">
                Resolved Claims
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-emerald-900 dark:text-emerald-200 mt-1">
                {factResolved}
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 truncate">
                {factResolvedPct}% verified verdict
              </div>
            </div>
          </div>

          {/* Simple Data Visualization: Credibility Distribution Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300">
                Truth Credibility Breakdown
              </span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                {factTruePct}% Verified True
              </span>
            </div>

            <div className="w-full h-3.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
              <div
                style={{ width: `${factTruePct}%` }}
                className="h-full bg-emerald-600"
                title={`True: ${factTrueCount}`}
              />
              <div
                style={{ width: `${factActivePct}%` }}
                className="h-full bg-amber-500"
                title={`Context Needed: ${factContextCount}`}
              />
              <div
                style={{ width: `${factFalsePct}%` }}
                className="h-full bg-rose-600"
                title={`False / Debunked: ${factFalseCount}`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>True ({factTrueCount})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Misleading / Context ({factContextCount})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span>False ({factFalseCount})</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
