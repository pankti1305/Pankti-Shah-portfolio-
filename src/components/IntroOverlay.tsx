import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks/useInteractiveEnhancements';

let introPlayedInCurrentLoad = false;

/**
 * Determines whether the opening intro should play for the current page load.
 * Plays immediately when opening or refreshing the website URL, and stays
 * disabled during any internal client-side navigation within the loaded app
 * (or browser back/forward restoration).
 */
export function shouldShowPortfolioIntro(): boolean {
  if (typeof window === 'undefined') return false;
  if (introPlayedInCurrentLoad) return false;

  try {
    const entries = window.performance?.getEntriesByType?.('navigation') as
      | PerformanceNavigationTiming[]
      | undefined;
    const navType = entries?.[0]?.type;
    if (navType === 'back_forward') {
      return false;
    }
  } catch {
    // Ignore Performance API restrictions
  }

  return true;
}

interface IntroOverlayProps {
  onComplete: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');
  const completedRef = useRef(false);

  useEffect(() => {
    introPlayedInCurrentLoad = true;
    const reduced = prefersReducedMotion();
    const holdMs = reduced ? 1600 : 3050;
    const fadeMs = reduced ? 450 : 750;

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete();
    };

    const exitTimer = window.setTimeout(() => {
      setPhase('exit');
    }, holdMs);

    const doneTimer = window.setTimeout(finish, holdMs + fadeMs);

    // Fail-safe guard so the homepage is never permanently blocked
    const safetyTimer = window.setTimeout(finish, holdMs + fadeMs + 600);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      window.clearTimeout(safetyTimer);
    };
  }, [onComplete]);

  return (
    <div
      id="portfolio-intro-overlay"
      className={`intro-overlay${phase === 'exit' ? ' is-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio introduction"
      aria-hidden={phase === 'exit'}
    >
      <div className="intro-arch-bg" aria-hidden="true">
        <span className="intro-form intro-form-a" />
        <span className="intro-form intro-form-b" />
        <span className="intro-form intro-form-c" />
        <svg
          className="intro-drafting"
          viewBox="0 0 1200 720"
          preserveAspectRatio="xMidYMid slice"
        >
          <g className="intro-lines" fill="none" strokeLinecap="round">
            <line
              className="intro-rule-h"
              x1="80"
              y1="140"
              x2="1120"
              y2="140"
              stroke="#304B3C"
              strokeOpacity="0.14"
              strokeWidth="1"
            />
            <line
              className="intro-rule-h"
              x1="80"
              y1="580"
              x2="1120"
              y2="580"
              stroke="#304B3C"
              strokeOpacity="0.14"
              strokeWidth="1"
            />
            <line
              x1="220"
              y1="60"
              x2="220"
              y2="660"
              stroke="#304B3C"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
            <line
              x1="980"
              y1="60"
              x2="980"
              y2="660"
              stroke="#304B3C"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
            <path
              className="intro-arch-stroke"
              d="M360 660 V330 C360 197.45 467.45 90 600 90 C732.55 90 840 197.45 840 330 V660"
              stroke="#304B3C"
              strokeOpacity="0.24"
              strokeWidth="1.25"
            />
            <path
              className="intro-terracotta-arc"
              d="M445 620 V345 C445 259.4 514.4 190 600 190 C685.6 190 755 259.4 755 345 V620"
              stroke="#C66C43"
              strokeOpacity="0.6"
              strokeWidth="1.35"
            />
            <circle cx="600" cy="190" r="4.5" fill="#C66C43" fillOpacity="0.85" />
          </g>
        </svg>
      </div>

      <div className="intro-center">
        <span className="intro-kicker">Pankti Shah Studio</span>
        <h1 className="intro-title d">PORTFOLIO</h1>
        <span className="intro-rule" aria-hidden="true" />
        <p className="intro-subtitle">Interior Design | Selected Works</p>
      </div>
    </div>
  );
};
