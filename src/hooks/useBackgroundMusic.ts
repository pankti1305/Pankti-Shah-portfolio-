import { useCallback, useEffect, useRef, useState } from 'react';

const MUSIC_PREF_KEY = 'portfolio_music_pref';
const AUDIO_SRC = '/audio/portfolio-ambient.mp3';
const TARGET_VOLUME = 0.28;

// Gentle fallback ambient pad chords (pure warm sine swells, no piano or sharp attacks)
const FALLBACK_PADS: number[][] = [
  [54, 57, 61, 64], // Dmaj9
  [52, 57, 61, 66], // A6/C#
  [54, 57, 59, 64], // Bm9
  [55, 59, 62, 66], // Gmaj9
];

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

interface BackgroundMusicState {
  enabled: boolean;
  isPlaying: boolean;
  toggle: () => void;
}

export function useBackgroundMusic(): BackgroundMusicState {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const saved = window.sessionStorage.getItem(MUSIC_PREF_KEY);
      return saved === null ? true : saved === '1';
    } catch {
      return true;
    }
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const enabledRef = useRef<boolean>(enabled);
  enabledRef.current = enabled;

  const audioFailedRef = useRef<boolean>(false);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const padTimerRef = useRef<number | null>(null);
  const padIndexRef = useRef<number>(0);

  const ensureFallbackContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!ctxRef.current) {
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(620, ctx.currentTime);
      lp.Q.setValueAtTime(0.5, ctx.currentTime);

      master.connect(lp);
      lp.connect(ctx.destination);

      ctxRef.current = ctx;
      masterGainRef.current = master;
    }
    return ctxRef.current;
  }, []);

  const triggerWarmPadChord = useCallback((chord: number[], time: number) => {
    const ctx = ctxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    chord.forEach((midi, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(midiToFreq(midi), time);
      osc.detune.setValueAtTime(idx % 2 === 0 ? 3 : -3, time);

      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.045, time + 1.2);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 4.2);

      osc.connect(g);
      g.connect(master);
      osc.start(time);
      osc.stop(time + 4.3);
    });
  }, []);

  const stopFallbackPad = useCallback(() => {
    if (padTimerRef.current !== null) {
      window.clearInterval(padTimerRef.current);
      padTimerRef.current = null;
    }
    const ctx = ctxRef.current;
    const master = masterGainRef.current;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.12);
    }
  }, []);

  const startFallbackPad = useCallback(async (): Promise<boolean> => {
    const ctx = ensureFallbackContext();
    const master = masterGainRef.current;
    if (!ctx || !master) return false;

    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      if (ctx.state !== 'running') {
        return false;
      }

      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0.24, ctx.currentTime, 0.35);

      if (padTimerRef.current === null) {
        triggerWarmPadChord(FALLBACK_PADS[padIndexRef.current], ctx.currentTime + 0.05);
        padIndexRef.current = (padIndexRef.current + 1) % FALLBACK_PADS.length;

        padTimerRef.current = window.setInterval(() => {
          const activeCtx = ctxRef.current;
          if (!activeCtx || !enabledRef.current || activeCtx.state !== 'running') return;
          triggerWarmPadChord(FALLBACK_PADS[padIndexRef.current], activeCtx.currentTime + 0.05);
          padIndexRef.current = (padIndexRef.current + 1) % FALLBACK_PADS.length;
        }, 3200);
      }
      return true;
    } catch {
      return false;
    }
  }, [ensureFallbackContext, triggerWarmPadChord]);

  const stopPlayback = useCallback(() => {
    if (audioElRef.current) {
      audioElRef.current.pause();
    }
    stopFallbackPad();
    setIsPlaying(false);
  }, [stopFallbackPad]);

  const startPlayback = useCallback(async (): Promise<boolean> => {
    if (!enabledRef.current) return false;

    if (!audioFailedRef.current) {
      try {
        if (!audioElRef.current) {
          const el = new Audio(AUDIO_SRC);
          el.loop = true;
          el.volume = TARGET_VOLUME;
          el.preload = 'auto';
          el.addEventListener('error', () => {
            audioFailedRef.current = true;
            if (enabledRef.current) {
              void startFallbackPad().then((ok) => setIsPlaying(ok));
            }
          });
          audioElRef.current = el;
        }
        audioElRef.current.volume = TARGET_VOLUME;
        await audioElRef.current.play();
        setIsPlaying(true);
        return true;
      } catch {
        return false;
      }
    }

    const ok = await startFallbackPad();
    if (ok) {
      setIsPlaying(true);
    }
    return ok;
  }, [startFallbackPad]);

  // Attempt autoplay on mount & unlock smoothly on first natural interaction if browser blocks autoplay
  useEffect(() => {
    let unlocked = false;

    const cleanupListeners = () => {
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('scroll', onFirstInteraction);
    };

    const tryStart = async () => {
      if (!enabledRef.current || unlocked) return;
      const started = await startPlayback();
      if (started) {
        unlocked = true;
        cleanupListeners();
      }
    };

    const onFirstInteraction = () => {
      if (!enabledRef.current) return;
      void tryStart();
    };

    if (enabledRef.current) {
      void tryStart();
      window.addEventListener('pointerdown', onFirstInteraction, { passive: true });
      window.addEventListener('touchstart', onFirstInteraction, { passive: true });
      window.addEventListener('keydown', onFirstInteraction, { passive: true });
      window.addEventListener('click', onFirstInteraction, { passive: true });
      window.addEventListener('scroll', onFirstInteraction, { passive: true });
    }

    return () => {
      cleanupListeners();
      stopPlayback();
      if (audioElRef.current) {
        audioElRef.current.src = '';
        audioElRef.current = null;
      }
      if (ctxRef.current) {
        void ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, [startPlayback, stopPlayback]);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      enabledRef.current = next;
      try {
        window.sessionStorage.setItem(MUSIC_PREF_KEY, next ? '1' : '0');
      } catch {
        // ignore storage restrictions
      }
      if (next) {
        void startPlayback();
      } else {
        stopPlayback();
      }
      return next;
    });
  }, [startPlayback, stopPlayback]);

  return {
    enabled,
    isPlaying,
    toggle,
  };
}
