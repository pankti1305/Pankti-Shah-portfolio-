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
  globalItemIndex: number;
}

export const LightboxDialog: React.FC<LightboxDialogProps> = ({
  state,
  onClose,
  onChangeIndex,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const touchXRef = useRef<number | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const { scopedSequence, currentScopeIdx, currentProject } = useMemo(() => {
    if (!state) {
      return {
        scopedSequence: [] as LightboxSlide[],
        currentScopeIdx: 0,
        currentProject: null,
      };
    }

    const project = PROJECTS[state.projectIndex];
    if (!project) {
      return {
        scopedSequence: [] as LightboxSlide[],
        currentScopeIdx: 0,
        currentProject: null,
      };
    }

    if (state.itemIndex <= 0) {
      return {
        scopedSequence: [
          {
            key: project.hero,
            caption: project.heroCap,
            surface: project.heroSurface ?? 'photo',
            globalItemIndex: 0,
          },
        ],
        currentScopeIdx: 0,
        currentProject: project,
      };
    }

    const orderedSheets = getOrderedProjectSheets(project);
    const activeSheet = orderedSheets[state.itemIndex - 1];
    if (!activeSheet) {
      return {
        scopedSequence: [] as LightboxSlide[],
        currentScopeIdx: 0,
        currentProject: project,
      };
    }

    const slides: LightboxSlide[] = [];
    orderedSheets.forEach((s, idx) => {
      const sameCategory = s.category === activeSheet.category;
      const sameSubgroup = activeSheet.subgroup
        ? s.subgroup === activeSheet.subgroup
        : !s.subgroup;
      if (!sameCategory || !sameSubgroup) return;

      const catLabel = project.categoryTitles?.[s.category] ?? s.category;
      const fullContext = s.subgroup ? `${catLabel} · ${s.subgroup}` : catLabel;
      const capText =
        s.title && s.caption
          ? `${s.title} — ${s.caption}`
          : (s.title ?? s.caption ?? '');

      slides.push({
        key: s.imageKey,
        caption: capText,
        context: fullContext,
        surface: s.surface ?? (s.fit === 'cover' ? 'photo' : 'sheet'),
        globalItemIndex: idx + 1,
      });
    });

    const scopeIdx = Math.max(
      0,
      slides.findIndex((slide) => slide.globalItemIndex === state.itemIndex)
    );

    return {
      scopedSequence: slides,
      currentScopeIdx: scopeIdx,
      currentProject: project,
    };
  }, [state]);

  const step = useCallback(
    (delta: number) => {
      if (!state || scopedSequence.length <= 1) return;
      const nextPos =
        (currentScopeIdx + delta + scopedSequence.length) % scopedSequence.length;
      onChangeIndex(scopedSequence[nextPos].globalItemIndex);
    },
    [state, scopedSequence, currentScopeIdx, onChangeIndex]
  );

  useEffect(() => {
    const root = document.documentElement;
    if (state) {
      if (!prevFocusRef.current) {
        prevFocusRef.current = document.activeElement as HTMLElement | null;
      }
      root.setAttribute('data-lightbox', '1');
      document.body.style.overflow = 'hidden';
      containerRef.current?.focus({ preventScroll: true });
    } else {
      setShowNotes(false);
      setZoomed(false);
      root.removeAttribute('data-lightbox');
      document.body.style.overflow = '';
      if (prevFocusRef.current) {
        prevFocusRef.current.focus?.({ preventScroll: true });
        prevFocusRef.current = null;
      }
    }

    return () => {
      root.removeAttribute('data-lightbox');
      document.body.style.overflow = '';
    };
  }, [state]);

  useEffect(() => {
    if (!state) return;
    const onWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setZoomed(false);
        step(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setZoomed(false);
        step(-1);
      }
    };
    window.addEventListener('keydown', onWindowKeyDown);
    return () => window.removeEventListener('keydown', onWindowKeyDown);
  }, [state, onClose, step]);

  if (!state) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('lb-stage') || target.classList.contains('lb-inner')) {
      onClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
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

  const currentSlide = scopedSequence[currentScopeIdx] ?? null;
  const hasMultiple = scopedSequence.length > 1;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="lb"
      id="lb"
      aria-label="Drawing viewer"
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="lb-inner">
        <div className="lb-top">
          <span id="lb-title">
            {currentProject
              ? hasMultiple
                ? `${currentProject.title}, ${currentScopeIdx + 1} of ${scopedSequence.length}`
                : currentProject.title
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

        <div className="lb-stage" data-zoomed={zoomed ? '1' : undefined}>
          {hasMultiple && (
            <button
              type="button"
              className="lb-prev"
              id="lb-prev"
              aria-label="Previous drawing"
              onClick={() => {
                setZoomed(false);
                step(-1);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
          )}

          {currentSlide && (
            <img
              key={currentSlide.key}
              id="lb-img"
              data-surface={currentSlide.surface}
              src={IMAGES[currentSlide.key]}
              alt={currentSlide.caption}
              decoding="sync"
              fetchPriority="high"
              onClick={() => setZoomed((prev) => !prev)}
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

          {hasMultiple && (
            <button
              type="button"
              className="lb-next"
              id="lb-next"
              aria-label="Next drawing"
              onClick={() => {
                setZoomed(false);
                step(1);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        <div className="lb-cap" id="lb-cap">
          {currentSlide
            ? currentSlide.context && currentSlide.caption
              ? `${currentSlide.context} · ${currentSlide.caption}`
              : currentSlide.context || currentSlide.caption
            : ''}
        </div>
      </div>
    </div>
  );
};
