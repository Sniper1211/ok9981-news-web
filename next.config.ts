import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
