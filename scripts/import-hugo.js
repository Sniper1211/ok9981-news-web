#!/usr/bin/env node
/**
 * Import Hugo markdown files into Next.js content/news
 * Usage: node scripts/import-hugo.js /path/to/hugo/content/news
 */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const toml = require("toml");

function parseHugoMarkdown(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const firstLine = raw.split(/\r?\n/, 1)[0] || "";
  let fm = {};
  let content = raw;

  try {
    if (firstLine.trim().startsWith("+++") || raw.startsWith("+++") ) {
      const parsed = matter(raw, {
        delimiters: "+++",
        language: "toml",
        engines: { toml: toml.parse },
      });
      fm = parsed.data || {};
      content = parsed.content || "";
    } else {
      const parsed = matter(raw); // YAML or default
      fm = parsed.data || {};
      content = parsed.content || "";
    }
  } catch (e) {
    console.warn(`Warn: failed to parse front matter for ${filePath}:`, e.message);
  }
  return { fm, content };
}

function toYamlFrontMatter(obj) {
  const lines = ["---"]; 
  const entries = {
    title: obj.title || "",
    date: obj.date || new Date().toISOString(),
    draft: obj.draft === true ? true : false,
    categories: Array.isArray(obj.categories) ? obj.categories : ["news"],
    type: obj.type || "news",
    summary: obj.summary || "",
  };
  for (const [k, v] of Object.entries(entries)) {
    if (Array.isArray(v)) {
      lines.push(`${k}: [${v.map((x) => JSON.stringify(x)).join(", ")}]`);
    } else {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    }
  }
  lines.push("---\n");
  return lines.join("\n");
}

function main() {
  const srcDir = process.argv[2];
  if (!srcDir) {
    console.error("Usage: node scripts/import-hugo.js <hugo-content-news-dir>");
    process.exit(1);
  }
  const absSrc = path.resolve(srcDir);
  if (!fs.existsSync(absSrc) || !fs.statSync(absSrc).isDirectory()) {
    console.error(`Error: ${absSrc} is not a directory`);
    process.exit(1);
  }

  const destDir = path.resolve(process.cwd(), "content", "news");
  fs.mkdirSync(destDir, { recursive: true });

  const files = fs.readdirSync(absSrc).filter((f) => f.endsWith(".md"));
  if (files.length === 0) {
    console.warn("No markdown files found to import.");
  }

  let imported = 0;
  for (const f of files) {
    const srcPath = path.join(absSrc, f);
    const slug = f.replace(/\.md$/, "");
    const { fm, content } = parseHugoMarkdown(srcPath);
    // derive summary if missing
    const firstLine = (content || "").split(/\r?\n/).find((l) => l.trim().length > 0) || "";
    const finalFm = { ...fm, summary: fm.summary || firstLine };
    const yaml = toYamlFrontMatter(finalFm);
    const out = yaml + content.trim() + "\n";
    const destPath = path.join(destDir, `${slug}.md`);
    fs.writeFileSync(destPath, out, "utf8");
    imported++;
    console.log(`Imported: ${f} -> ${path.relative(process.cwd(), destPath)}`);
  }

  console.log(`Done. Imported ${imported} files.`);
}

main();