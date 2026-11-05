import path from 'node:path'

import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output : 'standalone',
  outputFileTracingRoot: path.resolve(process.cwd(), '../..'),
  transpilePackages: [
    "@tcg/api-contracts",
    "@tcg/auth-client",
    "@tcg/design-tokens",
    "@tcg/ui-web",
    "@tcg/locale",
  ],
};

export default nextConfig;
