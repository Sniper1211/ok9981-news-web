"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface DealCardProps {
  deal: {
    id: number;
    title: string;
    image: string;
    link: string;
    desc: string;
  };
}

export default function DealCard({ deal }: DealCardProps) {
  const [showToast, setShowToast] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [toastPos, setToastPos] = useState({ x: 0, y: 0 });
  const timerRef = useRef<NodeJS.Timeout>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    // 复制链接
    try {
      await navigator.clipboard.writeText(deal.link);
    } catch (err) {
      console.error("Failed to copy:", err);
    }

    // 设置气泡位置（跟随鼠标点击位置）
    setToastPos({ x: e.clientX, y: e.clientY });
    
    // 重置状态
    clearTimers();
    setShowToast(true);
    setIsFading(false);

    // 4.5秒后开始淡出
    fadeTimerRef.current = setTimeout(() => {
      setIsFading(true);
    }, 4500);

    // 5秒后完全消失
    timerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearTimers();
    setIsFading(true);
    // 等待淡出动画结束（300ms）后移除 DOM
    setTimeout(() => {
      setShowToast(false);
    }, 300);
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <>
      <div
        onClick={handleClick}
        className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 cursor-pointer relative"
      >
        <div className="aspect-[3/4] relative bg-slate-50">
          <Image
            src={deal.image}
            alt={deal.title}
            width={300}
            height={400}
            className="object-cover w-full h-full"
            unoptimized
          />
        </div>
        <div className="p-4 border-t border-slate-100">
          <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
            {deal.title}
          </h3>
          <p className="text-slate-500 text-sm mt-1">{deal.desc}</p>
        </div>
      </div>

      {/* Portal 或 Fixed 定位的 Toast */}
      {showToast && (
        <div
          className={`fixed z-50 px-4 py-3 bg-slate-800 text-white text-sm rounded-lg shadow-lg pointer-events-auto transition-opacity duration-300 ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
          style={{
            left: toastPos.x,
            top: toastPos.y,
            transform: "translate(-50%, -100%) translateY(-12px)", // 稍微向上偏移一点，避免遮挡鼠标
          }}
        >
          <div className="flex items-start gap-3">
            <div>
              <p className="font-bold mb-1">链接已复制！</p>
              <p className="text-xs text-slate-300">请前往微信粘贴并打开</p>
            </div>
            <button 
              onClick={handleClose}
              className="text-slate-400 hover:text-white transition-colors p-0.5"
              aria-label="关闭"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* 小箭头 */}
          <div className="absolute left-1/2 bottom-[-6px] w-3 h-3 bg-slate-800 transform -translate-x-1/2 rotate-45"></div>
        </div>
      )}
    </>
  );
}
