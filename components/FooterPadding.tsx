"use client";

import { useEffect } from "react";

export default function FooterPadding() {
  useEffect(() => {
    const applyPadding = () => {
      const footer = document.getElementById("site-footer");
      if (!footer) return;
      // 使用更稳健的高度测量，优先 boundingClientRect
      const rect = footer.getBoundingClientRect();
      let height = Math.ceil(rect.height || footer.offsetHeight || 64);
      // 兼容 iOS 安全区（刘海屏底部安全区），如果存在则加上
      const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue("padding-bottom").replace("px", "")) || 0;
      document.body.style.paddingBottom = `${height + safeAreaBottom}px`;
      // 同步更新 CSS 变量，便于页面占位引用
      document.documentElement.style.setProperty("--footer-height", `${height + safeAreaBottom}px`);
    };

    applyPadding();
    window.addEventListener("resize", applyPadding);

    // 观察 footer 尺寸变化（字体加载、内容变化等）
    const footer = document.getElementById("site-footer");
    const resizeObserver = new ResizeObserver(() => applyPadding());
    if (footer) resizeObserver.observe(footer);

    // 观察主题切换等属性变化引起的布局变化
    const mutationObserver = new MutationObserver(() => applyPadding());
    mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      window.removeEventListener("resize", applyPadding);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}