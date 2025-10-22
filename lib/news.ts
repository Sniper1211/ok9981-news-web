import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import breaks from "remark-breaks";
import * as toml from "toml";

export type NewsItem = {
  slug: string;
  title: string;
  date: string; // ISO string
  summary: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "news");

function parseFrontMatter(file: string) {
  const trimmed = file.trimStart();
  const startsToml = trimmed.startsWith("+++");
  if (startsToml) {
    return matter(file, {
      delimiters: "+++",
      language: "toml",
      engines: { toml: toml.parse },
    });
  }
  // default: YAML (---) or none
  return matter(file);
}

export function getNewsSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllNews(): NewsItem[] {
  const slugs = getNewsSlugs();
  const items = slugs.map((slug) => {
    const file = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.md`), "utf8");
    const { data, content } = parseFrontMatter(file);
    const title = String(data.title ?? slug);
    const date = String(data.date ?? new Date().toISOString());
    const summary = String(
      data.summary ?? content.split("\n").find((l) => l.trim().length > 0) ?? ""
    );
    return { slug, title, date, summary };
  });
  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getNewsBySlug(slug: string): NewsItem | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const { data, content } = parseFrontMatter(fs.readFileSync(filePath, "utf8"));
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? new Date().toISOString()),
    summary: String(
      data.summary ?? content.split("\n").find((l) => l.trim().length > 0) ?? ""
    ),
  };
}

export async function getNewsHtmlBySlug(slug: string): Promise<string | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const { content } = parseFrontMatter(fs.readFileSync(filePath, "utf8"));
  const rendered = await remark().use(breaks as any).use(html).process(content);
  return String(rendered.value);
}

export function getSiblingNews(slug: string): { prev: NewsItem | null; next: NewsItem | null } {
  const items = getAllNews();
  const index = items.findIndex((i) => i.slug === slug);
  if (index === -1) return { prev: null, next: null };
  // 列表按时间倒序（新→旧）。约定：
  // 上一篇 = 更旧（index + 1），下一篇 = 更新（index - 1）。
  const prev = items[index + 1] ?? null; // older
  const next = items[index - 1] ?? null; // newer
  return { prev, next };
}

export const PAGE_SIZE = 20;

export function getAllYears(): number[] {
  const years = new Set<number>();
  for (const n of getAllNews()) {
    const d = new Date(n.date);
    years.add(d.getFullYear());
  }
  return Array.from(years).sort((a, b) => b - a);
}

export function getMonthsByYear(year: number): number[] {
  const months = new Set<number>();
  for (const n of getAllNews()) {
    const d = new Date(n.date);
    if (d.getFullYear() === year) months.add(d.getMonth() + 1);
  }
  return Array.from(months).sort((a, b) => b - a);
}

export function getNewsByYearMonth(year: number, month: number): NewsItem[] {
  return getAllNews().filter((n) => {
    const d = new Date(n.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}

export function getPaginatedNewsPage(page: number, pageSize: number = PAGE_SIZE): { items: NewsItem[]; totalPages: number; page: number } {
  const all = getAllNews();
  const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = all.slice(start, start + pageSize);
  return { items, totalPages, page: safePage };
}

export function getYearMonthFromItem(n: NewsItem): { year: number; month: number } {
  const d = new Date(n.date);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export type NewsWithContent = NewsItem & { content: string };

export function getAllNewsWithContent(): NewsWithContent[] {
  const slugs = getNewsSlugs();
  const items = slugs.map((slug) => {
    const file = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.md`), "utf8");
    const { data, content } = parseFrontMatter(file);
    const title = String(data.title ?? slug);
    const date = String(data.date ?? new Date().toISOString());
    const summary = String(
      data.summary ?? content.split("\n").find((l) => l.trim().length > 0) ?? ""
    );
    return { slug, title, date, summary, content };
  });
  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}