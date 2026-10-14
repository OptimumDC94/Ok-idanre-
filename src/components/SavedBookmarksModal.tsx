import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookmarkItem } from '../types';
import {
  Bookmark,
  X,
  Trash2,
  ExternalLink,
  MessageSquare,
  Newspaper,
  Calendar,
  Search,
  Check,
} from 'lucide-react';

export const SavedBookmarksModal: React.FC = () => {
  const {
    isSavedModalOpen,
    setIsSavedModalOpen,
    bookmarks,
    removeBookmark,
    setActiveTab,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'discussion' | 'update' | 'event'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isSavedModalOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredBookmarks = bookmarks.filter(b => {
    if (activeFilter !== 'all' && b.type !== activeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.snippet.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getIcon = (type: BookmarkItem['type']) => {
    switch (type) {
      case 'discussion':
        return <MessageSquare className="w-4 h-4 text-emerald-700" />;
      case 'update':
        return <Newspaper className="w-4 h-4 text-sky-700" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-amber-700" />;
      default:
        return <Bookmark className="w-4 h-4 text-stone-700" />;
    }
  };

  const handleNavigate = (item: BookmarkItem) => {
    setIsSavedModalOpen(false);
    if (item.type === 'discussion') {
      setActiveTab('discussions');
    } else if (item.type === 'update') {
      setActiveTab('updates');
    } else if (item.type === 'event') {
      setActiveTab('events');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
        onClick={() => setIsSavedModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-emerald-800 text-emerald-800" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Personal Saved List</h2>
              <p className="text-xs text-stone-500">
                {bookmarks.length} saved item{bookmarks.length === 1 ? '' : 's'} for quick reference
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSavedModalOpen(false)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="pt-3 pb-2 space-y-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter saved items by keyword..."
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {[
              { id: 'all', label: `All (${bookmarks.length})` },
              { id: 'discussion', label: `Discussions (${bookmarks.filter(b => b.type === 'discussion').length})` },
              { id: 'update', label: `Updates (${bookmarks.filter(b => b.type === 'update').length})` },
              { id: 'event', label: `Events (${bookmarks.filter(b => b.type === 'event').length})` },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeFilter === f.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 py-2 space-y-2 pr-1">
          {filteredBookmarks.length === 0 ? (
            <div className="py-14 text-center text-stone-500">
              <Bookmark className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-800">No saved items found</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Tap the bookmark icon on any discussion thread, announcement, or community event to save it here!
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setIsSavedModalOpen(false);
                    setActiveTab('discussions');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold"
                >
                  Explore Discussions
                </button>
                <button
                  onClick={() => {
                    setIsSavedModalOpen(false);
                    setActiveTab('events');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 text-xs font-semibold"
                >
                  Browse Events
                </button>
              </div>
            </div>
          ) : (
            filteredBookmarks.map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-stone-100 hover:border-stone-200 bg-stone-50/50 hover:bg-white transition-all space-y-2 text-left"
              >
                {/* Unboxed Metadata Header */}
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    {getIcon(item.type)}
                    <span className="font-semibold capitalize text-stone-800">{item.type}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-900 font-medium">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.lga === 'Both' ? 'Idanre & Ifedore' : `${item.lga} LGA`}</span>
                  </div>

                  <span className="text-[10px] text-stone-400">{item.savedAt}</span>
                </div>

                {/* Content */}
                <div>
                  <h4 className="text-sm font-bold text-stone-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-100/80">
                  <span className="text-[11px] text-stone-400">
                    {item.authorOrOrganizer && `By ${item.authorOrOrganizer}`}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleNavigate(item)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open
                    </button>

                    <button
                      onClick={() => {
                        removeBookmark(item.itemId);
                        showToast('Removed from saved list');
                      }}
                      title="Remove bookmark"
                      className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      aria-label="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
