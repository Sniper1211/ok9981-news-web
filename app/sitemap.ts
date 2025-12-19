import type { MetadataRoute } from "next";
import { getAllNews } from "@/lib/news";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.meirizixun.site";
  const news = getAllNews().map((n) => ({
    url: `${base}/news/${n.slug}/`,
    lastModified: new Date(n.date),
  }));

  return [
    { url: `${base}/`, lastModified: new Date() },
    ...news,
  ];
}
