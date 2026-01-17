import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import CurrentYear from "@/components/CurrentYear";
import Script from "next/script";
import NavLinks from "@/components/NavLinks";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "每日资讯简报",
  description: "每日资讯简报 - 每日最新新闻",
  keywords: [
    "OK9981",
    "新闻",
    "资讯",
    "新闻中心",
    "每日资讯",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.meirizixun.site"),
  alternates: {
    canonical: "/",
  },
  viewport: { width: "device-width", initialScale: 1 },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="glass-header">
          <div className="site-container py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight hover:scale-105 active:scale-95 transition-transform">
              每日资讯简报
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <NavLinks />
              <ThemeToggle />
            </div>
            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="mt-20 border-t border-border bg-card/30">
          <div className="site-container py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">每日资讯简报</h3>
                <p className="text-sm text-muted leading-relaxed">
                  汇聚全球资讯，提供每日最有价值的新闻内容。
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">快速链接</h4>
                <nav className="flex flex-col gap-2">
                  <Link href="/news/" className="text-sm hover:text-accent transition-colors">新闻列表</Link>
                  <Link href="/deals/" className="text-sm hover:text-accent transition-colors">精选优惠</Link>
                  <Link href="/search" className="text-sm hover:text-accent transition-colors">全局搜索</Link>
                </nav>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">法律与合规</h4>
                <nav className="flex flex-col gap-2">
                  <Link href="/privacy/" className="text-sm hover:text-accent transition-colors">隐私政策</Link>
                  <Link href="/terms/" className="text-sm hover:text-accent transition-colors">使用条款</Link>
                  <Link href="/contact/" className="text-sm hover:text-accent transition-colors">联系我们</Link>
                </nav>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
              <span>© <CurrentYear /> OK9981. All rights reserved.</span>
              <div className="flex gap-6">
                <Link href="/about/" className="hover:text-foreground">关于我们</Link>
              </div>
            </div>
          </div>
        </footer>

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-K4ZX54PHWM" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'G-K4ZX54PHWM');
          `}
        </Script>
      </body>
    </html>
  );
}
