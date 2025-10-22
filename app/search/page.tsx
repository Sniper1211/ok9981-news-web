import type { Metadata } from "next";
import { getAllNewsWithContent } from "@/lib/news";
import SearchNews from "@/components/SearchNews";

export const metadata: Metadata = {
  title: "全文搜索",
  description: "按正文关键词与日期范围搜索每日资讯",
};

export default function SearchPage() {
  const items = getAllNewsWithContent();
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">全文搜索</h1>
      <SearchNews items={items} />
    </main>
  );
}