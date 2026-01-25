import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "信用卡支付满减",
  description: "银行活动汇总"
};

export default function CreditCardDealsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <nav aria-label="面包屑" className="text-sm text-slate-600 mb-4 flex items-center gap-2">
        <Link href="/deals/">羊毛</Link>
        <span aria-hidden>›</span>
        <span>信用卡支付满减</span>
      </nav>
      <h1 className="text-3xl font-bold mb-4">信用卡支付满减</h1>
      <p className="text-slate-600 mb-8">银行活动汇总。你可以在此添加各银行与支付渠道的满减与返现详情。</p>
      <section className="card p-5">
        <p className="text-sm text-slate-600">暂无内容，稍后添加。</p>
      </section>
    </main>
  );
}
