import type { MetadataRoute } from "next";
import { getAllNews } from "@/lib/news";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const news = getAllNews().map((n) => ({
    url: `${base}/news/${n.slug}`,
    lastModified: new Date(n.date),
  }));

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/news`, lastModified: new Date() },
    ...news,
  ];
}