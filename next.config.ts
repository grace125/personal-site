import type { NextConfig } from "next";

// See: https://nextjs.org/docs/pages/guides/static-exports

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
