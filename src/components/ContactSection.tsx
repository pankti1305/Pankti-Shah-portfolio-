import React from 'react';
import { SITE_LINKS } from '../data/portfolioData';

interface ContactSectionProps {
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onNavigate }) => {
  return (
    <>
      <section className="contact wrap" id="contact" aria-labelledby="contact-h">
        <h2
          className="d interactive-heading"
          id="contact-h"
          data-reveal
          style={{ '--stagger': 0 } as React.CSSProperties}
        >
          Say hello
        </h2>
        <a
          className="mail"
          href={`mailto:${SITE_LINKS.email}`}
          data-reveal
          style={{ '--stagger': 1 } as React.CSSProperties}
        >
          {SITE_LINKS.email}
        </a>
        <ul className="contact-list" id="contact-list">
          <li data-reveal style={{ '--stagger': 1 } as React.CSSProperties}>
            <span className="meta">Phone</span>
            <a href={SITE_LINKS.phoneHref}>{SITE_LINKS.phone}</a>
          </li>
          <li data-reveal style={{ '--stagger': 2 } as React.CSSProperties}>
            <span className="meta">Instagram</span>
            <a href={SITE_LINKS.instagram} target="_blank" rel="noopener noreferrer">
              {SITE_LINKS.instagramHandle}
            </a>
          </li>
          <li data-reveal style={{ '--stagger': 3 } as React.CSSProperties}>
            <span className="meta">Based in</span>
            {SITE_LINKS.location}
          </li>
          {SITE_LINKS.github && (
            <li data-reveal style={{ '--stagger': 4 } as React.CSSProperties}>
              <span className="meta">GitHub</span>
              <a href={SITE_LINKS.github} target="_blank" rel="noopener noreferrer">
                {SITE_LINKS.github.replace(/^https?:\/\//, '')}
              </a>
            </li>
          )}
        </ul>
      </section>

      <footer>
        <div className="wrap meta">
          <span>© 2026 Pankti Shah</span>
          <a href="#home" onClick={(e) => onNavigate(e, 'home')}>
            Back to top
          </a>
        </div>
      </footer>
    </>
  );
};
