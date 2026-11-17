import { toNextJsHandler } from "better-auth/next-js";
import { socialAuth } from "../../../../src/lib/auth/better-auth.server";

export const { GET, POST } = toNextJsHandler(socialAuth);
