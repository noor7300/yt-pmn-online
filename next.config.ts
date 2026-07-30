import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve images as-is instead of routing them through Vercel's optimizer.
    // Every image here is already web-optimised at source: YouTube thumbnails
    // come pre-sized off Google's CDN, and our extracted screenshots are
    // already WebP. Optimising them again bought nothing and exhausted the
    // plan's image-transformation quota, which made every image 402.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
