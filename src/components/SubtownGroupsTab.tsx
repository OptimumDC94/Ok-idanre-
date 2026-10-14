import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubtownGroup } from '../types';
import { Users, MapPin, Calendar, CheckCircle2, Plus, MessageSquare, Shield, Sparkles, Building2, Search, ArrowRight, Share2 } from 'lucide-react';

export const SubtownGroupsTab: React.FC = () => {
  const { subtowns = [], toggleJoinSubtownGroup, addSubtownMessage, selectedLGA, setSelectedLGA } = useApp() as any;
  const [filterLGA, setFilterLGA] = useState<'All' | 'Idanre' | 'Ifedore'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubtown, setSelectedSubtown] = useState<SubtownGroup | null>(null);
  const [newMessageContent, setNewMessageContent] = useState('');

  const filteredSubtowns = subtowns.filter((sub: SubtownGroup) => {
    const matchesLga = filterLGA === 'All' || sub.lga === filterLGA;
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subtown.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLga && matchesSearch;
  });

  const handleSendMessage = (e: React.FormEvent, subtownId: string) => {
    e.preventDefault();
    if (!newMessageContent.trim()) return;
    addSubtownMessage(subtownId, newMessageContent);
    setNewMessageContent('');
    // Update local selectedSubtown state as well
    const updated = subtowns.find((s: SubtownGroup) => s.id === subtownId);
    if (updated) {
      setSelectedSubtown(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-emerald-700/50">
            <Building2 className="w-3.5 h-3.5" />
            <span>Idanre & Ifedore Subtown Chapters</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Local Community Groups & Subtown Hubs
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Connect directly with fellow youth and elders in your specific subtown—from Odode and Oke Idanre to Igbara-Oke, Ilara-Mokin, and Ijare. Join local development meetings, coordinate agricultural projects, and build community power locally.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setFilterLGA('All')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filterLGA === 'All'
                  ? 'bg-white text-emerald-950 shadow-md'
                  : 'bg-emerald-800/60 text-white hover:bg-emerald-800'
              }`}
            >
              All Subtowns ({subtowns.length})
            </button>
            <button
              onClick={() => setFilterLGA('Idanre')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filterLGA === 'Idanre'
                  ? 'bg-white text-emerald-950 shadow-md'
                  : 'bg-emerald-800/60 text-white hover:bg-emerald-800'
              }`}
            >
              Idanre Subtowns
            </button>
            <button
              onClick={() => setFilterLGA('Ifedore')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filterLGA === 'Ifedore'
                  ? 'bg-white text-emerald-950 shadow-md'
                  : 'bg-emerald-800/60 text-white hover:bg-emerald-800'
              }`}
            >
              Ifedore Subtowns
            </button>
          </div>
        </div>
      </div>

      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-stone-900 p-4 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subtowns (e.g. Odode, Igbara-Oke, Alade)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="text-xs text-stone-500 dark:text-stone-400">
          Showing <span className="font-bold text-stone-800 dark:text-stone-200">{filteredSubtowns.length}</span> active chapters
        </div>
      </div>

      {/* Subtown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubtowns.map((sub: SubtownGroup) => (
          <div
            key={sub.id}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
          >
            <div className="relative h-36 overflow-hidden bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 relative z-10">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${
                  sub.lga === 'Idanre' ? 'bg-amber-600' : 'bg-teal-700'
                }`}>
                  {sub.lga} LGA
                </span>
                <span className="bg-white/10 text-stone-200 px-2 py-0.5 rounded text-xs font-mono">
                  {sub.subtown}
                </span>
              </div>
              <div className="text-white relative z-10">
                <h3 className="text-base font-bold leading-snug truncate">{sub.name}</h3>
                <p className="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{sub.memberCount} active members</span>
                </p>
              </div>
              <Building2 className="w-20 h-20 text-white/10 absolute -right-3 -bottom-3 pointer-events-none" />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-stone-600 dark:text-stone-300 text-xs line-clamp-2 leading-relaxed">
                {sub.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{sub.meetingLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{sub.meetingTime}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => toggleJoinSubtownGroup(sub.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    sub.isJoined
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  }`}
                >
                  {sub.isJoined ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Joined Chapter</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Join Chapter</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedSubtown(sub)}
                  className="px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>({sub.messages?.length || 0})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subtown Detail & Discussion Modal */}
      {selectedSubtown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col">
            <div className="relative p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white flex flex-col justify-between overflow-hidden">
              <button
                onClick={() => setSelectedSubtown(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors z-20"
                aria-label="Close modal"
              >
                ✕
              </button>
              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                    selectedSubtown.lga === 'Idanre' ? 'bg-amber-600' : 'bg-teal-700'
                  }`}>
                    {selectedSubtown.lga} LGA
                  </span>
                  <span className="text-stone-300 font-mono text-xs">{selectedSubtown.subtown} Chapter</span>
                </div>
                <h2 className="text-2xl font-bold">{selectedSubtown.name}</h2>
              </div>
              <Building2 className="w-24 h-24 text-white/10 absolute -right-4 -bottom-4 pointer-events-none" />
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div>
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">About Chapter</h4>
                <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
                  {selectedSubtown.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
                <div>
                  <span className="text-xs text-stone-400">Chapter Leader</span>
                  <p className="font-semibold text-stone-800 dark:text-stone-200 text-sm">{selectedSubtown.leaderName}</p>
                </div>
                <div>
                  <span className="text-xs text-stone-400">Total Members</span>
                  <p className="font-semibold text-stone-800 dark:text-stone-200 text-sm">{selectedSubtown.memberCount} youth & elders</p>
                </div>
                <div>
                  <span className="text-xs text-stone-400">Meeting Venue</span>
                  <p className="font-semibold text-stone-800 dark:text-stone-200 text-sm">{selectedSubtown.meetingLocation}</p>
                </div>
                <div>
                  <span className="text-xs text-stone-400">Schedule</span>
                  <p className="font-semibold text-stone-800 dark:text-stone-200 text-sm">{selectedSubtown.meetingTime}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Active Subtown Projects</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSubtown.activeProjects.map((proj, idx) => (
                    <span key={idx} className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl text-xs font-medium">
                      ✓ {proj}
                    </span>
                  ))}
                </div>
              </div>

              {/* Discussion / Chat Stream */}
              <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Subtown Discussion & Updates</h4>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {selectedSubtown.messages && selectedSubtown.messages.length > 0 ? (
                    selectedSubtown.messages.map((msg: any) => (
                      <div key={msg.id} className="bg-stone-50 dark:bg-stone-800 p-3 rounded-2xl border border-stone-100 dark:border-stone-700 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-900 dark:text-stone-100">{msg.authorName}</span>
                          <span className="text-stone-400">{msg.timestamp}</span>
                        </div>
                        <p className="text-stone-700 dark:text-stone-300 text-xs">{msg.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-400 text-xs italic py-4 text-center">No messages yet in this subtown group. Be the first to post an update!</p>
                  )}
                </div>

                <form onSubmit={(e) => handleSendMessage(e, selectedSubtown.id)} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    placeholder="Post a message to your subtown chapter..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <button
                onClick={() => toggleJoinSubtownGroup(selectedSubtown.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedSubtown.isJoined
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                }`}
              >
                {selectedSubtown.isJoined ? '✓ Joined Chapter' : 'Join This Chapter'}
              </button>

              <button
                onClick={() => setSelectedSubtown(null)}
                className="px-4 py-2.5 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
