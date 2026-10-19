import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/thesis-summary.html", destination: "/writing/thesis", permanent: true }];
  },
};

export default nextConfig;
