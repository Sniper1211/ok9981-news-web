import Link from "next/link";
import { getAllNews } from "@/lib/news";
import { movieDeals } from "@/lib/deals";
import DealCard from "@/components/DealCard";

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
  // 只取前 4 个优惠展示在首页（如果有更多的话）
  const featuredDeals = movieDeals.slice(0, 4);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {/* 头部：每日资讯 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">每日资讯</h1>
          <p className="text-slate-500 text-sm mt-1">一分钟知晓天下事，汇集每日新闻简报</p>
        </div>
        <Link href="/news/" className="text-blue-600 hover:underline text-sm font-medium">
          查看全部 &rarr;
        </Link>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
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

      {/* 中部：精选优惠 */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              🎬 精选优惠
              <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">限时特惠</span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">热门电影票立减、生活福利一站式领取</p>
          </div>
          <Link href="/deals/" className="text-blue-600 hover:underline text-sm font-medium">
            更多羊毛 &rarr;
          </Link>
        </div>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {featuredDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      {/* 底部：历史归档入口 */}
      <div className="text-center border-t border-slate-100 pt-10">
        <h2 className="text-xl font-semibold mb-4">探索更多历史内容</h2>
        <Link href="/news/archive/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
          浏览资讯归档
        </Link>
      </div>
    </main>
  );
}