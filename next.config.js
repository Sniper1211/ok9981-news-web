// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  trailingSlash: false,
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ok9981.com",
      },
      {
        protocol: "https",
        hostname: "vercel.app",
      }
    ],
  }
};

module.exports = nextConfig; // 注意导出语法