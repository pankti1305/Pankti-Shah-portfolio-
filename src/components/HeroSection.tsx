import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IMAGES } from '../data/portfolioData';
import { useMagnetic } from '../hooks/useInteractiveEnhancements';
import { HeroScene3D } from './HeroScene3D';

interface HeroSectionProps {
  night: boolean;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ night, onNavigate }) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  useMagnetic(ctaRef, 0.22);

  useEffect(() => {
    let timer = 0;
    const raf = requestAnimationFrame(() => {
      timer = window.setTimeout(() => setHeroLoaded(true), 120);
    });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  const handleFallback = useCallback(() => {
    setWebglFailed(true);
  }, []);

  return (
    <section
      ref={heroRef}
      className={`hero${webglFailed ? ' no-gl' : ''}${heroLoaded ? '' : ' hero-load'}`}
      id="home"
      aria-label="Introduction"
    >
      <div className="hero-pin">
        {!webglFailed && (
          <HeroScene3D
            night={night}
            heroRef={heroRef}
            copyRef={copyRef}
            onWebGLUnavailable={handleFallback}
          />
        )}
        <img
          className="hero-fallback"
          src={IMAGES.cover}
          alt="Stacked architectural frames illustration"
          referrerPolicy="no-referrer"
        />
        <div className="hero-copy" ref={copyRef}>
          <div className="wrap">
            <div>
              <p className="hero-sub">
                Interior design student at Indus University, Ahmedabad, shaping spaces around the
                people who live, learn and shop in them.
              </p>
              <h1 className="d hero-name">
                <span>Pankti</span>
                <span>Shah</span>
              </h1>
            </div>
            <div className="hero-side">
              <a
                ref={ctaRef}
                href="#work"
                onClick={(e) => onNavigate(e, 'work')}
              >
                <span>See the work</span>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 3v10M4 9l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <span className="meta hero-hint">
                Drag to turn the rooms, scroll to pull them apart
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
