import type { NextConfig } from "next";

// See: https://nextjs.org/docs/pages/guides/static-exports

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // redirects: () => [
  //     {
  //       source: '/',
  //       destination: '/home',
  //       permanent: true,
  //     },
  // ]
};

export default nextConfig;
