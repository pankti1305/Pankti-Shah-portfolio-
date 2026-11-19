import React, { useEffect, useRef } from 'react';
import {
  IMAGES,
  Project,
  PROJECTS,
} from '../data/portfolioData';
import {
  isFinePointer,
  prefersReducedMotion,
  useMagnetic,
  useSubtleParallax,
} from '../hooks/useInteractiveEnhancements';

interface CaseStudySectionProps {
  onOpenLightbox: (projectIndex: number, sheetIndex: number) => void;
  onExploreProject: (projectIndex: number) => void;
}

interface CaseItemProps {
  project: Project;
  projectIndex: number;
  onOpenLightbox: (projectIndex: number, sheetIndex: number) => void;
  onExploreProject: (projectIndex: number) => void;
}

const CaseStudyItem: React.FC<CaseItemProps> = ({
  project,
  projectIndex,
  onOpenLightbox,
  onExploreProject,
}) => {
  const tiltRef = useRef<HTMLButtonElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const exploreBtnRef = useRef<HTMLButtonElement>(null);
  const ghBtnRef = useRef<HTMLAnchorElement>(null);

  useSubtleParallax(parallaxRef, 12);
  useMagnetic(exploreBtnRef, 0.16);
  useMagnetic(ghBtnRef, 0.16);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.transition = 'transform .12s linear,box-shadow .6s';
      el.style.transform = `rotateY(${(x - 0.5) * 9}deg) rotateX(${(0.5 - y) * 7}deg) translateZ(0)`;
      el.style.setProperty('--gx', `${x * 100}%`);
      el.style.setProperty('--gy', `${y * 100}%`);
      el.style.boxShadow = `${(0.5 - x) * 40}px ${50 + (0.5 - y) * 20}px 90px -40px rgba(0,0,0,.55)`;
    };

    const onLeave = () => {
      el.style.transition = '';
      el.style.transform = '';
      el.style.boxShadow = '';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section className="case" id={project.id} aria-labelledby={`${project.id}-h`}>
      <div className="wrap">
        <div className="case-head" data-reveal style={{ '--stagger': 0 } as React.CSSProperties}>
          <span className="meta">
            {project.sem}
            <br />
            {project.kind}
            {project.location ? (
              <>
                <br />
                {project.location}
              </>
            ) : null}
          </span>
          <h3 className="d interactive-heading" id={`${project.id}-h`}>
            {project.title}
          </h3>
          <p className="tag">{project.tag}</p>
        </div>

        <div className="case-body">
          <figure className="figure" data-reveal style={{ '--stagger': 1 } as React.CSSProperties}>
            <div ref={parallaxRef} className="figure-parallax">
              <button
                ref={tiltRef}
                className="tilt"
                type="button"
                data-surface={project.heroSurface ?? 'photo'}
                style={{ '--ar': project.ar } as React.CSSProperties}
                onClick={() => onOpenLightbox(projectIndex, -1)}
                aria-label={`Enlarge: ${project.heroCap}`}
              >
                <img
                  src={IMAGES[project.hero]}
                  alt={project.heroCap}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </button>
            </div>
            <figcaption>{project.heroCap}</figcaption>
          </figure>

          <div className="text" data-reveal style={{ '--stagger': 2 } as React.CSSProperties}>
            <h4>The brief</h4>
            <p>{project.brief}</p>
            <h4>The idea</h4>
            <p>{project.concept}</p>
            {project.vibes && (
              <>
                <h4>Brand character</h4>
                <div className="vibes">
                  {project.vibes.map((vibe) => (
                    <span key={vibe}>{vibe}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="facts" data-reveal style={{ '--stagger': 1 } as React.CSSProperties}>
          <dl>
            {project.facts.map(([label, value]) => (
              <React.Fragment key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </React.Fragment>
            ))}
          </dl>

          {project.palette && (
            <div className="palette">
              <h4>Palette</h4>
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

        <div className="files" data-reveal style={{ '--stagger': 1 } as React.CSSProperties}>
          <button
            ref={exploreBtnRef}
            type="button"
            className="btn explore-btn"
            onClick={() => onExploreProject(projectIndex)}
          >
            EXPLORE COMPLETE PROJECT
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {project.githubUrl && (
            <a
              ref={ghBtnRef}
              className="btn"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
              </svg>
              View on GitHub
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export const CaseStudySection: React.FC<CaseStudySectionProps> = ({
  onOpenLightbox,
  onExploreProject,
}) => {
  return (
    <div id="cases">
      {PROJECTS.map((project, index) => (
        <CaseStudyItem
          key={project.id}
          project={project}
          projectIndex={index}
          onOpenLightbox={onOpenLightbox}
          onExploreProject={onExploreProject}
        />
      ))}
    </div>
  );
};
