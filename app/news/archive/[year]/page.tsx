import Link from "next/link";
import type { Metadata } from "next";
import { getAllYears, getMonthsByYear, getNewsByYearMonth } from "@/lib/news";

type Props = { params: Promise<{ year: string }> };

export async function generateStaticParams() {
  return getAllYears().map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `${year} 年资讯归档`,
    description: `${year} 年的每日资讯归档列表`,
  };
}

export default async function NewsArchiveYear({ params }: Props) {
  const { year } = await params;
  const y = Number(year);
  const months = getMonthsByYear(y);
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{y} 年资讯归档</h1>
      <div className="flex flex-wrap gap-3">
        {months.map((m) => (
          <Link key={m} href={`/news/archive/${y}/${String(m).padStart(2, "0")}`} className="card px-3 py-2">
            {y}-{String(m).padStart(2, "0")}（{getNewsByYearMonth(y, m).length}）
          </Link>
        ))}
      </div>
    </main>
  );
}