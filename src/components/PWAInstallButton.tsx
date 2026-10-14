import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, Share, PlusSquare, X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running standalone, hide the prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {/* Install Button Trigger */}
      <button
        onClick={handleInstallClick}
        aria-label="Install IdanApp"
        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
      >
        <Smartphone className="w-3.5 h-3.5 text-amber-300" />
        <span className="whitespace-nowrap">Install IdanApp</span>
      </button>

      {/* Guide Modal for iOS & Android Browsers */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setShowGuide(false)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 overflow-hidden">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* App Icon & Title */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/pwa-192x192.png"
                alt="IdanApp"
                className="w-12 h-12 rounded-xl shadow-xs"
              />
              <div>
                <h3 className="text-base font-bold text-stone-900">Install IdanApp</h3>
                <p className="text-xs text-stone-500">Ok Idanre Community Mobile App</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2 mb-5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Instant launch with full-screen experience</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Works offline during farm & hills travel</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Lightweight (less than 1MB), no app store needed</span>
              </div>
            </div>

            {/* Instructions */}
            {isIOS ? (
              <div className="space-y-3 mb-5 text-xs text-stone-700">
                <p className="font-semibold text-stone-900">Follow these 2 steps in Safari:</p>
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50 text-emerald-950 font-medium">
                  <Share className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <span>1. Tap the <strong>Share</strong> icon in the bottom Safari bar.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50 text-emerald-950 font-medium">
                  <PlusSquare className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <span>2. Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 mb-5 text-xs text-stone-700">
                <p className="font-semibold text-stone-900">How to install on Chrome / Android:</p>
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50 text-emerald-950 font-medium">
                  <Download className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <span>
                    Tap your browser menu (<strong>⋮</strong>) and select <strong>Install App</strong> or <strong>Add to Home screen</strong>.
                  </span>
                </div>
              </div>
            )}

            {isInstallable && (
              <button
                onClick={async () => {
                  await install();
                  setShowGuide(false);
                }}
                className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors mb-2"
              >
                <Download className="w-4 h-4" />
                Tap to Install Now
              </button>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
