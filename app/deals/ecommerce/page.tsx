import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "电商平台津贴",
  description: "跨店满减"
};

export default function EcommerceAllowancePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <nav aria-label="面包屑" className="text-sm text-slate-600 mb-4 flex items-center gap-2">
        <Link href="/deals/">羊毛</Link>
        <span aria-hidden>›</span>
        <span>电商平台津贴</span>
      </nav>
      <h1 className="text-3xl font-bold mb-4">电商平台津贴</h1>
      <p className="text-slate-600 mb-8">跨店满减与活动说明。你可以在此添加京东、淘宝、拼多多等详情。</p>
      <section className="card p-5">
        <p className="text-sm text-slate-600">暂无内容，稍后添加。</p>
      </section>
    </main>
  );
}
