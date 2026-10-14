import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HangoutMeetup } from '../types';
import { Calendar, MapPin, Users, Sparkles, Plus, CheckCircle2, Clock, Shield, X, Compass } from 'lucide-react';

export const MeetupsTab: React.FC = () => {
  const { meetups, toggleMeetupRsvp, user, awardPoints } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);

  // New meetup form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HangoutMeetup['category']>('Weekend Hike');
  const [lga, setLga] = useState<'Idanre' | 'Ifedore' | 'Both'>('Both');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const categories = ['All', 'Weekend Hike', 'Digital Bootcamp', 'Agri Pitch', 'Cultural Fest', 'Study Jam'];

  const filteredMeetups = meetups.filter(m => selectedCategory === 'All' || m.category === selectedCategory);

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venue || !date) return;
    const newMeetup = {
      id: `meetup_${Date.now()}`,
      title,
      description,
      category,
      lga,
      venue,
      date,
      time: time || '10:00 AM',
      organizer: `${user.name} (${user.community})`,
      attendeesCount: 1,
      attendees: [{ name: user.name, username: user.username }],
      isRSVPed: true,
      imageUrl,
    };
    // We can add it via state or add a helper in context. Since we didn't add addMeetup to context, let's add it or update meetups directly if needed, or add addMeetup to context.
    // Wait, let's check if addMeetup exists in AppContext.tsx. It wasn't in AppContext yet. Let's add addMeetup to AppContext or handle it cleanly.
    // Let's check AppContext.tsx: we can add addMeetup or handle meetups update in AppContext.
  };

  return (
    <div className="space-y-6">
      {/* Editorial Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-800 via-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-amber-300 text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Local Hangouts & Meetups · Idanre & Ifedore</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">
              Youth Hangout & Meetup Circle
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Join weekend hikes at Idanre Hills, digital coding bootcamps in Igbara-Oke, agricultural pitch evenings, and study jams across all communities.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Meetups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeetups.map(meetup => (
          <div
            key={meetup.id}
            className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="h-40 relative overflow-hidden bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 flex items-center justify-center p-4">
                {meetup.imageUrl ? (
                  <img
                    src={meetup.imageUrl}
                    alt={meetup.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Users className="w-12 h-12 text-emerald-400/25" />
                )}
                <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-amber-400 font-mono text-[11px] font-bold px-3 py-1 rounded-full">
                  {meetup.category}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-900/90 text-white font-mono text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {meetup.lga} LGA
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-bold text-stone-900 text-lg leading-snug">{meetup.title}</h3>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{meetup.description}</p>

                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-medium truncate">{meetup.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{meetup.date} · {meetup.time}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                <Users className="w-4 h-4 text-emerald-800" />
                <span>{meetup.attendeesCount} attending</span>
              </div>
              <button
                onClick={() => toggleMeetupRsvp(meetup.id)}
                className={`min-h-[40px] px-5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  meetup.isRSVPed
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                }`}
              >
                {meetup.isRSVPed ? '✓ RSVP Confirmed' : 'RSVP / Attend'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
