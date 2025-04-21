import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  }
  // assetPrefix: '/portfolio-v1/' // Remove this line - not needed for custom domain
};

export default nextConfig;
