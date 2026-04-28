import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reverting GitHub Pages specific config because this application
  // requires a Node.js runtime for API routes and Prisma.
  // It should be deployed to a full-stack platform like Vercel.
};

export default nextConfig;
