import type { PageTransitionVariant } from "./types";

const TRANSITION_ARTWORK = {
  "sticker-packs": [
    "cwc_2025.jpg",
    "football_78.jpg",
    "sonic_panini.png",
    "topps_pl_2026.jpg",
    "ucl_24_25.jpg",
    "world_cup_2006.jpg",
    "spiderman.jpg",
    "toy_story.jpg",
    "efl_2026.jpg",
    "fifa_365_2026.jpg",
    "stitch.jpg",
  ],
  "tcg-games": [
    "cwc_2025.jpg",
    "football_78.jpg",
    "sonic_panini.png",
    "topps_pl_2026.jpg",
    "ucl_24_25.jpg",
    "world_cup_2006.jpg",
    "spiderman.jpg",
    "toy_story.jpg",
    "efl_2026.jpg",
    "fifa_365_2026.jpg",
    "stitch.jpg",
  ],
} satisfies Record<PageTransitionVariant, readonly string[]>;
