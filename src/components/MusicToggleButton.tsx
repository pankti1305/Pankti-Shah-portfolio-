import React, { useRef } from 'react';
import { useMagnetic } from '../hooks/useInteractiveEnhancements';

interface MusicToggleButtonProps {
  enabled: boolean;
  isPlaying: boolean;
  onToggle: () => void;
  variant?: 'header' | 'explorer';
}

export const MusicToggleButton: React.FC<MusicToggleButtonProps> = ({
  enabled,
  isPlaying,
  onToggle,
  variant = 'header',
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  useMagnetic(btnRef, 0.18);

  const activeVisual = enabled && isPlaying;

  return (
    <button
      ref={btnRef}
      type="button"
      className={`music-btn${variant === 'explorer' ? ' music-btn--explorer' : ''}`}
      data-on={enabled ? '1' : '0'}
      data-playing={activeVisual ? '1' : '0'}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn background music off' : 'Turn background music on'}
      title={enabled ? 'Music: On (click to mute)' : 'Music: Off (click to play)'}
      onClick={onToggle}
    >
      <span className="music-icon" aria-hidden="true">
        {enabled ? (
          <span className="music-bars">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <svg viewBox="0 0 24 24">
            <path
              d="M11 5L6 9H3v6h3l5 4V5z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M16 9l5 6M21 9l-5 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <span className="music-btn-t">{enabled ? 'Music On' : 'Music Off'}</span>
    </button>
  );
};
