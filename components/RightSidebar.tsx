import { getAllNews } from "@/lib/news";
import Link from "next/link";

export default function RightSidebar({ currentSlug }: { currentSlug?: string }) {
  const all = getAllNews();
  const recommendations = all
    .filter((n) => n.slug !== currentSlug)
    .slice(0, 6);

  return (
    <aside aria-label="右侧推荐与广告" className="space-y-6">
      <section className="sidebar-panel p-4">
        <h2 className="text-base font-semibold">推荐阅读</h2>
        <ul className="mt-3 space-y-2">
          {recommendations.map((n) => (
            <li key={n.slug}>
              <Link href={`/news/${n.slug}/`} className="text-sm">
                {n.title}
              </Link>
              <time className="block text-xs text-slate-500">
                {new Date(n.date).toLocaleDateString("zh-CN")}
              </time>
            </li>
          ))}
        </ul>
      </section>

      <section className="sidebar-panel p-4">
        <h2 className="text-base font-semibold">一拍即合</h2>
        <div className="mt-3 grid gap-3">
          <div className="ad-slot">320×80 Banner</div>
          <div className="ad-slot ad-slot--large">320×180 广告位</div>
        </div>
      </section>
    </aside>
  );
}