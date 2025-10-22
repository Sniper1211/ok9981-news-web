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

  useEffect(() => {
    setMounted(true);
  }, []);

  const applyTheme = (next: Theme) => {
    if (typeof document === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const effective = next === "system" ? (mql.matches ? "dark" : "light") : next;
    document.documentElement.setAttribute("data-theme", effective);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = (window.localStorage.getItem("theme") as Theme | null) || "system";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  // 监听系统主题变化，仅当当前处于“跟随系统”时才应用
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (theme === "system") applyTheme("system");
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
    applyTheme(theme);
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
                  transform: isDarkEffective ? "translateX(28px)" : "translateX(-1px)",
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