import type { Metadata } from "next";
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.meirizixun.site";

export const metadata: Metadata = {
  title: "关于我们",
  description:
    "每日资讯简报：以简洁、可信为宗旨，汇集每日要闻与生活优惠，帮助你快速获取重要信息。",
  alternates: { canonical: `${site}/about/` },
};

export default function AboutPage() {
  return (
    <main className="site-container py-10">
      <header>
        <h1 className="text-3xl font-bold">关于我们</h1>
        <p className="text-slate-600 mt-2">
          OK9981 团队运营的资讯聚合项目，聚焦“快速、可信、好读”。
        </p>
      </header>

      <article className="prose mt-6">
        <h2>项目愿景</h2>
        <p>
          我们希望用更轻量的方式，帮助用户在碎片时间掌握当天重要新闻动态，并发现生活相关的实用优惠信息。
        </p>

        <h2>内容标准</h2>
        <ul>
          <li>来源公开可查，优先权威发布或多方交叉验证</li>
          <li>标题简明不夸张，摘要信息准确、可溯源</li>
          <li>及时更新与纠错，尊重原创与版权</li>
        </ul>

        <h2>联系我们</h2>
        <p>
          意见、建议或合作，请发送邮件至：
          <a href="mailto:contact@meirizixun.site">contact@meirizixun.site</a>
        </p>
      </article>
    </main>
  );
}

