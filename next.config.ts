import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    allowedDevOrigins: ['http://localhost:4000', 'http://72.60.102.111:4000'],
  },
};

export default nextConfig;
