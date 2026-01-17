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

  const systemPrefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDarkEffective = theme === "dark" || (theme === "system" && systemPrefersDark);

  if (!mounted) return null;

  return (
    <div
      ref={wrapperRef}
      suppressHydrationWarning
      className="relative inline-flex items-center"
    >
      <button
        type="button"
        role="switch"
        aria-checked={isDarkEffective}
        aria-label="切换主题"
        onClick={() => {
          const isDark = theme === "dark" || (theme === "system" && systemPrefersDark);
          setTheme(isDark ? "light" : "dark");
        }}
        className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-800 border border-border transition-all duration-300 hover:border-accent group overflow-hidden"
      >
        <div className={`absolute inset-0 transition-opacity duration-500 ${isDarkEffective ? 'bg-accent/10 opacity-100' : 'bg-transparent opacity-0'}`} />
        <div
          className={`absolute top-0.5 w-5.5 h-5.5 rounded-full bg-white dark:bg-slate-900 shadow-lg border border-border flex items-center justify-center transition-all duration-300 ease-out ${isDarkEffective ? 'left-[32px]' : 'left-0.5'
            }`}
        >
          {isDarkEffective ? (
            <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.3,4.9c0.4-0.1,0.6-0.5,0.5-0.9c-0.1-0.4-0.5-0.6-0.9-0.5C7.2,4.4,3,8.7,3,14c0,5.5,4.5,10,10,10c4.1,0,7.7-2.5,9.2-6.1c0.1-0.4-0.1-0.8-0.4-1c-0.4-0.2-0.8,0-1,0.3c-1.3,2-3.5,3.3-5.9,3.3c-3.9,0-7-3.1-7-7C7.8,10.1,9.7,7,12.3,4.9z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13L2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13L20,13z M11,2l0,2c0,0.55,0.45,1,1,1s1-0.45,1-1l0-2c0-0.55-0.45-1-1-1S11,1.45,11,2L11,2z M11,20l0,2c0,0.55,0.45,1,1,1s1-0.45,1-1l0-2c0-0.55-0.45-1-1-1S11,19.45,11,20L11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
}