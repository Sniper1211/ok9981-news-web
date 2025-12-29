import type { Metadata } from "next";
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.meirizixun.site";

export const metadata: Metadata = {
  title: "使用条款与免责声明",
  description:
    "使用本网站的条款、免责声明与权利义务说明，包括内容来源与责任限制。",
  alternates: { canonical: `${site}/terms/` },
};

export default function TermsPage() {
  return (
    <main className="site-container py-10">
      <header>
        <h1 className="text-3xl font-bold">使用条款与免责声明</h1>
        <p className="text-slate-600 mt-2">
          请在使用本网站前仔细阅读并理解以下条款。
        </p>
      </header>

      <article className="prose mt-6">
        <h2>1. 内容与来源</h2>
        <p>
          本网站所展示的资讯内容可能来源于公开渠道的整理与汇编，仅供学习与参考。我们致力于提供准确及时的信息，但不对内容的完整性、准确性、时效性作出保证。
        </p>

        <h2>2. 非投资/法律建议</h2>
        <p>
          本网站不提供任何形式的投资建议、法律意见或专业咨询。您据此做出的任何决策或行动，需自行承担风险与责任。
        </p>

        <h2>3. 版权与使用</h2>
        <p>
          站内原创内容的版权归本站或作者所有；转载或引用请注明来源，且不得用于违法用途。若您认为内容侵权，请通过
          <a href="mailto:contact@meirizixun.site">contact@meirizixun.site</a> 与我们联系，我们将及时处理。
        </p>

        <h2>4. 第三方链接与广告</h2>
        <p>
          本站可能包含第三方链接或广告（如 Google AdSense）。这些链接指向的站点或服务由第三方负责，其内容与隐私做法与本站无关，请您谨慎访问并遵循对方的条款。
        </p>

        <h2>5. 服务变更与终止</h2>
        <p>
          我们可能基于运营需要随时调整、暂停或终止部分功能或服务，并尽可能提前在站内通知。由此可能导致的访问不便或数据变化，敬请谅解。
        </p>

        <h2>6. 适用法律与争议解决</h2>
        <p>
          本条款受相关适用法律管辖。因使用本网站产生的争议，应友好协商解决；协商不成的，提交至有管辖权的法院处理。
        </p>
      </article>
    </main>
  );
}

