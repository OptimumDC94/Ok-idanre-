import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveClimbTracker } from './InteractiveClimbTracker';
import { InteractiveProverbCard } from './InteractiveProverbCard';
import { AfrobeatSoundwavePlayer } from './AfrobeatSoundwavePlayer';
import { WeatherWidget } from './WeatherWidget';
import {
  MessageSquare,
  Vote,
  Landmark,
  GraduationCap,
  Wrench,
  Users,
  Compass,
  Flame,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Gift,
  ShieldAlert,
  Search,
  UserPlus,
  LogIn,
  Sun,
  ShieldCheck,
  Menu,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Radio,
  CloudSun,
} from 'lucide-react';

export const HomeTab: React.FC = () => {
  const {
    user,
    isAuthenticated,
    setActiveTab,
    openAuthModal,
    hasCheckedInToday,
    dailyCheckIn,
    setIsCheckInModalOpen,
    themeConfig,
    playSound,
    toggleSiteMenu,
  } = useApp();

  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: 'left' | 'right') => {
    playSound('click');
    if (sliderRef.current) {
      const scrollAmount = 380;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const highlightedMenus = [
    {
      id: 'civic-tech',
      kicker: 'GOVERNANCE · 10 WARDS',
      title: 'Civic Tech & Ward Tracker',
      desc: 'Real-time monitoring of roads, solar mini-grids, and health facilities across 10 wards.',
      icon: Vote,
      badge: 'Active Tracker',
      gradient: 'from-emerald-950 via-stone-900 to-emerald-900',
    },
    {
      id: 'discussions',
      kicker: 'CIVIC DIALOGUE',
      title: 'Youth Discussions & Polls',
      desc: 'Active town debates on cocoa cooperatives, digital bootcamps, and municipal resolutions.',
      icon: MessageSquare,
      badge: 'Live Debates',
      gradient: 'from-amber-950 via-stone-900 to-emerald-950',
    },
    {
      id: 'culture-heritage',
      kicker: 'HISTORIC HERITAGE',
      title: 'Ancient Oke Idanre & Heritage',
      desc: 'Preserving the 800-year mountain fortress, UNESCO candidate landmarks, and oral history.',
      icon: Landmark,
      badge: 'UNESCO Sites',
      gradient: 'from-stone-950 via-stone-900 to-emerald-950',
    },
    {
      id: 'secondary-school',
      kicker: 'EDUCATION & STUDY',
      title: 'Secondary School Connect',
      desc: 'WAEC & JAMB study circles, peer assignment hubs, and step-by-step mentoring.',
      icon: GraduationCap,
      badge: '12 Schools',
      gradient: 'from-indigo-950 via-stone-900 to-emerald-950',
    },
    {
      id: 'skills',
      kicker: 'COMMERCE & TALENT',
      title: 'Skills Directory & Marketplace',
      desc: 'Directory of vetted youth technicians alongside farm-fresh cocoa and crafts.',
      icon: Wrench,
      badge: 'Vetted Venders',
      gradient: 'from-teal-950 via-stone-900 to-emerald-950',
    },
    {
      id: 'subtowns',
      kicker: 'LOCAL CHAPTERS',
      title: 'Subtown Chapters & Expeditions',
      desc: 'Hyper-local chapters for Odode, Alade, Atosin, Igbara-Oke, and Ilara-Mokin.',
      icon: Users,
      badge: '5 Towns',
      gradient: 'from-emerald-950 via-stone-900 to-stone-950',
    },
    {
      id: 'meetups',
      kicker: 'HANGOUTS & TREKS',
      title: 'Community Meetups & Hikes',
      desc: 'Weekend sunrise mountain treks, town hall discussions, and agropreneur meetups.',
      icon: Calendar,
      badge: 'Weekend Hike',
      gradient: 'from-stone-900 via-emerald-950 to-stone-900',
    },
    {
      id: 'giveaways',
      kicker: 'GRANTS & REWARDS',
      title: 'Grants & Youth Giveaways',
      desc: 'Data bundles, seedling grants, solar lanterns, and agropreneur support packages.',
      icon: Gift,
      badge: 'Active Drops',
      gradient: 'from-amber-900 via-stone-900 to-amber-950',
    },
    {
      id: 'emergency',
      kicker: '24/7 SAFETY',
      title: 'Emergency Helpline & Security',
      desc: 'Direct hotlines for medical emergencies, forest security, and rapid response.',
      icon: ShieldAlert,
      badge: '24/7 Active',
      gradient: 'from-rose-950 via-stone-900 to-stone-950',
    },
    {
      id: 'ai-advisor',
      kicker: 'INTELLIGENT Q&A',
      title: 'AI Youth Guide & Advisor',
      desc: 'Instant guidance on Ondo State youth policies, agricultural grants, and local ordinances.',
      icon: Sparkles,
      badge: 'Gemini Powered',
      gradient: 'from-purple-950 via-stone-900 to-emerald-950',
    },
    {
      id: 'studio',
      kicker: 'CAMPAIGN ART',
      title: 'Poster & Campaign Studio',
      desc: 'Design grassroots campaign posters and community event flyers with professional templates.',
      icon: Compass,
      badge: 'Creative Tool',
      gradient: 'from-blue-950 via-stone-900 to-emerald-950',
    },
  ];

  const quickStats = [
    { label: 'Youth Enrolled', value: '3,840+' },
    { label: 'Political Wards', value: '10 Wards' },
    { label: 'Ancient Stone Steps', value: '682 Steps' },
    { label: 'Secondary Schools', value: '12 Schools' },
  ];

  const curatedDispatches = [
    {
      channel: 'Agribusiness & Cooperatives',
      location: 'Alade & Atosin Corridor',
      title: 'Youth Cocoa Cooperative Expands Solar Drying in Alade',
      snippet: 'Over 60 young agropreneurs collaborating on high-grade dried cocoa beans for premium export pricing.',
      tab: 'discussions',
      readTime: '3 min read',
    },
    {
      channel: 'Civic Infrastructure',
      location: 'General Hospital Idanre',
      title: 'General Hospital 20kVA Hybrid Solar Mini-Grid Active',
      snippet: 'Maternity ward and night delivery theaters now powered 24/7 without diesel generator interruptions.',
      tab: 'civic-tech',
      readTime: '2 min read',
    },
    {
      channel: 'Heritage & Youth Sports',
      location: 'Oke Idanre Base Gate',
      title: '682-Step Sunrise Mountain Hike & Eco-Cleanup Scheduled',
      snippet: 'Ascending from Odode base to ancient Ufe Oke kingdom with trail guides and youth conservation team.',
      tab: 'meetups',
      readTime: 'Weekend trek',
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-12">
      {/* ========================================================
          1. EDITORIAL HERO & WELCOME BANNER
         ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-emerald-950/80 to-stone-950 text-white shadow-xl border border-stone-800">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-stone-950 via-stone-950/90 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-wider uppercase text-emerald-400">
            <span>DIGITAL TOWN SQUARE</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>IDANRE & IFEDORE LGAS</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-300">ONDO STATE, NIGERIA</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Connecting Youth, Civic Stewardship & Community Prosperity
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-stone-300 max-w-2xl leading-relaxed">
              Uniting young citizens across Odode, Alade, Atosin, Igbara-Oke, and Ilara-Mokin for budget accountability across 10 wards, cocoa agro-cooperatives, cultural preservation, and school excellence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    playSound('click');
                    openAuthModal('signup');
                  }}
                  className="px-5 py-3 rounded-xl font-bold text-sm text-white shadow-md flex items-center gap-2 hover:opacity-95 active:scale-98 transition-all"
                  style={{ backgroundColor: themeConfig.primaryColor }}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Join Ok Idanre (+100 pts)</span>
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    openAuthModal('login');
                  }}
                  className="px-4 py-3 rounded-xl font-bold text-sm bg-stone-900/90 hover:bg-stone-850 text-stone-200 border border-stone-700/80 flex items-center gap-2 transition-all active:scale-98"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    playSound('click');
                    if (!hasCheckedInToday) {
                      dailyCheckIn();
                    }
                    setIsCheckInModalOpen(true);
                  }}
                  className="px-5 py-3 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-md flex items-center gap-2 transition-all active:scale-98"
                >
                  <Flame className="w-4 h-4 fill-stone-950" />
                  <span>
                    {hasCheckedInToday
                      ? `Streak Active: ${user.checkInStreak || 1} Days`
                      : 'Claim Daily Check-In (+20 pts)'}
                  </span>
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    setActiveTab('civic-tech');
                  }}
                  className="px-4 py-3 rounded-xl font-bold text-sm bg-stone-900/90 hover:bg-stone-850 text-stone-200 border border-stone-700/80 flex items-center gap-2 transition-all active:scale-98"
                >
                  <Vote className="w-4 h-4 text-emerald-400" />
                  <span>Track Wards</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                toggleSiteMenu();
              }}
              className="px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-stone-850/70 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-750 transition-colors flex items-center gap-2"
              title="Open full site directory"
            >
              <Menu className="w-4 h-4 text-emerald-400" />
              <span>Browse All Tools</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-800/80">
            {quickStats.map(stat => (
              <div key={stat.label} className="space-y-0.5">
                <span className="block text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
                  {stat.value}
                </span>
                <span className="block text-xs text-stone-400 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          2. HIGHLIGHTED MENUS IN GRID FORM (Striking, Clean, Non-Tacky Grid)
         ======================================================== */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              COMMUNITY DIRECTORY
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
              Highlighted Menus & Core Pillars
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
            Select any feature to launch instantly
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlightedMenus.map(menu => {
            const Icon = menu.icon;
            return (
              <div
                key={menu.id}
                onClick={() => {
                  playSound('click');
                  setActiveTab(menu.id);
                }}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer hover:border-emerald-600/60 dark:hover:border-emerald-500/60 transform hover:-translate-y-0.5"
              >
                {/* Header Graphic */}
                <div className={`relative h-28 overflow-hidden bg-gradient-to-br ${menu.gradient} p-4 flex flex-col justify-between border-b border-stone-100 dark:border-stone-800`}>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-300">
                      {menu.kicker}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono backdrop-blur-xs">
                      {menu.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 relative z-10">
                    <div
                      className="w-8 h-8 rounded-xl text-white flex items-center justify-center shadow-xs shrink-0"
                      style={{ backgroundColor: themeConfig.primaryColor }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-white text-sm font-bold truncate">
                      {menu.title}
                    </span>
                  </div>

                  <div className="text-white/10 absolute -right-3 -bottom-3 pointer-events-none">
                    <Icon className="w-20 h-20" />
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {menu.desc}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    <span>Open {menu.title.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          3. SLIDING SECTION: WEATHER, LIVE UPDATES, FEATURES & MENU PREVIEWS
         ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
              <span>LIVE SLIDING TICKER & PREVIEWS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
              Weather, Live Updates & Interactive Previews
            </h2>
          </div>

          {/* Slider Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollSlider('left')}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 transition-colors"
              title="Slide Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSlider('right')}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 transition-colors"
              title="Slide Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Sliding Container */}
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-3 pt-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Slide 1: Weather Microclimate Widget */}
          <div className="min-w-[320px] sm:min-w-[380px] max-w-[420px] shrink-0 snap-start">
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs space-y-4 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <CloudSun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                      Live Weather & Microclimate
                    </span>
                    <span className="block text-[10px] text-stone-500 font-mono">
                      Open-Meteo · Idanre & Ifedore
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
                  ● Live
                </span>
              </div>

              <div className="py-2">
                <WeatherWidget variant="compact" initialTown="idanre" />
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-500">Cocoa & Farming Outlook</span>
                <button
                  onClick={() => {
                    playSound('click');
                    setActiveTab('civic-tech');
                  }}
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Ward Weather</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Slide 2: Live Community Dispatches & Updates */}
          <div className="min-w-[320px] sm:min-w-[380px] max-w-[420px] shrink-0 snap-start">
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs space-y-4 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                      Live Community Dispatches
                    </span>
                    <span className="block text-[10px] text-stone-500 font-mono">
                      Verified Field Updates
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold">
                  Active
                </span>
              </div>

              <div className="space-y-3">
                {curatedDispatches.slice(0, 2).map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      playSound('click');
                      setActiveTab(item.tab);
                    }}
                    className="p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200/80 dark:border-stone-750 hover:border-emerald-600 transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] text-stone-500">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {item.channel}
                      </span>
                      <span>{item.readTime}</span>
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2">
                      {item.snippet}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-500">All local updates</span>
                <button
                  onClick={() => {
                    playSound('click');
                    setActiveTab('discussions');
                  }}
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore Feed</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Slide 3: Interactive Yoruba Proverb */}
          <div className="min-w-[320px] sm:min-w-[380px] max-w-[420px] shrink-0 snap-start">
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs space-y-4 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                      Daily Cultural Proverb
                    </span>
                    <span className="block text-[10px] text-stone-500 font-mono">
                      Yoruba Heritage & Wisdom
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-mono font-bold">
                  Culture
                </span>
              </div>

              <div className="py-2">
                <InteractiveProverbCard />
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-500">Heritage preservation</span>
                <button
                  onClick={() => {
                    playSound('click');
                    setActiveTab('culture-heritage');
                  }}
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Archive</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Slide 4: Oke Idanre Climb Tracker */}
          <div className="min-w-[320px] sm:min-w-[380px] max-w-[420px] shrink-0 snap-start">
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs space-y-4 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                      682 Steps Mountain Climb
                    </span>
                    <span className="block text-[10px] text-stone-500 font-mono">
                      Interactive Waypoint Tracker
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
                  Landmark
                </span>
              </div>

              <div className="py-2">
                <InteractiveClimbTracker />
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-500">UNESCO Hill Ascent</span>
                <button
                  onClick={() => {
                    playSound('click');
                    setActiveTab('culture-heritage');
                  }}
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Full Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Slide 5: Afrobeat Soundwave Player */}
          <div className="min-w-[320px] sm:min-w-[380px] max-w-[420px] shrink-0 snap-start">
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs space-y-4 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                      Afrobeat Soundwave Lounge
                    </span>
                    <span className="block text-[10px] text-stone-500 font-mono">
                      Ondo Rhythm & Beats
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold">
                  Audio
                </span>
              </div>

              <div className="py-2">
                <AfrobeatSoundwavePlayer />
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-500">Cultural Melodies</span>
                <button
                  onClick={() => {
                    playSound('click');
                    setActiveTab('culture-heritage');
                  }}
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore Culture</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. GUEST INVITATION BANNER
         ======================================================== */}
      {!isAuthenticated && (
        <section className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-stone-900 text-white border border-stone-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              JOIN 3,840+ YOUTH CITIZENS
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Ready to Shape the Future of Idanre & Ifedore?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Create your youth profile to earn 100 welcome points, propose community meetups, participate in agribusiness grants, and track public projects.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                playSound('click');
                openAuthModal('signup');
              }}
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center gap-2"
              style={{ backgroundColor: themeConfig.primaryColor }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Free Account</span>
            </button>
            <button
              onClick={() => {
                playSound('click');
                openAuthModal('login');
              }}
              className="px-4 py-3 rounded-xl font-bold text-xs sm:text-sm bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 transition-all active:scale-98"
            >
              <span>Sign In</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
