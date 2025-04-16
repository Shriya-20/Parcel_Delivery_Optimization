import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["randomuser.me"],
    // Alternatively, you can use remotePatterns for more control
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'randomuser.me',
    //     pathname: '/api/portraits/**',
    //   },
    // ],
  },
  reactStrictMode: true,
};

export default nextConfig;
