import type { Metadata } from "next";
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.meirizixun.site";

export const metadata: Metadata = {
  title: "联系我们",
  description: "商务合作、内容纠错与侵权申诉，请通过邮箱与我们联系。",
  alternates: { canonical: `${site}/contact/` },
};

export default function ContactPage() {
  return (
    <main className="site-container py-10">
      <header>
        <h1 className="text-3xl font-bold">联系我们</h1>
        <p className="text-slate-600 mt-2">
          我们欢迎反馈与合作，通常在 3 个工作日内回复。
        </p>
      </header>

      <section className="prose mt-6">
        <h2>电子邮箱</h2>
        <p>
          请发送邮件至：
          <a href="mailto:busivaa@gmail.com">busivaa@gmail.com</a>
        </p>
        <p>邮件主题建议包含：问题类别 + 简要说明（例如：纠错反馈 - 某条资讯日期有误）。</p>

        <h2>常见事项</h2>
        <ul>
          <li>内容纠错与补充说明</li>
          <li>版权与转载授权</li>
          <li>商务合作与广告投放</li>
          <li>隐私或安全问题反馈</li>
        </ul>
      </section>
    </main>
  );
}
