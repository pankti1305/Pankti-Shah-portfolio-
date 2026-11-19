import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  GalleryCategory,
  getProjectGalleryGroups,
  IMAGES,
  ProjectGalleryGroup,
  ProjectGallerySubgroup,
  PROJECTS,
} from '../data/portfolioData';
import { prefersReducedMotion } from '../hooks/useInteractiveEnhancements';

interface ProjectExplorerDialogProps {
  projectIndex: number | null;
  isLightboxOpen: boolean;
  onClose: () => void;
  onOpenLightbox: (projectIndex: number, sheetIndex: number) => void;
}

export const ProjectExplorerDialog: React.FC<ProjectExplorerDialogProps> = ({
  projectIndex,
  isLightboxOpen,
  onClose,
  onOpenLightbox,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | null>(null);
  const [activeSubgroup, setActiveSubgroup] = useState<string>('__all__');

  const project = projectIndex !== null ? PROJECTS[projectIndex] ?? null : null;

  const galleryGroups: ProjectGalleryGroup[] = useMemo(
    () => (project ? getProjectGalleryGroups(project) : []),
    [project]
  );

  // Reset explorer back to Level 2 (Category Selection) whenever a project opens
  useEffect(() => {
    setSelectedCategory(null);
    setActiveSubgroup('__all__');
    if (overlayRef.current) {
      overlayRef.current.scrollTop = 0;
    }
  }, [projectIndex]);

  // Manage explorer DOM attribute & focus restoration
  useEffect(() => {
    const root = document.documentElement;
    if (projectIndex !== null) {
      if (!prevFocusRef.current) {
        prevFocusRef.current = document.activeElement as HTMLElement | null;
      }
      root.setAttribute('data-explorer', '1');
      overlayRef.current?.focus({ preventScroll: true });
    } else {
      root.removeAttribute('data-explorer');
      if (prevFocusRef.current) {
        prevFocusRef.current.focus?.({ preventScroll: true });
        prevFocusRef.current = null;
      }
    }

    return () => {
      root.removeAttribute('data-explorer');
    };
  }, [projectIndex]);

  const scrollOverlayTop = useCallback(() => {
    const el = overlayRef.current;
    if (!el) return;
    el.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, []);

  const handleOpenCategory = useCallback(
    (category: GalleryCategory) => {
      setSelectedCategory(category);
      setActiveSubgroup('__all__');
      requestAnimationFrame(scrollOverlayTop);
    },
    [scrollOverlayTop]
  );

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
    setActiveSubgroup('__all__');
    requestAnimationFrame(scrollOverlayTop);
  }, [scrollOverlayTop]);

  const activeGroupIndex =
    selectedCategory !== null
      ? galleryGroups.findIndex((g) => g.category === selectedCategory)
      : -1;
  const activeGroup = activeGroupIndex >= 0 ? galleryGroups[activeGroupIndex] : null;
  const prevGroup = activeGroupIndex > 0 ? galleryGroups[activeGroupIndex - 1] : null;
  const nextGroup =
    activeGroupIndex >= 0 && activeGroupIndex < galleryGroups.length - 1
      ? galleryGroups[activeGroupIndex + 1]
      : null;

  // Escape key closes Lightbox first (handled in LightboxDialog), otherwise closes Explorer
  useEffect(() => {
    if (projectIndex === null || isLightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [projectIndex, isLightboxOpen, onClose]);

  const visibleSubgroups: ProjectGallerySubgroup[] = useMemo(() => {
    if (!activeGroup?.subgroups) return [];
    if (activeSubgroup === '__all__') return activeGroup.subgroups;
    return activeGroup.subgroups.filter((s) => s.title === activeSubgroup);
  }, [activeGroup, activeSubgroup]);

  if (projectIndex === null || !project) return null;

  const isConceptCategory =
    activeGroup &&
    (activeGroup.category === 'Moodboard' ||
      (project.id === 'block-and-flow' && activeGroup.category === 'Other Project Visuals'));

  const renderSubgroup = (
    sub: ProjectGallerySubgroup,
    headingId: string,
    subIndex: number,
    hideSubheading = false
  ) => (
    <div key={sub.title} className="gallery-subgroup">
      {!hideSubheading && (
        <div className="gallery-subhead">
          <h4
            id={`${headingId}-sub-${subIndex}`}
            className="gallery-subtitle d interactive-heading"
          >
            {sub.title}
          </h4>
          <span className="meta">
            {sub.items.length} {sub.items.length === 1 ? 'sheet' : 'sheets'}
          </span>
        </div>
      )}
      {sub.description && <p className="gallery-subdesc">{sub.description}</p>}
      <div
        className="gallery-grid"
        data-count={sub.items.length}
        data-layout={sub.layout}
        style={{ '--card-ar': sub.aspectRatio } as React.CSSProperties}
      >
        {sub.items.map(({ sheet, orderedIndex }, itemIdx) => (
          <button
            key={sheet.imageKey}
            className="sheet gallery-card"
            type="button"
            data-key={sheet.imageKey}
            data-fit={sheet.fit ?? 'contain'}
            data-surface={sheet.surface ?? (sheet.fit === 'cover' ? 'photo' : 'sheet')}
            data-fade={sheet.fadeBottom ? 'bottom' : undefined}
            data-wide={sheet.panoramic ? '1' : undefined}
            data-role={
              sub.layout === 'plan-elevations' && itemIdx === 0 ? 'plan' : undefined
            }
            style={
              sheet.ar ? ({ '--item-ar': sheet.ar } as React.CSSProperties) : undefined
            }
            onClick={() => onOpenLightbox(projectIndex, orderedIndex)}
            aria-label={
              sheet.title || sheet.caption
                ? `Open ${sub.title}: ${sheet.title ?? sheet.caption}`
                : `Open ${sub.title} view ${itemIdx + 1}`
            }
          >
            <div className="gallery-frame">
              <img
                src={IMAGES[sheet.imageKey]}
                alt={
                  sheet.title
                    ? sheet.caption
                      ? `${sheet.title} — ${sheet.caption}`
                      : sheet.title
                    : (sheet.caption ?? `${sub.title} view ${itemIdx + 1}`)
                }
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
            {sheet.title && <strong className="gallery-card-title">{sheet.title}</strong>}
            {sheet.caption && <span className="gallery-caption">{sheet.caption}</span>}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="explorer"
      aria-label={`${project.title} project explorer`}
    >
      <header className="explorer-top">
        <div className="wrap explorer-top-inner">
          <div className="explorer-top-left">
            {activeGroup ? (
              <button
                type="button"
                className="explorer-back-btn"
                onClick={handleBackToCategories}
              >
                <span aria-hidden="true">←</span> Back to Categories
              </button>
            ) : (
              <span className="meta explorer-crumb">
                {project.sem} · {project.kind}
                {project.location ? ` · ${project.location}` : ''}
              </span>
            )}
          </div>

          <div className="explorer-top-title">
            <span>{project.title}</span>
            {activeGroup && (
              <span className="explorer-top-cat">
                {' '}
                / {String(activeGroupIndex + 1).padStart(2, '0')} · {activeGroup.title}
              </span>
            )}
          </div>

          <div className="explorer-top-right">
            {activeGroup && (
              <div className="explorer-top-steppers">
                <button
                  type="button"
                  className="explorer-step-btn"
                  disabled={!prevGroup}
                  onClick={() => prevGroup && handleOpenCategory(prevGroup.category)}
                  aria-label={prevGroup ? `Previous category: ${prevGroup.title}` : 'No previous category'}
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  className="explorer-step-btn"
                  disabled={!nextGroup}
                  onClick={() => nextGroup && handleOpenCategory(nextGroup.category)}
                  aria-label={nextGroup ? `Next category: ${nextGroup.title}` : 'No next category'}
                >
                  Next →
                </button>
              </div>
            )}
            <button
              type="button"
              className="explorer-close-btn"
              onClick={onClose}
              aria-label="Close project explorer"
            >
              <span>Close</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="explorer-body">
        <div className="wrap">
          {!activeGroup ? (
            /* LEVEL 2: PROJECT CATEGORY SELECTION */
            <div className="explorer-level-2" key={`lvl2-${project.id}`}>
              <div className="explorer-intro">
                <span className="meta explorer-eyebrow">Explore the Project</span>
                <h2 className="d interactive-heading">{project.title}</h2>
                <p className="explorer-instruction">
                  Select a category to explore the design process and project details.
                </p>
              </div>

              <div className="explorer-cat-grid" data-count={galleryGroups.length}>
                {galleryGroups.map((group, idx) => {
                  const lead = group.items[0]?.sheet;
                  const thumbSrc = lead ? IMAGES[lead.imageKey] : undefined;
                  const thumbSurface =
                    lead?.surface ?? (lead?.fit === 'cover' ? 'photo' : 'sheet');

                  return (
                    <button
                      key={group.category}
                      type="button"
                      className="explorer-cat-card"
                      data-surface={thumbSurface}
                      onClick={() => handleOpenCategory(group.category)}
                    >
                      {thumbSrc && (
                        <div className="explorer-cat-thumb">
                          <img
                            src={thumbSrc}
                            alt={`${group.title} preview`}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="explorer-cat-info">
                        <span className="explorer-cat-num">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className="explorer-cat-name d">{group.title}</h3>
                        {group.description && (
                          <p className="explorer-cat-desc">{group.description}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* LEVEL 3: CATEGORY DETAIL / CONTENT VIEW */
            <article
              className="explorer-level-3"
              key={`lvl3-${project.id}-${activeGroup.category}`}
              aria-labelledby={`exp-cat-h-${project.id}`}
            >
              <div className="explorer-detail-head">
                <span className="meta explorer-detail-num">
                  Chapter {String(activeGroupIndex + 1).padStart(2, '0')} of{' '}
                  {String(galleryGroups.length).padStart(2, '0')}
                </span>
                <div className="gallery-head">
                  <h2
                    id={`exp-cat-h-${project.id}`}
                    data-category={activeGroup.category}
                    className="explorer-detail-title d interactive-heading"
                  >
                    {activeGroup.title}
                  </h2>
                  <span className="meta">
                    {activeGroup.items.length}{' '}
                    {activeGroup.items.length === 1 ? 'sheet' : 'sheets'}
                  </span>
                </div>
                {activeGroup.description && (
                  <p className="explorer-detail-desc">{activeGroup.description}</p>
                )}
              </div>

              {isConceptCategory && (
                <div className="explorer-concept-context">
                  <div className="explorer-concept-copy">
                    <h4>Design Concept</h4>
                    <p>{project.concept}</p>
                    {project.vibes && (
                      <div className="vibes">
                        {project.vibes.map((vibe) => (
                          <span key={vibe}>{vibe}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {project.palette && (
                    <div className="explorer-concept-palette">
                      <h4>Material &amp; Colour Palette</h4>
                      <div className="chips">
                        {project.palette.map((swatch) => (
                          <span className="chip" key={swatch.name}>
                            <i style={{ background: swatch.color }} />
                            {swatch.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeGroup.subgroups && activeGroup.subgroups.length > 0 && (
                <div
                  className="subcat-nav"
                  role="tablist"
                  aria-label={`${activeGroup.title} spaces and sections`}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeSubgroup === '__all__'}
                    className="subcat-btn"
                    data-active={activeSubgroup === '__all__' ? '1' : undefined}
                    onClick={() => setActiveSubgroup('__all__')}
                  >
                    <span>All</span>
                    <span className="subcat-count">{activeGroup.items.length}</span>
                  </button>
                  {activeGroup.subgroups.map((sub) => {
                    const isSubActive = activeSubgroup === sub.title;
                    return (
                      <button
                        key={sub.title}
                        type="button"
                        role="tab"
                        aria-selected={isSubActive}
                        className="subcat-btn"
                        data-active={isSubActive ? '1' : undefined}
                        onClick={() => setActiveSubgroup(sub.title)}
                      >
                        <span>{sub.title}</span>
                        <span className="subcat-count">{sub.items.length}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {activeGroup.subgroups ? (
                <div className="gallery-subgroups">
                  {visibleSubgroups.map((sub, subIndex) =>
                    renderSubgroup(
                      sub,
                      `exp-${project.id}-cat-${activeGroupIndex}`,
                      subIndex,
                      false
                    )
                  )}
                </div>
              ) : (
                <div
                  className="gallery-grid"
                  data-count={activeGroup.items.length}
                  data-layout={activeGroup.isCurated ? 'curated' : 'grid'}
                  data-panoramic={activeGroup.isPanoramic ? '1' : '0'}
                  style={{ '--card-ar': activeGroup.aspectRatio } as React.CSSProperties}
                >
                  {activeGroup.items.map(({ sheet, orderedIndex }) => (
                    <button
                      key={sheet.imageKey}
                      className="sheet gallery-card"
                      type="button"
                      data-key={sheet.imageKey}
                      data-fit={sheet.fit ?? 'contain'}
                      data-surface={
                        sheet.surface ?? (sheet.fit === 'cover' ? 'photo' : 'sheet')
                      }
                      data-fade={sheet.fadeBottom ? 'bottom' : undefined}
                      data-wide={sheet.panoramic ? '1' : undefined}
                      data-span={sheet.span}
                      style={
                        sheet.ar
                          ? ({ '--item-ar': sheet.ar } as React.CSSProperties)
                          : undefined
                      }
                      onClick={() => onOpenLightbox(projectIndex, orderedIndex)}
                      aria-label={
                        sheet.title || sheet.caption
                          ? `Open ${activeGroup.title}: ${sheet.title ?? sheet.caption}`
                          : `Open ${activeGroup.title}`
                      }
                    >
                      <div className="gallery-frame">
                        <img
                          src={IMAGES[sheet.imageKey]}
                          alt={sheet.caption ?? sheet.title ?? activeGroup.title}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      {sheet.title && (
                        <strong className="gallery-card-title">{sheet.title}</strong>
                      )}
                      {sheet.caption && (
                        <span className="gallery-caption">{sheet.caption}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="cat-pager" aria-label="Category navigation">
                <div className="cat-pager-side">
                  {prevGroup && (
                    <button
                      type="button"
                      className="cat-pager-btn"
                      onClick={() => handleOpenCategory(prevGroup.category)}
                    >
                      <span aria-hidden="true">←</span> {prevGroup.title}
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="cat-pager-btn cat-pager-overview"
                  onClick={handleBackToCategories}
                >
                  Back to Categories
                </button>
                <div className="cat-pager-side cat-pager-right">
                  {nextGroup && (
                    <button
                      type="button"
                      className="cat-pager-btn"
                      onClick={() => handleOpenCategory(nextGroup.category)}
                    >
                      {nextGroup.title} <span aria-hidden="true">→</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
};
