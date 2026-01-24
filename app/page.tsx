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
  const featuredDeals = movieDeals.slice(0, 4);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-accent/[0.03] -z-10" />
        <div className="site-container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              一分钟，<br />
              <span className="text-accent underline decoration-accent/20 underline-offset-8">知晓天下事</span>
            </h1>
            <p className="text-lg text-muted leading-relaxed mb-8 max-w-2xl">
              汇集全球每日新闻简报，为你提供最快捷、精准的资讯获取体验。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/news/" className="btn-primary">
                立即阅读
              </Link>
              <Link href="/about/" className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-border font-medium hover:bg-card transition-colors">
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Daily News Grid */}
      <section className="py-20">
        <div className="site-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">每日资讯</h2>
              <p className="text-muted">最新的新闻动态，实时更新</p>
            </div>
            <Link href="/news/" className="text-accent font-medium hover:underline underline-offset-4">
              查看全部资讯 →
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.slug}
                className="premium-card group relative p-6 flex flex-col h-full bg-card"
              >
                <Link
                  href={`/news/${item.slug}/`}
                  className="absolute inset-0 z-10"
                  aria-label={`阅读：${item.title}`}
                />
                <time className="text-sm font-medium text-accent mb-4 block">
                  {new Date(item.date).toLocaleDateString("zh-CN", { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors leading-tight">
                  {item.title}
                </h3>
                <p className="text-muted text-sm line-clamp-3 mb-6 flex-grow">
                  {item.summary}
                </p>
                <div className="flex items-center text-sm font-bold text-accent group-hover:gap-2 transition-all">
                  阅读全文 <span>→</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="py-20 bg-accent/[0.02] border-y border-border">
        <div className="site-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                🎬 精选优惠
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-white">LIMITED</span>
              </h2>
              <p className="text-muted">热门电影票立减、生活福利一站式领取</p>
            </div>
            <Link href="/deals/" className="text-accent font-medium hover:underline underline-offset-4">
              获取更多优惠 →
            </Link>
          </div>
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {featuredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="site-container text-center">
          <div className="max-w-2xl mx-auto premium-card p-12 bg-accent text-white shadow-2xl shadow-accent/20">
            <h2 className="text-3xl font-bold mb-6 italic">“信息就是力量，及时就是价值。”</h2>
            <p className="text-white/80 mb-10 text-lg">
              加入我们的资讯计划，不错过任何一个关键时刻。
            </p>
            <Link href="/news/archive/" className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-accent font-bold hover:scale-105 active:scale-95 transition-all">
              浏览历史归档
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
