import Link from "next/link";
import { getAllNews } from "@/lib/news";

export const metadata = {
  title: "新闻中心",
  description: "最新新闻列表",
};

export default function Home() {
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
            <p className="mt-2 line-clamp-3 text-sm text-slate-700">{item.summary}</p>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1 text-blue-600 group-hover:text-blue-800">
                阅读全文 <span aria-hidden>→</span>
              </span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}