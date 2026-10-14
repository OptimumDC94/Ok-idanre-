import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../data/initialData';
import {
  X,
  Phone,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  User,
  MapPin,
  Lock,
  Sparkles,
  Zap,
  LogIn,
  UserPlus,
  Compass,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    loginWithDemoUser,
    signup,
    themeConfig,
    playSound,
  } = useApp();

  // Mode: 'login' or 'signup'
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(authModalMode || 'login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('babatunde_idanre');
  const [loginPin, setLoginPin] = useState('1234');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPhone, setSignupPhone] = useState('080');
  const [signupPin, setSignupPin] = useState('1234');
  const [signupLga, setSignupLga] = useState<'Idanre' | 'Ifedore'>('Idanre');
  const [signupCommunity, setSignupCommunity] = useState('Odode Idanre');
  const [signupInterests, setSignupInterests] = useState<string[]>([
    'Civic Leadership',
    'Agribusiness',
    'Eco-Tourism & Hills',
  ]);
  const [signupError, setSignupError] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(authModalMode || 'login');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const idanreCommunities = [
    'Odode Idanre',
    'Alade Idanre',
    'Atosin Idanre',
    'Oke Idanre (Ufe Oke)',
    'Ofosu',
    'Owena',
    'Ala-Elefosan',
    'Apefon',
    'Bajare',
  ];

  const ifedoreCommunities = [
    'Igbara-Oke',
    'Ilara-Mokin',
    'Ijare',
    'Itaogbolu',
    'Isarun',
    'Ipogun',
    'Ibule-Soro',
    'Ero',
  ];

  const interestOptions = [
    'Agribusiness & Cocoa',
    'Civic Leadership',
    'Eco-Tourism & Hills',
    'Tech & Digital Skills',
    'Arts & Culture',
    'Secondary School Tutoring',
    'Youth Sports',
    'Environmental Action',
  ];

  const toggleInterest = (interest: string) => {
    setSignupInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your Phone number or @Username');
      return;
    }
    const ok = login(loginIdentifier.trim(), loginPin);
    if (!ok) {
      setLoginError('Could not log in with provided details. Please try a demo account.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    if (!signupName.trim()) {
      setSignupError('Please enter your full name');
      return;
    }
    if (signupPhone.trim().length < 9) {
      setSignupError('Please enter a valid phone number');
      return;
    }

    signup({
      name: signupName.trim(),
      username: signupUsername.trim() || signupName.toLowerCase().replace(/\s+/g, '_'),
      phone: signupPhone.trim(),
      lga: signupLga,
      community: signupCommunity,
      interests: signupInterests,
      pin: signupPin,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-7 overflow-hidden my-8 z-10">
        {/* Close Button */}
        <button
          onClick={() => {
            playSound('click');
            setIsAuthModalOpen(false);
          }}
          className="absolute top-5 right-5 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Close Authentication Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-lg shadow-sm"
            style={{ backgroundColor: themeConfig.primaryColor }}
          >
            OK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Ok Idanre Platform
              </h2>
              <span className="text-[10px] font-bold font-mono text-emerald-800 dark:text-emerald-400">
                IdanApp
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Community portal for Idanre & Ifedore LGA youth
            </p>
          </div>
        </div>

        {/* Tab Switcher: Log In vs Sign Up */}
        <div className="flex p-1 bg-stone-100 dark:bg-stone-850 rounded-xl mb-6 border border-stone-200/80 dark:border-stone-800">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setActiveTab('login');
              setAuthModalMode('login');
              setLoginError(null);
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'login'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setActiveTab('signup');
              setAuthModalMode('signup');
              setSignupError(null);
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'signup'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
            <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
              +100 pts
            </span>
          </button>
        </div>

        {/* ========================================================
            LOG IN VIEW
           ======================================================== */}
        {activeTab === 'login' && (
          <div className="space-y-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl text-xs font-medium">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Phone Number or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. 08034567890 or babatunde_idanre"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Security PIN / Password
                  </label>
                  <span className="text-[11px] text-stone-400 dark:text-stone-500">
                    Default demo PIN: <strong className="font-mono text-stone-600 dark:text-stone-300">1234</strong>
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={loginPin}
                    onChange={e => setLoginPin(e.target.value)}
                    placeholder="4-digit PIN"
                    maxLength={8}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all hover:opacity-95 active:scale-98"
                style={{ backgroundColor: themeConfig.primaryColor }}
              >
                Sign In to Ok Idanre
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick 1-Click Demo Profiles */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Or 1-Tap Sign In with Community Profiles:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEMO_USERS.map(demo => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => {
                      loginWithDemoUser(demo);
                    }}
                    className="p-2.5 bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 rounded-xl text-left transition-all flex items-start gap-2.5 group"
                  >
                    <div
                      className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase shadow-xs group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: themeConfig.primaryColor }}
                    >
                      {demo.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                          {demo.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 rounded shrink-0">
                          {demo.points} pts
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                        {demo.community} · {demo.lga}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-stone-500 dark:text-stone-400 pt-1">
              New here?{' '}
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setActiveTab('signup');
                }}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                Create your account in 30 seconds
              </button>
            </p>
          </div>
        )}

        {/* ========================================================
            SIGN UP VIEW
           ======================================================== */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4 max-h-[68vh] overflow-y-auto pr-1">
            {signupError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl text-xs font-medium">
                {signupError}
              </div>
            )}

            {/* Welcome Bonus Callout */}
            <div className="p-3 bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-stone-800 dark:to-stone-800/80 border border-amber-200/80 dark:border-amber-900/60 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Welcome Youth Bonus: +100 Points!
                </h4>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  Join fellow changemakers in Idanre & Ifedore to participate in grants, polls, and events.
                </p>
              </div>
            </div>

            {/* Full Name & Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={e => {
                    setSignupName(e.target.value);
                    if (!signupUsername) {
                      setSignupUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'));
                    }
                  }}
                  placeholder="e.g. Babatunde Adeleke"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Username *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 text-xs">@</span>
                  <input
                    type="text"
                    required
                    value={signupUsername}
                    onChange={e => setSignupUsername(e.target.value)}
                    placeholder="tunde_idanre"
                    className="w-full pl-7 pr-3.5 py-2.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Phone & Security PIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Phone (Nigerian Mobile) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={signupPhone}
                    onChange={e => setSignupPhone(e.target.value)}
                    placeholder="0803 123 4567"
                    className="w-full pl-8 pr-3 py-2.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  4-Digit Security PIN
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="password"
                    maxLength={4}
                    value={signupPin}
                    onChange={e => setSignupPin(e.target.value)}
                    placeholder="1234"
                    className="w-full pl-8 pr-3 py-2.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* LGA & Community */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Your LGA *
                </label>
                <select
                  value={signupLga}
                  onChange={e => {
                    const next = e.target.value as 'Idanre' | 'Ifedore';
                    setSignupLga(next);
                    setSignupCommunity(next === 'Idanre' ? 'Odode Idanre' : 'Igbara-Oke');
                  }}
                  className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Idanre">Idanre LGA (Hills & Cocoa Heart)</option>
                  <option value="Ifedore">Ifedore LGA (Education & Agronomy)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Subtown / Community *
                </label>
                <select
                  value={signupCommunity}
                  onChange={e => setSignupCommunity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {(signupLga === 'Idanre' ? idanreCommunities : ifedoreCommunities).map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interests & Skills */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Youth Interests & Engagement Goals
              </label>
              <div className="flex flex-wrap gap-1.5">
                {interestOptions.map(interest => {
                  const isSelected = signupInterests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                      style={{
                        backgroundColor: isSelected ? themeConfig.primaryColor : undefined,
                      }}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all hover:opacity-95 active:scale-98"
              style={{ backgroundColor: themeConfig.primaryColor }}
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Sign Up & Claim +100 pts
            </button>

            <p className="text-center text-xs text-stone-500 dark:text-stone-400 pt-1">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setActiveTab('login');
                }}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                Sign In here
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
