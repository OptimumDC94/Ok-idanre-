import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Search,
  MessageSquare,
  Vote,
  Landmark,
  GraduationCap,
  Wrench,
  ShoppingBag,
  Building2,
  Calendar,
  HeartHandshake,
  Users,
  Compass,
  Sparkles,
  ShieldAlert,
  Gamepad2,
  Gift,
  Palette,
  Newspaper,
  User,
  Zap,
  MapPin,
  Flame,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  LogIn,
  UserPlus,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const SiteMenuDrawer: React.FC = () => {
  const {
    isSiteMenuOpen,
    setIsSiteMenuOpen,
    activeTab,
    setActiveTab,
    selectedLGA,
    setSelectedLGA,
    user,
    isAuthenticated,
    openAuthModal,
    logout,
    setIsProfileModalOpen,
    setIsSearchModalOpen,
    isDarkMode,
    toggleDarkMode,
    themeConfig,
    setIsThemeModalOpen,
    soundEnabled,
    toggleSound,
    playSound,
    hasCheckedInToday,
    dailyCheckIn,
    setIsCheckInModalOpen,
  } = useApp();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSiteMenuOpen(false);
      }
    };
    if (isSiteMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isSiteMenuOpen, setIsSiteMenuOpen]);

  if (!isSiteMenuOpen) return null;

  const navigateTo = (tabId: string) => {
    playSound('click');
    setActiveTab(tabId);
    setIsSiteMenuOpen(false);
  };

  const menuSections = [
    {
      title: 'Civic Governance & Public Affairs',
      items: [
        {
          id: 'civic-tech',
          label: 'Civic Tech & Ward Tracker',
          desc: 'Monitor budgets, 10 political wards & polling units',
          icon: Vote,
        },
        {
          id: 'updates',
          label: 'Official Council Updates',
          desc: 'Gazettes & notices from Idanre and Ifedore councils',
          icon: Newspaper,
        },
        {
          id: 'emergency',
          label: 'Emergency Directory',
          desc: '24/7 verified contacts for police, hospital & security',
          icon: ShieldAlert,
        },
      ],
    },
    {
      title: 'Community Dialogues & Social Action',
      items: [
        {
          id: 'discussions',
          label: 'Discussions & Civic Polls',
          desc: 'Town debates on cocoa cooperatives & youth initiatives',
          icon: MessageSquare,
        },
        {
          id: 'pulse',
          label: 'Youth Pulse Hub',
          desc: 'Live youth activities, Afrobeat soundwave & daily trivia',
          icon: Zap,
        },
        {
          id: 'chat',
          label: 'Community Chat Rooms',
          desc: 'Channels for Odode, Alade, Atosin, Igbara-Oke & Ilara',
          icon: Users,
        },
        {
          id: 'meetups',
          label: 'Hangout Meetups & Hikes',
          desc: 'Sunrise mountain treks, code jams & tree planting',
          icon: Compass,
        },
        {
          id: 'peers',
          label: 'Peer Matching',
          desc: 'Find agribusiness co-founders & study partners',
          icon: User,
        },
      ],
    },
    {
      title: 'Culture, Heritage & Environment',
      items: [
        {
          id: 'culture-heritage',
          label: 'Ancient Oke Idanre & Heritage',
          desc: '682 stone steps, 1923 descent archive & festivals',
          icon: Landmark,
        },
        {
          id: 'subtowns',
          label: 'Subtown Community Chapters',
          desc: 'Local groups across Odode, Alade, Igbara-Oke & more',
          icon: Building2,
        },
        {
          id: 'volunteering',
          label: 'Volunteer Service',
          desc: 'Agroforestry, trail maintenance & school mentoring',
          icon: HeartHandshake,
        },
        {
          id: 'events',
          label: 'Community Events Calendar',
          desc: 'Festivals, sports tournaments & youth assemblies',
          icon: Calendar,
        },
      ],
    },
    {
      title: 'Education, Skills & Local Commerce',
      items: [
        {
          id: 'secondary-school',
          label: 'Secondary School Connect',
          desc: 'WAEC & JAMB study desks for 12 local schools',
          icon: GraduationCap,
        },
        {
          id: 'skills',
          label: 'Verified Skills Directory',
          desc: 'Hire verified youth electricians, coders & artisans',
          icon: Wrench,
        },
        {
          id: 'marketplace',
          label: 'Community Marketplace',
          desc: 'Direct buy & sell for cocoa, farm produce & crafts',
          icon: ShoppingBag,
        },
        {
          id: 'giveaways',
          label: 'Grants & Youth Giveaways',
          desc: 'Monthly mobile data grants & agribusiness starter aid',
          icon: Gift,
        },
      ],
    },
    {
      title: 'Creative Studio & Interactive Tools',
      items: [
        {
          id: 'ai-advisor',
          label: 'AI Community Guide',
          desc: 'Instant answers on youth programs, grants & civic rights',
          icon: Sparkles,
        },
        {
          id: 'studio',
          label: 'Civic Poster Studio',
          desc: 'Design shareable flyers for events & community causes',
          icon: Palette,
        },
        {
          id: 'games',
          label: 'Games & Yoruba Trivia',
          desc: 'Oke Idanre climbing challenge & Yoruba proverb quizzes',
          icon: Gamepad2,
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => {
          playSound('click');
          setIsSiteMenuOpen(false);
        }}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-16">
        <div className="w-screen max-w-md bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-stone-200/90 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/90">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-xs"
                  style={{ backgroundColor: themeConfig.primaryColor }}
                >
                  OK
                </div>
                <div>
                  <h2 className="font-bold text-base text-stone-900 dark:text-stone-100 tracking-tight">
                    Ok Idanre Menu
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Platform Directory & Navigation
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playSound('click');
                  setIsSiteMenuOpen(false);
                }}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search Bar */}
            <div className="mt-4">
              <button
                onClick={() => {
                  playSound('click');
                  setIsSiteMenuOpen(false);
                  setIsSearchModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-emerald-600 text-xs transition-colors shadow-2xs"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Search discussions, projects, skills...</span>
                </span>
                <kbd className="font-mono text-[10px] bg-stone-100 dark:bg-stone-700 px-1.5 py-0.5 rounded text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-600">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Region / LGA Focus Selector */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Active Region:</span>
              </span>

              <div className="flex items-center gap-1 bg-stone-200/80 dark:bg-stone-800 p-0.5 rounded-lg">
                {(['All', 'Idanre', 'Ifedore'] as const).map(lga => (
                  <button
                    key={lga}
                    onClick={() => {
                      playSound('click');
                      setSelectedLGA(lga);
                    }}
                    className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
                      selectedLGA === lga
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    {lga}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable Navigation Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Account Status Card */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs"
                        style={{ backgroundColor: themeConfig.primaryColor }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
                          {user.name}
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                          @{user.username} · {user.community || user.lga}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                        {user.points} pts
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-stone-200/80 dark:border-stone-800 text-xs">
                    <button
                      onClick={() => {
                        playSound('click');
                        setIsSiteMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-stone-200/70 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 font-semibold text-stone-800 dark:text-stone-200 text-center transition-colors"
                    >
                      Profile & Badges
                    </button>
                    <button
                      onClick={() => {
                        logout();
                      }}
                      className="py-1.5 px-3 rounded-lg text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors flex items-center gap-1"
                      title="Sign Out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Guest Member
                    </h3>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-medium mt-0.5">
                      Join 3,840+ youth citizens to earn points, participate in grants, and vote on community issues.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        playSound('click');
                        setIsSiteMenuOpen(false);
                        openAuthModal('login');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        playSound('click');
                        setIsSiteMenuOpen(false);
                        openAuthModal('signup');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-95 flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: themeConfig.primaryColor }}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Join Free (+100)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Home Jump */}
            <div>
              <button
                onClick={() => navigateTo('home')}
                className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-colors border ${
                  activeTab === 'home'
                    ? 'border-emerald-600/60 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">Homepage</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    Town square overview, daily pulse & highlights
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {/* Categorized Directory Sections */}
            <div className="space-y-6">
              {menuSections.map(section => (
                <div key={section.title} className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-1">
                    {section.title}
                  </div>

                  <div className="space-y-1">
                    {section.items.map(item => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => navigateTo(item.id)}
                          className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-colors ${
                            isActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/70'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive
                                ? 'bg-emerald-200/80 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                              {item.desc}
                            </div>
                          </div>

                          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 border-t border-stone-200/90 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/90 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound('click');
                  setIsThemeModalOpen(true);
                }}
                className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 font-medium"
                title="Color Themes"
              >
                <span
                  className="w-3 h-3 rounded-full border border-white dark:border-stone-900"
                  style={{ backgroundColor: themeConfig.primaryColor }}
                />
                <span className="hidden xs:inline">Theme</span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  toggleDarkMode();
                }}
                className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 font-medium"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                <span className="hidden xs:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>

              <button
                onClick={() => {
                  toggleSound();
                }}
                className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 font-medium"
                title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-[11px] font-mono text-stone-400">
              Ok Idanre v2.4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
