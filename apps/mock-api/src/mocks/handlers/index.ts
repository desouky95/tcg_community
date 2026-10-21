import { accountHandlers } from "./account.js";
import { authHandlers } from "./auth.js";
import { catalogueHandlers } from "./catalogue.js";
import { communityHandlers } from "./community.js";
import { legacyHandlers } from "./legacy.js";
import { scraperHandlers } from "./scraper.js";
import { swapHandlers } from "./swaps.js";

export const handlers = [
  ...authHandlers,
  ...accountHandlers,
  ...catalogueHandlers,
  ...communityHandlers,
  ...swapHandlers,
  ...scraperHandlers,
  ...legacyHandlers,
];
