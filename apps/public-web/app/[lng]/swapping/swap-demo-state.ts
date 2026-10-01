export type DemoCard = {
  id: string;
  name: string;
  edition: string;
  image: string;
};

// Illustrative decks only. These do not represent a collector's inventory.
export const yourDeck: DemoCard[] = [
  {
    id: "messi",
    name: "Lionel Messi",
    edition: "UCL Medal Winner",
    image: "/images/landing/messi.jpg",
  },
  {
    id: "ronaldinho",
    name: "Ronaldinho",
    edition: "Hall of Fame",
    image: "/images/landing/ronaldinho.jpg",
  },
  {
    id: "szoboszlai",
    name: "D. Szoboszlai",
    edition: "Midfield Maestro",
    image: "/images/packs/sabo.jpg",
  },
];
export const collectorDeck: DemoCard[] = [
  {
    id: "metal-sonic",
    name: "Metal Sonic",
    edition: "Sonic collection",
    image: "/images/packs/sonic3.jpg",
  },
  {
    id: "yamal",
    name: "Lamine Yamal",
    edition: "Football collection",
    image: "/images/landing/yamal.jpg",
  },
  {
    id: "shadow",
    name: "Shadow",
    edition: "Sonic collection",
    image: "/images/packs/sonic1.webp",
  },
];

export type SwapState = {
  phase: "offer" | "receive" | "swapping" | "complete";
  offered: string[];
  requested: string[];
};
export type SwapAction =
  | { type: "toggle"; side: "offered" | "requested"; id: string }
  | { type: "continue" | "back" | "swap" | "finish" | "reset" };

export const initialSwapState: SwapState = {
  phase: "offer",
  offered: [],
  requested: [],
};

export function swapReducer(state: SwapState, action: SwapAction): SwapState {
  switch (action.type) {
    case "toggle": {
      const isOffer = action.side === "offered";
      // if (state.phase !== (isOffer ? "offer" : "receive")) return state;
      // if (!(isOffer ? yourDeck : collectorDeck).some((card) => card.id === action.id)) return state;
      const selected = state[action.side];
      return {
        ...state,
        [action.side]: selected.includes(action.id)
          ? selected.filter((id) => id !== action.id)
          : [...selected, action.id],
      };
    }
    case "continue":
      return state.phase === "offer" && state.offered.length > 0
        ? { ...state, phase: "receive" }
        : state;
    case "back":
      return state.phase === "receive" ? { ...state, phase: "offer" } : state;
    case "swap":
      return state.offered.length > 0 && state.requested.length > 0
        ? { ...state, phase: "swapping" }
        : state;
    case "finish":
      return state.phase === "swapping"
        ? { ...state, phase: "complete" }
        : state;
    case "reset":
      return initialSwapState;
  }
}
