import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  MessageSquare,
  Newspaper,
  Calendar,
  HeartHandshake,
  Sparkles,
  Gamepad2,
  Gift,
  Palette,
  X,
  User,
  Bookmark,
  Flame,
  Wrench,
  ShoppingBag,
  ShieldAlert,
  Users,
  Compass,
  Building2,
  Vote,
  Landmark,
  GraduationCap,
  Zap,
  Menu,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsProfileModalOpen,
    setIsSavedModalOpen,
    bookmarks,
    user,
    hasCheckedInToday,
    setIsCheckInModalOpen,
    themeConfig,
    setIsThemeModalOpen,
    playSound,
    toggleSiteMenu,
  } = useApp();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const mainTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discussions', label: 'Discussions', icon: MessageSquare },
    { id: 'civic-tech', label: 'Civic Tech', icon: Vote },
    { id: 'culture-heritage', label: 'Culture', icon: Landmark },
  ];

  const moreItems = [
    { id: 'updates', label: 'Official Updates', icon: Newspaper, desc: 'Announcements from Idanre & Ifedore councils' },
    { id: 'events', label: 'Community Events', icon: Calendar, desc: 'Festivals, sports, hackathons & youth assemblies' },
    { id: 'volunteering', label: 'Volunteering', icon: HeartHandshake, desc: 'Tree planting, school mentoring & trail stewardship' },
    { id: 'pulse', label: 'Youth Pulse Hub ⚡', icon: Zap, desc: 'Agro grants, Soundwave Afrobeat lounge & Daily Trivia' },
    { id: 'civic-tech', label: 'Civic Tech & Ward Tracker', icon: Vote, desc: 'Track ward budgets, Know Your Reps & Polling Units' },
    { id: 'culture-heritage', label: 'Culture & Heritage Museum', icon: Landmark, desc: '1923 Ufe Oke archive, oral audio, Mare Fest & festivals' },
    { id: 'secondary-school', label: 'Secondary School Connect', icon: GraduationCap, desc: 'Assignment groups, reading circles, AI tutor & verification' },
    { id: 'subtowns', label: 'Subtown Community Groups', icon: Building2, desc: 'Explore Odode, Oke Idanre, Igbara-Oke, Ilara-Mokin & more subtowns' },
    { id: 'ai-advisor', label: 'AI Community Guide', icon: Sparkles, desc: 'Chat & voice Q&A about Idanre & Ifedore opportunities' },
    { id: 'chat', label: 'Group Chat Rooms', icon: Users, desc: 'Real-time discussions across Idanre & Ifedore' },
    { id: 'peers', label: 'Peer Matching', icon: User, desc: 'Find study partners, tech & agri collaborators' },
    { id: 'meetups', label: 'Hangout Meetups', icon: Compass, desc: 'Weekend hikes, coding jams & agro-youth hangouts' },
    { id: 'skills', label: 'Verified Skills Directory', icon: Wrench, desc: 'Hire local young artisans, tech talents & professionals' },
    { id: 'marketplace', label: 'Community Marketplace', icon: ShoppingBag, desc: 'Buy & sell farm produce, crafts & local goods' },
    { id: 'emergency', label: 'Emergency & Help Directory', icon: ShieldAlert, desc: 'Verified 24/7 helplines, security & health centers' },
    { id: 'games', label: 'Games & Trivia', icon: Gamepad2, desc: 'Idanre Hills & Yoruba proverbs challenge' },
    { id: 'giveaways', label: 'Giveaways & Rewards', icon: Gift, desc: 'Data bundles & agribusiness grants' },
    { id: 'studio', label: 'Creative Studio', icon: Palette, desc: 'Generate community campaign posters' },
  ];

  return (
    <>
      {/* Mobile More Drawer Sheet */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMoreMenuOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900 rounded-t-3xl p-5 shadow-2xl border-t border-stone-200 dark:border-stone-800 max-h-[85vh] overflow-y-auto">
            <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">More Community Features</h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Discover all 19 youth features</p>
              </div>
              <button
                onClick={() => {
                  playSound('click');
                  setIsMoreMenuOpen(false);
                }}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Palette Button */}
            <button
              onClick={() => {
                playSound('click');
                setIsMoreMenuOpen(false);
                setIsThemeModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 mb-4 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: themeConfig.primaryColor }}
                >
                  <Palette className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Theme & Color Palette</div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400">
                    Active: {themeConfig.name}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                Change
              </span>
            </button>

            <div className="space-y-2 mb-6">
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      playSound('click');
                      setActiveTab(item.id);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200/60 dark:border-emerald-800/60'
                        : 'hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{item.label}</div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  playSound('click');
                  setIsCheckInModalOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 text-stone-800 dark:text-stone-200 font-medium text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span className="font-semibold text-amber-950 dark:text-amber-200">Daily Check-in</span>
                </div>
                <span className="font-mono font-bold text-amber-900 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-900/60 px-2 py-0.5 rounded-full text-[11px]">
                  {hasCheckedInToday ? `${user.checkInStreak || 1}d streak ✓` : '+20 pts ready'}
                </span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  setIsSavedModalOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-stone-800 dark:text-stone-200 font-medium text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                  <span>Personal Saved List</span>
                </div>
                <span className="font-mono font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-full text-[11px]">
                  {bookmarks.length} saved
                </span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  setIsProfileModalOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-sm"
              >
                <User className="w-4 h-4" />
                View My Profile & Points ({user.points} pts)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 shadow-md transition-colors">
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto">
          {mainTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSound('click');
                  setActiveTab(tab.id);
                }}
                className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                  isActive
                    ? 'text-emerald-800 dark:text-emerald-300'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                <span className={`text-[10px] mt-1 whitespace-nowrap ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => {
              toggleSiteMenu();
            }}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              !mainTabs.some(t => t.id === activeTab)
                ? 'text-emerald-800 dark:text-emerald-300 font-bold'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-semibold whitespace-nowrap">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
};
