"use client";

import { useEffect, useId, useReducer, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  collectorDeck,
  initialSwapState,
  swapReducer,
  yourDeck,
  type DemoCard,
  type SwapState,
} from "./swap-demo-state";

function CardStack({
  cards,
  x,
  angle,
}: {
  cards: DemoCard[];
  x: number;
  angle: number;
}) {
  return (
    <g transform={`translate(${x} 102)`}>
      {cards.map((card, index) => (
        <g
          key={card.id}
          transform={`translate(${index * 16} ${-index * 9}) rotate(${angle + index * 4} 77 105)`}
        >
          <rect x="-5" y="-5" width="164" height="226" rx="9" fill="#efbd35" />
          <rect width="154" height="216" rx="5" fill="#fffaf1" />
          <image
            href={card.image}
            x="3"
            y="3"
            width="148"
            height="210"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      ))}
    </g>
  );
}

function ExchangeArtwork({
  offered,
  requested,
  phase,
  onClick,
}: {
  offered: DemoCard[];
  requested: DemoCard[];
  phase: SwapState["phase"];
  onClick?: () => void;
}) {
  const id = useId();
  const complete = phase === "complete";
  return (
    <svg
      onClick={() => !complete && onClick?.()}
      className="swap-demo-art"
      viewBox="0 0 960 410"
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
    >
      <title id={`${id}-title`}>
        {complete
          ? "Selected cards have exchanged sides"
          : "Your cards and the collector’s cards on the exchange table"}
      </title>
      <desc id={`${id}-desc`}>
        {offered.length
          ? `You offer ${offered.map((card) => card.name).join(", ")}.`
          : "Choose cards from your deck below."}
        {requested.length
          ? ` You receive ${requested.map((card) => card.name).join(", ")}.`
          : " Then choose cards from the other deck."}
      </desc>
      <defs>
        <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#3c8bbd" />
          <stop offset="1" stopColor="#17385e" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#efbd35" />
          <stop offset="1" stopColor="#b68419" />
        </linearGradient>
      </defs>
      <g className="swap-art-backdrop" aria-hidden="true">
        <ellipse
          cx="480"
          cy="224"
          rx="340"
          ry="120"
          fill="none"
          stroke="currentColor"
          strokeDasharray="3 10"
        />
        <rect
          x="385"
          y="40"
          width="190"
          height="322"
          rx="27"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M444 54h72M462 346h36"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect
          x="75"
          y="107"
          width="96"
          height="140"
          rx="6"
          transform="rotate(-24 123 177)"
          fill="currentColor"
        />
        <rect
          x="796"
          y="62"
          width="96"
          height="140"
          rx="6"
          transform="rotate(22 844 132)"
          fill="currentColor"
        />
      </g>
      <g aria-hidden="true" className="swap-art-bases">
        <path d="m94 322 133-48 144 48-134 55z" fill="#17385e" />
        <path d="m94 322 143 55 134-55v14l-134 55-143-55z" fill="#102d4d" />
        <path d="m588 322 133-48 144 48-134 55z" fill="#c83430" />
        <path d="m588 322 143 55 134-55v14l-134 55-143-55z" fill="#a92a27" />
      </g>
      <g className="swap-art-arrows" aria-hidden="true">
        <path
          d="M303 113c77-79 202-93 309-38l9-28 45 70-82 7 13-26c-96-49-200-43-294 15Z"
          fill={`url(#${id}-blue)`}
        />
        <path
          d="M657 288c-77 79-202 93-309 38l-9 28-45-70 82-7-13 26c96 49 200 43 294-15Z"
          fill={`url(#${id}-gold)`}
        />
      </g>
      {!offered.length && (
        <g
          className="swap-art-placeholder"
          transform="translate(164 108) rotate(-9 77 105)"
        >
          <rect width="154" height="216" rx="8" />
          <path d="M59 108h36m-18-18v36" />
          <text x="77" y="158" textAnchor="middle">
            YOUR PICKS
          </text>
        </g>
      )}
      {!requested.length && (
        <g
          className="swap-art-placeholder"
          transform="translate(657 108) rotate(9 77 105)"
        >
          <rect width="154" height="216" rx="8" />
          <path d="M59 108h36m-18-18v36" />
          <text x="77" y="158" textAnchor="middle">
            THEIR PICKS
          </text>
        </g>
      )}
      <g className="swap-art-offered">
        <CardStack cards={offered} x={164} angle={-9} />
      </g>
      <g className="swap-art-requested">
        <CardStack cards={requested} x={657} angle={9} />
      </g>
      <g
        className="swap-art-seal"
        transform="translate(480 204)"
        aria-hidden="true"
      >
        <path d="M0-45 39-30v33C39 28 0 49 0 49S-39 28-39 3v-33Z" />
        {complete ? (
          <path className="swap-art-seal-mark" d="m-17 0 12 12 23-25" />
        ) : (
          <g className="swap-art-seal-mark">
            <path d="M-18-10h34l-8-8m10 29h-34l8 8" />
          </g>
        )}
      </g>
    </svg>
  );
}

