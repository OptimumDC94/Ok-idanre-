import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Palette,
  Sparkles,
  Download,
  Share2,
  RefreshCw,
  Check,
  Type,
  Sliders,
  Flame,
} from 'lucide-react';

export const CreativeStudioTab: React.FC = () => {
  const { user, awardPoints, playSound } = useApp();

  const [prompt, setPrompt] = useState('Mobilize youth across Idanre and Ifedore for the 2026 Oke Idanre Trail Cleanup and tree planting summit');
  const [theme, setTheme] = useState('Eco-Tourism & Hills Preservation');
  const [lgaFocus, setLgaFocus] = useState('Both');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTexture, setActiveTexture] = useState<string>('dots');
  const [activeBgImage, setActiveBgImage] = useState<string>('');
  const [posterData, setPosterData] = useState({
    headline: 'Stand Up for Oke Idanre Heritage',
    yorubaProverb: 'Agbajo owo la fi n soya',
    yorubaTranslation: 'Collective unity gives true strength and community victory',
    subheadline: 'Connecting Youth · Building Community · Creating Change',
    bulletPoints: [
      'Preserve the 682 ancient stone steps',
      'Plant indigenous trees and protect our watersheds',
      'Promote sustainable youth-led eco-tourism',
    ],
    callToAction: 'Join the Movement on Ok Idanre',
    colorPalette: {
      primary: '#047857',
      accent: '#f59e0b',
      bg: '#064e3b',
    },
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  const presets = [
    {
      title: 'Hills Eco-Cleanup',
      theme: 'Eco-Tourism & Hills Preservation',
      prompt: 'Clean the 682 steps of Oke Idanre, plant shade trees, and educate visitors on eco-preservation',
    },
    {
      title: 'Youth Agribusiness',
      theme: 'Cocoa & Agricultural Innovation',
      prompt: 'Empower young farmers in Ifedore and Idanre with modern cocoa processing and value addition technology',
    },
    {
      title: 'Cultural Festival',
      theme: 'Arts & Cultural Heritage',
      prompt: 'Celebrate Ondo cultural drums, poetry, adire textiles, and modern youth music',
    },
    {
      title: 'Community Tree Planting',
      theme: 'Community Action & Climate Care',
      prompt: 'Plant 500 economic trees across farming settlements in Atosin and Igbara-Oke',
    },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/create-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          theme,
          lga: lgaFocus,
          existingImage: activeBgImage,
        }),
      });

      const data = await response.json();
      if (data.poster) {
        setPosterData(data.poster);
        if (data.generatedImage) {
          setActiveBgImage(data.generatedImage);
        }
        awardPoints(20, 'Created youth community poster in Creative Studio!');
        setToastMessage('Community poster generated successfully!');
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setToastMessage('Using offline design layout template.');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    playSound('success');
    setToastMessage('Rendering high-res PNG poster...');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas unavailable');

      // Draw background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(0.5, '#022c22');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const finishExport = () => {
        // Decorative gold border
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 14;
        ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

        // Header Pill
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('OK IDANRE · YOUTH COMMUNITY ACTION', 70, 110);

        // Yoruba Proverb Banner
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(70, 150, canvas.width - 140, 130);
        ctx.fillStyle = '#fef08a';
        ctx.font = 'italic bold 34px serif';
        ctx.fillText(`"${posterData.yorubaProverb}"`, 95, 210);
        ctx.fillStyle = '#f3f4f6';
        ctx.font = '24px sans-serif';
        ctx.fillText(posterData.yorubaTranslation, 95, 255);

        // Headline
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 54px sans-serif';
        // Wrap headline if long
        const words = posterData.headline.split(' ');
        let line = '';
        let y = 360;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > canvas.width - 160 && n > 0) {
            ctx.fillText(line, 70, y);
            line = words[n] + ' ';
            y += 65;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 70, y);

        // Subheadline
        y += 45;
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '600 28px sans-serif';
        ctx.fillText(posterData.subheadline, 70, y);

        // Action Bullet Points
        y += 70;
        posterData.bulletPoints.forEach(point => {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(88, y - 8, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#f8fafc';
          ctx.font = '500 30px sans-serif';
          ctx.fillText(point, 120, y);
          y += 62;
        });

        // Call to Action Banner
        y = Math.max(y + 30, canvas.height - 240);
        ctx.fillStyle = '#047857';
        ctx.fillRect(70, y, canvas.width - 140, 90);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(posterData.callToAction, canvas.width / 2, y + 58);
        ctx.textAlign = 'left';

        // Footer Brand
        ctx.fillStyle = '#94a3b8';
        ctx.font = '22px sans-serif';
        ctx.fillText('Idanre & Ifedore, Ondo State · Ok Idanre Youth Platform', 70, canvas.height - 70);

        // Trigger download
        const imageURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${posterData.headline.replace(/[^a-zA-Z0-9]/g, '_')}_poster.png`;
        link.href = imageURL;
        link.click();
        setToastMessage('PNG poster downloaded successfully! 🎨');
        setTimeout(() => setToastMessage(null), 3000);
      };

      // Try drawing background image if available
      if (activeBgImage) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Dark overlay for readable typography
          ctx.fillStyle = 'rgba(6, 78, 59, 0.82)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          finishExport();
        };
        img.onerror = () => {
          finishExport();
        };
        img.src = activeBgImage;
      } else {
        finishExport();
      }
    } catch {
      setToastMessage('Export failed, please try again.');
      setTimeout(() => setToastMessage(null), 3000);
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

      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
            <Palette className="w-3.5 h-3.5" />
            AI Poster & Campaign Studio
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
            Create & Edit Community Posters
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            Use text prompts to design bold youth campaign flyers, meeting banners, and civic advocacy graphics for Idanre and Ifedore with bilingual Yoruba wisdom.
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="min-h-[44px] px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          Export Flyer
        </button>
      </div>

      {/* 2-Column Split: Controls on Left, Live Canvas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Prompt & Customization (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-white p-5 rounded-2xl border border-stone-200">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              1. Quick Theme Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map(p => (
                <button
                  key={p.title}
                  onClick={() => {
                    setPrompt(p.prompt);
                    setTheme(p.theme);
                  }}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-colors ${
                    theme === p.theme
                      ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-semibold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="font-bold truncate">{p.title}</div>
                  <div className="text-[10px] text-stone-500 line-clamp-1">{p.theme}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              2. Text Prompt / Campaign Goal
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the campaign, rally, forum, or activity..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Theme Category</label>
              <select
                value={theme}
                onChange={e => setTheme(e.target.value)}
                className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              >
                <option value="Eco-Tourism & Hills Preservation">Eco-Tourism & Hills</option>
                <option value="Cocoa & Agricultural Innovation">Cocoa & Agribusiness</option>
                <option value="Arts & Cultural Heritage">Cultural Heritage</option>
                <option value="Civic Leadership & Governance">Civic Leadership</option>
                <option value="Sports & Youth Derby">Youth Sports</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Target Community</label>
              <select
                value={lgaFocus}
                onChange={e => setLgaFocus(e.target.value)}
                className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              >
                <option value="Both">Idanre + Ifedore</option>
                <option value="Idanre">Idanre LGA</option>
                <option value="Ifedore">Ifedore LGA</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              3. Graphic Texture & Accent
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'Dots', id: 'dots' },
                { name: 'Grid', id: 'grid' },
                { name: 'Minimal', id: 'minimal' },
                { name: 'Diagonal', id: 'diagonal' },
              ].map(tex => (
                <button
                  key={tex.id}
                  onClick={() => setActiveTexture(tex.id)}
                  className={`p-2 rounded-xl text-center border text-xs font-semibold transition-all ${
                    activeTexture === tex.id
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-700/20'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  {tex.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating Campaign Concept...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Generate AI Poster Concept
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Poster Graphic (7 cols) */}
        <div className="lg:col-span-7">
          <div
            ref={posterRef}
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-300 text-white aspect-4/5 flex flex-col justify-between p-6 sm:p-8"
            style={{
              backgroundColor: posterData.colorPalette?.bg || '#064e3b',
            }}
          >
            {/* Background Graphic with Texture (No AI Images) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              {activeTexture === 'dots' && (
                <div
                  className="w-full h-full opacity-15"
                  style={{
                    backgroundImage: 'radial-gradient(currentColor 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              )}
              {activeTexture === 'grid' && (
                <div
                  className="w-full h-full opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(to right, currentColor 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />
              )}
              {activeTexture === 'diagonal' && (
                <div
                  className="w-full h-full opacity-10"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, currentColor, currentColor 1px, transparent 1px, transparent 16px)',
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
            </div>

            {/* Poster Top Bar */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs">
                  OK
                </div>
                <span className="font-bold text-sm tracking-wider uppercase text-amber-300">
                  Ok Idanre Youth Platform
                </span>
              </div>
              <span className="text-[11px] font-mono tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded">
                {lgaFocus === 'Both' ? 'Idanre & Ifedore' : `${lgaFocus} LGA`}
              </span>
            </div>

            {/* Poster Center Headline & Proverb */}
            <div className="relative z-10 space-y-4 my-auto">
              <div className="inline-block bg-amber-400 text-stone-950 font-mono text-[11px] font-extrabold uppercase px-3 py-1 rounded-md tracking-wider">
                Youth Action Movement
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
                {posterData.headline}
              </h2>

              <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <div className="text-xs text-amber-300 font-serif italic text-base">
                  "{posterData.yorubaProverb}"
                </div>
                <div className="text-[11px] text-stone-300 mt-0.5">
                  — {posterData.yorubaTranslation}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                {posterData.bulletPoints?.map((pt, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-stone-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Poster Footer CTA */}
            <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-stone-400 uppercase tracking-widest">
                  Connect · Mobilize · Transform
                </div>
                <div className="text-xs font-bold text-white">{posterData.subheadline}</div>
              </div>

              <div className="bg-amber-400 text-stone-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                {posterData.callToAction}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
