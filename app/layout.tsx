import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import Script from "next/script";

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
  description: "每日资讯简报 - 每日最新新闻与羊毛资讯",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
        style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
      >
        <header style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backdropFilter: "saturate(180%) blur(6px)",
          background: "color-mix(in oklab, var(--background) 85%, transparent)",
          borderBottom: "1px solid var(--border)",
          zIndex: 50,
        }}>
          <div className="site-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.8rem 0" }}>
            <a href="/" style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--foreground)" }}>每日资讯简报</a>
            <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <a href="/" aria-label="首页">首页</a>
              <a href="/news/" aria-label="新闻">新闻</a>
              <a href="/search" aria-label="搜索">搜索</a>
              <a href="/deals/" aria-label="羊毛">羊毛🐑</a>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        {/* 为固定 header 留出空间 */}
        <div style={{ height: "var(--header-height)", minHeight: "64px", flexShrink: 0 }} aria-hidden="true" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-K4ZX54PHWM" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'G-K4ZX54PHWM');
          `}
        </Script>
        {children}
        <footer id="site-footer" style={{ marginTop: "auto", borderTop: "1px solid var(--border)", background: "var(--background)" }}>
          <div className="site-container" style={{ padding: "1.2rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem", color: "var(--muted)" }}>
            <span>© {new Date().getFullYear()} OK9981</span>
            <span>由 Next.js 与 Vercel 驱动</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
