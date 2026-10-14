import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CommunityUpdate } from '../types';
import { IDANRE_IMAGE, YOUTH_IMAGE, VOLUNTEER_IMAGE, CULTURE_IMAGE } from '../data/initialData';
import {
  Newspaper,
  Heart,
  Share2,
  Plus,
  Image as ImageIcon,
  Check,
  X,
  Megaphone,
  Bookmark,
} from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';

export const UpdatesTab: React.FC = () => {
  const { updates, likeUpdate, addUpdate, selectedLGA, user, toggleBookmark, isBookmarked } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // New update form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityUpdate['category']>('Youth News');
  const [newLga, setNewLga] = useState<CommunityUpdate['lga']>('Both');
  const [selectedImagePreset, setSelectedImagePreset] = useState<string>(YOUTH_IMAGE);

  const categories = [
    'All',
    'Official Announcement',
    'Youth News',
    'Development Progress',
    'Cultural Heritage',
  ];

  const imagePresets = [
    { label: 'Youth Forum', url: YOUTH_IMAGE },
    { label: 'Oke Idanre Hills', url: IDANRE_IMAGE },
    { label: 'Community Tree Planting', url: VOLUNTEER_IMAGE },
    { label: 'Cultural Arts', url: CULTURE_IMAGE },
  ];

  const filteredUpdates = updates.filter(upd => {
    if (selectedLGA !== 'All' && upd.lga !== 'Both' && upd.lga !== selectedLGA) {
      return false;
    }
    if (categoryFilter !== 'All' && upd.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addUpdate(newTitle.trim(), newContent.trim(), newCategory, newLga, selectedImagePreset);
    setNewTitle('');
    setNewContent('');
    setIsPublishModalOpen(false);
  };

  const handleShare = (upd: CommunityUpdate) => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast(`Copied link to "${upd.title.slice(0, 30)}..."`);
    setTimeout(() => setShareToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {shareToast && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
            Community Updates & Bulletins
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            Stay informed with verified news, local announcements, development milestones, and youth stories across Idanre and Ifedore.
          </p>
        </div>

        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="min-h-[44px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Publish Update
        </button>
      </div>

      {/* Local Weather Banner */}
      <WeatherWidget variant="banner" initialTown={selectedLGA === 'Ifedore' ? 'ifedore' : 'idanre'} />

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Updates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUpdates.map(upd => (
          <article
            key={upd.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col hover:shadow-xs transition-shadow"
          >
            {/* Visual Header Image */}
            {upd.imageUrl && (
              <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden">
                <img
                  src={upd.imageUrl}
                  alt={upd.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  {upd.category}
                </div>
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                {/* Zero-Pill Unboxed Metadata */}
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-emerald-900">{upd.publisher}</span>
                  <span aria-hidden="true">·</span>
                  <span>{upd.lga === 'Both' ? 'Idanre & Ifedore' : `${upd.lga} LGA`}</span>
                  <span aria-hidden="true">·</span>
                  <span>{upd.timestamp}</span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                  {upd.title}
                </h2>

                <p className="text-stone-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
                  {upd.content}
                </p>
              </div>

              {/* Action Bar */}
              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="text-[11px] text-stone-400">{upd.publisherRole}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => likeUpdate(upd.id)}
                    className={`min-h-[40px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                      upd.isLiked
                        ? 'bg-rose-50 text-rose-700 font-bold'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${upd.isLiked ? 'fill-rose-600' : ''}`} />
                    <span className="font-mono tabular-nums">{upd.likes}</span>
                  </button>

                  <button
                    onClick={() => {
                      const saved = toggleBookmark({
                        itemId: upd.id,
                        type: 'update',
                        title: upd.title,
                        snippet: upd.content,
                        lga: upd.lga,
                        category: upd.category,
                        timestamp: upd.timestamp,
                        authorOrOrganizer: upd.publisher,
                        imageUrl: upd.imageUrl,
                      });
                      setShareToast(saved ? 'Update saved to your personal list!' : 'Removed from saved list');
                      setTimeout(() => setShareToast(null), 2500);
                    }}
                    title={isBookmarked(upd.id) ? 'Saved' : 'Save update'}
                    aria-label={isBookmarked(upd.id) ? 'Saved' : 'Save update'}
                    className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg transition-colors ${
                      isBookmarked(upd.id)
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(upd.id) ? 'fill-emerald-800' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleShare(upd)}
                    aria-label="Share update"
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Publish Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsPublishModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsPublishModalOpen(false)}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-stone-900 mb-1">
              Publish Community Announcement
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Share verified community announcements, youth initiatives, or important news with members.
            </p>

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Title / Headline</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Free Eye Screening & Health Camp at Odode Health Center"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as CommunityUpdate['category'])}
                    className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Official Announcement">Official Announcement</option>
                    <option value="Youth News">Youth News</option>
                    <option value="Development Progress">Development Progress</option>
                    <option value="Cultural Heritage">Cultural Heritage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Target Coverage</label>
                  <select
                    value={newLga}
                    onChange={e => setNewLga(e.target.value as CommunityUpdate['lga'])}
                    className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Both">Both (Idanre & Ifedore)</option>
                    <option value="Idanre">Idanre LGA only</option>
                    <option value="Ifedore">Ifedore LGA only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Announcement Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Provide date, venue, organizer details, and context..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-2">
                  Select Visual Graphic
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {imagePresets.map(preset => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setSelectedImagePreset(preset.url)}
                      className={`relative aspect-16/9 rounded-lg overflow-hidden border-2 text-left ${
                        selectedImagePreset === preset.url
                          ? 'border-emerald-700 ring-2 ring-emerald-700/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 bg-stone-900/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Publish & Earn +20 pts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
