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

// 递归遍历目录查找所有 .md 文件
function listMarkdownFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(listMarkdownFiles(filePath));
    } else if (file.endsWith(".md")) {
      results.push(filePath);
    }
  }
  return results;
}

export function getAllNews(): NewsItem[] {
  const files = listMarkdownFiles(CONTENT_DIR);
  const items = files.map((filePath) => {
    const fileName = path.basename(filePath, ".md");
    // slug 保持为文件名（不含路径），因此要求文件名全局唯一
    const slug = fileName;
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = parseFrontMatter(fileContent);
    const title = String(data.title ?? slug);
    const date = String(data.date ?? new Date().toISOString());
    const summary = String(
      data.summary ?? content.split("\n").find((l) => l.trim().length > 0) ?? ""
    );
    return { slug, title, date, summary, _fullPath: filePath }; // _fullPath internal use
  });
  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// 辅助函数：根据 slug 查找文件路径
function findFileBySlug(slug: string): string | null {
  const files = listMarkdownFiles(CONTENT_DIR);
  const found = files.find((f) => path.basename(f, ".md") === slug);
  return found || null;
}

export function getNewsSlugs(): string[] {
  return getAllNews().map((n) => n.slug);
}

export function getNewsBySlug(slug: string): NewsItem | null {
  const filePath = findFileBySlug(slug);
  if (!filePath) return null;
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
  const filePath = findFileBySlug(slug);
  if (!filePath) return null;
  const { content } = parseFrontMatter(fs.readFileSync(filePath, "utf8"));
  const rendered = await remark().use(breaks as any).use(html).process(content);
  return String(rendered.value);
}

export function getNewsContentBySlug(slug: string): string | null {
  const filePath = findFileBySlug(slug);
  if (!filePath) return null;
  const { content } = parseFrontMatter(fs.readFileSync(filePath, "utf8"));
  return content;
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
  const files = listMarkdownFiles(CONTENT_DIR);
  const items = files.map((filePath) => {
    const fileName = path.basename(filePath, ".md");
    const slug = fileName;
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = parseFrontMatter(fileContent);
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
