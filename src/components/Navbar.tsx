import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Bell,
  User,
  Sparkles,
  MapPin,
  Bookmark,
  Flame,
  CheckCircle2,
  Sun,
  Moon,
  Search,
  Palette,
  ChevronDown,
  Volume2,
  VolumeX,
  Menu,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedLGA,
    setSelectedLGA,
    notifications,
    setIsNotificationsModalOpen,
    setIsProfileModalOpen,
    bookmarks,
    setIsSavedModalOpen,
    user,
    hasCheckedInToday,
    dailyCheckIn,
    setIsCheckInModalOpen,
    isDarkMode,
    toggleDarkMode,
    setIsSearchModalOpen,
    currentTheme,
    themeConfig,
    setIsThemeModalOpen,
    soundEnabled,
    toggleSound,
    playSound,
    isAuthenticated,
    openAuthModal,
    toggleSiteMenu,
  } = useApp();

  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Primary top links shown directly on desktop
  const primaryLinks = [
    { id: 'home', label: 'Home' },
    { id: 'discussions', label: 'Discussions' },
    { id: 'civic-tech', label: 'Civic Tech' },
    { id: 'culture-heritage', label: 'Culture & Heritage' },
    { id: 'secondary-school', label: 'Schools' },
    { id: 'subtowns', label: 'Subtowns' },
    { id: 'skills', label: 'Skills' },
    { id: 'marketplace', label: 'Marketplace' },
  ];

  // Grouped additional links inside the "More Hub" menu
  const moreCategories = [
    {
      group: 'Community & Connect',
      items: [
        { id: 'pulse', label: 'Youth Pulse Hub' },
        { id: 'chat', label: 'Group Chat Rooms' },
        { id: 'peers', label: 'Peer Match' },
        { id: 'meetups', label: 'Hangout Meetups' },
        { id: 'updates', label: 'Official Updates' },
      ],
    },
    {
      group: 'Action & Impact',
      items: [
        { id: 'events', label: 'Community Events' },
        { id: 'volunteering', label: 'Volunteering' },
        { id: 'emergency', label: 'Emergency Contacts' },
      ],
    },
    {
      group: 'Creative & Rewards',
      items: [
        { id: 'ai-advisor', label: 'AI Community Guide' },
        { id: 'games', label: 'Games & Trivia' },
        { id: 'giveaways', label: 'Grants & Rewards' },
        { id: 'studio', label: 'Poster Studio' },
      ],
    },
  ];

  const isMoreTabActive = moreCategories.some(cat =>
    cat.items.some(item => item.id === activeTab)
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            playSound('click');
            setActiveTab('home');
          }}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-md shrink-0"
        >
          <div
            className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-base shadow-sm transition-all"
            style={{ backgroundColor: themeConfig.primaryColor }}
          >
            OK
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors whitespace-nowrap">
              Ok Idanre
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200/60 dark:border-emerald-800/60 hidden xs:inline-block">
              IdanApp
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {primaryLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  playSound('click');
                  setActiveTab(link.id);
                }}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  isActive
                    ? 'text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100'
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-2.5 left-0 right-0 h-0.5 rounded-full transition-all"
                    style={{ backgroundColor: themeConfig.primaryColor }}
                  />
                )}
              </button>
            );
          })}

          {/* More Hub Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                playSound('click');
                setIsMoreDropdownOpen(!isMoreDropdownOpen);
              }}
              className={`flex items-center gap-1 py-1 transition-colors relative ${
                isMoreTabActive
                  ? 'text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100'
              }`}
            >
              <span>More Hub</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
              {isMoreTabActive && (
                <span
                  className="absolute -bottom-2.5 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: themeConfig.primaryColor }}
                />
              )}
            </button>

            {isMoreDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-3">
                  {moreCategories.map(cat => (
                    <div key={cat.group}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 mb-1">
                        {cat.group}
                      </div>
                      <div className="space-y-0.5">
                        {cat.items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => {
                              playSound('click');
                              setActiveTab(item.id);
                              setIsMoreDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                              activeTab === item.id
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold'
                                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                            }`}
                          >
                            <span>{item.label}</span>
                            {activeTab === item.id && <span className="text-[10px] text-emerald-600 font-mono">Active</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Primary Action & User Utility */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Main Menu Button (Always Available on Desktop and Mobile) */}
          <button
            onClick={toggleSiteMenu}
            aria-label="Platform Directory Menu"
            title="Open Complete Platform Menu"
            className="min-h-[40px] px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-700 shrink-0"
          >
            <Menu className="w-4 h-4 text-emerald-400 dark:text-emerald-700" />
            <span className="font-bold">Menu</span>
          </button>

          {/* Theme Palette Switcher Trigger */}
          <button
            onClick={() => {
              playSound('click');
              setIsThemeModalOpen(true);
            }}
            aria-label="Color Palette & Themes"
            title={`Active: ${themeConfig.name}. Change color theme`}
            className="min-h-[40px] px-2.5 sm:px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border border-stone-200 dark:border-stone-700 active:scale-95"
          >
            <span
              className="inline-block w-3 h-3 rounded-full border border-white dark:border-stone-900 shadow-2xs"
              style={{ backgroundColor: themeConfig.primaryColor }}
            />
            <span className="hidden sm:inline">Theme</span>
            <Palette className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
          </button>

          {/* Daily Check-in Trigger */}
          {!hasCheckedInToday ? (
            <button
              onClick={() => {
                dailyCheckIn();
                setIsCheckInModalOpen(true);
              }}
              aria-label="Claim Daily Check-in Points"
              title="Engage daily on Ok Idanre to claim +20 points"
              className="min-h-[40px] px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Flame className="w-4 h-4 fill-amber-200 text-amber-200 animate-pulse" />
              <span className="hidden sm:inline">Daily Check-in</span>
              <span className="bg-amber-700/60 text-white px-1.5 py-0.2 rounded font-mono text-[11px]">
                +20
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                playSound('click');
                setIsCheckInModalOpen(true);
              }}
              aria-label="Daily Check-in Status"
              title="Daily check-in completed today! View streak progress"
              className="min-h-[40px] px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span className="hidden sm:inline">Checked in</span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold flex items-center gap-0.5 text-[11px]">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {user.checkInStreak || 1}d
              </span>
            </button>
          )}

          {/* PWA Install Action */}
          <PWAInstallButton />

          {/* Global Search Button / Bar */}
          <button
            onClick={() => {
              playSound('click');
              setIsSearchModalOpen(true);
            }}
            aria-label="Search Platform"
            title="Search discussions, events, skills, marketplace..."
            className="flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl text-xs font-medium transition-colors border border-stone-200 dark:border-stone-700"
          >
            <Search className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-stone-900 text-stone-500 rounded border border-stone-300 dark:border-stone-700">⌘K</kbd>
          </button>

          {/* Personal Saved Bookmarks Button */}
          <button
            onClick={() => {
              playSound('click');
              setIsSavedModalOpen(true);
            }}
            aria-label="Personal Saved List"
            title="Saved Items"
            className="relative min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            <Bookmark className="w-5 h-5" />
            {bookmarks.length > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-emerald-800 text-white text-[10px] font-bold font-mono rounded-full flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => {
              playSound('click');
              toggleDarkMode();
            }}
            aria-label="Toggle Dark Mode"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-stone-700" />}
          </button>

          {/* Notification Trigger */}
          <button
            onClick={() => {
              playSound('click');
              setIsNotificationsModalOpen(true);
            }}
            aria-label="Notifications"
            className="relative min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white dark:ring-stone-900" />
            )}
          </button>

          {/* Profile or Auth Trigger */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  playSound('click');
                  openAuthModal('login');
                }}
                className="min-h-[40px] px-2.5 sm:px-3 py-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  openAuthModal('signup');
                }}
                className="min-h-[40px] px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white rounded-xl shadow-xs transition-all hover:opacity-95 active:scale-95 flex items-center gap-1"
                style={{ backgroundColor: themeConfig.primaryColor }}
              >
                <span>Join</span>
                <span className="text-[10px] font-mono bg-white/20 px-1 py-0.2 rounded font-bold hidden xs:inline-block">
                  +100 pts
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                playSound('click');
                setIsProfileModalOpen(true);
              }}
              aria-label="User Profile"
              className="min-h-[40px] pl-2 pr-3 flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors border border-stone-200 dark:border-stone-700"
            >
              <div
                className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs uppercase"
                style={{ backgroundColor: themeConfig.primaryColor }}
              >
                {user.name.charAt(0)}
              </div>
              <span className="hidden sm:inline-block max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
              <span className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                {user.points} pts
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-bar for Community Focus & Micro-Vibes Info */}
      <div className="bg-stone-50/90 dark:bg-stone-900/80 border-t border-stone-200/80 dark:border-stone-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Active Community Focus:</span>
          </div>

          <div className="flex items-center gap-1 bg-stone-200/70 dark:bg-stone-800 p-0.5 rounded-lg">
            {(['All', 'Idanre', 'Ifedore'] as const).map(lga => (
              <button
                key={lga}
                onClick={() => {
                  playSound('click');
                  setSelectedLGA(lga);
                }}
                className={`px-3 py-1 rounded-md font-medium text-xs transition-colors whitespace-nowrap ${
                  selectedLGA === lga
                    ? 'bg-white dark:bg-stone-700 text-emerald-900 dark:text-emerald-200 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {lga === 'All' ? 'All (Idanre + Ifedore)' : lga}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 text-stone-500 dark:text-stone-400 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeConfig.primaryColor }} />
              <span>{themeConfig.name}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Connecting Youth</span>
          </div>
        </div>
      </div>
    </header>
  );
};
