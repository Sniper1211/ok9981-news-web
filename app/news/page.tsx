import Link from "next/link";
import { getAllNews } from "@/lib/news";

export const metadata = {
  title: "新闻中心",
  description: "最新新闻列表",
};

export default function NewsListPage() {
  const news = getAllNews();
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">新闻中心</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <article
            key={item.slug}
            className="rounded-xl bg-white shadow hover:shadow-lg transition-shadow p-4 border"
          >
            <h2 className="text-lg font-semibold text-slate-800">
              <Link href={`/news/${item.slug}`}>{item.title}</Link>
            </h2>
            <time className="block text-sm text-slate-500 mt-1">
              {new Date(item.date).toLocaleDateString("zh-CN")}
            </time>
            <p className="text-slate-700 mt-2 line-clamp-3">{item.summary}</p>
            <div className="mt-3">
              <Link
                href={`/news/${item.slug}`}
                className="text-blue-600 hover:text-blue-800"
              >
                阅读全文 →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}