import type { NextConfig } from "next";
const config: NextConfig = {
  output: "export",
  basePath: "/mg-group",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  devIndicators: false,
  reactStrictMode: true,
};
export default config;
