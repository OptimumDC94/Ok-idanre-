import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CivicProject,
  PoliticalWard,
  PoliticalRepresentative,
  PollingUnit,
  FactCheckItem,
} from '../types';
import {
  IDANRE_WARDS,
  IFEDORE_WARDS,
  INITIAL_REPRESENTATIVES,
  INITIAL_POLLING_UNITS,
  VOTER_GUIDE_STEPS,
} from '../data/civicData';
import { CameraGeotagReportModal } from './CameraGeotagReportModal';
import { CivicVisualSummarySection } from './CivicVisualSummarySection';
import {
  Vote,
  Landmark,
  FileText,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  ThumbsUp,
  Share2,
  ExternalLink,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Camera,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  HelpCircle,
  Award,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ShieldAlert,
  ArrowRight,
  Heart,
  Star,
  MessageSquare,
  Send,
  Droplets,
  Zap,
  HeartPulse,
  GraduationCap,
  Truck,
} from 'lucide-react';

export const CivicTechTab: React.FC = () => {
  const {
    selectedLGA,
    civicProjects,
    addProjectReport,
    upvoteProjectReport,
    addCivicProject,
    addProjectComment,
    upvoteProjectComment,
    factChecks,
    submitFactCheckClaim,
    citizenSpotlights,
    toggleSupportSpotlight,
    nominateSpotlight,
    user,
  } = useApp();

  // Primary Civic Section Switcher
  const [activeCivicSection, setActiveCivicSection] = useState<'tracker' | 'spotlight' | 'reps' | 'voter-hub' | 'fact-check'>('tracker');

  // --- Citizen Spotlight States ---
  const [spotlightCategory, setSpotlightCategory] = useState<string>('All');
  const [spotlightLga, setSpotlightLga] = useState<'All' | 'Idanre' | 'Ifedore'>('All');
  const [isNominateModalOpen, setIsNominateModalOpen] = useState(false);
  const [nomTitle, setNomTitle] = useState('');
  const [nomGroup, setNomGroup] = useState('');
  const [nomLga, setNomLga] = useState<'Idanre' | 'Ifedore'>('Idanre');
  const [nomWard, setNomWard] = useState('Idale-Logbosere');
  const [nomCategory, setNomCategory] = useState<any>('Infrastructure & Safety');
  const [nomImpact, setNomImpact] = useState('');
  const [nomStory, setNomStory] = useState('');
  const [nomMetricNum, setNomMetricNum] = useState('');
  const [nomMetricLabel, setNomMetricLabel] = useState('');
  const [nomPhoto, setNomPhoto] = useState('');

  // --- Project Tracker Filters & Comments State ---
  const [openCommentsProjectIds, setOpenCommentsProjectIds] = useState<Record<string, boolean>>({
    proj_01: true,
    proj_02: true,
  });
  const [commentInputValues, setCommentInputValues] = useState<Record<string, string>>({});
  const [projectModalTab, setProjectModalTab] = useState<'report' | 'comments'>('report');

  const QUICK_PROJECT_TAGS = [
    'Work ongoing smoothly',
    'Workers active on site',
    'Site inspection needed',
    'Materials delivered',
    'Poles & wiring connected',
  ];

  const handleAddQuickTag = (projectId: string, tag: string) => {
    setCommentInputValues(prev => {
      const current = prev[projectId] || '';
      return {
        ...prev,
        [projectId]: current ? `${current} · ${tag}` : tag,
      };
    });
  };

  const toggleComments = (projectId: string) => {
    setOpenCommentsProjectIds(prev => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const handlePostComment = (projectId: string) => {
    const text = commentInputValues[projectId]?.trim();
    if (!text) return;
    addProjectComment(projectId, text);
    setCommentInputValues(prev => ({ ...prev, [projectId]: '' }));
    setOpenCommentsProjectIds(prev => ({ ...prev, [projectId]: true }));
    showToast('Citizen comment published! +15 Civic Points earned');
  };

  const getCategoryIcon = (category: CivicProject['category']) => {
    switch (category) {
      case 'Water & Boreholes':
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'Solar & Power':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'Healthcare':
        return <HeartPulse className="w-4 h-4 text-rose-500" />;
      case 'Education & Schools':
        return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      case 'Roads & Infrastructure':
        return <Truck className="w-4 h-4 text-emerald-500" />;
      default:
        return <Building2 className="w-4 h-4 text-emerald-500" />;
    }
  };

  const [projectLgaFilter, setProjectLgaFilter] = useState<'All' | 'Idanre' | 'Ifedore'>(
    selectedLGA !== 'All' ? selectedLGA : 'All'
  );
  const [selectedWardFilter, setSelectedWardFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjectForReport, setSelectedProjectForReport] = useState<CivicProject | null>(null);
  const [isCameraReportModalOpen, setIsCameraReportModalOpen] = useState(false);
  const [cameraReportPreselectedProject, setCameraReportPreselectedProject] = useState<CivicProject | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Report submission form
  const [reportStatus, setReportStatus] = useState<CivicProject['status']>('In Progress');
  const [reportNote, setReportNote] = useState('');
  const [reportPhotoUrl, setReportPhotoUrl] = useState('');

  // Add Project Form
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjLga, setNewProjLga] = useState<'Idanre' | 'Ifedore'>('Idanre');
  const [newProjWardId, setNewProjWardId] = useState('');
  const [newProjCategory, setNewProjCategory] = useState<CivicProject['category']>('Roads & Infrastructure');
  const [newProjFunding, setNewProjFunding] = useState<CivicProject['fundingLevel']>('State Government (Ondo State)');
  const [newProjBudget, setNewProjBudget] = useState('');
  const [newProjAgency, setNewProjAgency] = useState('');
  const [newProjLandmark, setNewProjLandmark] = useState('');
  const [newProjImage, setNewProjImage] = useState('');

  // --- Representatives Filters ---
  const [repLevelFilter, setRepLevelFilter] = useState<string>('All');
  const [repLgaFilter, setRepLgaFilter] = useState<'All' | 'Idanre' | 'Ifedore'>('All');
  const [selectedRepDetail, setSelectedRepDetail] = useState<PoliticalRepresentative | null>(null);

  // --- Polling Unit & Voter Hub ---
  const [puSearch, setPuSearch] = useState('');
  const [puWardFilter, setPuWardFilter] = useState<string>('All');
  const [puLgaFilter, setPuLgaFilter] = useState<'All' | 'Idanre' | 'Ifedore'>('All');

  // --- Fact Check Submission ---
  const [isFactCheckModalOpen, setIsFactCheckModalOpen] = useState(false);
  const [factClaim, setFactClaim] = useState('');
  const [factClaimant, setFactClaimant] = useState('');
  const [factCategory, setFactCategory] = useState<FactCheckItem['category']>('Elections & INEC');

  const allWards = useMemo(() => {
    return [...IDANRE_WARDS, ...IFEDORE_WARDS];
  }, []);

  const displayWards = useMemo(() => {
    if (projectLgaFilter === 'Idanre') return IDANRE_WARDS;
    if (projectLgaFilter === 'Ifedore') return IFEDORE_WARDS;
    return allWards;
  }, [projectLgaFilter, allWards]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return civicProjects.filter(p => {
      if (projectLgaFilter !== 'All' && p.lga !== projectLgaFilter) return false;
      if (selectedWardFilter !== 'All' && p.wardId !== selectedWardFilter) return false;
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      if (projectSearch.trim()) {
        const q = projectSearch.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchWard = p.wardName.toLowerCase().includes(q);
        const matchAgency = p.contractorOrAgency.toLowerCase().includes(q);
        const matchLandmark = p.locationLandmark.toLowerCase().includes(q);
        if (!matchTitle && !matchWard && !matchAgency && !matchLandmark) return false;
      }
      return true;
    });
  }, [civicProjects, projectLgaFilter, selectedWardFilter, categoryFilter, statusFilter, projectSearch]);

  // Aggregate budget metrics
  const totalBudgetTracked = useMemo(() => {
    return civicProjects.reduce((sum, p) => sum + p.budgetAmount, 0);
  }, [civicProjects]);

  const completedProjectsCount = useMemo(() => {
    return civicProjects.filter(p => p.status === 'Completed').length;
  }, [civicProjects]);

  const inProgressProjectsCount = useMemo(() => {
    return civicProjects.filter(p => p.status === 'In Progress').length;
  }, [civicProjects]);

  const totalCitizenReports = useMemo(() => {
    return civicProjects.reduce((sum, p) => sum + p.residentReports.length, 0);
  }, [civicProjects]);

  // Filtered representatives
  const filteredReps = useMemo(() => {
    return INITIAL_REPRESENTATIVES.filter(r => {
      if (repLgaFilter !== 'All' && r.lga !== 'Both' && r.lga !== repLgaFilter) return false;
      if (repLevelFilter !== 'All' && r.level !== repLevelFilter) return false;
      return true;
    });
  }, [repLgaFilter, repLevelFilter]);

  // Filtered polling units
  const filteredPUs = useMemo(() => {
    return INITIAL_POLLING_UNITS.filter(pu => {
      if (puLgaFilter !== 'All' && pu.lga !== puLgaFilter) return false;
      if (puWardFilter !== 'All' && pu.wardName !== puWardFilter) return false;
      if (puSearch.trim()) {
        const q = puSearch.toLowerCase();
        return (
          pu.locationName.toLowerCase().includes(q) ||
          pu.puCode.toLowerCase().includes(q) ||
          pu.landmark.toLowerCase().includes(q) ||
          pu.wardName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [puLgaFilter, puWardFilter, puSearch]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForReport || !reportNote.trim()) return;

    addProjectReport(
      selectedProjectForReport.id,
      reportStatus,
      reportNote.trim(),
      reportPhotoUrl.trim() || undefined
    );

    showToast('Verified report logged! Earned +25 Civic Reputation Points');
    setReportNote('');
    setReportPhotoUrl('');
    setSelectedProjectForReport(null);
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjWardId) return;

    const matchedWard = allWards.find(w => w.id === newProjWardId);
    if (!matchedWard) return;

    const budgetNum = parseFloat(newProjBudget.replace(/[^0-9.]/g, '')) || 10000000;

    addCivicProject({
      title: newProjTitle.trim(),
      description: newProjDesc.trim() || 'Ward capital project logged by community residents.',
      wardId: matchedWard.id,
      wardName: matchedWard.name,
      lga: matchedWard.lga,
      category: newProjCategory,
      fundingLevel: newProjFunding,
      budgetAmount: budgetNum,
      status: 'In Progress',
      progressPercentage: 20,
      contractorOrAgency: newProjAgency.trim() || 'Ministry of Works & Infrastructure',
      startDate: 'Current Fiscal Quarter',
      targetCompletionDate: 'Next Fiscal Year',
      locationLandmark: newProjLandmark.trim() || `${matchedWard.name} central corridor`,
      imageUrl: newProjImage.trim() || undefined,
    });

    showToast('Project logged successfully! Earned +40 Civic Points');
    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjBudget('');
    setNewProjAgency('');
    setNewProjLandmark('');
    setNewProjImage('');
    setIsAddProjectModalOpen(false);
  };

  const handleFactCheckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!factClaim.trim()) return;

    submitFactCheckClaim(factClaim.trim(), factClaimant.trim(), factCategory);
    showToast('Claim submitted for verification! +15 Points');
    setFactClaim('');
    setFactClaimant('');
    setIsFactCheckModalOpen(false);
  };

  const formatNaira = (amount: number) => {
    if (amount >= 1000000000) {
      return `₦${(amount / 1000000000).toFixed(2)} Billion`;
    }
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)} Million`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status: CivicProject['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Completed</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>In Progress</span>
          </span>
        );
      case 'Stalled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-900 dark:bg-red-950/80 dark:text-red-300">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Stalled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span>Not Started</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-xs border border-emerald-400/30">
            <Vote className="w-3.5 h-3.5" />
            <span>Democracy, Open Budgets & Youth Oversight</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Political & Civic Tech Center
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            Promoting transparent governance across Idanre’s 10 political wards and Ifedore’s 10 political wards. Track public expenditures, hold representatives accountable, verify polling units, and counter electoral misinformation.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <div className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">Tracked Budget</div>
              <div className="text-base sm:text-xl font-mono font-extrabold text-amber-300 mt-0.5">
                {formatNaira(totalBudgetTracked)}
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <div className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">Official Wards</div>
              <div className="text-base sm:text-xl font-mono font-extrabold text-white mt-0.5">
                20 Wards
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <div className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">Active Projects</div>
              <div className="text-base sm:text-xl font-mono font-extrabold text-emerald-300 mt-0.5">
                {inProgressProjectsCount} In Progress
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <div className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">Resident Reports</div>
              <div className="text-base sm:text-xl font-mono font-extrabold text-white mt-0.5">
                {totalCitizenReports} Field Logs
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-white">
          <Vote className="w-80 h-80" />
        </div>
      </div>

      {/* Primary Navigation Pills */}
      <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCivicSection('tracker')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeCivicSection === 'tracker'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Ward-Level Budget Tracker</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950/60 text-amber-300 font-mono">
            {civicProjects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveCivicSection('spotlight')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeCivicSection === 'spotlight'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Citizen Spotlight</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950/60 text-amber-300 font-mono">
            {citizenSpotlights.length}
          </span>
        </button>

        <button
          onClick={() => setActiveCivicSection('reps')}
          className={`flex-1 min-w-[210px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeCivicSection === 'reps'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>"Know Your Reps" Directory</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950/60 text-amber-300 font-mono">
            {INITIAL_REPRESENTATIVES.length}
          </span>
        </button>

        <button
          onClick={() => setActiveCivicSection('voter-hub')}
          className={`flex-1 min-w-[210px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeCivicSection === 'voter-hub'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Vote className="w-4 h-4" />
          <span>Voter Hub & Polling Units</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-200 font-mono">
            INEC/IREV
          </span>
        </button>

        <button
          onClick={() => setActiveCivicSection('fact-check')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeCivicSection === 'fact-check'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Fact-Checking Desk</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950/60 text-amber-300 font-mono">
            {factChecks.length}
          </span>
        </button>
      </div>

      {/* Visual Summary Section: Total, Active, and Resolved for ALL sections according to their features */}
      <CivicVisualSummarySection
        section={activeCivicSection}
        civicProjects={civicProjects}
        citizenSpotlights={citizenSpotlights}
        representatives={INITIAL_REPRESENTATIVES}
        pollingUnits={INITIAL_POLLING_UNITS}
        factChecks={factChecks}
        selectedLGA={selectedLGA}
        activeStatusFilter={statusFilter}
        onSelectStatusFilter={st => setStatusFilter(st)}
        onOpenReportModal={() => {
          setCameraReportPreselectedProject(null);
          setIsCameraReportModalOpen(true);
        }}
      />

      {/* ========================================================
          SECTION 1: WARD-LEVEL BUDGET & PROJECT TRACKER
         ======================================================== */}
      {activeCivicSection === 'tracker' && (
        <div className="space-y-6">
          {/* Controls & Filter Bar */}
          <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  Ward Capital Expenditure & Citizen Tracker
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Monitor road gradings, healthcare clinics, water schemes, and solar lights across Idanre’s 10 and Ifedore’s 10 wards.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setCameraReportPreselectedProject(null);
                    setIsCameraReportModalOpen(true);
                  }}
                  className="min-h-[44px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>Camera & Geotag Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(true)}
                  className="min-h-[44px] px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-200 dark:border-stone-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Track Project</span>
                </button>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {/* LGA Filter */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                  Local Government
                </label>
                <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
                  {(['All', 'Idanre', 'Ifedore'] as const).map(lga => (
                    <button
                      key={lga}
                      onClick={() => {
                        setProjectLgaFilter(lga);
                        setSelectedWardFilter('All');
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                        projectLgaFilter === lga
                          ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 shadow-2xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      {lga}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ward Selector */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                  Select Ward ({displayWards.length})
                </label>
                <select
                  value={selectedWardFilter}
                  onChange={e => setSelectedWardFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="All">All 20 Political Wards</option>
                  <optgroup label="Idanre LGA (10 Wards)">
                    {IDANRE_WARDS.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Ifedore LGA (10 Wards)">
                    {IFEDORE_WARDS.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                  Project Status
                </label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="All">All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Started">Not Started</option>
                  <option value="Stalled">Stalled</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                  Search Keywords
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={e => setProjectSearch(e.target.value)}
                    placeholder="e.g. cocoa road, solar, clinic..."
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Quick 10-Ward Breakdown Pills */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
                Quick Ward:
              </span>
              {displayWards.map(ward => (
                <button
                  key={ward.id}
                  onClick={() => setSelectedWardFilter(selectedWardFilter === ward.id ? 'All' : ward.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                    selectedWardFilter === ward.id
                      ? 'bg-emerald-800 border-emerald-800 text-white font-bold'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  {ward.name}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProjects.map(proj => (
              <div
                key={proj.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden flex flex-col justify-between hover:border-emerald-700/40 transition-all"
              >
                <div>
                  {/* Category Architectural Header (No AI Images) */}
                  <div className="relative p-4 sm:p-5 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 border-b border-stone-200 dark:border-stone-800 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                          {getCategoryIcon(proj.category)}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white/10 text-stone-200">
                              {proj.lga} · Ward: {proj.wardName}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-800/80 text-emerald-300">
                              {proj.category}
                            </span>
                          </div>
                          <div className="text-xs font-mono font-bold text-amber-300 mt-1">
                            Budget: {formatNaira(proj.budgetAmount)}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {getStatusBadge(proj.status)}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3.5">
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 leading-snug">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-stone-500 dark:text-stone-400">Execution Progress</span>
                        <span className="font-bold text-emerald-800 dark:text-emerald-400">
                          {proj.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-700 dark:bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${proj.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-stone-100 dark:border-stone-800 text-stone-500 dark:text-stone-400">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Funding Level</span>
                        <strong className="text-stone-800 dark:text-stone-200">{proj.fundingLevel}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Executing Agency</span>
                        <strong className="text-stone-800 dark:text-stone-200 line-clamp-1">{proj.contractorOrAgency}</strong>
                      </div>
                      <div className="col-span-2 flex items-center gap-1 text-stone-600 dark:text-stone-300">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">{proj.locationLandmark}</span>
                      </div>
                    </div>

                    {/* Resident Reports Showcase */}
                    {proj.residentReports.length > 0 && (
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Resident Status Report ({proj.residentReports.length})</span>
                          </span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[10px]">
                            ✓ Community Verified
                          </span>
                        </div>

                        {proj.residentReports.slice(0, 1).map(rep => (
                          <div key={rep.id} className="text-xs space-y-2">
                            <div className="flex items-center justify-between text-[10px] text-stone-400">
                              <span>@{rep.reporterUsername} ({rep.reporterName})</span>
                              <span>{rep.timestamp}</span>
                            </div>

                            {/* Geotag Coordinates Pin */}
                            {rep.coordinates && (
                              <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 dark:text-emerald-300 font-mono bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60 w-fit">
                                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{rep.coordinates.lat.toFixed(4)}°N, {rep.coordinates.lng.toFixed(4)}°E</span>
                                {rep.geotagLabel && <span className="opacity-75 truncate max-w-[200px]">· {rep.geotagLabel}</span>}
                              </div>
                            )}

                            {/* Photo Evidence Thumbnail if Present */}
                            {rep.photoUrl && (
                              <div
                                onClick={() => setLightboxPhoto(rep.photoUrl || null)}
                                className="relative rounded-xl overflow-hidden max-h-36 border border-stone-200 dark:border-stone-700 bg-stone-900 cursor-pointer group"
                              >
                                <img
                                  src={rep.photoUrl}
                                  alt="Geotagged field evidence"
                                  className="w-full h-32 object-cover group-hover:scale-102 transition-transform"
                                />
                                <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-black/75 text-[9px] font-mono text-white backdrop-blur-xs flex items-center gap-1">
                                  <Camera className="w-3 h-3 text-emerald-400" />
                                  <span>Tap to inspect photo</span>
                                </div>
                              </div>
                            )}

                            <p className="text-[11px] text-stone-700 dark:text-stone-300 italic bg-white dark:bg-stone-900 p-2 rounded-lg border border-stone-100 dark:border-stone-800">
                              "{rep.note}"
                            </p>

                            <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-mono font-semibold">
                                  Claim: {rep.statusClaimed}
                                </span>
                                {rep.reportType && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-mono">
                                    {rep.reportType}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => upvoteProjectReport(proj.id, rep.id)}
                                className={`text-[11px] flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg transition-colors ${
                                  rep.isUpvoted
                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 border border-stone-200 dark:border-stone-700'
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>✓ {rep.verificationsCount || rep.upvotes || 1} Community Verified</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Citizen Project Comments Section */}
                    <div className="pt-2.5 border-t border-stone-100 dark:border-stone-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleComments(proj.id)}
                          className="text-xs font-bold text-stone-800 dark:text-stone-200 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Citizen Comments ({(proj.comments || []).length})</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform ${
                              openCommentsProjectIds[proj.id] ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <span className="text-[10px] text-stone-400 font-mono">
                          Public Oversight
                        </span>
                      </div>

                      {/* Expandable comments list and submission form */}
                      {openCommentsProjectIds[proj.id] && (
                        <div className="space-y-2.5 pt-1 animate-in fade-in duration-200">
                          {/* Comments List */}
                          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                            {proj.comments && proj.comments.length > 0 ? (
                              proj.comments.map(c => (
                                <div
                                  key={c.id}
                                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 text-xs space-y-1.5"
                                >
                                  <div className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-1.5 font-semibold text-stone-800 dark:text-stone-200">
                                      <span>{c.authorName}</span>
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-normal">
                                        {c.authorCommunity}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-stone-400">{c.timestamp}</span>
                                  </div>
                                  <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed">
                                    {c.text}
                                  </p>
                                  <div className="flex items-center justify-end pt-0.5">
                                    <button
                                      onClick={() => upvoteProjectComment(proj.id, c.id)}
                                      className={`text-[10px] flex items-center gap-1 font-medium transition-colors ${
                                        c.isUpvoted
                                          ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                                          : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                                      }`}
                                    >
                                      <ThumbsUp className="w-3 h-3" />
                                      <span>{c.upvotes} Helpful</span>
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-3 text-stone-400 text-xs italic bg-stone-50/50 dark:bg-stone-800/30 rounded-xl">
                                No comments on this project yet. Share your observation or question below!
                              </div>
                            )}
                          </div>

                          {/* Add Comment Input */}
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={commentInputValues[proj.id] || ''}
                              onChange={e =>
                                setCommentInputValues(prev => ({ ...prev, [proj.id]: e.target.value }))
                              }
                              onKeyDown={e => {
                                if (e.key === 'Enter') handlePostComment(proj.id);
                              }}
                              placeholder={`Comment or question for Ward ${proj.wardName}...`}
                              className="flex-1 px-3 py-2 bg-stone-50 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1.5 focus:ring-emerald-700"
                            />
                            <button
                              onClick={() => handlePostComment(proj.id)}
                              disabled={!commentInputValues[proj.id]?.trim()}
                              className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Post</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-4 sm:p-5 pt-0">
                  <button
                    onClick={() => setSelectedProjectForReport(proj)}
                    className="w-full min-h-[40px] py-2 px-3 bg-stone-100 hover:bg-emerald-50 dark:bg-stone-800 dark:hover:bg-emerald-950/40 text-stone-800 hover:text-emerald-900 dark:text-stone-200 dark:hover:text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-stone-200 dark:border-stone-700"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Upload Status Photo & Field Note</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-2">
              <Layers className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="font-bold text-stone-800 dark:text-stone-200">No projects match your filter</h3>
              <p className="text-xs text-stone-500">
                Try selecting "All Wards" or clear your search keywords to view other capital projects.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SECTION: CITIZEN SPOTLIGHT (YOUTH COMMUNITY ACTIONS)
         ======================================================== */}
      {activeCivicSection === 'spotlight' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-1 rounded-md mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Youth Collective Action & Community Heroics</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                Citizen Spotlight: Verified Youth Achievements
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xl">
                Celebrating grassroots projects reported and executed by young citizens in Idanre & Ifedore — from fixing farm bridges to restoring school desks and mountain cleanups.
              </p>
            </div>

            <button
              onClick={() => setIsNominateModalOpen(true)}
              className="min-h-[44px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Nominate a Citizen Action</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Verified Actions</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
                {citizenSpotlights.length}
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">Across 20 wards</p>
            </div>

            <div className="bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Community Supports</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-400">
                {citizenSpotlights.reduce((acc, curr) => acc + curr.supportsCount, 0)}
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">Likes & endorsements</p>
            </div>

            <div className="bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Direct Beneficiaries</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
                1,800+
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">Residents impacted</p>
            </div>

            <div className="bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Civic Impact</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
                100%
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">Community-driven</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl overflow-x-auto no-scrollbar">
            {['All', 'Infrastructure & Safety', 'Eco-Sanitation & Tourism', 'Education & Schools', 'Neighborhood Watch', 'Agribusiness & Water'].map(cat => (
              <button
                key={cat}
                onClick={() => setSpotlightCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  spotlightCategory === cat
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Spotlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {citizenSpotlights
              .filter(s => {
                if (spotlightCategory !== 'All' && s.category !== spotlightCategory) return false;
                if (spotlightLga !== 'All' && s.lga !== spotlightLga) return false;
                return true;
              })
              .map(item => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden flex flex-col justify-between hover:border-emerald-700/50 transition-all"
                >
                  <div>
                    {/* Editorial Header (No AI Images) */}
                    {item.photoUrl && !item.photoUrl.includes('assets/images') && item.photoUrl.trim() !== '' ? (
                      <div className="relative h-48 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                        <img
                          src={item.photoUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-xs">
                            {item.lga} · {item.wardName}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-800/90 text-white backdrop-blur-xs">
                            {item.category}
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-3 px-2 py-1 rounded-lg bg-black/80 text-amber-300 font-mono font-bold text-xs backdrop-blur-xs">
                          {item.metricNumber} {item.metricLabel}
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white border-b border-stone-200 dark:border-stone-800">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white/10 text-stone-200">
                              {item.lga} · {item.wardName}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-800/80 text-emerald-300">
                              {item.category}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {item.verifiedBadge}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between pt-1">
                          <span className="font-mono text-2xl font-black text-amber-300 tracking-tight">
                            {item.metricNumber}
                          </span>
                          <span className="text-xs text-stone-300 font-medium font-mono">
                            {item.metricLabel}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                            {item.youthLeaderOrGroup}
                          </span>
                          <span>{item.dateCompleted}</span>
                        </div>
                        <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 leading-snug">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        {item.impactSummary}
                      </p>

                      <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs text-stone-700 dark:text-stone-300 leading-relaxed border border-stone-100 dark:border-stone-800">
                        <div className="font-bold text-[11px] text-stone-900 dark:text-stone-100 mb-0.5">
                          The Action Story:
                        </div>
                        {item.fullStory}
                      </div>
                    </div>
                  </div>

                  {/* Support / Like Mechanism Action Bar */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-stone-100 dark:border-stone-800 mt-2 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        toggleSupportSpotlight(item.id);
                        showToast(
                          item.isSupported
                            ? 'Removed your support'
                            : `Supported "${item.title.slice(0, 25)}..." (+5 Points)`
                        );
                      }}
                      className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${
                        item.isSupported
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-2xs'
                          : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                      title="Like and endorse this youth community action"
                    >
                      <Heart
                        className={`w-4 h-4 transition-all ${
                          item.isSupported ? 'fill-rose-600 text-rose-600 scale-110' : 'text-stone-500'
                        }`}
                      />
                      <span>{item.isSupported ? 'Supported' : 'Support / Like'}</span>
                      <span className="font-mono px-1.5 py-0.5 rounded-full bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-[11px]">
                        {item.supportsCount}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        showToast(`Copied spotlight share link!`);
                      }}
                      className="min-h-[40px] px-3 py-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Share this spotlight"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Action</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 2: "KNOW YOUR REPRESENTATIVES" DIRECTORY
         ======================================================== */}
      {activeCivicSection === 'reps' && (
        <div className="space-y-6">
          {/* Header & Filter Controls */}
          <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  "Know Your Representatives" Directory
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Non-partisan profiles across Local Government (Chairmen & 10 Ward Councillors), State Assembly, House of Reps, and Senate.
                </p>
              </div>

              {/* LGA Filter */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl shrink-0">
                {(['All', 'Idanre', 'Ifedore'] as const).map(lga => (
                  <button
                    key={lga}
                    onClick={() => setRepLgaFilter(lga)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                      repLgaFilter === lga
                        ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 shadow-2xs font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    {lga}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: 'All', label: 'All Levels' },
                { id: 'Local Government', label: 'Local Govt (Chairmen & Councillors)' },
                { id: 'State Assembly', label: 'Ondo State Assembly' },
                { id: 'National Assembly (Reps)', label: 'House of Reps (NASS)' },
                { id: 'National Assembly (Senate)', label: 'Senate (Ondo Central)' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setRepLevelFilter(tab.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                    repLevelFilter === tab.id
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Representatives Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredReps.map(rep => (
              <div
                key={rep.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs p-5 space-y-4 hover:border-emerald-700/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Rep Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300">
                          {rep.level}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold">
                          {rep.politicalParty}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          Tenure: {rep.tenurePeriod}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 pt-1">
                        {rep.name}
                      </h3>

                      <p className="text-xs font-medium text-emerald-800 dark:text-emerald-400">
                        {rep.titleRole}
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-lg shrink-0 border border-emerald-100 dark:border-stone-700">
                      <Landmark className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Official Constituency Contact Information */}
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/70 space-y-2 text-xs">
                    <div className="font-bold text-[11px] text-stone-700 dark:text-stone-300 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Official Constituency Office & Direct Channels</span>
                    </div>

                    <div className="text-[11px] text-stone-600 dark:text-stone-300 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>{rep.constituencyOffice}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-stone-200/50 dark:border-stone-700">
                      <a
                        href={`tel:${rep.officialPhone}`}
                        className="flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold hover:underline"
                      >
                        <Phone className="w-3 h-3 shrink-0" />
                        <span>{rep.officialPhone}</span>
                      </a>
                      <a
                        href={`mailto:${rep.officialEmail}`}
                        className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-400 hover:text-emerald-800 truncate"
                      >
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate">{rep.officialEmail}</span>
                      </a>
                    </div>
                  </div>

                  {/* Bills & Motions Sponsored */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-stone-100">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Bills & Motions Sponsored ({rep.billsOrMotionsSponsored.length})</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      {rep.billsOrMotionsSponsored.map((b, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl border border-stone-200/70 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <strong className="text-stone-900 dark:text-stone-100 font-semibold line-clamp-1">
                              {b.title}
                            </strong>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                                b.status === 'Passed'
                                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {b.status} ({b.year})
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                            {b.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campaign Promises Tracker */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                      <span>Campaign Promises Tracker</span>
                      <span className="text-[10px] font-normal text-stone-400">Oversight audit</span>
                    </div>

                    <div className="space-y-1.5">
                      {rep.campaignPromises.map(cp => (
                        <div
                          key={cp.id}
                          className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800/40 text-[11px] space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-stone-800 dark:text-stone-200 font-medium">
                              {cp.promiseText}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                                cp.status === 'Fulfilled'
                                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                                  : cp.status === 'In Progress'
                                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                                  : 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300'
                              }`}
                            >
                              {cp.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 italic">
                            Status note: {cp.notes}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Constituency Projects Allocated Pill */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Facilitated Constituency Interventions:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {rep.allocatedConstituencyProjects.map((p, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ward Councillors Summary Table (All 20 Wards) */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Complete 20-Ward Legislative Councillors Directory
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Every ward in Idanre and Ifedore has a directly elected local government councillor representing residents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Idanre Councillors Table */}
              <div className="space-y-2">
                <div className="text-xs font-bold font-mono text-emerald-900 dark:text-emerald-300 uppercase tracking-wider p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                  Idanre LGA (10 Wards Councillors)
                </div>
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {IDANRE_WARDS.map(w => (
                    <div key={w.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-stone-800 dark:text-stone-200">
                          {w.name} ({w.code})
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {w.councillorName} · {w.councillorParty}
                        </div>
                      </div>
                      <a
                        href={`tel:${w.councillorPhone}`}
                        className="text-[11px] font-mono text-emerald-800 dark:text-emerald-400 hover:underline"
                      >
                        {w.councillorPhone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ifedore Councillors Table */}
              <div className="space-y-2">
                <div className="text-xs font-bold font-mono text-emerald-900 dark:text-emerald-300 uppercase tracking-wider p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                  Ifedore LGA (10 Wards Councillors)
                </div>
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {IFEDORE_WARDS.map(w => (
                    <div key={w.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-stone-800 dark:text-stone-200">
                          {w.name} ({w.code})
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {w.councillorName} · {w.councillorParty}
                        </div>
                      </div>
                      <a
                        href={`tel:${w.councillorPhone}`}
                        className="text-[11px] font-mono text-emerald-800 dark:text-emerald-400 hover:underline"
                      >
                        {w.councillorPhone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 3: VOTER EDUCATION & POLLING UNITS HUB
         ======================================================== */}
      {activeCivicSection === 'voter-hub' && (
        <div className="space-y-6">
          {/* Polling Units Locator Card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-md mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>INEC Polling Unit Locator · Idanre & Ifedore</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  Locate Your Exact Voting Polling Unit
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Search by ward, school, or official PU code to find your designated registration and election station.
                </p>
              </div>

              {/* Official Portals Direct Launchers */}
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="https://cvr.inecnigeria.gov.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <span>INEC CVR Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://irev.inecnigeria.gov.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-stone-900 hover:bg-black text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-amber-400/40 shadow-2xs"
                >
                  <span>INEC IReV Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={puSearch}
                  onChange={e => setPuSearch(e.target.value)}
                  placeholder="Search polling unit, school or PU Code..."
                  className="w-full pl-8 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <select
                  value={puLgaFilter}
                  onChange={e => {
                    setPuLgaFilter(e.target.value as any);
                    setPuWardFilter('All');
                  }}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="All">All LGAs</option>
                  <option value="Idanre">Idanre LGA (10 Wards)</option>
                  <option value="Ifedore">Ifedore LGA (10 Wards)</option>
                </select>
              </div>

              <div>
                <select
                  value={puWardFilter}
                  onChange={e => setPuWardFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="All">All Political Wards</option>
                  {allWards.map(w => (
                    <option key={w.id} value={w.name}>
                      {w.lga}: {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Polling Units Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-500 font-bold">
                    <th className="py-2.5 px-3">PU Code</th>
                    <th className="py-2.5 px-3">Polling Station Location</th>
                    <th className="py-2.5 px-3">Ward & LGA</th>
                    <th className="py-2.5 px-3">Landmark & Access</th>
                    <th className="py-2.5 px-3 text-right">Registered Voters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredPUs.map(pu => (
                    <tr key={pu.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-800 dark:text-emerald-400 whitespace-nowrap">
                        {pu.puCode}
                      </td>
                      <td className="py-3 px-3 font-semibold text-stone-900 dark:text-stone-100">
                        {pu.locationName}
                      </td>
                      <td className="py-3 px-3 text-stone-600 dark:text-stone-400">
                        <span className="font-medium text-stone-800 dark:text-stone-200">{pu.wardName}</span>
                        <span className="block text-[10px] text-stone-400">{pu.lga} LGA</span>
                      </td>
                      <td className="py-3 px-3 text-stone-500 dark:text-stone-400">
                        <div>{pu.landmark}</div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                          {pu.accessibility}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-stone-800 dark:text-stone-200">
                        ~{pu.registeredVotersCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4-Step Voter Guide Timeline */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Step-by-Step Voter Registration & Election Guide
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                How young citizens in Idanre & Ifedore navigate CVR registration, biometric capture, PVC collection, and election day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {VOTER_GUIDE_STEPS.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-bold font-mono text-sm flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {step.title}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-1 text-[11px] text-stone-500 dark:text-stone-400 pt-1">
                      {step.checklist.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 4: FACT-CHECKING DASHBOARD (MISINFORMATION BUSTER)
         ======================================================== */}
      {activeCivicSection === 'fact-check' && (
        <div className="space-y-6">
          {/* Header & Submit Button */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-1 rounded-md mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Electoral & Public Policy Verification Desk</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                Fact-Checking & Misinformation Debunker
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Combating viral rumors, fake election circulars, and distorted budget claims across Ondo State.
              </p>
            </div>

            <button
              onClick={() => setIsFactCheckModalOpen(true)}
              className="min-h-[44px] px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Rumor to Fact-Checkers</span>
            </button>
          </div>

          {/* Fact Check Cards */}
          <div className="space-y-4">
            {factChecks.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        item.verdict === 'False Claim'
                          ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300'
                          : item.verdict === 'Verified True'
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {item.verdict}
                    </span>
                    <span className="text-[11px] font-mono text-stone-400">
                      Category: {item.category} · Verified: {item.publishedDate}
                    </span>
                  </div>

                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Desk: <strong>{item.verifiedBy}</strong>
                  </span>
                </div>

                {/* Claim Statement */}
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Claim Circulating Online:
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                    "{item.claim}"
                  </p>
                  <div className="text-[10px] text-stone-400 mt-1">Source of claim: {item.claimant}</div>
                </div>

                {/* Explanation of Facts */}
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>The Verified Facts:</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-xs sm:text-sm">
                    {item.explanation}
                  </p>
                </div>

                {/* Sources */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 flex-wrap text-[11px] text-stone-400">
                  <span className="font-bold">Verified Sources:</span>
                  {item.sources.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          MODALS
         ======================================================== */}

      {/* Modal: Resident Status Report & Photo Upload */}
      {selectedProjectForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setSelectedProjectForReport(null)}
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setSelectedProjectForReport(null)}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Submit Field Report & Status Photo
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Project: <strong>{selectedProjectForReport.title}</strong> ({selectedProjectForReport.wardName} Ward)
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Observed Status on the Ground
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['In Progress', 'Completed', 'Stalled', 'Not Started'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setReportStatus(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        reportStatus === st
                          ? 'border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Field Observations & Details
                </label>
                <textarea
                  required
                  rows={3}
                  value={reportNote}
                  onChange={e => setReportNote(e.target.value)}
                  placeholder="Describe what you observed: e.g. workers are laying drainage blocks, caterpillar is parked, culvert is drying..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Site Photo URL (optional)
                </label>
                <input
                  type="url"
                  value={reportPhotoUrl}
                  onChange={e => setReportPhotoUrl(e.target.value)}
                  placeholder="https://... or photo link from your device"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProjectForReport(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Publish Field Report (+25 Points)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Capital Project for Tracking */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsAddProjectModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setIsAddProjectModalOpen(false)}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Log a Ward Capital Project for Community Oversight
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Enter public works project details announced by local, state, or federal authorities.
            </p>

            <form onSubmit={handleAddProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={newProjTitle}
                  onChange={e => setNewProjTitle(e.target.value)}
                  placeholder="e.g. Grading of Ijomu-Agbaluku Cocoa Farm Road"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    LGA
                  </label>
                  <select
                    value={newProjLga}
                    onChange={e => {
                      const l = e.target.value as 'Idanre' | 'Ifedore';
                      setNewProjLga(l);
                      setNewProjWardId(l === 'Idanre' ? IDANRE_WARDS[0].id : IFEDORE_WARDS[0].id);
                    }}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                  >
                    <option value="Idanre">Idanre LGA</option>
                    <option value="Ifedore">Ifedore LGA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Political Ward
                  </label>
                  <select
                    required
                    value={newProjWardId}
                    onChange={e => setNewProjWardId(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                  >
                    <option value="">Select Ward</option>
                    {(newProjLga === 'Idanre' ? IDANRE_WARDS : IFEDORE_WARDS).map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Sector Category
                  </label>
                  <select
                    value={newProjCategory}
                    onChange={e => setNewProjCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                  >
                    <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Water & Boreholes">Water & Boreholes</option>
                    <option value="Solar & Power">Solar & Power</option>
                    <option value="Education & Schools">Education & Schools</option>
                    <option value="Agribusiness & Markets">Agribusiness & Markets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Funding Level
                  </label>
                  <select
                    value={newProjFunding}
                    onChange={e => setNewProjFunding(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                  >
                    <option value="State Government (Ondo State)">State Government</option>
                    <option value="Local Government (LGA)">Local Government</option>
                    <option value="Federal Constituency Project">Federal Constituency</option>
                    <option value="Community Co-sponsored">Community Co-sponsored</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Budget Amount (₦)
                  </label>
                  <input
                    type="text"
                    value={newProjBudget}
                    onChange={e => setNewProjBudget(e.target.value)}
                    placeholder="e.g. 45000000"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Contractor / Agency
                  </label>
                  <input
                    type="text"
                    value={newProjAgency}
                    onChange={e => setNewProjAgency(e.target.value)}
                    placeholder="e.g. Ministry of Works"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Location Landmark
                </label>
                <input
                  type="text"
                  value={newProjLandmark}
                  onChange={e => setNewProjLandmark(e.target.value)}
                  placeholder="e.g. Opposite Community High School gate"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Save Project (+40 Points)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Fact-Check Submission */}
      {isFactCheckModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsFactCheckModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setIsFactCheckModalOpen(false)}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Submit a Claim for Fact-Checking
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Help our civic monitors verify circulating WhatsApp messages, election rumors, or budget claims.
            </p>

            <form onSubmit={handleFactCheckSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  What is the claim or rumor?
                </label>
                <textarea
                  required
                  rows={3}
                  value={factClaim}
                  onChange={e => setFactClaim(e.target.value)}
                  placeholder="Paste or type the viral message or claim..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Where did you see or hear this? (Claimant)
                </label>
                <input
                  type="text"
                  value={factClaimant}
                  onChange={e => setFactClaimant(e.target.value)}
                  placeholder="e.g. WhatsApp Group, Facebook Page, Local meeting"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Topic Category
                </label>
                <select
                  value={factCategory}
                  onChange={e => setFactCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                >
                  <option value="Elections & INEC">Elections & INEC</option>
                  <option value="Budget & Projects">Budget & Public Projects</option>
                  <option value="Governance">Governance</option>
                  <option value="Public Policy">Public Policy</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFactCheckModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Submit for Fact-Checking (+15 Points)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nominate a Citizen Action */}
      {isNominateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsNominateModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setIsNominateModalOpen(false)}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Nominate a Citizen Action or Youth Achievement
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Share grassroots community work done by youth in Idanre or Ifedore to inspire fellow citizens.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!nomTitle.trim() || !nomImpact.trim()) return;
                nominateSpotlight({
                  title: nomTitle.trim(),
                  youthLeaderOrGroup: nomGroup.trim() || `${user.name} & Volunteers`,
                  lga: nomLga,
                  wardName: nomWard,
                  dateCompleted: 'Recently',
                  category: nomCategory,
                  impactSummary: nomImpact.trim(),
                  fullStory: nomStory.trim() || nomImpact.trim(),
                  metricNumber: nomMetricNum.trim() || '100+',
                  metricLabel: nomMetricLabel.trim() || 'Citizens Impacted',
                  photoUrl: nomPhoto.trim() || '',
                });
                showToast('Citizen action nominated! Earned +35 Civic Points');
                setNomTitle('');
                setNomGroup('');
                setNomImpact('');
                setNomStory('');
                setNomMetricNum('');
                setNomMetricLabel('');
                setNomPhoto('');
                setIsNominateModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Action Title
                </label>
                <input
                  type="text"
                  required
                  value={nomTitle}
                  onChange={(e) => setNomTitle(e.target.value)}
                  placeholder="e.g. Youth Repairs of Atosin Community Well"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Youth Group or Leader
                  </label>
                  <input
                    type="text"
                    required
                    value={nomGroup}
                    onChange={(e) => setNomGroup(e.target.value)}
                    placeholder="e.g. Atosin Youth Vanguard"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    LGA
                  </label>
                  <select
                    value={nomLga}
                    onChange={(e) => {
                      const l = e.target.value as 'Idanre' | 'Ifedore';
                      setNomLga(l);
                      setNomWard(l === 'Idanre' ? 'Idale-Logbosere' : 'Igbara-Oke I');
                    }}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                  >
                    <option value="Idanre">Idanre LGA</option>
                    <option value="Ifedore">Ifedore LGA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Ward
                  </label>
                  <select
                    value={nomWard}
                    onChange={(e) => setNomWard(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                  >
                    {(nomLga === 'Idanre' ? IDANRE_WARDS : IFEDORE_WARDS).map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Category
                  </label>
                  <select
                    value={nomCategory}
                    onChange={(e) => setNomCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                  >
                    <option value="Infrastructure & Safety">Infrastructure & Safety</option>
                    <option value="Eco-Sanitation & Tourism">Eco-Sanitation & Tourism</option>
                    <option value="Education & Schools">Education & Schools</option>
                    <option value="Neighborhood Watch">Neighborhood Watch</option>
                    <option value="Agribusiness & Water">Agribusiness & Water</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Brief Summary of Impact
                </label>
                <textarea
                  required
                  rows={2}
                  value={nomImpact}
                  onChange={(e) => setNomImpact(e.target.value)}
                  placeholder="Explain what was accomplished and who benefited..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Key Metric Number
                  </label>
                  <input
                    type="text"
                    value={nomMetricNum}
                    onChange={(e) => setNomMetricNum(e.target.value)}
                    placeholder="e.g. 50+ or 3 Tons"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Metric Label
                  </label>
                  <input
                    type="text"
                    value={nomMetricLabel}
                    onChange={(e) => setNomMetricLabel(e.target.value)}
                    placeholder="e.g. Desks Repaired"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Photo URL (optional)
                </label>
                <input
                  type="url"
                  value={nomPhoto}
                  onChange={(e) => setNomPhoto(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNominateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Publish Nomination (+35 Points)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
