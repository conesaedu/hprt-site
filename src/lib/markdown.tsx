import type { ReactNode } from "react";

/** Tiny safe markdown: ## headings, - lists, **bold**, [link](url), paragraphs. */
function inline(text: string, k: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g;
  let last = 0; let m: RegExpExecArray | null; let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={`${k}b${i++}`}>{m[1]}</strong>);
    else out.push(<a key={`${k}a${i++}`} href={m[3]} className="text-primary underline">{m[2]}</a>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.replace(/\r/g, "").split(/\n{2,}/);
  return (
    <div className="space-y-5 text-lg leading-relaxed text-foreground/85">
      {blocks.map((b, i) => {
        const t = b.trim(); const k = String(i);
        if (!t) return null;
        if (t.startsWith("### ")) return <h3 key={k} className="font-display text-2xl font-bold uppercase pt-4 text-foreground">{inline(t.slice(4), k)}</h3>;
        if (t.startsWith("## ")) return <h2 key={k} className="font-display text-3xl font-bold uppercase pt-6 text-foreground">{inline(t.slice(3), k)}</h2>;
        const lines = t.split("\n");
        if (lines.every((l) => /^[-*] /.test(l))) return <ul key={k} className="list-disc pl-6 space-y-1">{lines.map((l, j) => <li key={j}>{inline(l.slice(2), k + j)}</li>)}</ul>;
        return <p key={k}>{lines.map((l, j) => <span key={j}>{j > 0 && <br />}{inline(l, k + j)}</span>)}</p>;
      })}
    </div>
  );
}
