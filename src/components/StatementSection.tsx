import React from 'react';

export const StatementSection: React.FC = () => {
  return (
    <section className="statement wrap" aria-label="Design thinking">
      <blockquote className="d" data-reveal style={{ '--stagger': 0 } as React.CSSProperties}>
        Design is about creating spaces that are not only functional and visually appealing, but
        meaningful to the people who experience them.
      </blockquote>
      <div className="more">
        <span className="meta who" data-reveal style={{ '--stagger': 1 } as React.CSSProperties}>
          Design thinking
        </span>
        <p data-reveal style={{ '--stagger': 2 } as React.CSSProperties}>
          Over the years I have learned to understand the user, context, materials, colour and
          functionality before developing a design. I believe good design comes from exploring
          ideas, experimenting and continuously refining them to create spaces with both purpose
          and character.
        </p>
      </div>
    </section>
  );
};
