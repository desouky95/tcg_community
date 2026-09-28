import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@tcg/api-contracts", "@tcg/auth-client", "@tcg/design-tokens", "@tcg/ui-web"],
};

export default nextConfig;
