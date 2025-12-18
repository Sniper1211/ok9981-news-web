"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { NewsWithContent } from "@/lib/news";

export default function SearchNews({ items }: { items: NewsWithContent[] }) {
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
      const matchK = k ? it.content.toLowerCase().includes(k) : true; // 仅匹配正文内容
      const inRange = t >= startTime && t <= endTime;
      return matchK && inRange;
    });
  }, [items, keyword, start, end]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div>
      <form className="card p-4 mb-6" onSubmit={(e) => e.preventDefault()}>
        <div className="text-sm text-slate-700 mb-3">搜索正文关键词（可选时间范围）</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex flex-col">
            <span className="text-sm text-slate-600">关键词（正文）</span>
            <input value={keyword} onChange={(e) => { setPage(1); setKeyword(e.target.value); }} className="px-3 py-2 rounded border border-slate-300 bg-white" placeholder="例如：新能源、并购、政策" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-slate-600">开始日期</span>
            <input type="date" value={start} onChange={(e) => { setPage(1); setStart(e.target.value); }} className="px-3 py-2 rounded border border-slate-300 bg-white" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-slate-600">结束日期</span>
            <input type="date" value={end} onChange={(e) => { setPage(1); setEnd(e.target.value); }} className="px-3 py-2 rounded border border-slate-300 bg-white" />
          </label>
        </div>
        <div className="mt-3 text-sm text-slate-600">共 {filtered.length} 条结果（第 {current}/{totalPages} 页）</div>
      </form>

      {filtered.length === 0 ? (
        <p className="text-slate-600">没有匹配的结果，试试更少或更换的关键词。</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((item) => (
            <article key={item.slug} className="card transition-shadow p-5 flex flex-col relative group">
              <Link href={`/news/${item.slug}/`} aria-label={`打开：${item.title}`} className="absolute inset-0 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <time className="block text-sm text-slate-500 mt-1">{new Date(item.date).toLocaleDateString("zh-CN")}</time>
              <p className="mt-2 line-clamp-3 text-sm">{item.summary}</p>
              <div className="mt-4"><span className="card-cta inline-flex items-center gap-1">阅读全文 <span aria-hidden>→</span></span></div>
            </article>
          ))}
        </div>
      )}

      <nav aria-label="分页" className="mt-8 flex items-center justify-center gap-3">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className={`px-3 py-1 rounded ${current > 1 ? "" : "pointer-events-none opacity-50"}`}>上一页</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded ${i + 1 === current ? "bg-blue-600 text-white" : ""}`}>{i + 1}</button>
        ))}
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className={`px-3 py-1 rounded ${current < totalPages ? "" : "pointer-events-none opacity-50"}`}>下一页</button>
      </nav>
    </div>
  );
}