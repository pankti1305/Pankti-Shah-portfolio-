import React, { useRef } from 'react';
import { useMagnetic } from '../hooks/useInteractiveEnhancements';
import { MusicToggleButton } from './MusicToggleButton';

export type NavGroup = 'work' | 'about' | 'contact' | null;

interface HeaderProps {
  scrolled: boolean;
  activeNav: NavGroup;
  night: boolean;
  musicEnabled: boolean;
  musicPlaying: boolean;
  onToggleTheme: () => void;
  onToggleMusic: () => void;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  scrolled,
  activeNav,
  night,
  musicEnabled,
  musicPlaying,
  onToggleTheme,
  onToggleMusic,
  onNavigate,
}) => {
  const lampRef = useRef<HTMLButtonElement>(null);
  useMagnetic(lampRef, 0.2);

  return (
    <header className={`top${scrolled ? ' scrolled' : ''}`} id="top">
      <div className="wrap">
        <a
          className="brand"
          href="#home"
          onClick={(e) => onNavigate(e, 'home')}
        >
          Pankti Shah
        </a>
        <nav className="nav" aria-label="Main">
          <a
            href="#work"
            aria-current={activeNav === 'work' ? 'true' : undefined}
            onClick={(e) => onNavigate(e, 'work')}
          >
            Work
          </a>
          <a
            href="#about"
            aria-current={activeNav === 'about' ? 'true' : undefined}
            onClick={(e) => onNavigate(e, 'about')}
          >
            About
          </a>
          <a
            href="#contact"
            aria-current={activeNav === 'contact' ? 'true' : undefined}
            onClick={(e) => onNavigate(e, 'contact')}
          >
            Contact
          </a>
          <MusicToggleButton
            enabled={musicEnabled}
            isPlaying={musicPlaying}
            onToggle={onToggleMusic}
            variant="header"
          />
          <button
            ref={lampRef}
            className="lamp"
            id="lamp"
            type="button"
            aria-pressed={night}
            aria-label={night ? 'Switch to day lighting' : 'Switch to night lighting'}
            onClick={onToggleTheme}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2v5" stroke="currentColor" strokeWidth="1.4" fill="none" />
              <path
                d="M5 13a7 6 0 0 1 14 0z"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinejoin="round"
              />
              <circle className="glow" cx="12" cy="17" r="3.2" />
              <path
                d="M10 15.6a2.4 2.4 0 0 0 4 0"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
              />
            </svg>
            <span className="lamp-t">{night ? 'Day' : 'Night'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
