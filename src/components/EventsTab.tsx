import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CommunityEvent } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Bell,
  CheckCircle2,
  Users,
  Plus,
  Share2,
  CalendarPlus,
  X,
  Check,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  CalendarDays,
} from 'lucide-react';

export const EventsTab: React.FC = () => {
  const { events, toggleRsvp, toggleReminder, selectedLGA, user, toggleBookmark, isBookmarked } = useApp();
  const [isOrganizeModalOpen, setIsOrganizeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'month' | 'week'>('grid');
  
  // Calendar Navigation State (Default to November 2026 based on initial event data)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 0-indexed: 10 = November
  const [selectedEventModal, setSelectedEventModal] = useState<CommunityEvent | null>(null);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityEvent['category']>('Youth Summit');
  const [newLga, setNewLga] = useState<CommunityEvent['lga']>('Both');
  const [newVenue, setNewVenue] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newImagePreset, setNewImagePreset] = useState('');

  const filteredEvents = events.filter(ev => {
    if (selectedLGA !== 'All' && ev.lga !== 'Both' && ev.lga !== selectedLGA) {
      return false;
    }
    return true;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const downloadIcs = (event: CommunityEvent) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ok Idanre Youth Network//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.venue}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Calendar invite downloaded for "${event.title}"`);
  };

  // Helper to parse date string like "Saturday, Nov 14, 2026" or "Tuesday, Nov 17, 2026"
  const parseEventDate = (dateStr: string): Date | null => {
    try {
      const cleaned = dateStr.replace(/^[A-Za-z]+,\s*/, ''); // remove weekday
      const d = new Date(cleaned);
      if (!isNaN(d.getTime())) return d;
      return null;
    } catch {
      return null;
    }
  };

  // Month Calendar Grid Calculations
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & View Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
            Community Events & Meetings
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            Discover upcoming youth forums, agribusiness workshops, mountain cleanups, town halls, and sports tournaments in Idanre and Ifedore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* View Mode Segmented Control */}
          <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 border border-stone-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-800" />
              Grid View
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-emerald-800" />
              Month Calendar
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-800" />
              Week Agenda
            </button>
          </div>

          <button
            onClick={() => setIsOrganizeModalOpen(true)}
            className="min-h-[40px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Organize Event
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map(ev => {
            const isGoing = ev.rsvpStatus === 'going';
            const isInterested = ev.rsvpStatus === 'interested';

            return (
              <article
                key={ev.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col hover:shadow-xs transition-shadow"
              >
                {ev.imageUrl && (
                  <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={ev.imageUrl}
                      alt={ev.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {ev.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-900/90 backdrop-blur-xs text-amber-300 text-[11px] font-mono px-2 py-1 rounded-md">
                      {ev.lga === 'Both' ? 'Idanre + Ifedore' : `${ev.lga} LGA`}
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                      {ev.title}
                    </h2>

                    <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                      {ev.description}
                    </p>

                    {/* Metadata Row */}
                    <div className="mt-4 space-y-2 text-xs text-stone-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-800 shrink-0" />
                        <span className="font-semibold text-stone-800">{ev.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                        <span>{ev.time}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                        <span>{ev.venue}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-mono tabular-nums font-bold text-emerald-900">{ev.attendeesCount}</span>
                        <span>youth participating</span>
                        <span aria-hidden="true">·</span>
                        <span>Organized by {ev.organizer}</span>
                      </div>
                    </div>
                  </div>

                  {/* RSVP and Action strip */}
                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleRsvp(ev.id, isGoing ? 'none' : 'going')}
                        className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          isGoing
                            ? 'bg-emerald-800 text-white'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isGoing ? 'Going' : 'RSVP Going'}
                      </button>

                      <button
                        onClick={() => toggleRsvp(ev.id, isInterested ? 'none' : 'interested')}
                        className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          isInterested
                            ? 'bg-amber-100 text-amber-900 font-bold'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                        }`}
                      >
                        {isInterested ? 'Interested' : 'Interested'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const saved = toggleBookmark({
                            itemId: ev.id,
                            type: 'event',
                            title: ev.title,
                            snippet: `${ev.date} · ${ev.venue} — ${ev.description}`,
                            lga: ev.lga,
                            category: ev.category,
                            timestamp: ev.date,
                            authorOrOrganizer: ev.organizer,
                            imageUrl: ev.imageUrl,
                          });
                          showToast(saved ? 'Event saved to your personal list!' : 'Removed from saved list');
                        }}
                        title={isBookmarked(ev.id) ? 'Saved' : 'Save event'}
                        aria-label={isBookmarked(ev.id) ? 'Saved' : 'Save event'}
                        className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition-colors ${
                          isBookmarked(ev.id)
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked(ev.id) ? 'fill-emerald-800' : ''}`} />
                      </button>

                      <button
                        onClick={() => toggleReminder(ev.id)}
                        title="Set SMS / App Reminder"
                        className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition-colors ${
                          ev.reminderSet
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                        }`}
                      >
                        <Bell className={`w-4 h-4 ${ev.reminderSet ? 'fill-amber-500 text-amber-600' : ''}`} />
                      </button>

                      <button
                        onClick={() => downloadIcs(ev)}
                        title="Add to Phone Calendar"
                        className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-600 transition-colors"
                      >
                        <CalendarPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Visual Month Calendar View */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          {/* Calendar Month Header Toolbar */}
          <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-900 font-semibold px-2.5 py-0.5 rounded-full">
                {filteredEvents.length} events scheduled
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-stone-200 rounded-lg text-stone-700 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setCurrentYear(2026);
                  setCurrentMonth(10); // November 2026
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 shadow-xs"
              >
                Jump to Nov 2026
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-stone-200 rounded-lg text-stone-700 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday Header Row */}
          <div className="grid grid-cols-7 bg-stone-100 border-b border-stone-200 text-center py-2.5 text-xs font-bold text-stone-600 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr bg-stone-200 gap-px">
            {(() => {
              const daysInMonth = getDaysInMonth(currentYear, currentMonth);
              const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
              const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;
              const cells = [];

              for (let i = 0; i < totalCells; i++) {
                const dayNum = i - firstDay + 1;
                const isCurrentMonthDay = dayNum > 0 && dayNum <= daysInMonth;

                // Match events for this date
                const dayEvents = isCurrentMonthDay ? filteredEvents.filter(ev => {
                  const evDate = parseEventDate(ev.date);
                  if (!evDate) return false;
                  return (
                    evDate.getFullYear() === currentYear &&
                    evDate.getMonth() === currentMonth &&
                    evDate.getDate() === dayNum
                  );
                }) : [];

                cells.push(
                  <div
                    key={i}
                    className={`min-h-[110px] sm:min-h-[130px] p-2 bg-white flex flex-col justify-between transition-colors ${
                      !isCurrentMonthDay ? 'bg-stone-50/60 text-stone-400' : 'text-stone-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isCurrentMonthDay && dayNum === 14 && currentMonth === 10 && currentYear === 2026
                          ? 'bg-emerald-800 text-white'
                          : ''
                      }`}>
                        {isCurrentMonthDay ? dayNum : ''}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded-md">
                          {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 mt-1 overflow-y-auto max-h-[85px] scrollbar-none">
                      {dayEvents.map(ev => (
                        <button
                          key={ev.id}
                          onClick={() => setSelectedEventModal(ev)}
                          className="w-full text-left p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-[11px] font-medium transition-all truncate group"
                          title={ev.title}
                        >
                          <div className="font-semibold truncate flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                            <span className="truncate">{ev.title}</span>
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono pl-2.5">
                            {ev.time.split('–')[0].trim()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
              return cells;
            })()}
          </div>
        </div>
      )}

      {/* Visual Week Agenda View */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Weekly Agenda & Meetup Timeline (November 2026)
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Upcoming activities organized sequentially for the week of Nov 14 – Nov 29, 2026.
              </p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-3 py-1 rounded-xl">
              {filteredEvents.length} Active Events
            </span>
          </div>

          <div className="space-y-4">
            {filteredEvents.map((ev, index) => (
              <div
                key={ev.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 hover:border-emerald-600 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 font-bold flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <span className="text-[10px] uppercase">{ev.date.split(',')[0]}</span>
                    <span className="text-sm font-mono">{ev.date.match(/\d+/)?.[0] || '14'}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold bg-stone-900 text-white px-2 py-0.5 rounded-md">
                        {ev.category}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-900 font-medium">
                        {ev.lga === 'Both' ? 'Idanre + Ifedore' : `${ev.lga} LGA`}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 mt-1">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-1">
                      {ev.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-stone-500">
                      <span className="flex items-center gap-1 font-medium text-stone-800">
                        <Clock className="w-3.5 h-3.5 text-emerald-800" />
                        {ev.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {ev.venue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => setSelectedEventModal(ev)}
                    className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-semibold shadow-xs"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => downloadIcs(ev)}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl transition-colors"
                    title="Add to Calendar"
                  >
                    <CalendarPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Event Quick Modal from Calendar */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setSelectedEventModal(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 overflow-hidden">
            <button
              onClick={() => setSelectedEventModal(null)}
              className="absolute top-4 right-4 min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-400 hover:text-stone-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-bold uppercase bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md">
              {selectedEventModal.category}
            </span>

            <h3 className="text-lg font-bold text-stone-900 mt-2">
              {selectedEventModal.title}
            </h3>

            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              {selectedEventModal.description}
            </p>

            <div className="mt-4 space-y-2.5 text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-800 shrink-0" />
                <span className="font-semibold">{selectedEventModal.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{selectedEventModal.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{selectedEventModal.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Organized by {selectedEventModal.organizer} ({selectedEventModal.attendeesCount} youth going)</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  toggleRsvp(selectedEventModal.id, selectedEventModal.rsvpStatus === 'going' ? 'none' : 'going');
                  showToast('RSVP status updated!');
                }}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                {selectedEventModal.rsvpStatus === 'going' ? 'Going ✓' : 'RSVP Going'}
              </button>
              <button
                onClick={() => downloadIcs(selectedEventModal)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <CalendarPlus className="w-4 h-4" />
                Add to Phone Calendar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Organize Modal */}
      {isOrganizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsOrganizeModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOrganizeModalOpen(false)}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-stone-900 mb-1">
              Organize a Youth Event or Meeting
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Schedule community forums, committee meetings, sports matches, or youth rallies in Idanre & Ifedore.
            </p>

            <form
              onSubmit={e => {
                e.preventDefault();
                showToast('Event created successfully and submitted for youth notifications!');
                setIsOrganizeModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Ifedore Youth Leadership Roundtable (Ilara-Mokin)"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as CommunityEvent['category'])}
                    className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Youth Summit">Youth Summit</option>
                    <option value="Town Hall">Town Hall</option>
                    <option value="Agriculture">Agriculture & Farming</option>
                    <option value="Culture & Tourism">Culture & Tourism</option>
                    <option value="Sports">Sports & Athletics</option>
                    <option value="Civic">Civic Action</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Coverage</label>
                  <select
                    value={newLga}
                    onChange={e => setNewLga(e.target.value as CommunityEvent['lga'])}
                    className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Both">Both (Idanre & Ifedore)</option>
                    <option value="Idanre">Idanre LGA only</option>
                    <option value="Ifedore">Ifedore LGA only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    placeholder="e.g. Saturday, Dec 05, 2026"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    placeholder="e.g. 10:00 AM – 1:00 PM"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Venue / Location</label>
                <input
                  type="text"
                  required
                  value={newVenue}
                  onChange={e => setNewVenue(e.target.value)}
                  placeholder="e.g. Civic Center, Igbara-Oke"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Description & Agenda</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="What is the objective, who should attend, and what will be discussed?"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOrganizeModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Create & Announce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
