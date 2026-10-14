import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkillListing, LGA } from '../types';
import {
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  Star,
  Plus,
  Phone,
  Mail,
  ExternalLink,
  X,
  Briefcase,
  MapPin,
  Sparkles,
  Award,
  Image as ImageIcon,
  MessageCircle,
} from 'lucide-react';

export const SkillsDirectoryTab: React.FC = () => {
  const { skills, addSkillListing, selectedLGA, user } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedSkillForModal, setSelectedSkillForModal] = useState<SkillListing | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Registration form state
  const [title, setTitle] = useState('');
  const [skillCategory, setSkillCategory] = useState<SkillListing['skillCategory']>('Artisans & Crafts');
  const [lga, setLga] = useState<'Idanre' | 'Ifedore'>(user.lga || 'Idanre');
  const [community, setCommunity] = useState(user.community || 'Odode Idanre');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState(user.phone || '+234 803 000 0000');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [rate, setRate] = useState('');
  const [yearsExperience, setYearsExperience] = useState('3 years');
  const [portfolioImageUrl, setPortfolioImageUrl] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  const categories = [
    'All',
    'Artisans & Crafts',
    'Tech & Digital',
    'Agriculture & Agro-processing',
    'Professional & Business',
    'Creative & Media',
  ];

  const filteredSkills = skills.filter(s => {
    if (selectedLGA !== 'All' && s.lga !== selectedLGA) return false;
    if (categoryFilter !== 'All' && s.skillCategory !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.bio.toLowerCase().includes(q) ||
        s.community.toLowerCase().includes(q) ||
        s.skillCategory.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!title.trim() || !bio.trim() || !phone.trim()) {
      setFormError('Please fill in your skill title, bio, and contact phone.');
      return;
    }

    const completedProjects = projectTitle.trim() && projectDesc.trim()
      ? [{ title: projectTitle.trim(), description: projectDesc.trim(), imageUrl: portfolioImageUrl.trim() || undefined }]
      : [];

    addSkillListing({
      title: title.trim(),
      skillCategory,
      lga,
      community: community.trim() || 'Idanre Ward',
      bio: bio.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      email: email.trim(),
      rate: rate.trim() || 'Negotiable',
      yearsExperience: yearsExperience.trim() || '2+ years',
      portfolioImages: portfolioImageUrl.trim() ? [portfolioImageUrl.trim()] : [],
      completedProjects,
    });

    setTitle('');
    setBio('');
    setRate('');
    setPortfolioImageUrl('');
    setProjectTitle('');
    setProjectDesc('');
    setIsRegisterModalOpen(false);
    setToastMessage('Skill profile registered successfully! Verified in community directory.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Hero Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-800/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/80 border border-emerald-700/60 rounded-full text-xs font-semibold text-emerald-200 mb-3">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Verified Youth Talent & Artisan Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Idanre & Ifedore Skills Directory
          </h1>
          <p className="text-sm text-emerald-100 mt-2 leading-relaxed">
            Discover and hire verified young artisans, tech talents, farmers, and professional service providers from Idanre and Ifedore. Support local youth enterprises and secure dependable expertise right at home.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="min-h-[48px] px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Register My Skill</span>
          </button>
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
            placeholder="Search skills, artisans, tech talent, or locations..."
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

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <Wrench className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-stone-800">No skill listings found</h3>
          <p className="text-xs text-stone-500 mt-1">
            Be the first youth in {selectedLGA === 'All' ? 'Idanre & Ifedore' : `${selectedLGA} LGA`} to register your professional or artisan service!
          </p>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="mt-4 px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-xl"
          >
            Register Your Skill Now (+30 Pts)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => (
            <div
              key={skill.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
                      {skill.skillCategory}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5 leading-snug">
                      {skill.title}
                    </h3>
                  </div>
                  {skill.verified && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full" title="Verified Community Youth Talent">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Provider details */}
                <div className="flex items-center gap-2 text-xs text-stone-600 mb-3">
                  <span className="font-semibold text-stone-900">{skill.name}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-500">{skill.community}, {skill.lga} LGA</span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                  {skill.bio}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 bg-stone-50 border border-stone-100 rounded-xl p-3 mb-4 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Experience</span>
                    <span className="font-semibold text-stone-800">{skill.yearsExperience}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Service Rate</span>
                    <span className="font-bold text-emerald-900">{skill.rate}</span>
                  </div>
                </div>
              </div>

              {/* Footer action */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{skill.rating.toFixed(1)}</span>
                  <span className="text-stone-400 font-normal">({skill.reviewsCount} reviews)</span>
                </div>

                <button
                  onClick={() => setSelectedSkillForModal(skill)}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact & Hire</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Skill Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900">Register Your Skill / Service</h2>
                  <p className="text-xs text-stone-500">List your craft or professional service to get hired locally (+30 Pts)</p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-medium">
                  {formError}
                </div>
              )}
              <div>
                <label className="block font-semibold text-stone-800 mb-1">Professional Title / Skill Offer *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Certified Solar Inverter Technician & Electrician"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Skill Category *</label>
                  <select
                    value={skillCategory}
                    onChange={e => setSkillCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Artisans & Crafts">Artisans & Crafts</option>
                    <option value="Tech & Digital">Tech & Digital</option>
                    <option value="Agriculture & Agro-processing">Agriculture & Agro-processing</option>
                    <option value="Professional & Business">Professional & Business</option>
                    <option value="Creative & Media">Creative & Media</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">LGA *</label>
                  <select
                    value={lga}
                    onChange={e => setLga(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Idanre">Idanre LGA</option>
                    <option value="Ifedore">Ifedore LGA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Community / Ward *</label>
                  <input
                    type="text"
                    required
                    value={community}
                    onChange={e => setCommunity(e.target.value)}
                    placeholder="e.g. Odode, Alade, Igbara-Oke, Ilara-Mokin"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Years of Experience</label>
                  <input
                    type="text"
                    value={yearsExperience}
                    onChange={e => setYearsExperience(e.target.value)}
                    placeholder="e.g. 4 years"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Bio / Service Summary *</label>
                <textarea
                  required
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Describe your expertise, certifications, and what kind of local contracts or clients you welcome..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+234 803 ..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="+234 803 ..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your.email@domain.com"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Service Rate / Pricing</label>
                  <input
                    type="text"
                    value={rate}
                    onChange={e => setRate(e.target.value)}
                    placeholder="e.g. ₦10,000 / project or Negotiable"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Portfolio & Past Projects */}
              <div className="pt-2 border-t border-stone-100 space-y-3">
                <h3 className="font-bold text-stone-900">Showcase Completed Project (Optional)</h3>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Project Title</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={e => setProjectTitle(e.target.value)}
                    placeholder="e.g. Solar Installation for Idanre Cocoa Farm"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Project Description</label>
                  <input
                    type="text"
                    value={projectDesc}
                    onChange={e => setProjectDesc(e.target.value)}
                    placeholder="Briefly describe what you accomplished"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Portfolio Image URL (Optional)</label>
                  <input
                    type="text"
                    value={portfolioImageUrl}
                    onChange={e => setPortfolioImageUrl(e.target.value)}
                    placeholder="https://... photo link (optional)"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2.5 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-sm transition-colors"
                >
                  Complete Registration (+30 Pts)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact & Hire Modal */}
      {selectedSkillForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 uppercase">
                  {selectedSkillForModal.skillCategory}
                </span>
                <h2 className="text-lg font-bold text-stone-900">{selectedSkillForModal.title}</h2>
              </div>
              <button
                onClick={() => setSelectedSkillForModal(null)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-stone-400 block text-[11px]">Talent Provider</span>
                  <span className="font-bold text-stone-900 text-sm">{selectedSkillForModal.name}</span>
                  <span className="text-stone-500 block text-[11px] mt-0.5">
                    {selectedSkillForModal.community}, {selectedSkillForModal.lga} LGA
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[11px]">Standard Rate</span>
                  <span className="font-bold text-emerald-900 text-sm">{selectedSkillForModal.rate}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-stone-800 mb-1">About Service</h4>
                <p className="text-stone-600 leading-relaxed">{selectedSkillForModal.bio}</p>
              </div>

              {/* Completed Projects Showcase */}
              {selectedSkillForModal.completedProjects.length > 0 && (
                <div>
                  <h4 className="font-semibold text-stone-800 mb-2">Past Completed Projects</h4>
                  <div className="space-y-2">
                    {selectedSkillForModal.completedProjects.map((proj, idx) => (
                      <div key={idx} className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-3">
                        <div className="font-bold text-emerald-950">{proj.title}</div>
                        <p className="text-stone-600 mt-0.5">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Contact Options */}
              <div className="pt-2 border-t border-stone-100 space-y-3">
                <h4 className="font-semibold text-stone-800">Connect & Hire Locally</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`tel:${selectedSkillForModal.phone}`}
                    className="min-h-[44px] px-4 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call {selectedSkillForModal.phone}</span>
                  </a>

                  {selectedSkillForModal.whatsapp && (
                    <a
                      href={`https://wa.me/${selectedSkillForModal.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedSkillForModal.name)},%20I%20found%20your%20service%20on%20Ok%20Idanre%20Skills%20Directory%20and%20would%20like%20to%20hire%20you.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Chat</span>
                    </a>
                  )}
                </div>

                {selectedSkillForModal.email && (
                  <div className="text-center pt-2">
                    <span className="text-stone-400">Email: </span>
                    <a href={`mailto:${selectedSkillForModal.email}`} className="font-semibold text-emerald-800 underline">
                      {selectedSkillForModal.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
