"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export const CardsSlider = ({
  cards,
}: {
  cards: {
    name: string;
    set: string;
    condition: string;
    image: string;
    tone: string;
  }[];
}) => {
  const [active, setActive] = useState(0);
  return (
    <div
      className="wax-hero-specimen"
      aria-roledescription="carousel"
      aria-label="Featured cards"
    >
      <div className="wax-pack-label">FEATURED PULL · 01</div>
      <div className="wax-card-stack" aria-live="polite">
        {cards.map((card, index) => {
          const position = (index - active + cards.length) % cards.length;
          if (position > 2) return null;
          return (
            <article
              key={card.name}
              className={`wax-card wax-card-${position + 1}`}
            >
              <img src={card.image} alt={`${card.name} card`} />
              <div className="wax-card-caption">
                <strong>{card.name}</strong>
                <span>{card.set}</span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="wax-specimen-note">
        <span>
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(cards.length).padStart(2, "0")}
        </span>
        <strong>Good cards. Better connections.</strong>
        <div className="wax-card-slider-controls">
          <button
            type="button"
            className="wax-card-slider-button"
            aria-label="Previous featured card"
            onClick={() =>
              setActive(
                (current) =>
                  (current - 1 + cards.length) % cards.length,
              )
            }
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="wax-card-slider-button"
            aria-label="Next featured card"
            onClick={() => setActive((current) => (current + 1) % cards.length)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
