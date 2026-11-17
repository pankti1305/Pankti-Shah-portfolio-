import React, { useRef } from 'react';
import { EDUCATION, EXPERIENCE, IMAGES, SKILLS } from '../data/portfolioData';
import { useSubtleParallax } from '../hooks/useInteractiveEnhancements';

export const AboutSection: React.FC = () => {
  const portraitParallaxRef = useRef<HTMLDivElement>(null);
  useSubtleParallax(portraitParallaxRef, 14);

  return (
    <section className="about" id="about" aria-labelledby="about-h">
      <div className="wrap">
        <div className="sec-h" data-reveal>
          <h2 className="d interactive-heading" id="about-h">
            About
          </h2>
          <span className="meta">Ahmedabad, India</span>
        </div>

        <div className="about-grid">
          <figure className="portrait" data-reveal style={{ '--stagger': 0 } as React.CSSProperties}>
            <div ref={portraitParallaxRef} className="portrait-frame">
              <img
                src={IMAGES.pankti}
                alt="Portrait of Pankti Shah"
                width={413}
                height={569}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <figcaption>Bachelor of Design, Interior Design, class of 2027</figcaption>
          </figure>

          <div className="about-main">
            <p data-reveal style={{ '--stagger': 1 } as React.CSSProperties}>
              I’m Pankti, an interior design student who starts every project with the people who
              will use the space, then works through context, material and colour until the room
              feels right.
            </p>

            <div className="blocks">
              <div data-reveal style={{ '--stagger': 1 } as React.CSSProperties}>
                <h3>Education</h3>
                <ul className="timeline">
                  {EDUCATION.map((item) => (
                    <li key={item.period}>
                      <span className="yr">{item.period}</span>
                      {item.title}
                      <br />
                      <span style={{ color: 'var(--ink-soft)' }}>{item.institution}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div data-reveal style={{ '--stagger': 2 } as React.CSSProperties}>
                <h3>Experience</h3>
                <ul className="timeline">
                  {EXPERIENCE.map((item) => (
                    <li key={item.period}>
                      <span className="yr">{item.period}</span>
                      {item.title}
                      <br />
                      <span style={{ color: 'var(--ink-soft)' }}>{item.institution}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="wide" data-reveal style={{ '--stagger': 2 } as React.CSSProperties}>
                <h3>Skills</h3>
                <div className="skills">
                  {SKILLS.map((group) => (
                    <div key={group.category}>
                      <h4>{group.category}</h4>
                      <ul>
                        {group.items.map((skill) => (
                          <li key={skill}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="wide" data-reveal style={{ '--stagger': 3 } as React.CSSProperties}>
                <h3>Outside the studio</h3>
                <p style={{ margin: 0 }}>Sports, travelling and reading.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
