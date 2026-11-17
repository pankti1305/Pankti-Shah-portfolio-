import React, { useEffect, useRef, useState } from 'react';
import { IMAGES, ImageKey, PROJECTS } from '../data/portfolioData';
import { isFinePointer, prefersReducedMotion } from '../hooks/useInteractiveEnhancements';

interface WorkIndexSectionProps {
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

export const WorkIndexSection: React.FC<WorkIndexSectionProps> = ({ onNavigate }) => {
  const peekRef = useRef<HTMLDivElement>(null);
  const [peekImage, setPeekImage] = useState<ImageKey | null>(null);
  const [peekVisible, setPeekVisible] = useState(false);
  const onRef = useRef(false);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;

    let px = 0;
    let py = 0;
    let cx = 0;
    let cy = 0;
    let rafId = 0;

    const handleMove = (e: PointerEvent) => {
      px = e.clientX + 180;
      py = e.clientY;
    };

    window.addEventListener('pointermove', handleMove, { passive: true });

    const loop = () => {
      cx += (px - cx) * 0.14;
      cy += (py - cy) * 0.14;
      if (peekRef.current) {
        peekRef.current.style.transform = `translate(${cx - 150}px,${cy - 112}px) scale(${
          onRef.current ? 1 : 0.85
        }) rotate(${(px - cx) * 0.02}deg)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  const handleEnter = (key: ImageKey) => {
    setPeekImage(key);
    setPeekVisible(true);
    onRef.current = true;
  };

  const handleLeave = () => {
    setPeekVisible(false);
    onRef.current = false;
  };

  return (
    <>
      <section className="index wrap" id="work" aria-labelledby="work-h">
        <div className="sec-h" data-reveal>
          <h2 className="d interactive-heading" id="work-h">
            Selected work
          </h2>
          <span className="meta">Six projects from studio and practice</span>
        </div>
        <ol className="rows" id="rows">
          {PROJECTS.map((project, idx) => (
            <li
              key={project.id}
              data-reveal
              style={{ '--stagger': idx } as React.CSSProperties}
            >
              <a
                href={`#${project.id}`}
                onClick={(e) => onNavigate(e, project.id)}
                onPointerEnter={() => handleEnter(project.hero)}
                onPointerLeave={handleLeave}
              >
                <span className="meta">{project.sem}</span>
                <span className="d t">{project.title}</span>
                <span className="k">{project.kind}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <div
        className={`peek${peekImage && peekVisible ? ' on' : ''}`}
        id="peek"
        data-surface={
          peekImage
            ? (PROJECTS.find((p) => p.hero === peekImage)?.heroSurface ?? 'photo')
            : undefined
        }
        ref={peekRef}
        aria-hidden="true"
      >
        {peekImage && (
          <img src={IMAGES[peekImage]} alt="" referrerPolicy="no-referrer" />
        )}
      </div>
    </>
  );
};
