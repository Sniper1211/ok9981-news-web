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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(deal.link);
    } catch (err) {
      console.error("Failed to copy:", err);
    }

    setToastPos({ x: e.clientX, y: e.clientY });
    clearTimers();
    setShowToast(true);
    setIsFading(false);

    fadeTimerRef.current = setTimeout(() => {
      setIsFading(true);
    }, 2500);

    timerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearTimers();
    setIsFading(true);
    setTimeout(() => {
      setShowToast(false);
    }, 300);
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <>
      <div
        onClick={handleClick}
        className="premium-card group bg-card cursor-pointer flex flex-col h-full active:scale-95 transition-all"
      >
        <div className="aspect-[4/5] relative bg-muted/10 overflow-hidden">
          <Image
            src={deal.image}
            alt={deal.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span className="text-white text-xs font-bold bg-accent px-2 py-1 rounded">点击复制链接</span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors line-clamp-1">
            {deal.title}
          </h3>
          <p className="text-muted text-sm line-clamp-2 leading-relaxed">
            {deal.desc}
          </p>
        </div>
      </div>

      {showToast && (
        <div
          className={`fixed z-[100] px-4 py-3 bg-foreground text-background text-sm rounded-2xl shadow-2xl pointer-events-auto transition-all duration-300 border border-white/10 ${isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          style={{
            left: toastPos.x,
            top: toastPos.y,
            transform: "translate(-50%, -100%) translateY(-20px)",
          }}
        >
          <div className="flex items-center gap-3 whitespace-nowrap">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div>
              <p className="font-bold">链接已复制</p>
              <p className="text-[10px] opacity-70 italic font-mono">粘贴到微信中打开</p>
            </div>
          </div>
          <div className="absolute left-1/2 bottom-[-6px] w-3 h-3 bg-foreground transform -translate-x-1/2 rotate-45 border-r border-b border-white/10"></div>
        </div>
      )}
    </>
  );
}
