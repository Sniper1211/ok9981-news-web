"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/", label: "首页" },
    { href: "/news/", label: "新闻" },
    { href: "/search", label: "搜索" },
    { href: "/deals/", label: "羊毛🐑" },
    { href: "/about/", label: "关于" },
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => {
                // More robust active check:
                // 1. Exact match
                // 2. Path starts with href (for subpages, except for home)
                const isActive = link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`nav-link ${isActive ? "active" : ""}`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}
