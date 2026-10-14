import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Award, Clock, MapPin, Phone, Shield, Edit3, Check, Bookmark, Flame, Trophy, Star, Sparkles, CheckCircle2, Palette, LogOut } from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    user,
    setUser,
    setIsAuthModalOpen,
    openAuthModal,
    logout,
    bookmarks,
    setIsSavedModalOpen,
    setIsCheckInModalOpen,
    hasCheckedInToday,
    themeConfig,
    setIsThemeModalOpen,
    playSound,
  } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [community, setCommunity] = useState(user.community);
  const [lga, setLga] = useState(user.lga);

  if (!isProfileModalOpen) return null;

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      name,
      bio,
      community,
      lga,
    }));
    setIsEditing(false);
  };

  // Reputation level calculation
  const points = user.points || 0;
  let level = 1;
  let title = 'New Community Member';
  let nextLevelPoints = 100;
  let prevLevelPoints = 0;

  if (points >= 1000) {
    level = 5;
    title = 'Idanre & Ifedore Legend';
    nextLevelPoints = 2000;
    prevLevelPoints = 1000;
  } else if (points >= 500) {
    level = 4;
    title = 'Youth Ambassador & Leader';
    nextLevelPoints = 1000;
    prevLevelPoints = 500;
  } else if (points >= 250) {
    level = 3;
    title = 'Community Pioneer';
    nextLevelPoints = 500;
    prevLevelPoints = 250;
  } else if (points >= 100) {
    level = 2;
    title = 'Active Contributor';
    nextLevelPoints = 250;
    prevLevelPoints = 100;
  } else {
    level = 1;
    title = 'New Community Member';
    nextLevelPoints = 100;
    prevLevelPoints = 0;
  }

  const progressPercent = Math.min(
    100,
    Math.max(0, ((points - prevLevelPoints) / (nextLevelPoints - prevLevelPoints)) * 100)
  );

  // All available reputation badges in the system
  const allBadges = [
    {
      id: 'pioneer',
      name: 'Community Pioneer',
      desc: 'Reached Level 2+ or completed 3-day daily streak',
      icon: Trophy,
      unlocked: points >= 100 || (user.checkInStreak || 1) >= 3,
    },
    {
      id: 'champion',
      name: 'Event Champion',
      desc: 'Participated in or RSVP\'d to community events & meetups',
      icon: Award,
      unlocked: true,
    },
    {
      id: 'debater',
      name: 'Active Debater',
      desc: 'Contributed to discussions, polls, and town hall dialogues',
      icon: Star,
      unlocked: points >= 50,
    },
    {
      id: 'agro',
      name: 'Agro Innovator',
      desc: 'Engaged in agribusiness grants, skills directory, or marketplace',
      icon: Sparkles,
      unlocked: points >= 75,
    },
    {
      id: 'volunteer',
      name: 'Volunteer Hero',
      desc: 'Enrolled in community tree planting & restoration projects',
      icon: Shield,
      unlocked: user.volunteerHours > 0 || points >= 120,
    },
    {
      id: 'legend',
      name: 'Idanre Legend',
      desc: 'Achieved 500+ impact points and elite community leadership status',
      icon: Flame,
      unlocked: points >= 500,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
        onClick={() => setIsProfileModalOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsProfileModalOpen(false)}
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-2xl uppercase shadow-md shrink-0 relative">
            {user.name.charAt(0)}
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-900 font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs">
              L{level}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-900 truncate">{user.name}</h2>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Youth
              </span>
            </div>
            <p className="text-xs text-stone-500 font-mono">@{user.username}</p>
            <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{user.community}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-emerald-900">{user.lga} LGA</span>
            </div>
          </div>
        </div>

        {/* Reputation Level & Progress Card */}
        <div className="mb-6 p-4 bg-gradient-to-br from-emerald-900 to-stone-900 text-white rounded-2xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-mono font-semibold">
                Level {level} Reputation Rank
              </span>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                {title}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold font-mono text-amber-300 tabular-nums">
                {points} pts
              </div>
              <div className="text-[10px] text-stone-300">
                Next level at {nextLevelPoints} pts
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-stone-300 font-mono">
              <span>Progress to Level {level + 1}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
              <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">Points</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 tabular-nums">
              {user.points}
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5 truncate">Impact Score</p>
          </div>

          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">Hours</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 tabular-nums">
              {user.volunteerHours} <span className="text-xs font-normal text-stone-500">hrs</span>
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5 truncate">Community Action</p>
          </div>

          <button
            onClick={() => {
              setIsProfileModalOpen(false);
              setIsSavedModalOpen(true);
            }}
            className="bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-xl p-3 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 mb-1 font-medium">
              <Bookmark className="w-3.5 h-3.5 text-emerald-700 shrink-0 fill-emerald-700" />
              <span className="truncate">Saved</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-950 tabular-nums">
              {bookmarks.length}
            </div>
            <p className="text-[10px] text-emerald-700 mt-0.5 truncate group-hover:underline">
              Tap to view list →
            </p>
          </button>
        </div>

        {/* Daily Streak Highlight */}
        <button
          onClick={() => {
            setIsProfileModalOpen(false);
            setIsCheckInModalOpen(true);
          }}
          className="w-full mb-6 p-3 bg-amber-50/80 hover:bg-amber-100/70 border border-amber-200/90 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <span>{user.checkInStreak || 1}-Day Engagement Streak</span>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded font-mono font-bold">
                  {user.totalCheckIns || 1} total
                </span>
              </div>
              <div className="text-[11px] text-amber-800">
                {hasCheckedInToday ? 'Checked in today! Tap to view 7-day reward roadmap' : 'Claim today’s daily check-in points (+20 pts) →'}
              </div>
            </div>
          </div>
          <span className="text-xs text-amber-800 font-semibold group-hover:translate-x-0.5 transition-transform shrink-0">
            View →
          </span>
        </button>

        {/* Color Palette & Visual Theme Setting */}
        <button
          onClick={() => {
            playSound('click');
            setIsProfileModalOpen(false);
            setIsThemeModalOpen(true);
          }}
          className="w-full mb-6 p-3 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: themeConfig.primaryColor }}
            >
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span>Theme: {themeConfig.name}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                  Active
                </span>
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                Tap to change background palette & atmospheric vibes
              </div>
            </div>
          </div>
          <span className="text-xs text-stone-600 dark:text-stone-300 font-semibold group-hover:translate-x-0.5 transition-transform shrink-0">
            Customize →
          </span>
        </button>

        {/* Bio & Details */}
        {isEditing ? (
          <div className="space-y-3 mb-6 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">LGA</label>
                <select
                  value={lga}
                  onChange={e => setLga(e.target.value as 'Idanre' | 'Ifedore')}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                >
                  <option value="Idanre">Idanre LGA</option>
                  <option value="Ifedore">Ifedore LGA</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Town / Ward</label>
                <input
                  type="text"
                  value={community}
                  onChange={e => setCommunity(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Community Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 text-xs font-medium bg-emerald-800 text-white rounded-lg flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">About</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-emerald-800 hover:text-emerald-950 flex items-center gap-1 font-medium"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200/80">
              {user.bio}
            </p>
          </div>
        )}

        {/* Reputation Badges Gallery & Honors */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Reputation Badges & Honors
            </span>
            <span className="text-[11px] font-mono text-emerald-800 font-bold">
              {allBadges.filter(b => b.unlocked).length} / {allBadges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allBadges.map(badge => {
              const IconComp = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                    badge.unlocked
                      ? 'bg-emerald-50/60 border-emerald-200 text-stone-900'
                      : 'bg-stone-50/80 border-stone-200 opacity-60 text-stone-500'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    badge.unlocked ? 'bg-emerald-800 text-amber-300 shadow-xs' : 'bg-stone-200 text-stone-500'
                  }`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold truncate">{badge.name}</h4>
                      {badge.unlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interests */}
        <div className="mb-6">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
            Active Interests
          </span>
          <div className="flex flex-wrap gap-1.5">
            {user.interests.map(item => (
              <span
                key={item}
                className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Account Info & Actions */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-mono">{user.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound('click');
                setIsProfileModalOpen(false);
                openAuthModal('login');
              }}
              className="text-emerald-800 dark:text-emerald-400 hover:underline font-semibold"
            >
              Switch Account
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                logout();
                setIsProfileModalOpen(false);
              }}
              className="text-red-600 dark:text-red-400 hover:underline font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
