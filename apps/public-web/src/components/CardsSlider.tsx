"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { CardSpecimen, IconButton } from "@tcg/ui-web";

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
          const position = (index - active + cards.length + 1) % cards.length;
          if (position > 2) return null;
          return (
            <CardSpecimen
              key={card.name}
              {...card}
              position={(position + 1) as 1 | 2 | 3}
              href="/marketplace"
            />
          );
        })}
      </div>

      <div className="wax-specimen-note">
        <span>
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(cards.length).padStart(2, "0")}
        </span>
        <strong>Good cards. Better connections.</strong>
        <div className="ms-auto flex gap-2">
          <IconButton
            type="button"
            variant="outline"
            className="border-wax-paper/60 text-wax-paper hover:bg-wax-red"
            aria-label="Previous featured card"
            onClick={() =>
              setActive(
                (current) => (current - 1 + cards.length) % cards.length,
              )
            }
          >
            <ChevronLeft aria-hidden="true" />
          </IconButton>
          <IconButton
            variant="outline"
            type="button"
            className="border-wax-paper/60 text-wax-paper hover:bg-wax-red"
            aria-label="Next featured card"
            onClick={() => setActive((current) => (current + 1) % cards.length)}
          >
            <ChevronRight aria-hidden="true" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
