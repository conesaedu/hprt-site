import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Send, X } from "lucide-react";
import { askAssistant } from "@/lib/assistant.functions";
import { track } from "@/components/site/SiteRuntime";

type M = { role: "user" | "assistant"; content: string };

function Linkify({ text }: { text: string }) {
  const parts = text.replace(/\*\*/g, "").split(/(\/[a-z-]+(?:\/[a-z0-9-]+)?)/g);
  return <>{parts.map((p, i) => (/^\/[a-z-]+/.test(p) ? <a key={i} href={p} className="font-semibold text-primary underline">{p}</a> : <span key={i}>{p}</span>))}</>;
}

/** Floating product assistant on public pages. */
export function Assistant() {
  const ask = useServerFn(askAssistant);
  const [open, setOpen] = useState(false); const [busy, setBusy] = useState(false); const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<M[]>([{ role: "assistant", content: "Olá! Conte a sua aplicação (ex.: etiquetas para expedição, 2 mil por dia) que eu indico o modelo HPRT ideal." }]);
  const end = useRef<HTMLDivElement>(null);
  async function send(e: React.FormEvent) {
    e.preventDefault(); const q = text.trim(); if (!q || busy) return;
    const next = [...msgs, { role: "user" as const, content: q.slice(0, 2000) }]; setMsgs(next); setText(""); setBusy(true);
    if (next.length === 2) track("assistant_open", q.slice(0, 100));
    try { const r = await ask({ data: { messages: next.slice(1).slice(-12) } }); setMsgs([...next, { role: "assistant", content: r.reply }]); }
    catch { setMsgs([...next, { role: "assistant", content: "Falhou a conexão. Tente de novo." }]); }
    setBusy(false); setTimeout(() => end.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }
  if (!open) return (
    <button onClick={() => setOpen(true)} aria-label="Abrir assistente" className="fixed bottom-20 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl">
      <MessageSquare className="size-4" /> Qual modelo é ideal?
    </button>
  );
  return (
    <div className="fixed bottom-5 right-5 z-50 flex h-[32rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col border border-border bg-background shadow-2xl">
      <div className="flex items-center justify-between bg-foreground px-4 py-3 text-background">
        <p className="text-sm font-semibold">Assistente HPRT</p>
        <button aria-label="Fechar assistente" onClick={() => setOpen(false)}><X className="size-4" /></button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
        {msgs.map((m, i) => <div key={i} className={m.role === "user" ? "ml-8 bg-primary p-3 text-primary-foreground" : "mr-8 whitespace-pre-wrap bg-muted p-3"}>{m.role === "user" ? m.content : <Linkify text={m.content} />}</div>)}
        {busy && <div className="mr-8 bg-muted p-3 text-muted-foreground">Pensando…</div>}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="flex border-t border-border">
        <input value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder="Descreva sua operação…" className="flex-1 bg-background px-4 py-3 text-sm outline-none" />
        <button aria-label="Enviar" disabled={busy} className="px-4 text-primary"><Send className="size-4" /></button>
      </form>
    </div>
  );
}
