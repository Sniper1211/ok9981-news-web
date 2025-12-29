import type { MetadataRoute } from "next";
import { getAllNews } from "@/lib/news";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.meirizixun.site";
  const news = getAllNews().map((n) => ({
    url: `${base}/news/${n.slug}/`,
    lastModified: new Date(n.date),
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/news/`, lastModified: new Date() },
    { url: `${base}/news/archive/`, lastModified: new Date() },
    { url: `${base}/deals/`, lastModified: new Date() },
    { url: `${base}/search`, lastModified: new Date() },
    { url: `${base}/about/`, lastModified: new Date() },
    { url: `${base}/contact/`, lastModified: new Date() },
    { url: `${base}/privacy/`, lastModified: new Date() },
    { url: `${base}/terms/`, lastModified: new Date() },
  ];

  return [...staticPages, ...news];
}
