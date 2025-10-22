import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllNews, getNewsBySlug, getNewsHtmlBySlug, getSiblingNews } from "@/lib/news";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    keywords: [item.title, "OK9981", "新闻", "资讯"],
    openGraph: {
      title: item.title,
      description: item.summary,
      type: "article",
      publishedTime: item.date,
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/news/${item.slug}`,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) return notFound();
  const html = await getNewsHtmlBySlug(slug);
  const { prev, next } = getSiblingNews(slug);
  const d = new Date(item.date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <nav aria-label="面包屑" className="text-sm text-slate-600 mb-4 flex items-center gap-2">
        <a href="/news">新闻列表</a>
        <span aria-hidden>›</span>
        <a href={`/news/archive/${year}/${month}`}>{year}-{month} 归档</a>
      </nav>
      <header>
        <time className="block text-sm text-slate-500">
          {new Date(item.date).toLocaleDateString("zh-CN")}
        </time>
        <h1 className="text-3xl font-bold mt-2">{item.title}</h1>
      </header>
      <article className="prose mt-6" dangerouslySetInnerHTML={{ __html: html ?? "" }} />

      <nav aria-label="文章导航" className="mt-10">
        <div className="flex items-center justify-between gap-4">
          {prev ? (
            <a href={`/news/${prev.slug}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <span aria-hidden>←</span>
              <span>
                上一篇
                <span className="ml-2 text-slate-600">{prev.title}</span>
              </span>
            </a>
          ) : (
            <span className="text-slate-500">已是最早一篇</span>
          )}
          {next ? (
            <a href={`/news/${next.slug}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <span>
                下一篇
                <span className="ml-2 text-slate-600">{next.title}</span>
              </span>
              <span aria-hidden>→</span>
            </a>
          ) : (
            <span className="text-slate-500">已是最新一篇</span>
          )}
        </div>
      </nav>
      {/* 为固定 footer 预留额外空间，避免导航被遮挡 */}
      <div aria-hidden style={{ height: "calc(var(--footer-height) + 16px)" }} />
    </main>
  );
}