import Link from "next/link";
import { getAllNews } from "@/lib/news";

export const metadata = {
  title: "新闻中心",
  description: "最新新闻列表",
  keywords: [
    "OK9981",
    "新闻",
    "资讯",
    "每日资讯",
    "新闻中心",
    "首页",
  ],
};

export default function Home() {
  const news = getAllNews().slice(0, 12);
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">每日资讯</h1>
        <Link href="/news/" className="text-blue-600 hover:underline text-sm font-medium">
          查看全部资讯 &rarr;
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <article
            key={item.slug}
            className="card transition-shadow p-5 flex flex-col relative group"
          >
            <Link
              href={`/news/${item.slug}/`}
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
      <div className="mt-10 text-center">
        <Link href="/news/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
          浏览更多历史资讯
        </Link>
      </div>
    </main>
  );
}