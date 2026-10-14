import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PeerProfile } from '../types';
import { Users, UserPlus, Sparkles, Search, CheckCircle2, Phone, MessageSquare, Briefcase, GraduationCap, X } from 'lucide-react';

export const PeerMatchingTab: React.FC = () => {
  const { peers, addPeerProfile, user, awardPoints } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Form state for registering peer profile
  const [community, setCommunity] = useState(user.community || 'Odode Idanre');
  const [lga, setLga] = useState<'Idanre' | 'Ifedore'>(user.lga || 'Idanre');
  const [matchType, setMatchType] = useState<PeerProfile['matchType']>('Tech Collaborator');
  const [skillsOfferInput, setSkillsOfferInput] = useState('React, Tailwind, UI Design');
  const [skillsSeekInput, setSkillsSeekInput] = useState('Python, Agri-tech, Mentorship');
  const [bio, setBio] = useState('Passionate youth looking for teammates to build local impact solutions.');
  const [phone, setPhone] = useState(user.phone || '08030001122');
  const [whatsapp, setWhatsapp] = useState('08030001122');

  const matchTypes = ['All', 'Tech Collaborator', 'Agri-Business Partner', 'Study Partner', 'Apprentice & Mentor', 'General Peer'];

  const filteredPeers = peers.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.community.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.skillsToOffer.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'All' || p.matchType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPeerProfile({
      lga,
      community,
      matchType,
      skillsToOffer: skillsOfferInput.split(',').map(s => s.trim()).filter(Boolean),
      skillsSeeking: skillsSeekInput.split(',').map(s => s.trim()).filter(Boolean),
      bio,
      phone,
      whatsapp,
    });
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-900 via-emerald-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-amber-300 text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>Peer Matching & Mentorship · Idanre & Ifedore</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">
              Youth Collaboration Network
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Find study partners for WAEC/JAMB, co-founders for agribusiness & tech projects, or mentors and apprentices across Idanre and Ifedore LGAs.
            </p>
          </div>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="min-h-[46px] px-6 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register My Peer Profile</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, community or skill..."
            className="w-full min-h-[44px] pl-10 pr-4 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {matchTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Peer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPeers.map(peer => (
          <div
            key={peer.id}
            className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white font-bold text-lg flex items-center justify-center shadow-sm">
                    {peer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">{peer.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-stone-500">{peer.community}, {peer.lga} LGA</span>
                    </div>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-mono text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                  {peer.matchType}
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">{peer.bio}</p>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Skills to Offer:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {peer.skillsToOffer.map((skill, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-lg text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Looking For:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {peer.skillsSeeking.map((skill, idx) => (
                      <span key={idx} className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between gap-3">
              <span className="text-xs text-stone-400 font-mono">Connected with {peer.connectedCount} peers</span>
              <a
                href={`https://wa.me/${peer.whatsapp || peer.phone}?text=Hello%20${encodeURIComponent(peer.name)},%20saw%20your%20profile%20on%20Ok%20Idanre%20Peer%20Matching!`}
                target="_blank"
                rel="noreferrer"
                className="min-h-[40px] px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Connect / WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Register Peer Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-800" />
                Register Your Peer Profile
              </h2>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Collaboration Type</label>
                <select
                  value={matchType}
                  onChange={e => setMatchType(e.target.value as any)}
                  className="w-full min-h-[44px] px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Tech Collaborator">Tech Collaborator</option>
                  <option value="Agri-Business Partner">Agri-Business Partner</option>
                  <option value="Study Partner">Study Partner</option>
                  <option value="Apprentice & Mentor">Apprentice & Mentor</option>
                  <option value="General Peer">General Peer</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">LGA</label>
                  <select
                    value={lga}
                    onChange={e => setLga(e.target.value as any)}
                    className="w-full min-h-[44px] px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Idanre">Idanre LGA</option>
                    <option value="Ifedore">Ifedore LGA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Community / Ward</label>
                  <input
                    type="text"
                    value={community}
                    onChange={e => setCommunity(e.target.value)}
                    placeholder="e.g. Odode, Igbara-Oke"
                    required
                    className="w-full min-h-[44px] px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Skills You Can Offer (comma separated)</label>
                <input
                  type="text"
                  value={skillsOfferInput}
                  onChange={e => setSkillsOfferInput(e.target.value)}
                  placeholder="e.g. Frontend, Cocoa Farming, Tutoring"
                  required
                  className="w-full min-h-[44px] px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Skills / Partners You Are Seeking</label>
                <input
                  type="text"
                  value={skillsSeekInput}
                  onChange={e => setSkillsSeekInput(e.target.value)}
                  placeholder="e.g. Backend Dev, Agribusiness grant partner"
                  required
                  className="w-full min-h-[44px] px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Short Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  required
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    className="w-full min-h-[44px] px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    required
                    className="w-full min-h-[44px] px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 border border-stone-300 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm shadow-sm"
                >
                  Publish Profile (+25 pts)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
