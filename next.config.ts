import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Opt-in to proxy instead of deprecated middleware convention
    proxy: true,
  },
};

export default nextConfig;
