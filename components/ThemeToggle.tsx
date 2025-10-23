"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "system" | "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [open, setOpen] = useState(false);
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLButtonElement | null>(null);
  const [mounted, setMounted] = useState(false);
const skipTransitionOnceRef = useRef(true);
const prevEffectiveRef = useRef<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
  }, []);

  const applyTheme = (next: Theme, opts: { withTransition?: boolean; sweepDirection?: "down" | "up" } = {}) => {
    if (typeof document === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const effective: "light" | "dark" = next === "system" ? (mql.matches ? "dark" : "light") : next;
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 记录切换前的背景色，用于扫幕遮罩（遮住新主题，再按方向揭示）
    const oldBg = getComputedStyle(root).getPropertyValue("--background").trim();
     // 应用新主题
     root.setAttribute("data-theme", effective);
     prevEffectiveRef.current = effective;
     const withTransition = opts.withTransition !== false;
     if (withTransition && !reduceMotion) {
       // 全局平滑颜色过渡等待时间统一到 900ms，配合推过去动画
       root.classList.add("theme-transition");
       window.setTimeout(() => {
         root.classList.remove("theme-transition");
       }, 900);
       // 定向扫幕：上->下（down）或下->上（up）
       if (opts.sweepDirection) {
         const overlay = document.createElement("div");
         overlay.setAttribute("aria-hidden", "true");
         overlay.style.position = "fixed";
         overlay.style.left = "0";
         overlay.style.right = "0";
         overlay.style.height = "100%";
         overlay.style.pointerEvents = "none";
         overlay.style.zIndex = "9999";
         overlay.style.background = oldBg || "transparent";
         overlay.style.opacity = "0.12"; // 轻微半透明，避免完全遮挡；无模糊
         overlay.style.willChange = "transform, opacity";
         overlay.style.transform = "translateY(0%)";
         if (opts.sweepDirection === "down") {
           overlay.style.top = "0"; // 从顶部开始，向下推进（推出并淡出）
           overlay.style.animation = "themePushDown 900ms ease-in-out forwards";
         } else {
           overlay.style.bottom = "0"; // 从底部开始，向上推进（推出并淡出）
           overlay.style.animation = "themePushUp 900ms ease-in-out forwards";
         }
         document.body.appendChild(overlay);
         overlay.addEventListener("animationend", () => overlay.remove(), { once: true });
       }
     } else {
       // 无过渡或用户减少动效：直接切换
       root.setAttribute("data-theme", effective);
       prevEffectiveRef.current = effective;
     }
  };

  useEffect(() => {
     if (typeof window === "undefined") return;
     const saved = (window.localStorage.getItem("theme") as Theme | null) || "system";
     setTheme(saved);
     const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
     prevEffectiveRef.current = saved === "system" ? (systemPrefersDark ? "dark" : "light") : saved;
     applyTheme(saved, { withTransition: false });
   }, []);

   // 监听系统主题变化，仅当当前处于“跟随系统”时才应用
   useEffect(() => {
     if (typeof window === "undefined") return;
     const mql = window.matchMedia("(prefers-color-scheme: dark)");
     const onChange = () => {
      if (theme === "system") {
        const dir: "down" | "up" = mql.matches ? "down" : "up"; // 系统切到暗：上->下；切到浅：下->上
        applyTheme("system", { withTransition: true, sweepDirection: dir });
      }
     };
     mql.addEventListener("change", onChange);
     return () => mql.removeEventListener("change", onChange);
   }, [theme]);

   // 测量“🖥 跟随系统”文本对应的按钮理想宽度，用于固定按钮与菜单宽度
   useEffect(() => {
     const measure = () => {
       if (measureRef.current) {
         const w = measureRef.current.offsetWidth;
         if (w && w > 0) setButtonWidth(w);
       }
     };
     // 多次尝试以应对字体加载与首帧渲染
     measure();
     const id = window.setTimeout(measure, 50);
     const id2 = window.setTimeout(measure, 200);
     return () => {
       window.clearTimeout(id);
       window.clearTimeout(id2);
     };
   }, []);

   useEffect(() => {
     if (typeof window === "undefined") return;
     window.localStorage.setItem("theme", theme);
     const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
     const nextEff: "light" | "dark" = theme === "dark" || (theme === "system" && systemPrefersDark) ? "dark" : "light";
     const dir: "down" | "up" = nextEff === "dark" ? "down" : "up"; // 日->夜：上到下；夜->日：下到上
     applyTheme(theme, { withTransition: !skipTransitionOnceRef.current, sweepDirection: dir });
     if (skipTransitionOnceRef.current) skipTransitionOnceRef.current = false;
   }, [theme]);

   useEffect(() => {
     const onPointerDown = (e: Event) => {
       if (!wrapperRef.current) return;
       const target = e.target as Node | null;
       if (target && !wrapperRef.current.contains(target)) setOpen(false);
     };
     const onKeyDown = (e: KeyboardEvent) => {
       if (e.key === "Escape") setOpen(false);
     };
     document.addEventListener("pointerdown", onPointerDown);
     document.addEventListener("keydown", onKeyDown);
     return () => {
       document.removeEventListener("pointerdown", onPointerDown);
       document.removeEventListener("keydown", onKeyDown);
     };
   }, []);

   const options: { value: Theme; label: string }[] = [
     { value: "system", label: "🖥 跟随系统" },
     { value: "light", label: "🌞 浅色" },
     { value: "dark", label: "🌙 暗色" },
   ];

   const currentLabel = options.find((o) => o.value === theme)?.label ?? "主题";

   if (!mounted) return null;

   return (
     <div
       ref={wrapperRef}
       suppressHydrationWarning
       style={{ position: "relative", display: "inline-block" }}
     >
       {mounted && (
         (() => {
           const systemPrefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
           const isDarkEffective = theme === "dark" || (theme === "system" && systemPrefersDark);
           return (
             <button
               type="button"
               role="switch"
               aria-checked={isDarkEffective}
               aria-label="切换主题：日间/夜间（默认跟随系统）"
               onClick={() => {
                 const isDark = theme === "dark" || (theme === "system" && systemPrefersDark);
                 setTheme(isDark ? "light" : "dark");
               }}
               style={{
                 // 轨道（与圆球等高）
                 width: 60,
                 height: 30,
                 borderRadius: 9999,
                 border: "1px solid var(--border)",
                 background: "var(--muted)",
                 position: "relative",
                 display: "inline-block",
                 padding: 0,
                 transition: "background-color 200ms ease, border-color 200ms ease",
               }}
             >
               {/* 圆球滑块（与轨道等高，水平居中对齐）*/}
               <span
                 aria-hidden
                 style={{
                   width: 28,
                   height: 28,
                   borderRadius: "50%",
                   background: "var(--background)",
                   color: "var(--foreground)",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center",
                   position: "absolute",
                   top: 0,
                   left: 1,
                   transform: isDarkEffective ? "translateX(29px)" : "translateX(-1px)",
                   transition: "transform 200ms ease",
                   boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
                   fontSize: 16,
                   lineHeight: 1,
                 }}
               >
                 {isDarkEffective ? "🌙" : "🌞"}
               </span>
             </button>
           );
         })()
       )}
     </div>
   );
}