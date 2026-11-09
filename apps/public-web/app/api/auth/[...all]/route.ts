import { toNextJsHandler } from "better-auth/next-js";
import { socialAuth } from "../../../../src/lib/better-auth";

export const { GET, POST } = toNextJsHandler(socialAuth);
