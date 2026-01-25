import type { Metadata } from "next";
import Link from "next/link";
import CpsTool from "./CpsTool";

export const metadata: Metadata = {
  title: "CPS 链接替换",
  description: "将外卖 CPS 新链接替换进预设模板，并生成可复制的 HTML 片段。",
  keywords: ["羊毛", "CPS", "外卖", "链接替换", "HTML生成"]
};

export default function DealsCpsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <nav aria-label="面包屑" className="text-sm text-slate-600 mb-4 flex items-center gap-2">
        <Link href="/deals/">羊毛</Link>
        <span aria-hidden>›</span>
        <span>CPS 链接替换</span>
      </nav>
      <h1 className="text-3xl font-bold mb-4">CPS 链接替换</h1>
      <p className="text-slate-600 mb-8">输入新的外卖 CPS 链接，选择模板进行替换，生成可复制的 HTML 代码片段。</p>
      <CpsTool />
    </main>
  );
}
