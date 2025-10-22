import Link from "next/link";
import type { Metadata } from "next";
import { getAllYears, getMonthsByYear, getNewsByYearMonth } from "@/lib/news";

type Props = { params: Promise<{ year: string; month: string }> };

export async function generateStaticParams() {
  const years = getAllYears();
  const params: { year: string; month: string }[] = [];
  for (const y of years) {
    for (const m of getMonthsByYear(y)) {
      params.push({ year: String(y), month: String(m).padStart(2, "0") });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, month } = await params;
  return {
    title: `${year}-${month} 月资讯归档`,
    description: `${year}-${month} 月的每日资讯列表`,
  };
}

export default async function NewsArchiveYearMonth({ params }: Props) {
  const { year, month } = await params;
  const y = Number(year);
  const m = Number(month);
  const items = getNewsByYearMonth(y, m);
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{year}-{month} 月资讯</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.slug} className="card transition-shadow p-5 flex flex-col relative group">
            <Link href={`/news/${item.slug}`} aria-label={`打开：${item.title}`} className="absolute inset-0 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <time className="block text-sm text-slate-500 mt-1">{new Date(item.date).toLocaleDateString("zh-CN")}</time>
            <p className="mt-2 line-clamp-3 text-sm">{item.summary}</p>
            <div className="mt-4"><span className="card-cta inline-flex items-center gap-1">阅读全文 <span aria-hidden>→</span></span></div>
          </article>
        ))}
      </div>

      <nav aria-label="归档导航" className="mt-8">
        <Link href={`/news/archive/${year}`} className="px-3 py-1">返回 {year} 年</Link>
      </nav>
    </main>
  );
}