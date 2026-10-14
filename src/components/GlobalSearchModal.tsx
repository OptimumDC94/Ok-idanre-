import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, MessageSquare, Calendar, Wrench, ShoppingBag, Users, MapPin, ArrowRight, Shield, Sparkles, Landmark, GraduationCap, Vote } from 'lucide-react';
import { ORAL_HISTORY_CLIPS, HERITAGE_CARDS, CULTURAL_CALENDAR_EVENTS, STEPS_ASCENT_WAYPOINTS, UNESCO_BENCHMARK_CRITERIA } from '../data/cultureData';
import { RECOGNIZED_SECONDARY_SCHOOLS } from '../data/secondarySchoolData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = 'all' | 'discussions' | 'civic' | 'culture' | 'schools' | 'events' | 'skills' | 'marketplace' | 'meetups' | 'emergency';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    discussions,
    events,
    skills,
    marketplaceItems,
    meetups,
    emergencyContacts,
    civicProjects,
    assignmentGroups,
    setActiveTab,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');

  const categories: { id: SearchCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Results', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'discussions', label: 'Discussions', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'civic', label: 'Civic Tech', icon: <Vote className="w-4 h-4" /> },
    { id: 'culture', label: 'Culture & Heritage', icon: <Landmark className="w-4 h-4" /> },
    { id: 'schools', label: 'Secondary Schools', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills Directory', icon: <Wrench className="w-4 h-4" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'meetups', label: 'Meetups', icon: <Users className="w-4 h-4" /> },
    { id: 'emergency', label: 'Emergency', icon: <Shield className="w-4 h-4" /> },
  ];

  // Filter items based on query and category
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    const matchedDiscussions = (selectedCategory === 'all' || selectedCategory === 'discussions')
      ? discussions.filter(d =>
          !q || d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q))
        ).map(d => ({ ...d, type: 'discussion' as const }))
      : [];

    const matchedEvents = (selectedCategory === 'all' || selectedCategory === 'events')
      ? events.filter(e =>
          !q || e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || e.organizer.toLowerCase().includes(q)
        ).map(e => ({ ...e, type: 'event' as const }))
      : [];

    const matchedSkills = (selectedCategory === 'all' || selectedCategory === 'skills')
      ? skills.filter(s =>
          !q || s.title.toLowerCase().includes(q) || s.skillCategory.toLowerCase().includes(q) || s.bio.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.community.toLowerCase().includes(q)
        ).map(s => ({ ...s, type: 'skill' as const }))
      : [];

    const matchedMarketplace = (selectedCategory === 'all' || selectedCategory === 'marketplace')
      ? marketplaceItems.filter(m =>
          !q || m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.category.toLowerCase().includes(q) || m.sellerName.toLowerCase().includes(q)
        ).map(m => ({ ...m, type: 'marketplace' as const }))
      : [];

    const matchedMeetups = (selectedCategory === 'all' || selectedCategory === 'meetups')
      ? meetups.filter(m =>
          !q || m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.venue.toLowerCase().includes(q) || m.organizer.toLowerCase().includes(q)
        ).map(m => ({ ...m, type: 'meetup' as const }))
      : [];

    const matchedEmergency = (selectedCategory === 'all' || selectedCategory === 'emergency')
      ? emergencyContacts.filter(e =>
          !q || e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
        ).map(e => ({ ...e, type: 'emergency' as const }))
      : [];

    const matchedCivic = (selectedCategory === 'all' || selectedCategory === 'civic')
      ? civicProjects.filter(p =>
          !q || p.title.toLowerCase().includes(q) || p.wardName.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
        ).map(p => ({ ...p, type: 'civic' as const }))
      : [];

    const matchedCulture = (selectedCategory === 'all' || selectedCategory === 'culture')
      ? [
          ...STEPS_ASCENT_WAYPOINTS.filter(w => !q || w.name.toLowerCase().includes(q) || w.yorubaName.toLowerCase().includes(q) || w.stepRange.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)).map(w => ({ id: w.id, title: `${w.name} (${w.stepRange})`, subtitle: `${w.yorubaName} · ${w.elevationMeters}m Elevation`, desc: w.description, tab: 'culture-heritage' })),
          ...UNESCO_BENCHMARK_CRITERIA.filter(u => !q || u.title.toLowerCase().includes(q) || u.criterionNumber.toLowerCase().includes(q) || u.justification.toLowerCase().includes(q)).map(u => ({ id: u.id, title: `${u.criterionNumber}: ${u.title}`, subtitle: `UNESCO Tentative List · ${u.category} Value`, desc: u.justification, tab: 'culture-heritage' })),
          ...ORAL_HISTORY_CLIPS.filter(c => !q || c.title.toLowerCase().includes(q) || c.elderName.toLowerCase().includes(q) || c.englishTranslation.toLowerCase().includes(q)).map(c => ({ id: c.id, title: c.title, subtitle: `${c.elderName} (${c.elderTitle})`, desc: c.englishTranslation, tab: 'culture-heritage' })),
          ...HERITAGE_CARDS.filter(h => !q || h.title.toLowerCase().includes(q) || h.summary.toLowerCase().includes(q)).map(h => ({ id: h.id, title: h.title, subtitle: h.subtitle, desc: h.summary, tab: 'culture-heritage' })),
          ...CULTURAL_CALENDAR_EVENTS.filter(e => !q || e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)).map(e => ({ id: e.id, title: e.title, subtitle: `${e.date} · ${e.venue}`, desc: e.description, tab: 'culture-heritage' })),
        ]
      : [];

    const matchedSchools = (selectedCategory === 'all' || selectedCategory === 'schools')
      ? [
          ...RECOGNIZED_SECONDARY_SCHOOLS.filter(s => !q || s.name.toLowerCase().includes(q) || s.town.toLowerCase().includes(q)).map(s => ({ id: s.id, title: s.name, subtitle: `${s.category} · ${s.town} (${s.lga})`, desc: `Principal: ${s.principalName} · Motto: "${s.motto}"`, tab: 'secondary-school' })),
          ...assignmentGroups.filter(g => !q || g.title.toLowerCase().includes(q) || g.subject.toLowerCase().includes(q) || g.schoolName.toLowerCase().includes(q)).map(g => ({ id: g.id, title: g.title, subtitle: `${g.subject} · ${g.classLevel} · ${g.schoolName}`, desc: g.description, tab: 'secondary-school' })),
        ]
      : [];

    return {
      discussions: matchedDiscussions,
      civic: matchedCivic,
      culture: matchedCulture,
      schools: matchedSchools,
      events: matchedEvents,
      skills: matchedSkills,
      marketplace: matchedMarketplace,
      meetups: matchedMeetups,
      emergency: matchedEmergency,
      totalCount:
        matchedDiscussions.length +
        matchedCivic.length +
        matchedCulture.length +
        matchedSchools.length +
        matchedEvents.length +
        matchedSkills.length +
        matchedMarketplace.length +
        matchedMeetups.length +
        matchedEmergency.length,
    };
  }, [query, selectedCategory, discussions, events, skills, marketplaceItems, meetups, emergencyContacts, civicProjects, assignmentGroups]);

  if (!isOpen) return null;

  const handleSelectResult = (tab: string) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden z-10 flex flex-col max-h-[85vh]">
        
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3 bg-stone-50/50 dark:bg-stone-900/50">
          <Search className="w-5 h-5 text-emerald-700 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search discussions, events, skills, marketplace, emergency..."
            autoFocus
            className="w-full bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 text-base sm:text-lg focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors ml-2"
          >
            <span className="text-xs font-mono">ESC</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2.5 border-b border-stone-200 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-stone-100/50 dark:bg-stone-950/50">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {results.totalCount === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-stone-800 dark:text-stone-200 font-semibold text-sm">No results found for "{query}"</h3>
              <p className="text-stone-500 text-xs mt-1">Try checking your spelling or searching for a different community topic.</p>
            </div>
          ) : (
            <>
              {/* Discussions */}
              {results.discussions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1">
                    <span>Discussions ({results.discussions.length})</span>
                    <button onClick={() => setActiveTab('discussions')} className="text-emerald-700 hover:underline">View All</button>
                  </div>
                  <div className="space-y-2">
                    {results.discussions.map(d => (
                      <div
                        key={d.id}
                        onClick={() => handleSelectResult('discussions')}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-stone-200/80 dark:border-stone-700/80 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                            {d.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 shrink-0">
                            {d.category}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 mt-1">{d.content}</p>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400">
                          <span>By {d.authorName} · {d.lga}</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Open <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Civic Tech */}
              {results.civic.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1">
                    <span>Civic Tech & Ward Projects ({results.civic.length})</span>
                    <button onClick={() => handleSelectResult('civic-tech')} className="text-emerald-700 hover:underline">View All</button>
                  </div>
                  <div className="space-y-2">
                    {results.civic.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectResult('civic-tech')}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-stone-200/80 dark:border-stone-700/80 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                            {p.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 shrink-0">
                            {p.wardName} ({p.lga})
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 mt-1">{p.description}</p>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400">
                          <span>Status: {p.status} · ₦{(p.budgetAmount / 1000000).toFixed(1)}M Budget</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Ward Project <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Culture & Heritage */}
              {results.culture.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1">
                    <span>Culture & Oral History Archive ({results.culture.length})</span>
                    <button onClick={() => handleSelectResult('culture-heritage')} className="text-emerald-700 hover:underline">View All</button>
                  </div>
                  <div className="space-y-2">
                    {results.culture.map(c => (
                      <div
                        key={c.id}
                        onClick={() => handleSelectResult('culture-heritage')}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-stone-200/80 dark:border-stone-700/80 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                            {c.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 shrink-0">
                            Heritage
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium mt-0.5">{c.subtitle}</div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 mt-1">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Secondary Schools */}
              {results.schools.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1">
                    <span>Secondary School Connect & Groups ({results.schools.length})</span>
                    <button onClick={() => handleSelectResult('secondary-school')} className="text-emerald-700 hover:underline">View All</button>
                  </div>
                  <div className="space-y-2">
                    {results.schools.map(s => (
                      <div
                        key={s.id}
                        onClick={() => handleSelectResult('secondary-school')}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-stone-200/80 dark:border-stone-700/80 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                            {s.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 shrink-0">
                            School Connect
                          </span>
                        </div>
                        <div className="text-[11px] text-blue-700 dark:text-blue-400 font-medium mt-0.5">{s.subtitle}</div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 mt-1">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {results.events.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1">
                    <span>Community Events ({results.events.length})</span>
                    <button onClick={() => setActiveTab('events')} className="text-emerald-700 hover:underline">View All</button>
                  </div>
                  <div className="space-y-2">
                    {results.events.map(e => (
                      <div
                        key={e.id}
                        onClick={() => handleSelectResult('events')}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-stone-200/80 dark:border-stone-700/80 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                            {e.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 shrink-0">
                            {e.date}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 mt-1">{e.description}</p>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-700" /> {e.venue} ({e.lga})</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Event <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {results.skills.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1">
                    <span>Skills Directory ({results.skills.length})</span>
                    <button onClick={() => setActiveTab('skills')} className="text-emerald-700 hover:underline">View All</button>
                  </div>
                  <div className="space-y-2">
                    {results.skills.map(s => (
                      <div
                        key={s.id}
                        onClick={() => handleSelectResult('skills')}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-stone-200/80 dark:border-stone-700/80 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                            {s.title} — <span className="text-stone-600 dark:text-stone-300 font-normal">{s.name}</span>
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 shrink-0">
                            {s.skillCategory}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 mt-1">{s.bio}</p>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400">
                          <span>{s.lga} Ward · {s.rate}</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Skill <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Marketplace */}
              {results.marketplace.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1">
                    <span>Marketplace ({results.marketplace.length})</span>
                    <button onClick={() => setActiveTab('marketplace')} className="text-emerald-700 hover:underline">View All</button>
                  </div>
                  <div className="space-y-2">
                    {results.marketplace.map(m => (
                      <div
                        key={m.id}
                        onClick={() => handleSelectResult('marketplace')}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-stone-200/80 dark:border-stone-700/80 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                            {m.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 shrink-0 font-mono">
                            ₦{m.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 mt-1">{m.description}</p>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400">
                          <span>Seller: {m.sellerName} · {m.lga}</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Item <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meetups */}
              {results.meetups.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1">
                    <span>Meetups & Hangouts ({results.meetups.length})</span>
                    <button onClick={() => setActiveTab('meetups')} className="text-emerald-700 hover:underline">View All</button>
                  </div>
                  <div className="space-y-2">
                    {results.meetups.map(m => (
                      <div
                        key={m.id}
                        onClick={() => handleSelectResult('meetups')}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-stone-200/80 dark:border-stone-700/80 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                            {m.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 shrink-0">
                            {m.category}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 mt-1">{m.description}</p>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400">
                          <span>{m.venue} ({m.lga})</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Join Meetup <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Emergency Contacts */}
              {results.emergency.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1">
                    <span>Emergency & Helplines ({results.emergency.length})</span>
                    <button onClick={() => setActiveTab('emergency')} className="text-emerald-700 hover:underline">View All</button>
                  </div>
                  <div className="space-y-2">
                    {results.emergency.map(e => (
                      <div
                        key={e.id}
                        onClick={() => handleSelectResult('emergency')}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-stone-200/80 dark:border-stone-700/80 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                            {e.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 font-mono shrink-0">
                            {e.phone}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">{e.category} · {e.location} ({e.lga})</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
          <span>Press ESC to close</span>
          <span>·</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-medium">Ok Idanre & Ifedore Global Index</span>
        </div>

      </div>
    </div>
  );
};
