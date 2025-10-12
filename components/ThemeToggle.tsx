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

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (saved === "system") applyTheme("system");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

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
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          border: "1px solid var(--border)",
          borderRadius: 9999,
          padding: "6px 10px",
          background: "var(--background)",
          color: "var(--foreground)",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          width: buttonWidth ?? 160,
        }}
      >
        <span style={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>{currentLabel}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          style={{ opacity: 0.7 }}
        >
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            minWidth: buttonWidth ? `${buttonWidth}px` : "100%",
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              role="menuitemradio"
              aria-checked={theme === opt.value}
              onClick={() => { setTheme(opt.value); setOpen(false); }}
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                background: "transparent",
                color: "var(--foreground)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span style={{ flex: 1, textAlign: "left" }}>{opt.label}</span>
              {theme === opt.value && (
                <span aria-hidden style={{ opacity: 0.7 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 隐藏的测量按钮，仅用于计算“🖥 跟随系统”标准宽度 */}
      <button
        ref={measureRef}
        type="button"
        aria-hidden
        tabIndex={-1}
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          border: "1px solid var(--border)",
          borderRadius: 9999,
          padding: "6px 10px",
          background: "var(--background)",
          color: "var(--foreground)",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>🖥 跟随系统</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}