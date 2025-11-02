import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/news",
        destination: "/",
        permanent: true, // 308 永久重定向
      },
    ];
  },
};

export default nextConfig;
