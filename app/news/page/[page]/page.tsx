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
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">每日资讯</h1>
      <p className="text-sm text-slate-600 mb-6">这是第 {current} / {totalPages} 页。需要搜索或筛选？前往 <Link href="/news" className="underline">含搜索的列表页</Link>。</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.slug} className="card transition-shadow p-5 flex flex-col relative group">
            <Link href={`/news/${item.slug}/`} aria-label={`打开：${item.title}`} className="absolute inset-0 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <time className="block text-sm text-slate-500 mt-1">{new Date(item.date).toLocaleDateString("zh-CN")}</time>
            <p className="mt-2 line-clamp-3 text-sm">{item.summary}</p>
            <div className="mt-4"><span className="card-cta inline-flex items-center gap-1">阅读全文 <span aria-hidden>→</span></span></div>
          </article>
        ))}
      </div>

      <nav aria-label="分页" className="mt-8 flex items-center justify-center gap-3">
        <Link href={current > 1 ? `/news/page/${current - 1}/` : `/news/`} className={`px-3 py-1 rounded ${current > 1 ? "" : "pointer-events-none opacity-50"}`}>上一页</Link>
        {Array.from({ length: totalPages }, (_, i) => (
          <Link key={i} href={i === 0 ? "/news/" : `/news/page/${i + 1}/`} className={`px-3 py-1 rounded ${i + 1 === current ? "bg-blue-600 text-white" : ""}`}>{i + 1}</Link>
        ))}
        <Link href={current < totalPages ? `/news/page/${current + 1}/` : `/news/page/${current}/`} className={`px-3 py-1 rounded ${current < totalPages ? "" : "pointer-events-none opacity-50"}`}>下一页</Link>
      </nav>
    </main>
  );
}