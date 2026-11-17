import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getOrderedProjectSheets,
  IMAGES,
  ImageKey,
  ImageSurface,
  PROJECTS,
} from '../data/portfolioData';

export interface LightboxState {
  projectIndex: number;
  itemIndex: number; // 0 = hero image, 1..N = sheets
}

interface LightboxDialogProps {
  state: LightboxState | null;
  onClose: () => void;
  onChangeIndex: (nextItemIndex: number) => void;
}

interface LightboxSlide {
  key: ImageKey;
  caption: string;
  context?: string;
  surface: ImageSurface;
  fadeBottom?: boolean;
}

export const LightboxDialog: React.FC<LightboxDialogProps> = ({
  state,
  onClose,
  onChangeIndex,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchXRef = useRef<number | null>(null);
  const [showNotes, setShowNotes] = useState(false);

  const sequence = useMemo<LightboxSlide[]>(() => {
    if (!state) return [];
    const project = PROJECTS[state.projectIndex];
    if (!project) return [];
    const orderedSheets = getOrderedProjectSheets(project);
    return [
      {
        key: project.hero,
        caption: project.heroCap,
        surface: project.heroSurface ?? 'photo',
      },
      ...orderedSheets.map((s): LightboxSlide => {
        const catLabel = project.categoryTitles?.[s.category] ?? s.category;
        const fullContext = s.subgroup ? `${catLabel} · ${s.subgroup}` : catLabel;
        const capText = s.title && s.caption ? `${s.title} — ${s.caption}` : (s.title ?? s.caption ?? '');
        return {
          key: s.imageKey,
          caption: capText,
          context: fullContext,
          surface: s.surface ?? (s.fit === 'cover' ? 'photo' : 'sheet'),
          fadeBottom: s.fadeBottom,
        };
      }),
    ];
  }, [state]);

  const step = useCallback(
    (delta: number) => {
      if (!state || sequence.length === 0) return;
      const next = (state.itemIndex + delta + sequence.length) % sequence.length;
      onChangeIndex(next);
    },
    [state, sequence.length, onChangeIndex]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (state) {
      if (!dialog.open) {
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', '');
        }
      }
      document.body.style.overflow = 'hidden';
    } else {
      setShowNotes(false);
      if (dialog.open) {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [state]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('lb-stage') || target.classList.contains('lb-inner')) {
      onClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDialogElement>) => {
    touchXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDialogElement>) => {
    if (touchXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX;
    if (typeof endX === 'number') {
      const dx = endX - touchXRef.current;
      if (Math.abs(dx) > 50) {
        step(dx < 0 ? 1 : -1);
      }
    }
    touchXRef.current = null;
  };

  const currentProject = state ? PROJECTS[state.projectIndex] : null;
  const currentSlide = state ? sequence[state.itemIndex] : null;

  return (
    <dialog
      ref={dialogRef}
      className="lb"
      id="lb"
      aria-label="Drawing viewer"
      onClose={onClose}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="lb-inner">
        <div className="lb-top">
          <span id="lb-title">
            {currentProject && state
              ? `${currentProject.title}, ${state.itemIndex + 1} of ${sequence.length}`
              : ''}
          </span>
          <div className="lb-top-actions">
            {currentProject && (
              <button
                type="button"
                className="lb-notes-btn"
                aria-expanded={showNotes}
                onClick={() => setShowNotes((prev) => !prev)}
              >
                {showNotes ? 'Hide details' : 'Project details'}
              </button>
            )}
            <button
              type="button"
              id="lb-close"
              aria-label="Close viewer"
              onClick={onClose}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="lb-stage">
          <button
            type="button"
            className="lb-prev"
            id="lb-prev"
            aria-label="Previous drawing"
            onClick={() => step(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          {currentSlide && (
            <img
              key={currentSlide.key}
              id="lb-img"
              data-surface={currentSlide.surface}
              data-fade={currentSlide.fadeBottom ? 'bottom' : undefined}
              src={IMAGES[currentSlide.key]}
              alt={currentSlide.caption}
              referrerPolicy="no-referrer"
            />
          )}

          {showNotes && currentProject && (
            <aside className="lb-notes" aria-label={`${currentProject.title} project details`}>
              <h4>
                {currentProject.sem} · {currentProject.kind}
              </h4>
              <p>{currentProject.tag}</p>
              <h4>The brief</h4>
              <p>{currentProject.brief}</p>
              <h4>The idea</h4>
              <p>{currentProject.concept}</p>
              {currentProject.facts.map(([k, v]) => (
                <React.Fragment key={k}>
                  <h4>{k}</h4>
                  <p>{v}</p>
                </React.Fragment>
              ))}
            </aside>
          )}

          <button
            type="button"
            className="lb-next"
            id="lb-next"
            aria-label="Next drawing"
            onClick={() => step(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="lb-cap" id="lb-cap">
          {currentSlide
            ? currentSlide.context
              ? `${currentSlide.context} · ${currentSlide.caption}`
              : currentSlide.caption
            : ''}
        </div>
      </div>
    </dialog>
  );
};
