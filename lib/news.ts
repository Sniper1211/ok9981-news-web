import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type NewsItem = {
  slug: string;
  title: string;
  date: string; // ISO string
  summary: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "news");

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
    const { data, content } = matter(file);
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
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
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
  const { content } = matter(fs.readFileSync(filePath, "utf8"));
  const rendered = await remark().use(html).process(content);
  return String(rendered.value);
}