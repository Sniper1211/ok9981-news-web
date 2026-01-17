import Link from "next/link";
import type { Metadata } from "next";
import { getAllYears, getMonthsByYear, getNewsByYearMonth } from "@/lib/news";
import NewsList from "@/components/NewsList";

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
    <main className="py-16">
      <div className="site-container">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold tracking-tight">{year}-{month} 月资讯</h1>
          <Link href={`/news/archive/${year}`} className="text-accent hover:underline font-medium">
            ← 返回 {year} 年
          </Link>
        </div>

        <NewsList items={items} />
      </div>
    </main>
  );
}