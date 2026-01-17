import Link from "next/link";
import type { Metadata } from "next";
import { getAllNews, getPaginatedNewsPage, PAGE_SIZE } from "@/lib/news";

type Props = { params: Promise<{ page: string }> };

export async function generateStaticParams() {
  const totalPages = Math.max(1, Math.ceil(getAllNews().length / PAGE_SIZE));
  return Array.from({ length: totalPages }, (_, i) => ({ page: String(i + 1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const current = Number(page) || 1;
  return {
    title: `每日资讯 - 第 ${current} 页`,
    description: `每日资讯列表第 ${current} 页`,
  };
}

export default async function NewsListPaged({ params }: Props) {
  const { page } = await params;
  const current = Number(page) || 1;
  const { items, totalPages } = getPaginatedNewsPage(current, PAGE_SIZE);

  return (
    <main className="py-16">
      <div className="site-container">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">每日资讯</h1>
          <p className="text-lg text-muted mb-4">这是第 {current} / {totalPages} 页。</p>
          <Link href="/news" className="text-accent hover:underline font-medium inline-flex items-center gap-1">
            需要搜索或筛选？前往全文搜索页 <span>→</span>
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.slug} className="premium-card group relative p-6 flex flex-col h-full bg-card">
              <Link href={`/news/${item.slug}/`} aria-label={`阅读：${item.title}`} className="absolute inset-0 z-10" />
              <time className="text-xs font-bold text-accent mb-3 block uppercase tracking-widest">
                {new Date(item.date).toLocaleDateString("zh-CN")}
              </time>
              <h2 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors leading-tight">
                {item.title}
              </h2>
              <p className="text-muted text-sm line-clamp-3 mb-6 flex-grow">
                {item.summary}
              </p>
              <div className="flex items-center text-sm font-bold text-accent group-hover:gap-2 transition-all">
                阅读全文 <span>→</span>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <nav aria-label="分页" className="flex items-center justify-center gap-2 py-12">
            <Link
              href={current > 1 ? `/news/page/${current - 1}/` : `/news/`}
              className={`w-10 h-10 flex items-center justify-center rounded-full border border-border hover:bg-accent hover:text-white transition-all ${current > 1 ? "" : "pointer-events-none opacity-30"}`}
            >
              ←
            </Link>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Link
                  key={i}
                  href={i === 0 ? "/news/" : `/news/page/${i + 1}/`}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border border-border transition-all ${i + 1 === current ? "bg-accent text-white border-accent" : "hover:bg-accent/5"}`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
            <Link
              href={current < totalPages ? `/news/page/${current + 1}/` : `/news/page/${current}/`}
              className={`w-10 h-10 flex items-center justify-center rounded-full border border-border hover:bg-accent hover:text-white transition-all ${current < totalPages ? "" : "pointer-events-none opacity-30"}`}
            >
              →
            </Link>
          </nav>
        )}
      </div>
    </main>
  );
}