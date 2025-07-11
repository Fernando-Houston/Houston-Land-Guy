import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Optimize for Vercel deployment
  swcMinify: true,
  // Handle image domains if using next/image
  images: {
    domains: ['maps.googleapis.com'],
  },
};

export default nextConfig;
