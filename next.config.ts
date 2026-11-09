import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = isGithubPages
  ? {
      output: "export",
      basePath: "/orderbook-viewer",
      images: { unoptimized: true },
    }
  : {
      output: "standalone",
    };

export default nextConfig;
