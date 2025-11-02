import Link from "next/link";
import type { Metadata } from "next";
import { getAllYears, getMonthsByYear, getNewsByYearMonth } from "@/lib/news";

export const metadata: Metadata = {
  title: "资讯归档",
  description: "按年份与月份归档的每日资讯",
};

export default function NewsArchiveIndex() {
  const years = getAllYears();
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">资讯归档</h1>
      <div className="space-y-8">
        {years.map((year) => {
          const months = getMonthsByYear(year);
          return (
            <section key={year}>
              <h2 className="text-xl font-semibold">{year} 年</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {months.map((m) => {
                  const list = getNewsByYearMonth(year, m);
                  return (
                    <Link key={m} href={`/news/archive/${year}/${String(m).padStart(2, "0")}/`} className="card px-3 py-2">
                      {year}-{String(m).padStart(2, "0")}（{list.length}）
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}