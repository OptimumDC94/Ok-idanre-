import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmergencyContact } from '../types';
import {
  ShieldAlert,
  PhoneCall,
  Search,
  MapPin,
  Clock,
  Copy,
  Check,
  Building2,
  AlertTriangle,
  HeartPulse,
  Flame,
  Shield,
  X,
} from 'lucide-react';

export const EmergencyTab: React.FC = () => {
  const { emergencyContacts, selectedLGA } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const categories = [
    'All',
    'Emergency Helpline',
    'Police & Security',
    'Primary Healthcare',
    'Fire Service',
  ];

  const filteredContacts = emergencyContacts.filter(c => {
    if (selectedLGA !== 'All' && c.lga !== 'Both' && c.lga !== selectedLGA) return false;
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  const getCategoryIcon = (cat: EmergencyContact['category']) => {
    switch (cat) {
      case 'Police & Security':
        return <Shield className="w-5 h-5 text-blue-700" />;
      case 'Primary Healthcare':
        return <HeartPulse className="w-5 h-5 text-rose-700" />;
      case 'Fire Service':
        return <Flame className="w-5 h-5 text-amber-600" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-emerald-800" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Alert Banner */}
      <div className="bg-gradient-to-r from-rose-900 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-rose-800/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-800/80 border border-rose-700/60 rounded-full text-xs font-semibold text-rose-200 mb-3 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>24/7 Rapid Response Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Emergency & Help Directory
          </h1>
          <p className="text-sm text-rose-100 mt-2 leading-relaxed">
            Quick-access verified helpline numbers, primary health centers, police divisions, and fire service emergency contacts across all wards of Idanre and Ifedore LGAs.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <a
            href="tel:07004445555"
            className="min-h-[48px] px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-lg transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4 stroke-[2.5]" />
            <span>Call Youth Emergency Hotlines</span>
          </a>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search hospitals, police stations, security lines, or locations..."
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-700 transition-colors shadow-2xs"
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

        {/* Category Horizontal Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                categoryFilter === cat
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0">
                    {getCategoryIcon(contact.category)}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
                      {contact.category}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 leading-snug">
                      {contact.title}
                    </h3>
                  </div>
                </div>
                <span className="shrink-0 text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">
                  {contact.lga === 'Both' ? 'Idanre & Ifedore' : `${contact.lga} LGA`}
                </span>
              </div>

              <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                {contact.description}
              </p>

              <div className="grid grid-cols-2 gap-2 bg-stone-50 border border-stone-100 rounded-xl p-3 mb-4 text-xs">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{contact.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{contact.hours}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
              <div className="font-mono font-bold text-stone-900 text-sm">
                {contact.phone}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyPhone(contact.phone)}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedPhone === contact.phone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-emerald-800">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
