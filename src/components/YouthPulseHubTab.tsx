import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveClimbTracker } from './InteractiveClimbTracker';
import { InteractiveProverbCard } from './InteractiveProverbCard';
import { AfrobeatSoundwavePlayer } from './AfrobeatSoundwavePlayer';
import {
  Flame,
  Star,
  Award,
  Music,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  Share2,
  Send,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  ExternalLink,
  Volume2,
} from 'lucide-react';

export const YouthPulseHubTab: React.FC = () => {
  const { user, awardPoints, setActiveTab, hasCheckedInToday, dailyCheckIn } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'youth' | 'social' | 'politics' | 'games'>('youth');
  const [triviaSelected, setTriviaSelected] = useState<number | null>(null);
  const [triviaSubmitted, setTriviaSubmitted] = useState(false);
  const [votes, setVotes] = useState(42);
  const [hasVotedTrack, setHasVotedTrack] = useState(false);
  const [isPlayingTrack, setIsPlayingTrack] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Grant application modal state
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [grantWard, setGrantWard] = useState('Odode Idanre');
  const [grantCategory, setGrantCategory] = useState('Solar Cocoa Drying Trays');
  const [grantExperience, setGrantExperience] = useState('2-5 years farming');
  const [grantSubmitted, setGrantSubmitted] = useState(false);

  // Social chat comments state
  const [socialComments, setSocialComments] = useState<string[]>([
    'Anyone heading to the Orosun Festival ground this weekend from Alade?',
    'The cocoa harvest around Atosin is looking massive this season! 🍫',
    'Loving this Afrobeat mix from DJ Idanre Boy!',
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTriviaSubmit = () => {
    if (triviaSelected === null || triviaSubmitted) return;
    setTriviaSubmitted(true);
    if (triviaSelected === 1) {
      awardPoints(50, 'Daily Heritage Trivia: 1923 Ufe Oke Descent');
      showToast('Correct! +50 Points awarded to your profile! ⭐');
    } else {
      showToast('Incorrect. The historic descent occurred in 1923.');
    }
  };

  const handleVoteTrack = () => {
    if (!hasVotedTrack) {
      setVotes(v => v + 1);
      setHasVotedTrack(true);
      awardPoints(10, 'Voted for Idanre Soundwave Track of the Week');
      showToast('Vote recorded! +10 Points awarded 🔥');
    } else {
      setVotes(v => v - 1);
      setHasVotedTrack(false);
      showToast('Vote removed');
    }
  };

  const handleToggleStream = () => {
    if (isPlayingTrack) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsPlayingTrack(false);
      return;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'Now streaming Hills of Oke, Afrobeat Mix, by DJ Idanre Boy from Atosin base. Feel the heartbeat of the ancient granite hills and the modern youth rhythm.'
      );
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsPlayingTrack(false);
      utterance.onerror = () => setIsPlayingTrack(false);
      window.speechSynthesis.speak(utterance);
    }
    setIsPlayingTrack(true);
    showToast('Streaming "Hills of Oke" (Afrobeat Mix) 🎶');
  };

  const handleGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGrantSubmitted(true);
    awardPoints(150, 'Applied for Cocoa Value Addition Grant 2026');
    showToast('Grant Application Submitted! +150 Points awarded to your profile! 🏆');
    setTimeout(() => {
      setIsGrantModalOpen(false);
      setGrantSubmitted(false);
    }, 1500);
  };

  const handleAddSocialComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setSocialComments(prev => [newCommentText.trim(), ...prev]);
    awardPoints(5, 'Shared note in Social Hangout Lounge');
    setNewCommentText('');
    showToast('Message posted! (+5 Points)');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Pulse Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-emerald-800/40 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center font-black text-white text-lg shadow-md shadow-emerald-900/50 shrink-0">
              OK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Ok Idanre Youth Pulse Hub
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Universal Hub
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Ufe Oke to Valley • Connecting Young Farmers, Artisans, Creatives & Civics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 dark:bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{user.checkInStreak || 1}d Streak</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 font-mono">
              <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              <span>{user.points} Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <nav className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white dark:bg-stone-900 p-2 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        {[
          { key: 'youth', label: 'Youth & Skills', icon: '🌱', desc: 'Agro grants & startups' },
          { key: 'social', label: 'Social & Music', icon: '🎶', desc: 'Idanre soundwave' },
          { key: 'politics', label: 'Wards & Civics', icon: '🏛️', desc: 'Town halls & solar' },
          { key: 'games', label: 'Games Arcade', icon: '🎮', desc: 'Daily heritage trivia' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key as any)}
            className={`py-3 px-3 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
              activeSubTab === tab.key
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span className="truncate w-full">{tab.label}</span>
            <span className={`text-[10px] font-normal truncate hidden sm:inline ${activeSubTab === tab.key ? 'text-emerald-200' : 'text-stone-400'}`}>
              {tab.desc}
            </span>
          </button>
        ))}
      </nav>

      {/* Dynamic Content Viewport */}
      <main className="space-y-4">
        
        {/* TAB 1: YOUTH & SKILLS HUB */}
        {activeSubTab === 'youth' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-gradient-to-r from-emerald-950/20 via-white to-white dark:via-stone-900 dark:to-stone-900 border border-emerald-600/30 rounded-3xl p-6 sm:p-7 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Agro-Tech & Youth Opportunities
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mt-3">
                Cocoa Value Addition Grant 2026
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 mb-5 leading-relaxed max-w-2xl">
                Open to all young farmers and artisans across Idanre's 10 wards. Access modern solar drying patios, fermentation boxes, pest control equipment, and cooperative packaging training.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-200 dark:border-stone-800 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    +150 Points Reward
                  </span>
                  <span className="text-xs text-stone-400">· Deadline: Dec 2026</span>
                </div>
                <button
                  onClick={() => setIsGrantModalOpen(true)}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition shadow-xs self-start sm:self-auto"
                >
                  Apply Now
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Community Youth Spotlight
                </h3>
                <button
                  onClick={() => setActiveTab('skills')}
                  className="text-xs text-emerald-800 dark:text-emerald-400 font-bold hover:underline"
                >
                  View All Artisans →
                </button>
              </div>

              <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80">
                <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500 flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-400 text-sm shrink-0">
                  AO
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">Adewale Ojo</h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Agro Pioneer • Odode Ward</p>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                    "Cultivated 12 hectares of premium shade-grown cocoa and trained 18 youth apprentices."
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive 682 Steps Climb Tracker Challenge */}
            <InteractiveClimbTracker />
          </div>
        )}

        {/* TAB 2: SOCIAL & MUSIC LOUNGE */}
        {activeSubTab === 'social' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Live Procedural Web Audio Afrobeat Synthesizer & Soundwave Player */}
            <AfrobeatSoundwavePlayer />

            {/* Interactive Yoruba Wisdom & Proverb Draw Wheel */}
            <InteractiveProverbCard />

            {/* Social Hangout Lounge Chat */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Social Hangout Lounge</span>
                </p>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="text-xs text-emerald-800 dark:text-emerald-400 font-bold hover:underline"
                >
                  Join Chat Rooms →
                </button>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAddSocialComment} className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Drop a note for Idanre & Ifedore youth..."
                  className="flex-1 px-4 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </form>

              {/* Recent Notes */}
              <div className="space-y-2">
                {socialComments.map((comment, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800/60 text-xs text-stone-700 dark:text-stone-300"
                  >
                    "{comment}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WARDS & CIVICS (POLITICS) */}
        {activeSubTab === 'politics' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                  📍 Ward 4 Town Hall (Idale-Logbosere)
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Project
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Solar Streetlight Inspection & Maintenance
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                  Community review on the recent solar installation across Odode market junctions. Residents report 8 out of 10 poles functioning reliably at night.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-800 pt-4 text-xs">
                <span className="text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>112 Community Upvotes</span>
                </span>
                <button
                  onClick={() => setActiveTab('civic-tech')}
                  className="text-emerald-800 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1"
                >
                  <span>Open Ward Budget Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GAMES ARCADE */}
        {activeSubTab === 'games' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>Daily Heritage Trivia (+50 Points)</span>
                </span>
                <span className="text-xs text-stone-400 font-medium">Ufe Oke History</span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                In what year did the ancient Idanre settlement begin migrating down from the hilltop (Ufe Oke) to the valley?
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {['1910', '1923', '1960', '1984'].map((option, idx) => (
                  <button
                    key={idx}
                    disabled={triviaSubmitted}
                    onClick={() => setTriviaSelected(idx)}
                    className={`text-left p-3.5 rounded-2xl text-xs font-bold border transition-all ${
                      triviaSelected === idx
                        ? 'bg-emerald-800 text-white border-emerald-700 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                disabled={triviaSelected === null || triviaSubmitted}
                onClick={handleTriviaSubmit}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-xs"
              >
                {triviaSubmitted 
                  ? (triviaSelected === 1 ? 'Correct! +50 Points Added ⭐' : 'Incorrect! The correct year is 1923') 
                  : 'Submit Answer'}
              </button>

              <div className="flex items-center justify-between text-xs pt-2 text-stone-400">
                <span>Test your ancestral knowledge daily</span>
                <button
                  onClick={() => setActiveTab('games')}
                  className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline"
                >
                  More Yoruba Games →
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Grant Application Modal */}
      {isGrantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                  Agro-Innovation Fund
                </span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  Apply for Cocoa Value Addition Grant 2026
                </h3>
              </div>
              <button
                onClick={() => setIsGrantModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGrantSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Your Ward / Location
                </label>
                <select
                  value={grantWard}
                  onChange={(e) => setGrantWard(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100"
                >
                  <option value="Odode Idanre">Odode Idanre (Ward 1)</option>
                  <option value="Alade/Atosin">Alade / Atosin (Ward 2)</option>
                  <option value="Idale-Logbosere">Idale-Logbosere (Ward 4)</option>
                  <option value="Owena/Aponmulona">Owena / Aponmulona (Ward 10)</option>
                  <option value="Igbara-Oke">Igbara-Oke (Ifedore LGA)</option>
                  <option value="Ilara-Mokin">Ilara-Mokin (Ifedore LGA)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Equipment or Tool Support Needed
                </label>
                <select
                  value={grantCategory}
                  onChange={(e) => setGrantCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100"
                >
                  <option value="Solar Cocoa Drying Trays">Solar Cocoa Drying Trays</option>
                  <option value="Cascaded Fermentation Boxes">Cascaded Fermentation Boxes</option>
                  <option value="Eco-Friendly Cocoa Seedling Nursery">Eco-Friendly Cocoa Seedling Nursery</option>
                  <option value="Agro-Processing & Packaging">Agro-Processing & Packaging Tools</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Years of Agricultural Experience
                </label>
                <select
                  value={grantExperience}
                  onChange={(e) => setGrantExperience(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100"
                >
                  <option value="Aspiring Young Farmer (0-1 yr)">Aspiring Young Farmer (0-1 yr)</option>
                  <option value="2-5 years farming">2-5 years active farming</option>
                  <option value="5+ years cooperative member">5+ years cooperative member</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGrantModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={grantSubmitted}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs"
                >
                  {grantSubmitted ? 'Submitting...' : 'Submit Grant Application (+150 IP)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
