import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNews, getNewsBySlug, getSiblingNews, getNewsContentBySlug } from "@/lib/news";
import RightSidebar from "@/components/RightSidebar";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) return {};
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.meirizixun.site";
  return {
    title: item.title,
    description: item.summary,
    keywords: [item.title, "新闻", "资讯"],
    alternates: {
      canonical: `${site}/news/${item.slug}/`,
    },
    openGraph: {
      title: item.title,
      description: item.summary,
      type: "article",
      publishedTime: item.date,
      url: `${site}/news/${item.slug}/`,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) return notFound();
  const raw = getNewsContentBySlug(slug) ?? "";
  const { prev, next } = getSiblingNews(slug);
  const d = new Date(item.date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const lines = raw.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const items = lines;
  const first = items[0] ?? "";
  const rest = items.slice(1);
  const normalize = (line: string) =>
    line.replace(/^\d+\s*[、.．]\s*/, "").replace(/[；;]\s*$/, "");
  const splitForInlineButton = (line: string) => {
    const m = line.match(/([；;，,。.!？?、：:]+)\s*$/);
    const punct = m ? m[1] : "";
    const core = m ? line.slice(0, line.length - m[0].length) : line;
    const hanIdx: number[] = [];
    for (let i = 0; i < core.length; i++) {
      const ch = core[i];
      if (/[\u4e00-\u9fff]/.test(ch)) hanIdx.push(i);
    }
    const splitPos = hanIdx.length >= 2 ? hanIdx[hanIdx.length - 2] : Math.max(0, core.length - 2);
    return { prefix: core.slice(0, splitPos), tail: core.slice(splitPos), punct };
  };

  return (
    <main className="site-container py-10">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* 主内容区域 */}
        <section className="lg:col-span-8 xl:col-span-9">
          <nav aria-label="面包屑" className="text-sm text-slate-600 mb-4 flex items-center gap-2">
            <Link href="/news/">新闻列表</Link>
            <span aria-hidden>›</span>
            <Link href={`/news/archive/${year}/${month}/`}>{year}-{month} 归档</Link>
          </nav>
          <header>
            <time className="block text-sm text-slate-500">
              {new Date(item.date).toLocaleDateString("zh-CN")}
            </time>
            <h1 className="text-3xl font-bold mt-2">{item.title}</h1>
          </header>
          <article className="prose prose-news mt-6">
            {first && (() => {
              const { prefix, tail, punct } = splitForInlineButton(first);
              return (
                <div className="not-prose rounded-md p-4 bg-accent/10 border border-accent/20 text-accent font-bold">
                  <span className="inline">{prefix}{tail}{punct}</span>
                </div>
              );
            })()}
            <ol className="not-prose space-y-1 mt-2">
              {rest.map((line, idx) => {
                const hue = Math.round((idx / Math.max(1, rest.length)) * 360);
                const { prefix, tail, punct } = splitForInlineButton(line);
                return (
                  <li
                    key={idx}
                    className="news-item-gradient rounded-md p-1 leading-snug"
                    style={{ ["--news-h" as any]: `${hue}` }}
                  >
                    <span className="inline">{prefix}</span>
                    <span className="inline whitespace-nowrap">
                      {tail}
                      <Link
                        href={`https://www.bing.com/search?q=${encodeURIComponent(normalize(line))}`}
                        className="ml-1 inline-flex align-middle items-center gap-1 rounded-md px-2 py-[2px] text-[0.9em] hover:bg-accent/10 hover:text-accent transition-colors group"
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        aria-label={`搜索：${normalize(line)}`}
                      >
                        <svg viewBox="0 0 24 24" className="w-[1em] h-[1em] text-muted group-hover:text-accent" aria-hidden>
                          <path fill="currentColor" d="M21 20l-5.6-5.6a7 7 0 10-1.4 1.4L20 21zM10 15a5 5 0 110-10 5 5 0 010 10z"/>
                        </svg>
                      </Link>
                    </span>
                    {punct && <span className="inline">{punct}</span>}
                  </li>
                );
              })}
            </ol>
          </article>

          <nav aria-label="文章导航" className="mt-10">
            <div className="flex items-center justify-between gap-4">
              {prev ? (
                <Link href={`/news/${prev.slug}/`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
                  <span aria-hidden>←</span>
                  <span>
                    上一篇
                    <span className="ml-2 text-slate-600">{prev.title}</span>
                  </span>
                </Link>
              ) : (
                <span className="text-slate-500">已是最早一篇</span>
              )}
              {next ? (
                <Link href={`/news/${next.slug}/`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
                  <span>
                    下一篇
                    <span className="ml-2 text-slate-600">{next.title}</span>
                  </span>
                  <span aria-hidden>→</span>
                </Link>
              ) : (
                <span className="text-slate-500">已是最新一篇</span>
              )}
            </div>
          </nav>
        </section>

        {/* 右侧栏：广告与推荐（下移一点，避免紧贴顶部导航） */}
        <aside className="lg:col-span-4 xl:col-span-3 hidden lg:block lg:mt-2 xl:mt-3">
          <RightSidebar currentSlug={slug} />
        </aside>
      </div>
    </main>
  );
}
