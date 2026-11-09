import "server-only";
import { betterAuth } from "better-auth";

export const socialAuth = betterAuth({
  appName: "Next Pull",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    },
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true,
    accountLinking: { enabled: false },
  },
  session: { cookieCache: { enabled: true, strategy: "jwe", maxAge: 300 } },
  trustedOrigins: [process.env.BETTER_AUTH_URL].filter(
    (origin): origin is string => Boolean(origin),
  ),
  logger: {
    disabled: false,
    disableColors: false,
    level: "error",
    log: (level, message, ...args) => {
      // Custom logging implementation
      console.log(`[${level}] ${message}`, ...args);
    },
  },
});
