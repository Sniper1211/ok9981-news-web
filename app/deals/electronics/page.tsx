import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "数码产品促销",
  description: "以旧换新/教育优惠"
};

export default function ElectronicsDealsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <nav aria-label="面包屑" className="text-sm text-slate-600 mb-4 flex items-center gap-2">
        <Link href="/deals/">羊毛</Link>
        <span aria-hidden>›</span>
        <span>数码产品促销</span>
      </nav>
      <h1 className="text-3xl font-bold mb-4">数码产品促销</h1>
      <p className="text-slate-600 mb-8">数码类活动与权益。你可以在此添加以旧换新、教育优惠等详情。</p>
      <section className="card p-5">
        <p className="text-sm text-slate-600">暂无内容，稍后添加。</p>
      </section>
    </main>
  );
}
