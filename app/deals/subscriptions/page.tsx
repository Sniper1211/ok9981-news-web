import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "订阅服务返利",
  description: "年付更划算"
};

export default function SubscriptionsDealsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <nav aria-label="面包屑" className="text-sm text-slate-600 mb-4 flex items-center gap-2">
        <Link href="/deals/">羊毛</Link>
        <span aria-hidden>›</span>
        <span>订阅服务返利</span>
      </nav>
      <h1 className="text-3xl font-bold mb-4">订阅服务返利</h1>
      <p className="text-slate-600 mb-8">订阅类优惠与返利。你可以在此添加年付折扣与渠道返利详情。</p>
      <section className="card p-5">
        <p className="text-sm text-slate-600">暂无内容，稍后添加。</p>
      </section>
    </main>
  );
}
