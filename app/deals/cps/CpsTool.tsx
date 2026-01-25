"use client";
import { useMemo, useState } from "react";

type TemplateId = "meituan" | "eleme";

const TEMPLATES: Record<TemplateId, string> = {
  meituan:
    '<a href="{{CPS_URL}}" target="_blank" rel="nofollow noopener" style="display:inline-block;padding:10px 14px;background:#22c55e;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">美团外卖红包直达</a>',
  eleme:
    '<a href="{{CPS_URL}}" target="_blank" rel="nofollow noopener" style="display:inline-block;padding:10px 14px;background:#3b82f6;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">饿了么外卖红包直达</a>'
};

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const prefixed = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(prefixed);
    return u.toString();
  } catch {
    return prefixed;
  }
}

export default function CpsTool() {
  const [tplId, setTplId] = useState<TemplateId>("meituan");
  const [rawUrl, setRawUrl] = useState("");
  const norm = useMemo(() => normalizeUrl(rawUrl), [rawUrl]);
  const html = useMemo(() => {
    const base = TEMPLATES[tplId] ?? "";
    return base.replace("{{CPS_URL}}", encodeURI(norm || ""));
  }, [tplId, norm]);

  const [copied, setCopied] = useState(false);
  const [didReplace, setDidReplace] = useState(false);
  const canReplace = !!norm && /^https?:\/\//i.test(norm);

  const previewHtml = useMemo(() => (canReplace && didReplace ? html : ""), [canReplace, didReplace, html]);

  const onCopy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onReset = () => {
    setRawUrl("");
    setTplId("meituan");
    setCopied(false);
    setDidReplace(false);
  };

  return (
    <>
      <section className="card p-5 mb-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="block text-sm text-slate-600 mb-2">选择模板</span>
            <select
              className="w-full rounded-md border px-3 py-2"
              value={tplId}
              onChange={(e) => setTplId(e.target.value as TemplateId)}
            >
              <option value="meituan">美团外卖红包按钮</option>
              <option value="eleme">饿了么外卖红包按钮</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm text-slate-600 mb-2">新 CPS 链接</span>
            <input
              type="url"
              placeholder="https://..."
              className="w-full rounded-md border px-3 py-2"
              value={rawUrl}
              onChange={(e) => setRawUrl(e.target.value)}
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
            disabled={!canReplace}
            onClick={() => setDidReplace(true)}
          >
            替换
          </button>
          <button
            className="rounded-md bg-slate-800 text-white px-4 py-2 disabled:opacity-50"
            disabled={!canReplace || !didReplace}
            onClick={onCopy}
          >
            复制代码
          </button>
          <button className="rounded-md border px-4 py-2" onClick={onReset}>
            重置
          </button>
          <span className="text-sm text-green-600">{copied ? "已复制" : ""}</span>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">预览</h2>
        <div className="rounded-md border p-4">
          {previewHtml ? (
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          ) : (
            <p className="text-sm text-slate-500">填写有效链接并点击“替换”后显示预览</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">生成的 HTML 代码</h2>
        <pre className="rounded-md border p-4 overflow-auto text-sm whitespace-pre-wrap">{didReplace ? html : ""}</pre>
      </section>

      <hr className="my-10" />

      <section className="card p-5 mb-8">
        <h2 className="text-lg font-semibold mb-4">批量文案生成</h2>
        <p className="text-sm text-slate-600 mb-4">按预设格式生成包含多个平台链接的文案块，便于直接复制使用。</p>
        <BulkDocForm />
      </section>
    </>
  );
}

function BulkDocForm() {
  const [meituan, setMeituan] = useState("");
  const [eleme, setEleme] = useState("");
  const [jd, setJd] = useState("");
  const [festival, setFestival] = useState("");
  const [hidden, setHidden] = useState("");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const norm = {
    meituan: normalizeUrl(meituan),
    eleme: normalizeUrl(eleme),
    jd: normalizeUrl(jd),
    festival: normalizeUrl(festival),
    hidden: normalizeUrl(hidden),
  };

  const allValid = Object.values(norm).every((u) => !!u && /^https?:\/\//i.test(u));

  const generate = () => {
    const doc =
`订餐时间到，外卖红包都在这了 
可以【收藏】每天领 

💛【美团】天天神券 
${norm.meituan} 

💙【饿了么】每日红包 
${norm.eleme} 

💗【京东】外卖红包 
${norm.jd} 

😀【美团外卖节】 
${norm.festival} 

隐藏优惠： ${norm.hidden}`;
    setGenerated(doc);
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => {
    setMeituan("");
    setEleme("");
    setJd("");
    setFestival("");
    setHidden("");
    setGenerated("");
    setCopied(false);
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm text-slate-600 mb-2">美团 天天神券链接</span>
          <input className="w-full rounded-md border px-3 py-2" placeholder="https://..." value={meituan} onChange={(e) => setMeituan(e.target.value)} />
        </label>
        <label className="block">
          <span className="block text-sm text-slate-600 mb-2">饿了么 每日红包链接</span>
          <input className="w-full rounded-md border px-3 py-2" placeholder="https://..." value={eleme} onChange={(e) => setEleme(e.target.value)} />
        </label>
        <label className="block">
          <span className="block text-sm text-slate-600 mb-2">京东 外卖红包链接</span>
          <input className="w-full rounded-md border px-3 py-2" placeholder="https://..." value={jd} onChange={(e) => setJd(e.target.value)} />
        </label>
        <label className="block">
          <span className="block text-sm text-slate-600 mb-2">美团外卖节链接</span>
          <input className="w-full rounded-md border px-3 py-2" placeholder="https://..." value={festival} onChange={(e) => setFestival(e.target.value)} />
        </label>
        <label className="block sm:col-span-2">
          <span className="block text-sm text-slate-600 mb-2">隐藏优惠链接</span>
          <input className="w-full rounded-md border px-3 py-2" placeholder="https://..." value={hidden} onChange={(e) => setHidden(e.target.value)} />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!allValid} onClick={generate}>生成文案</button>
        <button className="rounded-md bg-slate-800 text-white px-4 py-2 disabled:opacity-50" disabled={!generated} onClick={onCopy}>复制文案</button>
        <button className="rounded-md border px-4 py-2" onClick={reset}>重置</button>
        <span className="text-sm text-green-600">{copied ? "已复制" : ""}</span>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">生成结果</h3>
        <pre className="rounded-md border p-4 overflow-auto text-sm whitespace-pre-wrap">{generated}</pre>
      </div>
    </>
  );
}
