import path from "node:path";
import { withStrapiTypes } from "strapi-typed-client/next";

import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  // outputFileTracingRoot: path.resolve(process.cwd(), "../.."),
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: [
    "@tcg/api-contracts",
    "@tcg/auth-client",
    "@tcg/design-tokens",
    "@tcg/ui-web",
    "@tcg/locale",
  ],
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
};

export default nextConfig;
