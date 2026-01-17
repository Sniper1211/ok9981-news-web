import type { Metadata } from "next";
import { getAllNewsWithContent } from "@/lib/news";
import SearchNews from "@/components/SearchNews";

export const metadata: Metadata = {
  title: "全文搜索",
  description: "按正文关键词与日期范围深度搜索每日资讯",
};

export default function SearchPage() {
  const items = getAllNewsWithContent();
  return (
    <main className="py-16">
      <div className="site-container">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">全文搜索</h1>
          <p className="text-lg text-muted">按正文关键词与日期范围深度搜索每日资讯。</p>
        </div>
        <SearchNews items={items} />
      </div>
    </main>
  );
}