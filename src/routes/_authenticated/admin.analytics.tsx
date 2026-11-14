import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { productSummaries } from "@/lib/products/summary";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Analytics /></AdminShell>,
});

type Ev = { event: string; path: string | null; label: string | null; session_id: string | null; device: string | null; referrer: string | null; created_at: string };

function top(list: (string | null)[], n = 10) {
  const m = new Map<string, number>();
  for (const k of list) if (k) m.set(k, (m.get(k) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}
function refHost(r: string | null) { if (!r) return "Direto"; try { return new URL(r).hostname.replace(/^www\./, ""); } catch { return "Direto"; } }

function Bars({ title, rows, fmt }: { title: string; rows: [string, number][]; fmt?: (k: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div className="border border-border bg-background p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">Sem dados no período.</p> : (
        <ul className="space-y-2.5">{rows.map(([k, v]) => (
          <li key={k} className="text-sm">
            <div className="flex justify-between gap-3"><span className="truncate">{fmt ? fmt(k) : k}</span><span className="font-semibold">{v}</span></div>
            <div className="mt-1 h-1.5 bg-muted"><div className="h-full bg-primary" style={{ width: `${(v / max) * 100}%` }} /></div>
          </li>))}</ul>
      )}
    </div>
  );
}

function Analytics() {
  const [days, setDays] = useState(30);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-events", days],
    queryFn: async () => {
      const since = new Date(Date.now() - days * 864e5).toISOString();
      const { data, error } = await supabase.from("site_events").select("event,path,label,session_id,device,referrer,created_at").gte("created_at", since).order("created_at", { ascending: false }).limit(20000);
      if (error) throw error; return data as Ev[];
    },
  });
  const names = useMemo(() => Object.fromEntries(productSummaries.map((p) => [p.slug, p.name])), []);
  const s = useMemo(() => {
    const pv = data.filter((e) => e.event === "page_view");
    const byDay = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) byDay.set(new Date(Date.now() - i * 864e5).toISOString().slice(0, 10), 0);
    for (const e of pv) { const d = e.created_at.slice(0, 10); if (byDay.has(d)) byDay.set(d, byDay.get(d)! + 1); }
    return {
      views: pv.length,
      visits: new Set(pv.map((e) => e.session_id)).size,
      wa: data.filter((e) => e.event === "whatsapp_click").length,
      dl: data.filter((e) => e.event === "download").length,
      days: [...byDay.entries()],
      pages: top(pv.map((e) => e.path)),
      products: top(data.filter((e) => e.event === "product_view").map((e) => e.label)),
      waPages: top(data.filter((e) => e.event === "whatsapp_click").map((e) => e.path)),
      refs: top(pv.map((e) => refHost(e.referrer)).filter((h) => !h.includes("lovable") && !h.includes("hprtbrasil"))),
      devices: top(pv.map((e) => e.device)),
      banners: top(data.filter((e) => e.event === "banner_click").map((e) => e.label)),
    };
  }, [data, days]);
  const maxDay = Math.max(1, ...s.days.map((d) => d[1]));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div><h1 className="font-display text-4xl font-bold uppercase">Analytics</h1><p className="text-sm text-muted-foreground">Comportamento dos visitantes do site público (sem cookies de terceiros).</p></div>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="border border-input bg-background px-3 py-2 text-sm">
          <option value={7}>7 dias</option><option value={30}>30 dias</option><option value={90}>90 dias</option>
        </select>
      </div>
      {isLoading ? <p className="text-muted-foreground">Carregando…</p> : (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            {[["Visitas", s.visits], ["Páginas vistas", s.views], ["Cliques no WhatsApp", s.wa], ["Downloads", s.dl]].map(([l, v]) => (
              <div key={l} className="border border-border bg-background p-5"><p className="text-xs uppercase tracking-wider text-muted-foreground">{l}</p><p className="mt-2 font-display text-5xl font-bold">{v}</p></div>
            ))}
          </div>
          <div className="border border-border bg-background p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Páginas vistas por dia</p>
            <div className="flex h-40 items-end gap-[2px]">
              {s.days.map(([d, v]) => <div key={d} title={`${d.split("-").reverse().join("/")}: ${v}`} className="flex-1 bg-primary/80 hover:bg-primary" style={{ height: `${Math.max(2, (v / maxDay) * 100)}%` }} />)}
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Bars title="Produtos mais vistos" rows={s.products} fmt={(k) => names[k] ?? k} />
            <Bars title="Páginas mais vistas" rows={s.pages} />
            <Bars title="De onde clicaram no WhatsApp" rows={s.waPages} />
            <Bars title="Origem das visitas" rows={s.refs} />
            <Bars title="Dispositivos" rows={s.devices} />
            <Bars title="Cliques em pop-ups" rows={s.banners} />
          </div>
        </>
      )}
    </div>
  );
}
