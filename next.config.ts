import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Self-contained production build (server.js + traced node_modules) for VPS deploys
  output: "standalone",
  reactCompiler: true,
  turbopack: {
    // A stray lockfile in a parent directory makes Next mis-detect the workspace root
    root: path.join(__dirname),
  },
  experimental: {
    serverActions: {
      // Photo uploads go through server actions; default is 1mb
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