function Deck({
  title,
  cards,
  selected,
  disabled,
  onToggle,
}: {
  title: string;
  cards: DemoCard[];
  selected: string[];
  disabled: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="swap-demo-deck" disabled={disabled}>
      <legend>
        {title} <span>{selected.length} selected</span>
      </legend>
      <div className="swap-demo-cards">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className="swap-demo-card"
            aria-pressed={selected.includes(card.id)}
            onClick={() => onToggle(card.id)}
          >
            <span className="swap-demo-card-image">
              <img src={card.image} alt="" width="120" height="168" />
              <span className="swap-demo-card-check" aria-hidden="true">
                <Check size={14} />
              </span>
            </span>
            <strong>{card.name}</strong>
            <small>{card.edition}</small>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function SwapDemo() {
  const [state, dispatch] = useReducer(swapReducer, initialSwapState);
  const firstRequestedCard = useRef<HTMLDivElement>(null);
  const artwork = useRef<HTMLDivElement>(null);
  const offered = yourDeck.filter((card) => state.offered.includes(card.id));
  const requested = collectorDeck.filter((card) =>
    state.requested.includes(card.id),
  );
  const isComplete = state.phase === "complete";
  const isSwapping = state.phase === "swapping";

  // Synchronize the finite SVG sequence with its textual result, including changes
  // to the OS motion preference mid-sequence. Clean up on reset or unmount.
  useEffect(() => {
    if (state.phase !== "swapping") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => dispatch({ type: "finish" });
    const timer = window.setTimeout(finish, media.matches ? 0 : 1800);
    const onMotionChange = () => {
      if (media.matches) finish();
    };
    media.addEventListener("change", onMotionChange);
    return () => {
      window.clearTimeout(timer);
      media.removeEventListener("change", onMotionChange);
    };
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === "receive")
      firstRequestedCard.current
        ?.querySelector("button")
        ?.focus({ preventScroll: true });
  }, [state.phase]);

  const status = isComplete
    ? "Swap complete. Your picks have changed hands."
    : isSwapping
      ? "Exchanging your selected cards…"
      : state.phase === "offer"
        ? "Pick one or more cards you’d like to offer."
        : "Now pick one or more cards you’d like to receive.";

  function advance() {
    if (state.phase === "receive" && offered.length && requested.length) {
      const bounds = artwork.current?.getBoundingClientRect();
      if (bounds && (bounds.top < 90 || bounds.bottom > window.innerHeight)) {
        artwork.current?.scrollIntoView({
          block: "center",
          behavior: "instant",
        });
      }
    }
    dispatch({
      type: isComplete
        ? "reset"
        : state.phase === "offer"
          ? "continue"
          : "swap",
    });
  }

  return (
    <div className="swap-demo" data-phase={state.phase}>
      {/* <div className="swap-demo-topline">
        <ol aria-label="Swap demo steps">
          <li aria-current={state.phase === "offer" ? "step" : undefined}>
            <span>1</span>Your offer
          </li>
          <li aria-current={state.phase === "receive" ? "step" : undefined}>
            <span>2</span>Their cards
          </li>
          <li aria-current={isSwapping || isComplete ? "step" : undefined}>
            <span>3</span>The exchange
          </li>
        </ol>
      </div> */}
      <div className="swap-demo-table">
        <div className="swap-demo-table-labels">
          <span>Your side</span>
          <span>Collector’s side</span>
        </div>
        <div ref={artwork} className="swap-demo-art-frame">
          <ExchangeArtwork
            onClick={() => {
              if (offered.length == 0 || requested.length == 0) return;
              dispatch({ type: "swap" });
            }}
            offered={offered}
            requested={requested}
            phase={state.phase}
          />
          {isComplete && (
            <p className="swap-demo-art-result">
              <Check size={16} aria-hidden="true" />
              Demo complete — {requested.length}{" "}
              {requested.length === 1 ? "card" : "cards"} to you,{" "}
              {offered.length} to the collector.
            </p>
          )}
        </div>
        <div className="swap-demo-decks">
          <Deck
            title="Your deck"
            cards={yourDeck}
            selected={state.offered}
            disabled={state.phase !== "offer"}
            onToggle={(id) => dispatch({ type: "toggle", side: "offered", id })}
          />
          <div ref={firstRequestedCard}>
            <Deck
              title="Collector’s deck"
              cards={collectorDeck}
              selected={state.requested}
              disabled={false}
              onToggle={(id) =>
                dispatch({ type: "toggle", side: "requested", id })
              }
            />
          </div>
        </div>
      </div>
      <div className="swap-demo-controls">
        <div>
          <p role="status" aria-live="polite" aria-atomic="true">
            {status}
          </p>
          <small>
            {isComplete
              ? `You received: ${requested.map((card) => card.name).join(", ")}. You offered: ${offered.map((card) => card.name).join(", ")}.`
              : "Sample decks. This preview does not create a real swap."}
          </small>
        </div>
        <div className="swap-demo-actions">
          {/* {state.phase === "receive" && <button type="button" className="swap-demo-back" onClick={() => dispatch({ type: "back" })}><ArrowLeft size={16} />Edit offer</button>} */}
          {/* <button type="button" className="swap-demo-primary" disabled={isSwapping || (state.phase === "offer" && !offered.length) || (state.phase === "receive" && !requested.length)}
            onClick={advance}>
            {isComplete ? <><RotateCcw size={17} />Try another swap</> : isSwapping ? "Swapping…" : state.phase === "offer" ? <>Choose their cards<ArrowRight size={17} /></> : <>Preview swap<ArrowRightLeft size={17} /></>}
          </button> */}
          {isComplete && (
            <button
              type="button"
              className="swap-demo-primary"
              onClick={() => dispatch({ type: "reset" })}
            >
              Try another swap
              <ArrowRight size={17} />
            </button>
          )}
          {!isSwapping &&
            state.offered.length > 0 &&
            state.requested.length > 0 &&
            !isComplete && (
              <button
                type="button"
                className="swap-demo-primary"
                onClick={() => dispatch({ type: "swap" })}
              >
                Preview swap
                <ArrowRightLeft size={17} />
              </button>
            )}
          {isSwapping && (
            <button
              type="button"
              className="swap-demo-back"
              onClick={() => dispatch({ type: "finish" })}
            >
              Skip animation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
