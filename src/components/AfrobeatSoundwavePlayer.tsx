import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, Volume2, VolumeX, Flame, Music, Sparkles, Radio } from 'lucide-react';

export const AfrobeatSoundwavePlayer: React.FC = () => {
  const { awardPoints, playSound, themeConfig } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [votes, setVotes] = useState(58);
  const [hasVoted, setHasVoted] = useState(false);

  // Web Audio Synth references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const loopTimerRef = useRef<number | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const stepRef = useRef<number>(0);

  // Stop synthesizer on unmount
  useEffect(() => {
    return () => {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
        const masterGain = audioCtxRef.current.createGain();
        masterGain.gain.setValueAtTime(volume * 0.4, audioCtxRef.current.currentTime);
        masterGain.connect(audioCtxRef.current.destination);
        gainNodeRef.current = masterGain;
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Play a procedural Afrobeat step (16 steps per bar at ~104 BPM = ~144ms per 16th note)
  const playStep = () => {
    const ctx = audioCtxRef.current;
    const master = gainNodeRef.current;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const step = stepRef.current % 16;
    stepRef.current = (stepRef.current + 1) % 16;

    // 1. Kick Drum on beats 0, 4, 8, 12 + syncopated pickup on 14
    if (step === 0 || step === 4 || step === 8 || step === 12 || step === 14) {
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(120, now);
      kickOsc.frequency.exponentialRampToValueAtTime(32, now + 0.12);
      kickGain.gain.setValueAtTime(0.8, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      kickOsc.connect(kickGain);
      kickGain.connect(master);
      kickOsc.start(now);
      kickOsc.stop(now + 0.15);
    }

    // 2. Snare / Rimshot on steps 4 and 12
    if (step === 4 || step === 12) {
      const snareOsc = ctx.createOscillator();
      const snareGain = ctx.createGain();
      snareOsc.type = 'triangle';
      snareOsc.frequency.setValueAtTime(280, now);
      snareOsc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
      snareGain.gain.setValueAtTime(0.4, now);
      snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      snareOsc.connect(snareGain);
      snareGain.connect(master);
      snareOsc.start(now);
      snareOsc.stop(now + 0.1);
    }

    // 3. Shekere / Shaker on every 16th note with syncopated accents
    const isAccent = step % 4 === 2 || step === 7 || step === 15;
    const shakerOsc = ctx.createOscillator();
    const shakerGain = ctx.createGain();
    shakerOsc.type = 'sine';
    shakerOsc.frequency.setValueAtTime(isAccent ? 3800 : 2600, now);
    shakerGain.gain.setValueAtTime(isAccent ? 0.08 : 0.03, now);
    shakerGain.gain.exponentialRampToValueAtTime(0.0001, now + (isAccent ? 0.05 : 0.025));
    shakerOsc.connect(shakerGain);
    shakerGain.connect(master);
    shakerOsc.start(now);
    shakerOsc.stop(now + 0.06);

    // 4. Afrobeat Pentatonic Bassline groove (F - Ab - Bb - C)
    const bassNotes: { [key: number]: number } = {
      0: 87.31, // F2
      3: 103.83, // Ab2
      6: 116.54, // Bb2
      8: 87.31, // F2
      11: 130.81, // C3
      14: 116.54, // Bb2
    };

    if (bassNotes[step]) {
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bassNotes[step], now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(160, now + 0.2);

      bassGain.gain.setValueAtTime(0.3, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      bassOsc.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(master);

      bassOsc.start(now);
      bassOsc.stop(now + 0.25);
    }
  };

  const togglePlay = () => {
    initAudio();

    if (isPlaying) {
      if (loopTimerRef.current) {
        clearInterval(loopTimerRef.current);
        loopTimerRef.current = null;
      }
      setIsPlaying(false);
      playSound('click');
    } else {
      playSound('upvote');
      stepRef.current = 0;
      // 104 BPM = 16th note every 144.2ms
      loopTimerRef.current = window.setInterval(playStep, 144);
      setIsPlaying(true);
      awardPoints(10, 'Streamed Idanre Soundwave Track of the Week');
    }
  };

  const handleVoteTrack = () => {
    playSound('upvote');
    if (!hasVoted) {
      setVotes(v => v + 1);
      setHasVoted(true);
      awardPoints(10, 'Cheered Idanre Soundwave Track of the Week');
    } else {
      setVotes(v => v - 1);
      setHasVoted(false);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol * 0.4, audioCtxRef.current.currentTime);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 border border-emerald-300/60 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white shadow-xl">
      {/* Top Tag & Radio Indicator */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center">
            <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Idanre Soundwave · Track of the Week
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                104 BPM
              </span>
            </div>
            <p className="text-[11px] text-stone-300">
              Live Afrobeat Groove Synthesizer (DJ Idanre Boy & Atosin Soundworks)
            </p>
          </div>
        </div>

        <button
          onClick={handleVoteTrack}
          className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
            hasVoted
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="Cheer for this track"
        >
          <Flame className={`w-3.5 h-3.5 ${hasVoted ? 'fill-stone-950 text-stone-950' : 'text-amber-400'}`} />
          <span>{votes} Cheers</span>
        </button>
      </div>

      {/* Main Track Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          {/* Play / Pause Big Button */}
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-stone-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0"
            aria-label={isPlaying ? 'Pause Afrobeat rhythm' : 'Play Afrobeat rhythm'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-stone-950 stroke-stone-950" />
            ) : (
              <Play className="w-6 h-6 fill-stone-950 stroke-stone-950 ml-0.5" />
            )}
          </button>

          <div>
            <h4 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
              Hills of Oke (Afrobeat Highlife Mix)
            </h4>
            <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
              DJ Idanre Boy · Featuring Talking Drum & Shekere Grooves
            </p>
          </div>
        </div>

        {/* Animated Soundwave Equalizer Bars */}
        <div className="flex items-end gap-1.5 h-10 px-3 py-1 bg-black/30 rounded-xl border border-white/10 shrink-0 self-start sm:self-auto">
          {[40, 75, 55, 90, 65, 80, 45, 95, 70, 50, 85, 60].map((height, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-150 ${
                isPlaying
                  ? 'bg-gradient-to-t from-emerald-400 to-amber-300'
                  : 'bg-stone-600'
              }`}
              style={{
                height: isPlaying ? `${Math.max(15, (height * (0.6 + Math.sin(Date.now() / 200 + i) * 0.4)))}%` : '20%',
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{isPlaying ? 'Synthesizing Afrobeat percussion loop...' : 'Tap Play to start the rhythm'}</span>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2">
          {volume === 0 ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={e => handleVolumeChange(parseFloat(e.target.value))}
            className="w-20 accent-emerald-400 h-1.5 rounded-lg bg-stone-700 cursor-pointer"
            title="Adjust groove volume"
          />
        </div>
      </div>
    </div>
  );
};
