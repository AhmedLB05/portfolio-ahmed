import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  output: "export",
  basePath: "/portfolio-ahmed",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
