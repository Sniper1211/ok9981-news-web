"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { NewsItem } from "@/lib/news";

export default function NewsList({ items, showFilter = true }: { items: NewsItem[], showFilter?: boolean }) {
  const [keyword, setKeyword] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    const startTime = start ? new Date(start).getTime() : Number.NEGATIVE_INFINITY;
    const endTime = end ? new Date(end).getTime() : Number.POSITIVE_INFINITY;
    return items.filter((it) => {
      const t = new Date(it.date).getTime();
      const matchK = k ? (it.title.toLowerCase().includes(k) || it.summary.toLowerCase().includes(k)) : true;
      const inRange = t >= startTime && t <= endTime;
      return matchK && inRange;
    });
  }, [items, keyword, start, end]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="space-y-12">
      {showFilter && (
        <form className="premium-card p-8 bg-card" onSubmit={(e) => e.preventDefault()}>
          <div className="text-lg font-bold mb-6">内容筛选</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">关键词</label>
              <input
                value={keyword}
                onChange={(e) => { setPage(1); setKeyword(e.target.value); }}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                placeholder="搜索标题或摘要..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">开始日期</label>
              <input
                type="date"
                value={start}
                onChange={(e) => { setPage(1); setStart(e.target.value); }}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/20 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">结束日期</label>
              <input
                type="date"
                value={end}
                onChange={(e) => { setPage(1); setEnd(e.target.value); }}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/20 transition-all outline-none"
              />
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between text-sm text-muted">
            <span>找到 {filtered.length} 条资讯</span>
            <span>第 {current} / {totalPages} 页</span>
          </div>
        </form>
      )}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((item) => (
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
        <nav aria-label="分页" className="flex items-center justify-center gap-2 py-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-border hover:bg-accent hover:text-white transition-all ${current > 1 ? "" : "pointer-events-none opacity-30"}`}
          >
            ←
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-full border border-border transition-all ${i + 1 === current ? "bg-accent text-white border-accent" : "hover:bg-accent/5"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-border hover:bg-accent hover:text-white transition-all ${current < totalPages ? "" : "pointer-events-none opacity-30"}`}
          >
            →
          </button>
        </nav>
      )}
    </div>
  );
}