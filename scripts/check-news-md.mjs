#!/usr/bin/env node
// Auto-check and optionally fix Markdown files in content/news
// - Removes trailing spaces
// - Collapses consecutive blank lines
// - Ensures single trailing newline at EOF
// Usage:
//   node scripts/check-news-md.mjs           -> check only (non-zero exit if issues)
//   node scripts/check-news-md.mjs --fix     -> fix files in place
//   node scripts/check-news-md.mjs --strict  -> in check mode, disallow any blank lines in body
//   node scripts/check-news-md.mjs --fix --strict -> remove all blank lines in body

import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const newsDir = path.join(cwd, 'content', 'news');
const args = new Set(process.argv.slice(2));
const isFix = args.has('--fix');
const isStrict = args.has('--strict');

function splitFrontMatter(text) {
  // Supports YAML (---) or TOML (+++)
  const lines = text.split(/\r?\n/);
  if (lines[0] === '---' || lines[0] === '+++') {
    const delim = lines[0];
    let endIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === delim) {
        endIndex = i;
        break;
      }
    }
    if (endIndex !== -1) {
      const head = lines.slice(0, endIndex + 1).join('\n');
      const body = lines.slice(endIndex + 1).join('\n');
      return { head, body, delimiter: delim };
    }
  }
  return { head: '', body: text, delimiter: '' };
}

function normalizeBody(body, { strict = false } = {}) {
  // Remove trailing spaces per line
  let processed = body
    .split(/\r?\n/)
    .map((l) => l.replace(/[ \t]+$/g, ''))
    .join('\n');

  if (strict) {
    // Remove ALL blank lines in body
    processed = processed
      .split(/\n/)
      .filter((l) => l.trim() !== '')
      .join('\n');
  } else {
    // Collapse 2+ blank lines to a single blank line
    processed = processed.replace(/(\r?\n)[ \t]*(\r?\n)+/g, '$1');
  }

  // Ensure single trailing newline at EOF
  processed = processed.replace(/[\r\n]*$/g, '\n');
  return processed;
}

function normalizeText(text, { strict = false } = {}) {
  const { head, body } = splitFrontMatter(text);
  const normalizedBody = normalizeBody(body, { strict });
  // Normalize head block: ensure it ends with a single newline if present
  const normalizedHead = head ? head.replace(/[\r\n]*$/g, '\n') : '';
  return normalizedHead + normalizedBody;
}

function listMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...listMarkdownFiles(full));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

function run() {
  if (!fs.existsSync(newsDir)) {
    console.error(`[error] directory not found: ${newsDir}`);
    process.exit(2);
  }

  const files = listMarkdownFiles(newsDir);
  let changed = 0;
  let issues = 0;
  const details = [];

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const normalized = normalizeText(original, { strict: isStrict });
    if (normalized !== original) {
      issues++;
      details.push({ file, action: isFix ? 'fixed' : 'needs-fix' });
      if (isFix) {
        fs.writeFileSync(file, normalized, 'utf8');
        changed++;
      }
    }
  }

  if (details.length) {
    for (const d of details) {
      console.log(`${d.action.padEnd(10)} ${path.relative(cwd, d.file)}`);
    }
  }

  if (isFix) {
    console.log(`\n[done] processed ${files.length} files, fixed ${changed}, remaining issues ${issues - changed}`);
  } else {
    if (issues) {
      console.error(`\n[fail] ${issues} file(s) need normalization. Run: npm run fix:news`);
      process.exitCode = 1;
    } else {
      console.log(`\n[ok] ${files.length} files checked, no issues.`);
    }
  }
}

run();

