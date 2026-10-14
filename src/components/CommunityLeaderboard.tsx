import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LeaderboardUser } from '../types';
import { INITIAL_LEADERBOARD_USERS } from '../data/initialData';
import {
  Trophy,
  Flame,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  Heart,
  ChevronRight,
  Info,
  CheckCircle2,
  Calendar,
  Zap,
  ShieldCheck,
  Star,
  Users,
  Search,
} from 'lucide-react';

interface CommunityLeaderboardProps {
  variant?: 'full' | 'compact';
  onNavigateToDiscussions?: () => void;
  onOpenCheckIn?: () => void;
}

export const CommunityLeaderboard: React.FC<CommunityLeaderboardProps> = ({
  variant = 'full',
  onNavigateToDiscussions,
  onOpenCheckIn,
}) => {
  const {
    user,
    dailyCheckIn,
    hasCheckedInToday,
    setIsCheckInModalOpen,
  } = useApp();

  const [metricTab, setMetricTab] = useState<'points' | 'streak' | 'weekly'>('points');
  const [lgaFilter, setLgaFilter] = useState<'All' | 'Idanre' | 'Ifedore'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPointsGuide, setShowPointsGuide] = useState(false);
  const [cheers, setCheers] = useState<{ [userId: string]: number }>({});
  const [cheerToast, setCheerToast] = useState<string | null>(null);

  // Combine initial leaders with the active user dynamically
  const allLeaderboardUsers: LeaderboardUser[] = useMemo(() => {
    const currentUserEntry: LeaderboardUser = {
      id: user.id || 'usr_current',
      name: user.name || 'Current User',
      username: user.username || 'user',
      lga: user.lga || 'Idanre',
      community: user.community || 'Odode Idanre',
      points: user.points,
      weeklyPoints: Math.min(user.points, 110),
      checkInStreak: user.checkInStreak || 0,
      totalCheckIns: user.totalCheckIns || 0,
      badge: user.badges?.[0] || 'Community Champion',
      bio: user.bio,
      cheersCount: 28,
      isCurrentUser: true,
    };

    // Filter out if user with same id or username already in list
    const otherUsers = INITIAL_LEADERBOARD_USERS.filter(
      u => u.username !== user.username && u.id !== user.id
    );

    return [currentUserEntry, ...otherUsers];
  }, [user]);

  // Sort and filter leaderboard entries
  const sortedUsers = useMemo(() => {
    let list = [...allLeaderboardUsers];

    // Filter by LGA
    if (lgaFilter !== 'All') {
      list = list.filter(u => u.lga === lgaFilter);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.community.toLowerCase().includes(q) ||
          u.badge.toLowerCase().includes(q)
      );
    }

    // Sort by selected metric
    list.sort((a, b) => {
      if (metricTab === 'streak') {
        if (b.checkInStreak !== a.checkInStreak) {
          return b.checkInStreak - a.checkInStreak;
        }
        return b.points - a.points;
      }
      if (metricTab === 'weekly') {
        if (b.weeklyPoints !== a.weeklyPoints) {
          return b.weeklyPoints - a.weeklyPoints;
        }
        return b.points - a.points;
      }
      // default: total points
      return b.points - a.points;
    });

    return list;
  }, [allLeaderboardUsers, lgaFilter, searchQuery, metricTab]);

  // Current user's rank in the active sorted list
  const currentUserRank = useMemo(() => {
    const idx = sortedUsers.findIndex(u => u.isCurrentUser);
    return idx !== -1 ? idx + 1 : null;
  }, [sortedUsers]);

  // User directly ahead of the current user
  const userAhead = useMemo(() => {
    if (!currentUserRank || currentUserRank <= 1) return null;
    return sortedUsers[currentUserRank - 2];
  }, [currentUserRank, sortedUsers]);

  const handleCheer = (userId: string, userName: string) => {
    setCheers(prev => ({
      ...prev,
      [userId]: (prev[userId] || 0) + 1,
    }));
    setCheerToast(`Sent a cheer to ${userName}! 👏`);
    setTimeout(() => {
      setCheerToast(null);
    }, 2800);
  };

  const topThree = sortedUsers.slice(0, 3);
  const remainingUsers = sortedUsers.slice(3);

  // Compact Widget Mode for Sidebar
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {/* Widget Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-stone-900 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm tracking-wide">Community Leaderboard</span>
            </div>
            <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded-full font-medium">
              Live
            </span>
          </div>
          <p className="text-[11px] text-emerald-200/90 mt-1">
            Top youth champions across Idanre & Ifedore
          </p>
        </div>

        {/* User Standing Quick Banner */}
        <div className="bg-emerald-50/80 border-b border-emerald-100 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
              #{currentUserRank || '-'}
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <span>{user.name}</span>
                <span className="text-[10px] text-emerald-800 font-semibold">(You)</span>
              </div>
              <div className="text-[11px] text-stone-600 flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-emerald-900">{user.points} pts</span>
                <span>·</span>
                <span className="inline-flex items-center gap-0.5 text-amber-700 font-medium">
                  <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {user.checkInStreak || 0}d streak
                </span>
              </div>
            </div>
          </div>

          {!hasCheckedInToday ? (
            <button
              onClick={() => {
                if (onOpenCheckIn) onOpenCheckIn();
                else setIsCheckInModalOpen(true);
              }}
              className="text-[10px] font-bold px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg flex items-center gap-1 transition-colors shadow-xs"
            >
              <Zap className="w-3 h-3" />
              <span>Check-in</span>
            </button>
          ) : (
            <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-100/80 px-2 py-1 rounded-md">
              <CheckCircle2 className="w-3 h-3" />
              <span>Active</span>
            </div>
          )}
        </div>

        {/* Top 3 List */}
        <div className="p-3 space-y-2">
          {sortedUsers.slice(0, 5).map((u, index) => {
            const rank = index + 1;
            const medalColors =
              rank === 1
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : rank === 2
                ? 'bg-stone-200 text-stone-800 border-stone-300'
                : rank === 3
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-stone-50 text-stone-600 border-stone-200';

            return (
              <div
                key={u.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                  u.isCurrentUser
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300/60'
                    : 'bg-white border-stone-100 hover:border-stone-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${medalColors}`}
                  >
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-stone-900 truncate flex items-center gap-1">
                      <span>{u.name}</span>
                      {u.isCurrentUser && (
                        <span className="text-[9px] bg-emerald-200 text-emerald-800 px-1 rounded font-medium">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-stone-500 truncate">
                      {u.community} · {u.lga}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <div className="text-xs font-bold text-emerald-950 font-mono">
                    {u.points} pts
                  </div>
                  <div className="text-[10px] text-stone-500 flex items-center justify-end gap-0.5">
                    <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    <span>{u.checkInStreak}d</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Link to expand */}
        {onNavigateToDiscussions && (
          <div className="p-3 border-t border-stone-100 bg-stone-50/70 text-center">
            <button
              onClick={onNavigateToDiscussions}
              className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold inline-flex items-center gap-1"
            >
              <span>View Full Leaderboard & Breakdown</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Full Leaderboard View
  return (
    <div className="space-y-6">
      {/* Toast Notification for Cheer */}
      {cheerToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-medium animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{cheerToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 text-white p-6 sm:p-8 border border-emerald-800/40 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 text-xs font-semibold mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Community Engagement Leaderboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Idanre & Ifedore Youth Champions
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
            Recognizing active youth members advancing our towns through daily check-in streaks, constructive civic discussions, policy poll participation, and community action.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone-300">
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Daily Check-in Streaks</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
              <Star className="w-4 h-4 text-emerald-400" />
              <span>Points Earned via Real Civic Impact</span>
            </div>
            <button
              onClick={() => setShowPointsGuide(!showPointsGuide)}
              className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 font-semibold underline underline-offset-4 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showPointsGuide ? 'Hide Points Guide' : 'How Points Work'}</span>
            </button>
          </div>
        </div>

        {/* Ambient Decorative Shapes */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Expandable Points Calculation Guide */}
      {showPointsGuide && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-800" />
              <h2 className="text-sm font-bold text-stone-900">How to Earn Community Impact Points</h2>
            </div>
            <button
              onClick={() => setShowPointsGuide(false)}
              className="text-stone-400 hover:text-stone-600 text-xs font-semibold"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center justify-between font-bold text-emerald-900 mb-1">
                <span className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Daily Check-in
                </span>
                <span className="text-emerald-800 font-mono">+20 to +30 pts</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Check in once every 24 hours in the navbar. Consecutive streaks earn a +10 pts bonus.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-center justify-between font-bold text-amber-900 mb-1">
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-600" />
                  Civic Discussions
                </span>
                <span className="text-amber-800 font-mono">+15 pts</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Initiate a discussion on agriculture, education, eco-tourism, or local governance.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center justify-between font-bold text-blue-900 mb-1">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Poll Participation
                </span>
                <span className="text-blue-800 font-mono">+5 pts</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Cast your vote or attach a community feedback poll to gather local consensus.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100">
              <div className="flex items-center justify-between font-bold text-purple-900 mb-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  Volunteering & Action
                </span>
                <span className="text-purple-800 font-mono">+50 pts</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Enroll in tree planting, clean-up at Oke Idanre, or youth tutoring in Ifedore.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Your Standing Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white font-extrabold text-base flex items-center justify-center border-2 border-emerald-400/60 shadow-inner">
                #{currentUserRank || '-'}
              </div>
              <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                YOU
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-white">{user.name}</h3>
                <span className="text-xs text-emerald-300 font-medium">@{user.username}</span>
                <span className="text-[10px] bg-emerald-800/90 text-emerald-100 px-2 py-0.5 rounded-md font-semibold">
                  {user.community} · {user.lga}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1 text-xs text-stone-300 flex-wrap">
                <span className="font-mono font-bold text-amber-300 text-sm">
                  {user.points} Total Points
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  {user.checkInStreak || 0}-day streak
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-stone-300">
                  {user.totalCheckIns || 0} total check-ins
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            {userAhead ? (
              <div className="hidden lg:block text-right text-xs pr-2">
                <p className="text-stone-300">
                  <span className="text-amber-400 font-bold">
                    +{userAhead.points - user.points + 1} pts
                  </span>{' '}
                  to overtake #{currentUserRank ? currentUserRank - 1 : 1}
                </p>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  @{userAhead.username} ({userAhead.points} pts)
                </p>
              </div>
            ) : currentUserRank === 1 ? (
              <div className="text-right text-xs pr-2">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Crown className="w-4 h-4 text-amber-400" />
                  You are leading the board!
                </span>
              </div>
            ) : null}

            {!hasCheckedInToday ? (
              <button
                onClick={() => {
                  dailyCheckIn();
                  setIsCheckInModalOpen(true);
                }}
                className="min-h-[40px] px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-98"
              >
                <Zap className="w-3.5 h-3.5 fill-stone-950" />
                <span>Daily Check-in (+20 pts)</span>
              </button>
            ) : (
              <div className="px-3.5 py-2 bg-emerald-800/80 border border-emerald-600/40 rounded-xl text-xs text-emerald-200 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Checked in today</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Metric Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-xs">
        {/* Metric Segmented Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setMetricTab('points')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              metricTab === 'points'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>All-Time Points</span>
          </button>

          <button
            onClick={() => setMetricTab('streak')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              metricTab === 'streak'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Daily Streak</span>
          </button>

          <button
            onClick={() => setMetricTab('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              metricTab === 'weekly'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-700" />
            <span>Weekly Sprint</span>
          </button>
        </div>

        {/* LGA Filter & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            {(['All', 'Idanre', 'Ifedore'] as const).map(lga => (
              <button
                key={lga}
                onClick={() => setLgaFilter(lga)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  lgaFilter === lga
                    ? 'bg-emerald-800 text-white font-semibold'
                    : 'bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {lga === 'All' ? 'Both LGAs' : lga}
              </button>
            ))}
          </div>

          <div className="relative min-w-[160px] sm:min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search champion..."
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length > 0 && !searchQuery.trim() && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 (Silver) */}
          {topThree[1] && (
            <div className="order-2 md:order-1 bg-white rounded-2xl border-2 border-stone-200 p-5 flex flex-col justify-between shadow-xs relative hover:border-stone-300 transition-colors">
              <div className="absolute top-4 right-4 text-2xl font-black text-stone-300">
                #2
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 border-2 border-stone-300 text-stone-800 font-bold text-base flex items-center justify-center shadow-xs">
                    🥈
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                      <span>{topThree[1].name}</span>
                      {topThree[1].isCurrentUser && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 rounded">
                          You
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-stone-500">@{topThree[1].username}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="inline-block text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                    {topThree[1].badge}
                  </span>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                    {topThree[1].bio}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="text-base font-extrabold text-stone-900 font-mono">
                    {metricTab === 'streak'
                      ? `${topThree[1].checkInStreak} days`
                      : metricTab === 'weekly'
                      ? `${topThree[1].weeklyPoints} pts`
                      : `${topThree[1].points} pts`}
                  </div>
                  <div className="text-[10px] text-stone-500 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{topThree[1].checkInStreak}-day streak</span>
                    <span>·</span>
                    <span>{topThree[1].community}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCheer(topThree[1].id, topThree[1].name)}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Cheer this youth leader"
                >
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <span>{topThree[1].cheersCount + (cheers[topThree[1].id] || 0)}</span>
                </button>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold - Crown) */}
          {topThree[0] && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50/70 to-white rounded-2xl border-2 border-amber-400 p-6 flex flex-col justify-between shadow-md relative hover:shadow-lg transition-all scale-[1.02]">
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span className="text-2xl font-black text-amber-500">#1</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border-2 border-amber-400 text-amber-900 font-bold text-xl flex items-center justify-center shadow-xs">
                    🥇
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-1.5">
                      <span>{topThree[0].name}</span>
                      {topThree[0].isCurrentUser && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 rounded">
                          You
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-amber-800 font-semibold">@{topThree[0].username}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="inline-block text-[10px] font-bold bg-amber-200/80 text-amber-950 px-2.5 py-0.5 rounded-md">
                    {topThree[0].badge}
                  </span>
                  <p className="text-xs text-stone-700 mt-2 line-clamp-2">
                    {topThree[0].bio}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-amber-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xl font-black text-amber-950 font-mono">
                    {metricTab === 'streak'
                      ? `${topThree[0].checkInStreak} days`
                      : metricTab === 'weekly'
                      ? `${topThree[0].weeklyPoints} pts`
                      : `${topThree[0].points} pts`}
                  </div>
                  <div className="text-[10px] text-amber-900/80 font-medium flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{topThree[0].checkInStreak}-day streak</span>
                    <span>·</span>
                    <span>{topThree[0].community}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCheer(topThree[0].id, topThree[0].name)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                  title="Cheer this youth champion"
                >
                  <Heart className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
                  <span>{topThree[0].cheersCount + (cheers[topThree[0].id] || 0)}</span>
                </button>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {topThree[2] && (
            <div className="order-3 bg-white rounded-2xl border-2 border-amber-200/70 p-5 flex flex-col justify-between shadow-xs relative hover:border-amber-300 transition-colors">
              <div className="absolute top-4 right-4 text-2xl font-black text-amber-700/40">
                #3
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/60 border-2 border-amber-300 text-amber-800 font-bold text-base flex items-center justify-center shadow-xs">
                    🥉
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                      <span>{topThree[2].name}</span>
                      {topThree[2].isCurrentUser && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 rounded">
                          You
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-stone-500">@{topThree[2].username}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="inline-block text-[10px] font-semibold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md">
                    {topThree[2].badge}
                  </span>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                    {topThree[2].bio}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="text-base font-extrabold text-stone-900 font-mono">
                    {metricTab === 'streak'
                      ? `${topThree[2].checkInStreak} days`
                      : metricTab === 'weekly'
                      ? `${topThree[2].weeklyPoints} pts`
                      : `${topThree[2].points} pts`}
                  </div>
                  <div className="text-[10px] text-stone-500 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{topThree[2].checkInStreak}-day streak</span>
                    <span>·</span>
                    <span>{topThree[2].community}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCheer(topThree[2].id, topThree[2].name)}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Cheer this youth leader"
                >
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <span>{topThree[2].cheersCount + (cheers[topThree[2].id] || 0)}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rankings Table / List */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-stone-500" />
            <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {lgaFilter === 'All' ? 'All Community Champions' : `${lgaFilter} Champions`} ({sortedUsers.length})
            </h2>
          </div>
          <span className="text-[11px] text-stone-500">
            Sorted by {metricTab === 'streak' ? 'Daily Streak' : metricTab === 'weekly' ? 'Weekly Points' : 'Total Points'}
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {sortedUsers.map((item, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 transition-colors ${
                  item.isCurrentUser
                    ? 'bg-emerald-50/70 border-l-4 border-l-emerald-700'
                    : 'hover:bg-stone-50/80'
                }`}
              >
                {/* Rank & User Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      rank === 1
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : rank === 2
                        ? 'bg-stone-200 text-stone-800'
                        : rank === 3
                        ? 'bg-amber-50 text-amber-900'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                        {item.name}
                      </span>
                      {item.isCurrentUser && (
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded">
                          You
                        </span>
                      )}
                      <span className="text-[11px] text-stone-400">@{item.username}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5 flex-wrap">
                      <span className="font-medium text-stone-700">
                        {item.community} · {item.lga}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-900 font-medium">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Cheers */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0 text-right">
                  {/* Streak metric */}
                  <div className="hidden sm:block">
                    <div className="flex items-center justify-end gap-1 text-xs font-semibold text-amber-600">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{item.checkInStreak} days</span>
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {item.totalCheckIns} check-ins
                    </span>
                  </div>

                  {/* Primary Points */}
                  <div>
                    <div className="text-sm sm:text-base font-extrabold text-stone-900 font-mono">
                      {metricTab === 'streak'
                        ? `${item.checkInStreak} days`
                        : metricTab === 'weekly'
                        ? `${item.weeklyPoints} pts`
                        : `${item.points} pts`}
                    </div>
                    <span className="text-[10px] text-stone-400 block sm:hidden">
                      🔥 {item.checkInStreak}d
                    </span>
                  </div>

                  {/* Cheer button */}
                  <button
                    onClick={() => handleCheer(item.id, item.name)}
                    className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium flex items-center gap-1 transition-colors active:scale-95"
                    title="Send a cheer"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span className="text-[11px] font-semibold text-stone-700">
                      {item.cheersCount + (cheers[item.id] || 0)}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}

          {sortedUsers.length === 0 && (
            <div className="p-8 text-center text-stone-500 text-xs">
              No champions found matching "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
