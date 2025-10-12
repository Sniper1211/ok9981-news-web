import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllNews, getNewsBySlug, getNewsHtmlBySlug } from "@/lib/news";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getNewsBySlug(params.slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
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
  const item = getNewsBySlug(params.slug);
  if (!item) return notFound();
  const html = await getNewsHtmlBySlug(params.slug);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header>
        <time className="block text-sm text-slate-500">
          {new Date(item.date).toLocaleDateString("zh-CN")}
        </time>
        <h1 className="text-3xl font-bold mt-2">{item.title}</h1>
      </header>
      <article className="prose mt-6" dangerouslySetInnerHTML={{ __html: html ?? "" }} />
    </main>
  );
}