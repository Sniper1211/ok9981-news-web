import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-container py-16">
      <section className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-bold">页面未找到（404）</h1>
        <p className="mt-4 text-slate-600">
          抱歉，您访问的页面不存在或已被移动。
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/" className="px-4 py-2 rounded bg-blue-600 text-white">返回首页</Link>
          <Link href="/news/" className="px-4 py-2 rounded border border-slate-300">查看新闻列表</Link>
        </div>
        <div aria-hidden style={{ height: "calc(var(--footer-height) + 24px)" }} />
      </section>
    </main>
  );
}