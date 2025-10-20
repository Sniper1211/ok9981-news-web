import Link from "next/link";
import { getAllNews } from "@/lib/news";

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
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">每日资讯</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <article
            key={item.slug}
            className="card transition-shadow p-5 flex flex-col relative group"
          >
            {/* 覆盖整个卡片的点击区域，避免嵌套链接 */}
            <Link
              href={`/news/${item.slug}`}
              aria-label={`打开：${item.title}`}
              className="absolute inset-0 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <h2 className="text-lg font-semibold">
              {item.title}
            </h2>
            <time className="block text-sm text-slate-500 mt-1">
              {new Date(item.date).toLocaleDateString("zh-CN")}
            </time>
            <p className="mt-2 line-clamp-3 text-sm">{item.summary}</p>
            <div className="mt-4">
              <span className="card-cta inline-flex items-center gap-1">
                阅读全文 <span aria-hidden>→</span>
              </span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}