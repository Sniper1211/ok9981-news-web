import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNews, getNewsBySlug, getNewsHtmlBySlug, getSiblingNews } from "@/lib/news";
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
  const html = await getNewsHtmlBySlug(slug);
  const { prev, next } = getSiblingNews(slug);
  const d = new Date(item.date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");

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
          <article className="prose mt-6" dangerouslySetInnerHTML={{ __html: html ?? "" }} />

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
