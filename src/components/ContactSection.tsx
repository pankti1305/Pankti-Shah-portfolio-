import React from 'react';
import contactStudioImg from '../assets/images/contact_interior_studio_1795095911976.jpg';
import { SITE_LINKS } from '../data/portfolioData';

interface ContactSectionProps {
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onNavigate }) => {
  return (
    <>
      <section className="contact wrap" id="contact" aria-labelledby="contact-h">
        <div className="contact-layout">
          <div className="contact-main">
            <span
              className="contact-eyebrow"
              data-reveal
              style={{ '--stagger': 0 } as React.CSSProperties}
            >
              LET'S CONNECT
            </span>

            <h2
              className="d contact-headline interactive-heading"
              id="contact-h"
              data-reveal
              style={{ '--stagger': 1 } as React.CSSProperties}
            >
              Good design starts with a conversation.
            </h2>

            <p
              className="contact-lead"
              data-reveal
              style={{ '--stagger': 2 } as React.CSSProperties}
            >
              I'm open to new opportunities, creative collaborations and meaningful conversations.
            </p>

            <div
              className="contact-primary-mail"
              data-reveal
              style={{ '--stagger': 3 } as React.CSSProperties}
            >
              <span className="meta contact-field-label">Direct Email</span>
              <a className="mail-editorial" href={`mailto:${SITE_LINKS.email}`}>
                <svg className="contact-ico" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="1.5" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                <span className="mail-text">{SITE_LINKS.email}</span>
                <span className="contact-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>

            <ul className="contact-directory" id="contact-list">
              <li data-reveal style={{ '--stagger': 3 } as React.CSSProperties}>
                <span className="meta contact-field-label">Phone</span>
                <a className="contact-dir-link" href={SITE_LINKS.phoneHref}>
                  <svg className="contact-ico" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5.5 4.5h3.2l1.6 4.1-2.1 1.4a13 13 0 0 0 5.8 5.8l1.4-2.1 4.1 1.6v3.2a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 4 6.1a1.5 1.5 0 0 1 1.5-1.6z" />
                  </svg>
                  <span className="contact-link-label">{SITE_LINKS.phone}</span>
                  <span className="contact-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>

              <li data-reveal style={{ '--stagger': 4 } as React.CSSProperties}>
                <span className="meta contact-field-label">Instagram</span>
                <a
                  className="contact-dir-link"
                  href={SITE_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="contact-ico" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
                  </svg>
                  <span className="contact-link-label">{SITE_LINKS.instagramHandle}</span>
                  <span className="contact-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>

              {SITE_LINKS.github && (
                <li data-reveal style={{ '--stagger': 5 } as React.CSSProperties}>
                  <span className="meta contact-field-label">GitHub</span>
                  <a
                    className="contact-dir-link"
                    href={SITE_LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="contact-ico" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 19c-4.3 1.4-4.3-2.2-6-2.7m12 5.4v-3.5a3 3 0 0 0-.8-2.3c2.8-.3 5.8-1.4 5.8-6.2a4.8 4.8 0 0 0-1.3-3.4 4.5 4.5 0 0 0-.1-3.3s-1.1-.3-3.5 1.3a12.1 12.1 0 0 0-6.4 0C6.3 2.5 5.2 2.8 5.2 2.8a4.5 4.5 0 0 0-.1 3.3 4.8 4.8 0 0 0-1.3 3.4c0 4.8 3 5.9 5.8 6.2a3 3 0 0 0-.8 2.3v3.5" />
                    </svg>
                    <span className="contact-link-label">
                      {SITE_LINKS.github.replace(/^https?:\/\//, '')}
                    </span>
                    <span className="contact-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              )}

              <li data-reveal style={{ '--stagger': 6 } as React.CSSProperties}>
                <span className="meta contact-field-label">Studio Base</span>
                <span className="contact-dir-static">
                  <svg className="contact-ico" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 21s6.5-6.2 6.5-11.5a6.5 6.5 0 1 0-13 0C5.5 14.8 12 21 12 21z" />
                    <circle cx="12" cy="9.5" r="2.2" />
                  </svg>
                  <span>{SITE_LINKS.location}</span>
                </span>
              </li>
            </ul>
          </div>

          <figure
            className="contact-visual"
            data-reveal
            style={{ '--stagger': 2 } as React.CSSProperties}
          >
            <div className="contact-photo-frame">
              <img
                src={contactStudioImg}
                alt="Sunlit interior studio corner in warm ivory limewash plaster, deep forest green lounge chair, solid oak console and terracotta stoneware vessel"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
          </figure>
        </div>

        <p
          className="contact-closing"
          data-reveal
          style={{ '--stagger': 4 } as React.CSSProperties}
        >
          Thank you for taking the time to explore my work.
        </p>
      </section>

      <footer>
        <div className="wrap footer-bar meta">
          <span>© 2026 Pankti Shah</span>
          <div className="footer-links">
            <a href={`mailto:${SITE_LINKS.email}`}>Email</a>
            <a href={SITE_LINKS.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            {SITE_LINKS.github && (
              <a href={SITE_LINKS.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
          </div>
          <a href="#home" onClick={(e) => onNavigate(e, 'home')}>
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
};
