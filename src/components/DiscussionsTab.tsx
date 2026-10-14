import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Discussion, DiscussionSortOption } from '../types';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Plus,
  Send,
  X,
  Sparkles,
  Search,
  Filter,
  Check,
  CornerDownRight,
  Bookmark,
  BarChart2,
  Trash2,
  Vote,
  Trophy,
  Flame,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  Users,
  Award,
} from 'lucide-react';
import { CommunityLeaderboard } from './CommunityLeaderboard';
import { WeatherWidget } from './WeatherWidget';

export const DiscussionsTab: React.FC = () => {
  const {
    discussions,
    addDiscussion,
    votePoll,
    upvoteDiscussion,
    addComment,
    selectedLGA,
    user,
    toggleBookmark,
    isBookmarked,
    setIsCheckInModalOpen,
    setActiveTab,
    playSound,
    themeConfig,
  } = useApp();

  const [activeView, setActiveView] = useState<'discussions' | 'polls' | 'leaderboard'>('discussions');
  const [pollStatusFilter, setPollStatusFilter] = useState<'all' | 'pending' | 'voted'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<DiscussionSortOption>('latest');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [expandedDiscussionId, setExpandedDiscussionId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [shareToast, setShareToast] = useState<string | null>(null);

  // New discussion form states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<Discussion['category']>('Agribusiness');
  const [newLga, setNewLga] = useState<Discussion['lga']>('Both');
  const [newTagInput, setNewTagInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  // Poll creation form states
  const [attachPoll, setAttachPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  const categories = [
    'All',
    'Polls',
    'Agribusiness',
    'Governance',
    'Tourism & Culture',
    'Education & Tech',
    'Infrastructure',
    'Sports',
  ];

  // Recency scorer for relative and absolute timestamp strings
  const getRecencyScore = (timestamp: string): number => {
    if (!timestamp) return 0;
    const lower = timestamp.toLowerCase().trim();
    if (lower.includes('just now') || lower.includes('moment')) return 1000000;
    const minMatch = lower.match(/(\d+)\s*min/);
    if (minMatch) return 500000 - parseInt(minMatch[1], 10);
    const hourMatch = lower.match(/(\d+)\s*hour/);
    if (hourMatch) return 200000 - parseInt(hourMatch[1], 10) * 60;
    if (lower.includes('yesterday')) return 50000;
    const dayMatch = lower.match(/(\d+)\s*day/);
    if (dayMatch) return 20000 - parseInt(dayMatch[1], 10) * 1440;
    const parsed = Date.parse(timestamp);
    if (!isNaN(parsed)) return parsed;
    return 0;
  };

  // Popularity scorer: weights upvotes + comments count + poll engagement
  const getPopularityScore = (disc: Discussion): number => {
    const upvotes = disc.upvotes || 0;
    const commentsCount = disc.comments?.length ?? disc.commentsCount ?? 0;
    const pollVotes = disc.poll?.totalVotes || 0;
    return upvotes * 10 + commentsCount * 5 + pollVotes;
  };

  // Filtering & Sorting
  const filteredDiscussions = useMemo(() => {
    const filtered = discussions.filter(disc => {
      // LGA match
      if (selectedLGA !== 'All' && disc.lga !== 'Both' && disc.lga !== selectedLGA) {
        return false;
      }
      // Category match
      if (categoryFilter === 'Polls') {
        if (!disc.poll) return false;
      } else if (categoryFilter !== 'All' && disc.category !== categoryFilter) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          disc.title.toLowerCase().includes(q) ||
          disc.content.toLowerCase().includes(q) ||
          disc.tags.some(t => t.toLowerCase().includes(q)) ||
          (disc.poll && disc.poll.question.toLowerCase().includes(q))
        );
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'popular') {
        const popB = getPopularityScore(b);
        const popA = getPopularityScore(a);
        if (popB !== popA) return popB - popA;
        return getRecencyScore(b.timestamp) - getRecencyScore(a.timestamp);
      }

      if (sortBy === 'unanswered') {
        const countA = a.comments?.length ?? a.commentsCount ?? 0;
        const countB = b.comments?.length ?? b.commentsCount ?? 0;
        const isUnansweredA = countA === 0;
        const isUnansweredB = countB === 0;

        // Unanswered (0 replies) strictly come first
        if (isUnansweredA && !isUnansweredB) return -1;
        if (!isUnansweredA && isUnansweredB) return 1;

        // If both are unanswered, newest first
        if (isUnansweredA && isUnansweredB) {
          return getRecencyScore(b.timestamp) - getRecencyScore(a.timestamp);
        }

        // If both have replies, sort by fewest replies first, then newest
        if (countA !== countB) return countA - countB;
        return getRecencyScore(b.timestamp) - getRecencyScore(a.timestamp);
      }

      // Default 'latest': Pinned items at top, then newest
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      const timeB = getRecencyScore(b.timestamp);
      const timeA = getRecencyScore(a.timestamp);
      if (timeB !== timeA) return timeB - timeA;

      return 0;
    });
  }, [discussions, selectedLGA, categoryFilter, searchQuery, sortBy]);

  const totalUnansweredCount = useMemo(() => {
    return discussions.filter(d => (d.comments?.length ?? d.commentsCount ?? 0) === 0).length;
  }, [discussions]);

  const allPollDiscussions = useMemo(() => {
    return discussions.filter(d => Boolean(d.poll));
  }, [discussions]);

  const totalCommunityVotes = useMemo(() => {
    return allPollDiscussions.reduce((acc, d) => acc + (d.poll?.totalVotes || 0), 0);
  }, [allPollDiscussions]);

  const userVotedPollsCount = useMemo(() => {
    return allPollDiscussions.filter(d => Boolean(d.poll?.userVotedOptionId)).length;
  }, [allPollDiscussions]);

  const filteredPollDiscussions = useMemo(() => {
    return allPollDiscussions.filter(disc => {
      if (selectedLGA !== 'All' && disc.lga !== 'Both' && disc.lga !== selectedLGA) {
        return false;
      }
      if (pollStatusFilter === 'pending' && disc.poll?.userVotedOptionId) {
        return false;
      }
      if (pollStatusFilter === 'voted' && !disc.poll?.userVotedOptionId) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const question = disc.poll?.question.toLowerCase() || '';
        const options = disc.poll?.options.some(o => o.text.toLowerCase().includes(q));
        const title = disc.title.toLowerCase();
        if (!question.includes(q) && !options && !title.includes(q)) return false;
      }
      return true;
    });
  }, [allPollDiscussions, selectedLGA, pollStatusFilter, searchQuery]);

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions(prev => [...prev, '']);
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleUpdatePollOption = (index: number, val: string) => {
    setPollOptions(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tags = newTagInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    let pollPayload: { question: string; options: string[] } | undefined = undefined;
    if (attachPoll) {
      const validOptions = pollOptions.map(o => o.trim()).filter(Boolean);
      if (validOptions.length >= 2) {
        pollPayload = {
          question: pollQuestion.trim() || newTitle.trim(),
          options: validOptions,
        };
      }
    }

    addDiscussion(newTitle.trim(), newContent.trim(), newCategory, newLga, tags, pollPayload);
    setNewTitle('');
    setNewContent('');
    setNewTagInput('');
    setAiSuggestions(null);
    setAttachPoll(false);
    setPollQuestion('');
    setPollOptions(['', '']);
    setIsNewModalOpen(false);
  };

  const handleAiAssist = async () => {
    if (!newTitle.trim()) {
      setShareToast('Please enter a brief topic in the title field first!');
      setTimeout(() => setShareToast(null), 3000);
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/gemini/assist-discussion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: newTitle,
          category: newCategory,
          lga: newLga,
        }),
      });
      const data = await res.json();
      if (data.advice) {
        setAiSuggestions(data.advice);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleShare = (disc: Discussion) => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast(`Link copied for "${disc.title.slice(0, 30)}..."`);
    setTimeout(() => setShareToast(null), 3000);
  };

  const submitComment = (discussionId: string) => {
    const text = commentInputs[discussionId]?.trim();
    if (!text) return;
    addComment(discussionId, text);
    setCommentInputs(prev => ({ ...prev, [discussionId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Share Toast */}
      {shareToast && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* Top Navigation: Feed vs Polls vs Leaderboard */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveView('discussions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeView === 'discussions'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Discussions Feed</span>
          </button>

          <button
            onClick={() => setActiveView('polls')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeView === 'polls'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Community Polls</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                activeView === 'polls' ? 'bg-emerald-950 text-amber-300' : 'bg-emerald-100 text-emerald-900'
              }`}
            >
              {allPollDiscussions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveView('leaderboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeView === 'leaderboard'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Community Leaderboard</span>
          </button>
        </div>

        <button
          onClick={() => setActiveView('leaderboard')}
          className="text-xs text-stone-700 hover:text-stone-900 flex items-center justify-between sm:justify-start gap-2 bg-stone-50 hover:bg-stone-100/80 border border-stone-200/80 px-3 py-1.5 rounded-xl transition-colors"
        >
          <span className="text-[11px] text-stone-500 font-medium">Your Standing:</span>
          <span className="font-bold text-emerald-900">{user.points} pts</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-700 font-medium inline-flex items-center gap-0.5">
            <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
            {user.checkInStreak || 0}d streak
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        </button>
      </div>

      {activeView === 'leaderboard' ? (
        <CommunityLeaderboard
          variant="full"
          onNavigateToDiscussions={() => setActiveView('discussions')}
          onOpenCheckIn={() => setIsCheckInModalOpen(true)}
        />
      ) : activeView === 'polls' ? (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
                <Vote className="w-3.5 h-3.5" />
                <span>Civic Decision-Making · Idanre & Ifedore</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
                Community Polls & Real-Time Ballots
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                Vote in real time on key municipal proposals, agricultural projects, eco-tourism ideas, and road repairs. Every vote shapes youth advocacy across Idanre and Ifedore.
              </p>
            </div>

            <button
              onClick={() => {
                setAttachPoll(true);
                setIsNewModalOpen(true);
              }}
              className="min-h-[44px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Launch New Poll</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                <BarChart2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Active Polls</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900">
                {allPollDiscussions.length}
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">Open for voting</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>Total Votes</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-900">
                {totalCommunityVotes}
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">Youth participated</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Your Participation</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900">
                {userVotedPollsCount}/{allPollDiscussions.length}
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">
                {userVotedPollsCount === allPollDiscussions.length ? 'All polls voted!' : `${allPollDiscussions.length - userVotedPollsCount} awaiting your vote`}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Impact Points</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-700">
                +{userVotedPollsCount * 10} pts
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">+10 pts per vote cast</p>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search polls by question, option, or topic..."
                className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Segmented Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl self-start sm:self-auto overflow-x-auto no-scrollbar">
              <button
                onClick={() => setPollStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  pollStatusFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Polls ({allPollDiscussions.length})
              </button>
              <button
                onClick={() => setPollStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  pollStatusFilter === 'pending'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Awaiting Vote ({allPollDiscussions.length - userVotedPollsCount})
              </button>
              <button
                onClick={() => setPollStatusFilter('voted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  pollStatusFilter === 'voted'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Voted by You ({userVotedPollsCount})
              </button>
            </div>
          </div>

          {/* Polls Grid */}
          {filteredPollDiscussions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-800">No Community Polls Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No polls match your current filter settings. Try adjusting your search query or status filter.
              </p>
              <button
                onClick={() => {
                  setPollStatusFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPollDiscussions.map(disc => {
                if (!disc.poll) return null;
                const hasVoted = Boolean(disc.poll.userVotedOptionId);
                const userChoice = disc.poll.options.find(o => o.id === disc.poll?.userVotedOptionId);

                return (
                  <article
                    key={disc.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 flex flex-col justify-between hover:shadow-xs transition-shadow"
                  >
                    <div>
                      {/* Meta header */}
                      <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-emerald-900">{disc.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-stone-700">{disc.lga === 'Both' ? 'Idanre & Ifedore' : `${disc.lga} LGA`}</span>
                        </div>
                        {hasVoted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Voted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                            <Vote className="w-3 h-3 text-amber-600" />
                            Open (+10 pts)
                          </span>
                        )}
                      </div>

                      {/* Question */}
                      <h2 className="text-base font-bold text-stone-900 leading-snug">
                        {disc.poll.question}
                      </h2>

                      {/* Brief topic context */}
                      <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                        {disc.content}
                      </p>

                      {/* Poll Options with Real-Time Results */}
                      <div className="space-y-2 mt-4">
                        {disc.poll.options.map(opt => {
                          const isUserChoice = disc.poll?.userVotedOptionId === opt.id;
                          const percentage =
                            disc.poll && disc.poll.totalVotes > 0
                              ? Math.round((opt.votesCount / disc.poll.totalVotes) * 100)
                              : 0;

                          return (
                            <button
                              key={opt.id}
                              onClick={() => {
                                votePoll(disc.id, opt.id);
                                setShareToast(`Vote recorded for "${opt.text.slice(0, 24)}..."`);
                                setTimeout(() => setShareToast(null), 2500);
                              }}
                              className={`w-full relative overflow-hidden rounded-xl border p-3 text-left transition-all group ${
                                isUserChoice
                                  ? 'border-emerald-700 bg-emerald-50/70 font-semibold text-emerald-950 ring-1 ring-emerald-700/40'
                                  : 'border-stone-200 bg-white hover:bg-stone-50/80 text-stone-800'
                              }`}
                            >
                              {/* Background progress percentage fill */}
                              {hasVoted && (
                                <div
                                  className={`absolute inset-y-0 left-0 transition-all duration-500 pointer-events-none ${
                                    isUserChoice ? 'bg-emerald-200/60' : 'bg-stone-100/90'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              )}

                              <div className="relative z-10 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] ${
                                      isUserChoice
                                        ? 'border-emerald-700 bg-emerald-700 text-white'
                                        : 'border-stone-300 text-transparent group-hover:border-stone-400'
                                    }`}
                                  >
                                    ✓
                                  </span>
                                  <span className="truncate">{opt.text}</span>
                                </div>

                                {hasVoted && (
                                  <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] tabular-nums">
                                    <span className="text-stone-500">{opt.votesCount}</span>
                                    <span className="font-bold text-stone-800">{percentage}%</span>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Vote Feedback Hint */}
                      <div className="text-[11px] text-stone-500 mt-2.5 flex items-center justify-between">
                        <span>
                          {hasVoted
                            ? `You selected: ${userChoice?.text.slice(0, 28)}... (Tap another to switch)`
                            : 'Select an option to vote & earn +10 community points'}
                        </span>
                        <span className="font-mono text-stone-600 font-semibold">
                          {disc.poll.totalVotes} votes
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setActiveView('discussions');
                          setExpandedDiscussionId(disc.id);
                        }}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Debate & Responses ({disc.comments.length})</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => upvoteDiscussion(disc.id)}
                          className={`min-h-[36px] px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            disc.isUpvoted
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${disc.isUpvoted ? 'fill-emerald-800' : ''}`} />
                          <span className="tabular-nums font-mono">{disc.upvotes}</span>
                        </button>

                        <button
                          onClick={() => handleShare(disc)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Share Poll"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            const saved = toggleBookmark({
                              itemId: disc.id,
                              type: 'discussion',
                              title: disc.title,
                              snippet: disc.poll?.question || disc.content,
                              lga: disc.lga,
                              category: disc.category,
                              timestamp: disc.timestamp,
                              authorOrOrganizer: disc.authorName,
                            });
                            setShareToast(saved ? 'Poll saved to your list!' : 'Removed from saved list');
                            setTimeout(() => setShareToast(null), 2500);
                          }}
                          className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg transition-colors ${
                            isBookmarked(disc.id)
                              ? 'text-emerald-800 bg-emerald-50'
                              : 'text-stone-500 hover:bg-stone-100'
                          }`}
                          title="Save Poll"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(disc.id) ? 'fill-emerald-800' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Political & Civic Tech Feature Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white p-4 sm:p-5 rounded-2xl border border-emerald-800/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                  <Vote className="w-5 h-5 text-amber-400" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-bold flex items-center gap-2">
                    <span>Ward-Level Budget Tracker & Civic Tech Center</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-400 text-stone-950 font-mono font-extrabold">
                      NEW
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 max-w-xl">
                    Track capital projects across Idanre's 10 wards & Ifedore's 10 wards. Verify representatives, locate polling units, and counter election misinformation.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('civic-tech')}
                className="min-h-[40px] px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
              >
                <span>Explore Civic Hub</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Header & Action Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
                  Community Discussions
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                  Deliberate on local governance, agricultural value chains, eco-tourism at Oke Idanre, and shared progress for Idanre & Ifedore youth.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <button
                  onClick={() => {
                    setAttachPoll(true);
                    setIsNewModalOpen(true);
                  }}
                  className="min-h-[44px] px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <BarChart2 className="w-4 h-4 text-emerald-700" />
                  <span>Create Poll</span>
                </button>

                <button
                  onClick={() => {
                    setAttachPoll(false);
                    setIsNewModalOpen(true);
                  }}
                  className="min-h-[44px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Discussion</span>
                </button>
              </div>
            </div>

            {/* Local Weather Widget for Idanre & Ifedore (Mobile/Tablet view) */}
            <div className="block lg:hidden">
              <WeatherWidget initialTown={selectedLGA === 'Ifedore' ? 'ifedore' : 'idanre'} />
            </div>

      {/* Search & Sorting Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search topics, keywords, polls, or tags..."
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative inline-flex items-center w-full sm:w-auto">
              <label htmlFor="sort-dropdown" className="sr-only">
                Sort community posts
              </label>
              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 bg-white border border-stone-200 hover:border-stone-300 rounded-xl px-3 py-2 shadow-2xs transition-colors">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span className="text-xs text-stone-500 font-medium shrink-0">Sort:</span>
                </div>
                <div className="relative flex items-center">
                  <select
                    id="sort-dropdown"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as DiscussionSortOption)}
                    aria-label="Sort community posts by"
                    className="bg-transparent text-xs font-semibold text-stone-800 pr-5 focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="latest">Latest</option>
                    <option value="popular">Most Popular</option>
                    <option value="unanswered">
                      Unanswered {totalUnansweredCount > 0 ? `(${totalUnansweredCount})` : ''}
                    </option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Horizontal Segmented Filter (Allowed interactive buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => {
            const isPollsCat = cat === 'Polls';
            const pollsCount = discussions.filter(d => Boolean(d.poll)).length;
            const label = isPollsCat ? `Polls (${pollsCount})` : cat;

            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  categoryFilter === cat
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {isPollsCat && <BarChart2 className="w-3 h-3 text-emerald-500" />}
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Non-default Sort Info Banner */}
        {sortBy === 'unanswered' && (
          <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2 min-w-0">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="truncate sm:whitespace-normal">
                Sorting by <strong>Unanswered</strong>: Discover discussions awaiting young voices and community answers.
              </p>
            </div>
            <button
              onClick={() => setSortBy('latest')}
              className="text-amber-800 hover:text-amber-950 font-semibold underline text-[11px] shrink-0"
            >
              Reset to Latest
            </button>
          </div>
        )}

        {sortBy === 'popular' && (
          <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2 min-w-0">
              <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="truncate sm:whitespace-normal">
                Sorting by <strong>Most Popular</strong>: Top upvoted and most active discussions in Idanre & Ifedore.
              </p>
            </div>
            <button
              onClick={() => setSortBy('latest')}
              className="text-emerald-800 hover:text-emerald-950 font-semibold underline text-[11px] shrink-0"
            >
              Reset to Latest
            </button>
          </div>
        )}
      </div>

      {/* Discussions Feed */}
      <div className="space-y-4">
        {filteredDiscussions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-stone-800">No discussions found</h3>
            <p className="text-xs text-stone-500 mt-1">
              {sortBy === 'unanswered'
                ? 'All discussions matching this filter currently have replies!'
                : `Be the first to raise a question or perspective for ${selectedLGA === 'All' ? 'Idanre & Ifedore' : `${selectedLGA} LGA`}!`}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {sortBy !== 'latest' && (
                <button
                  onClick={() => setSortBy('latest')}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl"
                >
                  Reset Sort to Latest
                </button>
              )}
              <button
                onClick={() => setIsNewModalOpen(true)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl"
              >
                Start New Topic
              </button>
            </div>
          </div>
        ) : (
          filteredDiscussions.map(disc => {
            const isExpanded = expandedDiscussionId === disc.id;

            return (
              <article
                key={disc.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 transition-shadow hover:shadow-xs"
              >
                {/* Zero-Pill Unboxed Metadata Header */}
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 flex-wrap">
                  <span className="font-semibold text-emerald-900">{disc.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-700">{disc.lga === 'Both' ? 'Idanre & Ifedore' : `${disc.lga} LGA`}</span>
                  <span aria-hidden="true">·</span>
                  <span>{disc.timestamp}</span>
                  {disc.isPinned && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-700 font-medium">Pinned Civic Topic</span>
                    </>
                  )}
                  {disc.commentsCount === 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-800 font-semibold inline-flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded text-[11px]">
                        <HelpCircle className="w-3 h-3 text-amber-600" />
                        Unanswered
                      </span>
                    </>
                  )}
                  {sortBy === 'popular' && disc.upvotes >= 40 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-800 font-medium inline-flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                        High Engagement
                      </span>
                    </>
                  )}
                  {disc.poll && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-800 font-semibold inline-flex items-center gap-1">
                        <BarChart2 className="w-3 h-3 text-emerald-700" />
                        Poll ({disc.poll.totalVotes} votes)
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                  {disc.title}
                </h2>

                {/* Content */}
                <p className="text-stone-700 text-xs sm:text-sm mt-2.5 leading-relaxed">
                  {disc.content}
                </p>

                {/* Community Poll Widget */}
                {disc.poll && (
                  <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <BarChart2 className="w-4 h-4 text-emerald-700" />
                        <span>Community Feedback Poll</span>
                      </div>
                      <span className="font-mono tabular-nums text-[11px] text-stone-600">
                        {disc.poll.totalVotes} total vote{disc.poll.totalVotes === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm font-semibold text-stone-900">
                      {disc.poll.question}
                    </div>

                    {/* Poll Options */}
                    <div className="space-y-2 pt-1">
                      {disc.poll.options.map(opt => {
                        const hasVoted = Boolean(disc.poll?.userVotedOptionId);
                        const isUserChoice = disc.poll?.userVotedOptionId === opt.id;
                        const percentage =
                          disc.poll && disc.poll.totalVotes > 0
                            ? Math.round((opt.votesCount / disc.poll.totalVotes) * 100)
                            : 0;

                        return (
                          <button
                            key={opt.id}
                            onClick={() => {
                              votePoll(disc.id, opt.id);
                              setShareToast(`Vote recorded for "${opt.text.slice(0, 24)}..."`);
                              setTimeout(() => setShareToast(null), 2500);
                            }}
                            className={`w-full relative overflow-hidden rounded-xl border p-2.5 sm:p-3 text-left transition-all group ${
                              isUserChoice
                                ? 'border-emerald-700 bg-emerald-50/70 font-semibold text-emerald-950 ring-1 ring-emerald-700/40'
                                : 'border-stone-200 bg-white hover:bg-stone-50/80 text-stone-800'
                            }`}
                          >
                            {/* Visual background progress fill when user has voted or totalVotes > 0 */}
                            {hasVoted && (
                              <div
                                className={`absolute inset-y-0 left-0 transition-all duration-500 pointer-events-none ${
                                  isUserChoice ? 'bg-emerald-200/60' : 'bg-stone-100/90'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            )}

                            <div className="relative z-10 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] ${
                                    isUserChoice
                                      ? 'border-emerald-700 bg-emerald-700 text-white'
                                      : 'border-stone-300 text-transparent group-hover:border-stone-400'
                                  }`}
                                >
                                  ✓
                                </span>
                                <span className="truncate">{opt.text}</span>
                              </div>

                              {hasVoted && (
                                <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] tabular-nums">
                                  <span className="text-stone-500">{opt.votesCount}</span>
                                  <span className="font-bold text-stone-800">{percentage}%</span>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                      <span>
                        {disc.poll.userVotedOptionId
                          ? 'Your feedback is recorded · Tap another option to change vote'
                          : 'Tap an option to participate and earn +10 community points'}
                      </span>
                      {disc.poll.userVotedOptionId && (
                        <span className="text-emerald-800 font-semibold">Voted</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags (Unboxed with typographic #) */}
                {disc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs text-emerald-800 font-mono mt-3">
                    {disc.tags.map(t => (
                      <span key={t}>#{t}</span>
                    ))}
                  </div>
                )}

                {/* Footer Controls & Author */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2 text-stone-600">
                    <span className="font-semibold text-stone-900">{disc.authorName}</span>
                    <span className="text-stone-400">@{disc.authorUsername}</span>
                    <span className="text-[11px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                      {disc.authorLga}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Upvote Button */}
                    <button
                      onClick={() => upvoteDiscussion(disc.id)}
                      className={`min-h-[40px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                        disc.isUpvoted
                          ? 'bg-emerald-100 text-emerald-900 font-bold'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${disc.isUpvoted ? 'fill-emerald-800' : ''}`} />
                      <span className="font-mono tabular-nums">{disc.upvotes}</span>
                    </button>

                    {/* Toggle Comments Button */}
                    <button
                      onClick={() =>
                        setExpandedDiscussionId(isExpanded ? null : disc.id)
                      }
                      className={`min-h-[40px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                        disc.commentsCount === 0
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-semibold'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="font-mono tabular-nums">{disc.commentsCount}</span>
                      <span className="hidden sm:inline">
                        {disc.commentsCount === 0 ? 'Be first to reply' : 'Comments'}
                      </span>
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => {
                        const saved = toggleBookmark({
                          itemId: disc.id,
                          type: 'discussion',
                          title: disc.title,
                          snippet: disc.content,
                          lga: disc.lga,
                          category: disc.category,
                          timestamp: disc.timestamp,
                          authorOrOrganizer: disc.authorName,
                        });
                        setShareToast(saved ? 'Discussion saved to your personal list!' : 'Removed from saved list');
                        setTimeout(() => setShareToast(null), 2500);
                      }}
                      title={isBookmarked(disc.id) ? 'Saved' : 'Save discussion'}
                      aria-label={isBookmarked(disc.id) ? 'Saved' : 'Save discussion'}
                      className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg transition-colors ${
                        isBookmarked(disc.id)
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(disc.id) ? 'fill-emerald-800' : ''}`} />
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(disc)}
                      aria-label="Share discussion"
                      className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Thread Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-stone-200/80 space-y-3">
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Community Responses ({disc.comments.length})
                    </h3>

                    {disc.comments.length === 0 ? (
                      <p className="text-xs text-stone-500 py-2">
                        No responses yet. Share your thoughts or solution proposal!
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {disc.comments.map(c => (
                          <div
                            key={c.id}
                            className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs"
                          >
                            <div className="flex items-center justify-between text-stone-500 mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-stone-900">{c.authorName}</span>
                                <span className="text-[10px] bg-stone-200/80 px-1 py-0.2 rounded text-stone-700">
                                  {c.authorLga}
                                </span>
                              </div>
                              <span className="text-[10px] text-stone-400">{c.timestamp}</span>
                            </div>
                            <p className="text-stone-700 leading-relaxed">{c.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Input */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={commentInputs[disc.id] || ''}
                        onChange={e =>
                          setCommentInputs(prev => ({ ...prev, [disc.id]: e.target.value }))
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') submitComment(disc.id);
                        }}
                        placeholder={`Reply as @${user.username} (${user.community})...`}
                        className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                      <button
                        onClick={() => submitComment(disc.id)}
                        className="min-h-[40px] px-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
          </div>

          {/* Sidebar Column: Local Weather Widget & Community Leaderboard */}
          <div className="lg:col-span-4 space-y-6">
            <WeatherWidget initialTown={selectedLGA === 'Ifedore' ? 'ifedore' : 'idanre'} />
            <CommunityLeaderboard
              variant="compact"
              onNavigateToDiscussions={() => setActiveView('leaderboard')}
              onOpenCheckIn={() => setIsCheckInModalOpen(true)}
            />
          </div>
        </div>
      )}

      {/* New Discussion Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsNewModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsNewModalOpen(false)}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-stone-900 mb-1">
              Start a Community Discussion
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Bring up ideas for youth empowerment, infrastructure, farming, tourism, or education in Idanre & Ifedore.
            </p>

            <form onSubmit={handleCreateDiscussion} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-stone-700">Topic Title</label>
                  <button
                    type="button"
                    onClick={handleAiAssist}
                    disabled={aiLoading}
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {aiLoading ? 'Thinking...' : 'AI Civic Advisor'}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. How can we organize a youth farmers seed exchange in Atosin?"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                />
              </div>

              {aiSuggestions && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-stone-800 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-amber-900 text-[11px]">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Suggested Talking Points:
                  </div>
                  <p className="whitespace-pre-line text-[11px] leading-relaxed text-stone-700">
                    {aiSuggestions}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Pillar Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as Discussion['category'])}
                    className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                  >
                    <option value="Agribusiness">Agribusiness & Cocoa</option>
                    <option value="Tourism & Culture">Tourism & Culture</option>
                    <option value="Governance">Governance & Civic</option>
                    <option value="Education & Tech">Education & Tech</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Sports">Youth Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Target Area</label>
                  <select
                    value={newLga}
                    onChange={e => setNewLga(e.target.value as Discussion['lga'])}
                    className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                  >
                    <option value="Both">Both (Idanre & Ifedore)</option>
                    <option value="Idanre">Idanre LGA only</option>
                    <option value="Ifedore">Ifedore LGA only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Discussion Detail & Context
                </label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Explain the background, challenge, or practical solution you would like youth to debate..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTagInput}
                  onChange={e => setNewTagInput(e.target.value)}
                  placeholder="Cocoa, SolarPower, YouthVenture"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                />
              </div>

              {/* Community Poll Attachment Section */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <BarChart2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Community Poll</div>
                      <div className="text-[11px] text-stone-500">Collect votes and feedback from local youth</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAttachPoll(!attachPoll)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      attachPoll
                        ? 'bg-emerald-800 text-white'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {attachPoll ? 'Poll Attached ✓' : '+ Attach Poll'}
                  </button>
                </div>

                {attachPoll && (
                  <div className="space-y-3 pt-3 border-t border-stone-200/70">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Poll Question (Optional - defaults to topic title)
                      </label>
                      <input
                        type="text"
                        value={pollQuestion}
                        onChange={e => setPollQuestion(e.target.value)}
                        placeholder="e.g. Which project should our youth coalition prioritize?"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-stone-700">
                          Voting Options (Min 2, Max 5)
                        </label>
                        <span className="text-[11px] font-mono text-stone-400">
                          {pollOptions.length}/5 options
                        </span>
                      </div>

                      <div className="space-y-2">
                        {pollOptions.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-xs font-mono text-stone-400 w-4 text-center shrink-0">
                              {idx + 1}.
                            </span>
                            <input
                              type="text"
                              required={attachPoll && idx < 2}
                              value={opt}
                              onChange={e => handleUpdatePollOption(idx, e.target.value)}
                              placeholder={
                                idx === 0
                                  ? 'e.g. Solar-powered crop drying hub'
                                  : idx === 1
                                  ? 'e.g. Youth digital innovation co-working space'
                                  : `Option ${idx + 1}...`
                              }
                              className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            />
                            {pollOptions.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePollOption(idx)}
                                className="min-h-[32px] min-w-[32px] flex items-center justify-center text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                title="Remove option"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {pollOptions.length < 5 && (
                        <button
                          type="button"
                          onClick={handleAddPollOption}
                          className="mt-2.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Option
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  {attachPoll ? 'Publish Poll & Topic (+35 pts)' : 'Publish & Earn +25 pts'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
