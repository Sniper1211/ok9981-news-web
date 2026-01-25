import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "生活服务折扣",
  description: "洗车/电影/美团券"
};

export default function LifeServicesDealsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <nav aria-label="面包屑" className="text-sm text-slate-600 mb-4 flex items-center gap-2">
        <Link href="/deals/">羊毛</Link>
        <span aria-hidden>›</span>
        <span>生活服务折扣</span>
      </nav>
      <h1 className="text-3xl font-bold mb-4">生活服务折扣</h1>
      <p className="text-slate-600 mb-8">生活服务类优惠与票券。你可以在此添加洗车、电影、美团券等详情。</p>
      <section className="card p-5">
        <p className="text-sm text-slate-600">暂无内容，稍后添加。</p>
      </section>
    </main>
  );
}
