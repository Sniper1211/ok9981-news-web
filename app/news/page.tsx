import Link from "next/link";
import { getAllNews } from "@/lib/news";
import NewsList from "@/components/NewsList";

export const metadata = {
  title: "每日新闻资讯中心",
  description: "最新新闻列表",
  keywords: [
    "OK9981",
    "新闻",
    "资讯",
    "每日资讯",
    "新闻中心",
    "新闻列表",
  ],
};

export default function NewsListPage() {
  const news = getAllNews();
  return (
    <main className="py-16">
      <div className="site-container">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">每日资讯</h1>
          <p className="text-lg text-muted">汇集全球每日新闻简报，为你提供最快捷、精准的资讯获取体验。</p>
        </div>
        <NewsList items={news} showFilter={false} />
      </div>
    </main>
  );
}