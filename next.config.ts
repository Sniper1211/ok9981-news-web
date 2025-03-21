// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 核心配置
  output: "standalone", // 适用于 Vercel 的容器化部署
  trailingSlash: false, // 禁用自动尾部斜杠
  productionBrowserSourceMaps: true, // 生产环境源码映射

  // 图片资源配置
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ok9981.com", // 允许加载自己域名的图片
      },
      {
        protocol: "https",
        hostname: "vercel.app", // 允许加载 Vercel 默认域的图片
      }
    ],
  },

  // 头部安全配置
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Credentials", value: "true" },
        { key: "Access-Control-Allow-Origin", value: "https://news.ok9981.com" },
        { key: "Access-Control-Allow-Methods", value: "GET" },
      ],
    }
  ],

  // 重定向配置（可选）
  redirects: async () => [
    {
      source: "/",
      destination: "/news", // 如果首页需要重定向到新闻列表
      permanent: false,
    }
  ]
};

export default nextConfig;