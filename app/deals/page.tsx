import type { Metadata } from "next";
import DealCard from "@/components/DealCard";

export const metadata: Metadata = {
  title: "羊毛🐑",
  description: "线上消费优惠信息汇总",
  keywords: ["羊毛", "优惠", "折扣", "返利", "券"]
};

const movieDeals = [
  {
    id: 1,
    title: "特惠观影渠道 A",
    image: "/images/deals/movies/movie-ticket-qr.png",
    link: "https://activity01.yunzhanxinxi.com/link/1000587694bdcebaf1bb1000ZFYeP555",
    desc: "全国影院通用，扫码立享优惠"
  },
  {
    id: 2,
    title: "特惠观影渠道 B",
    image: "/images/deals/movies/movie-ticket-qr-2.png",
    link: "https://activity01.yunzhanxinxi.com/link/1000071694bf2f5a83d41000gNR2c7Xd",
    desc: "支持在线选座，立减 5-20 元"
  }
];

export default function DealsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">羊毛🐑</h1>
      <p className="text-slate-600 mb-8">收集各类线上消费优惠与折扣信息，后续将支持分类与搜索。</p>

      {/* 电影票特惠区 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          🎬 电影票特惠
          <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">点击图片或扫码直达</span>
        </h2>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {movieDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      {/* 其他分类预留 */}
      <h2 className="text-2xl font-bold mb-6">更多优惠</h2>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "信用卡支付满减", note: "银行活动汇总" },
          { title: "外卖平台优惠", note: "周末加码券" },
          { title: "电商平台津贴", note: "跨店满减" },
          { title: "生活服务折扣", note: "洗车/电影/美团券" },
          { title: "数码产品促销", note: "以旧换新/教育优惠" },
          { title: "订阅服务返利", note: "年付更划算" },
        ].map((d, i) => (
          <article key={i} className="card p-5">
            <h2 className="text-lg font-semibold">{d.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{d.note}</p>
            <div className="mt-4"><span className="card-cta inline-flex items-center gap-1">查看详情 <span aria-hidden>→</span></span></div>
          </article>
        ))}
      </section>
    </main>
  );
}