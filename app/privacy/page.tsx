import type { Metadata } from "next";
import Link from "next/link";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.meirizixun.site";

export const metadata: Metadata = {
  title: "隐私政策",
  description:
    "我们重视您的隐私权。本页面阐述 Cookie 使用、数据收集与第三方（例如 Google）服务的相关说明。",
  alternates: { canonical: `${site}/privacy/` },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="site-container py-10">
      <header>
        <h1 className="text-3xl font-bold">隐私政策</h1>
        <p className="text-slate-600 mt-2">
          生效日期：{new Date().toLocaleDateString("zh-CN")}
        </p>
      </header>

      <article className="prose mt-6">
        <h2>1. 我们收集哪些信息</h2>
        <p>
          为了改进站点体验与稳定性，我们可能收集基础访问日志（如页面访问量、浏览器类型、引用来源）与匿名统计信息。除非您主动通过
          <Link href="/contact/">联系我们</Link> 提供，否则我们不会收集可识别您个人身份的敏感信息。
        </p>

        <h2>2. Cookie 与本地存储</h2>
        <p>
          我们可能使用 Cookie 或浏览器本地存储来记忆您的站点偏好（例如主题设置）与登录状态（如适用）。您可以在浏览器设置中禁用
          Cookie，但这可能影响站点的正常使用。
        </p>

        <h2>3. 第三方服务（Google 等）</h2>
        <p>
          我们的网站可能集成 Google 提供的服务（如 Google
          Analytics、Google AdSense）。这些第三方可能使用 Cookie
          或类似技术，在不直接识别您身份的前提下收集、使用并共享访问统计数据，用于广告个性化或流量分析。更多信息请参阅
          <a href="https://policies.google.com/technologies/ads?hl=zh-CN" rel="noopener" target="_blank">
            Google 广告与隐私
          </a>
          与
          <a href="https://policies.google.com/privacy?hl=zh-CN" rel="noopener" target="_blank">
            Google 隐私政策
          </a>
          。
        </p>

        <h2>4. 广告个性化设置</h2>
        <p>
          您可以访问
          <a href="https://adssettings.google.com/authenticated" rel="noopener" target="_blank">
            Google Ads 设置
          </a>
          管理与关闭广告个性化。部分第三方可能提供“选择退出”机制，具体请参考其官方说明。
        </p>

        <h2>5. 数据安全与保留</h2>
        <p>
          我们采取合理的技术与管理措施保护站点数据安全，仅在实现站点功能与合规目的所需的期间保留相关数据。除法律法规要求或履行合法义务外，我们不会出售您的个人信息。
        </p>

        <h2>6. 您的权利</h2>
        <p>
          如果您对隐私有任何疑问、希望访问/更正/删除您的信息或撤回授权，请通过
          <a href="mailto:contact@meirizixun.site">contact@meirizixun.site</a> 与我们联系。
        </p>

        <h2>7. 政策更新</h2>
        <p>
          本政策可能根据业务与法律环境变化进行更新。重大变更将通过站内公告或页面更新的方式通知。继续使用本网站即表示您同意更新后的政策。
        </p>
      </article>
    </main>
  );
}

