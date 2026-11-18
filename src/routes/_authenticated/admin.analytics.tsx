import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Sankey, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, Download, Minus, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { productSummaries } from "@/lib/products/summary";
import { getAdsOverview } from "@/lib/ads.functions";
import { channelOf } from "@/lib/channel";
import { deltaPercent, flow, funnel, heatmap, kpis, sessionChannels, topBy, type Ev } from "@/lib/analytics-metrics";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Analytics /></AdminShell>,
});

const DAY = 864e5;
const PRESETS = [{ k: "1", l: "Hoje" }, { k: "7", l: "7 dias" }, { k: "14", l: "14 dias" }, { k: "30", l: "30 dias" }, { k: "90", l: "90 dias" }, { k: "custom", l: "Personalizado" }] as const;
const ADS_RANGE: Record<string, "TODAY" | "LAST_7_DAYS" | "LAST_14_DAYS" | "LAST_30_DAYS"> = { "1": "TODAY", "7": "LAST_7_DAYS", "14": "LAST_14_DAYS", "30": "LAST_30_DAYS", "90": "LAST_30_DAYS", custom: "LAST_30_DAYS" };
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

async function fetchEvents(from: Date, to: Date): Promise<Ev[]> {
  const out: Ev[] = [];
  for (let i = 0; i < 30; i++) {
    const { data, error } = await supabase.from("site_events").select("event,path,label,session_id,visitor_id,device,referrer,utm,created_at")
      .gte("created_at", from.toISOString()).lt("created_at", to.toISOString()).order("created_at").range(i * 1000, i * 1000 + 999);
    if (error) throw error;
    out.push(...((data ?? []) as Ev[]));
    if (!data || data.length < 1000) break;
  }
  return out;
}

type Kpi = "views" | "sessions" | "wa" | "leads" | "conversion" | "downloads";

function Analytics() {
  const [preset, setPreset] = useState<string>("30");
  const [cFrom, setCFrom] = useState(() => new Date(Date.now() - 30 * DAY).toISOString().slice(0, 10));
  const [cTo, setCTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [channel, setChannel] = useState<string | null>(null);
  const [device, setDevice] = useState<string | null>(null);
  const [drill, setDrill] = useState<Kpi | null>(null);

  const range = useMemo(() => {
    if (preset === "custom") { const f = new Date(cFrom + "T03:00:00Z"), t = new Date(new Date(cTo + "T03:00:00Z").getTime() + DAY); return { from: f, to: t }; }
    const to = new Date(); const from = preset === "1" ? new Date(new Date().setHours(0, 0, 0, 0)) : new Date(to.getTime() - Number(preset) * DAY);
    return { from, to };
  }, [preset, cFrom, cTo]);
  const prev = { from: new Date(range.from.getTime() - (range.to.getTime() - range.from.getTime())), to: range.from };

  const cur = useQuery({ queryKey: ["an", range.from.toISOString().slice(0, 13), range.to.toISOString().slice(0, 13)], queryFn: () => fetchEvents(range.from, range.to) });
  const old = useQuery({ queryKey: ["an-prev", prev.from.toISOString().slice(0, 13)], queryFn: () => fetchEvents(prev.from, prev.to) });
  const adsFn = useServerFn(getAdsOverview);
  const ads = useQuery({ queryKey: ["an-ads", preset], queryFn: () => adsFn({ data: { range: ADS_RANGE[preset] } }), retry: false, staleTime: 5 * 60e3 });

  // Apply channel/device filters at session level.
  const filter = (list: Ev[] = []) => {
    if (!channel && !device) return list;
    const ch = sessionChannels(list);
    const dev = new Map<string, string | null>(); for (const e of list) if (e.session_id && !dev.has(e.session_id)) dev.set(e.session_id, e.device);
    return list.filter((e) => e.session_id && (!channel || ch.get(e.session_id) === channel) && (!device || dev.get(e.session_id) === device));
  };
  const ev = useMemo(() => filter(cur.data), [cur.data, channel, device]);
  const evPrev = useMemo(() => filter(old.data), [old.data, channel, device]);
  const k = useMemo(() => kpis(ev), [ev]);
  const kp = useMemo(() => kpis(evPrev), [evPrev]);
  const channelsAll = useMemo(() => [...new Set(sessionChannels(cur.data ?? []).values())].sort(), [cur.data]);
  const devices = useMemo(() => [...new Set((cur.data ?? []).map((e) => e.device).filter(Boolean) as string[])], [cur.data]);
  const names = useMemo(() => Object.fromEntries(productSummaries.map((p) => [p.slug, p.name])), []);

  const daily = useMemo(() => {
    const days = Math.max(1, Math.round((range.to.getTime() - range.from.getTime()) / DAY));
    const rows = new Map<string, { label: string; Visitas: number; WhatsApp: number; Leads: number }>();
    for (let i = 0; i < days; i++) { const d = new Date(range.from.getTime() + i * DAY - 3 * 3600e3).toISOString().slice(0, 10); rows.set(d, { label: d.slice(8) + "/" + d.slice(5, 7), Visitas: 0, WhatsApp: 0, Leads: 0 }); }
    for (const e of ev) {
      const d = new Date(new Date(e.created_at).getTime() - 3 * 3600e3).toISOString().slice(0, 10); const r = rows.get(d); if (!r) continue;
      if (e.event === "page_view") r.Visitas++; else if (e.event === "whatsapp_click") r.WhatsApp++; else if (["contact_lead", "quote_request", "reseller_application"].includes(e.event)) r.Leads++;
    }
    return [...rows.values()];
  }, [ev, range]);

  const byChannel = useMemo(() => {
    const ch = sessionChannels(ev); const m = new Map<string, { s: Set<string>; conv: Set<string>; wa: number; leads: number }>();
    for (const e of ev) {
      if (!e.session_id) continue; const c = ch.get(e.session_id)!; const r = m.get(c) ?? { s: new Set(), conv: new Set(), wa: 0, leads: 0 }; m.set(c, r);
      r.s.add(e.session_id);
      if (e.event === "whatsapp_click") { r.wa++; r.conv.add(e.session_id); }
      if (["contact_lead", "quote_request", "reseller_application"].includes(e.event)) { r.leads++; r.conv.add(e.session_id); }
    }
    const rows = [...m.entries()].map(([c, r]) => ({ c, sessions: r.s.size, wa: r.wa, leads: r.leads, rate: r.s.size ? (r.conv.size / r.s.size) * 100 : 0 })).sort((a, b) => b.sessions - a.sessions);
    const big = rows.filter((r) => !r.c.startsWith("Site: ") || r.sessions >= 3), small = rows.filter((r) => !big.includes(r));
    if (small.length) { const t = small.reduce((a, r) => ({ sessions: a.sessions + r.sessions, wa: a.wa + r.wa, leads: a.leads + r.leads, conv: a.conv + (r.rate / 100) * r.sessions }), { sessions: 0, wa: 0, leads: 0, conv: 0 });
      big.push({ c: `Outros sites (${small.length})`, sessions: t.sessions, wa: t.wa, leads: t.leads, rate: (t.conv / t.sessions) * 100 }); }
    return big;
  }, [ev]);

  const campaigns = useMemo(() => topBy(ev.filter((e) => e.event === "page_view" && (e.utm as any)?.utm_campaign), (e) => (e.utm as any).utm_campaign), [ev]);
  const hm = useMemo(() => heatmap(ev), [ev]);
  const hmMax = Math.max(1, ...hm.flat());
  const fun = useMemo(() => funnel(ev), [ev]);
  const fl = useMemo(() => flow(ev), [ev]);

  const adsTotals = useMemo(() => {
    const c = ads.data?.campaigns ?? []; const cost = c.reduce((a, x) => a + x.cost, 0), clicks = c.reduce((a, x) => a + x.clicks, 0), imp = c.reduce((a, x) => a + x.impressions, 0), conv = c.reduce((a, x) => a + x.conversions, 0);
    const realLeads = byChannel.find((r) => r.c === "Google Ads"); const real = (realLeads?.wa ?? 0) + (realLeads?.leads ?? 0);
    return { cost, clicks, imp, conv, real, active: c.filter((x) => x.status === "ENABLED").length, cpaReal: real ? cost / real : null, ctr: imp ? (clicks / imp) * 100 : 0 };
  }, [ads.data, byChannel]);

  function exportCsv() {
    const head = "data,evento,pagina,rotulo,origem,dispositivo,sessao";
    const ch = sessionChannels(ev);
    const lines = ev.map((e) => [e.created_at, e.event, e.path, e.label, e.session_id ? ch.get(e.session_id) : "", e.device, e.session_id].map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
    const url = URL.createObjectURL(new Blob(["\ufeff" + [head, ...lines].join("\n")], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: `analytics-hprt-${new Date().toISOString().slice(0, 10)}.csv` }).click();
  }

  const cards: { id: Kpi; l: string; v: number | null; p: number | null; s?: string }[] = [
    { id: "sessions", l: "Visitas (sessões)", v: k.sessions, p: kp.sessions },
    { id: "views", l: "Páginas vistas", v: k.views, p: kp.views },
    { id: "wa", l: "Cliques no WhatsApp", v: k.wa, p: kp.wa },
    { id: "leads", l: "Formulários (leads)", v: k.leads, p: kp.leads },
    { id: "conversion", l: "Taxa de conversão", v: k.conversion, p: kp.conversion, s: "%" },
    { id: "downloads", l: "Downloads", v: k.downloads, p: kp.downloads },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase">Analytics</h1>
          <p className="text-sm text-muted-foreground">Tráfego, origens, anúncios e conversões — comparado ao período anterior.</p>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 border border-border bg-background px-3 py-2 text-sm hover:border-primary"><Download className="h-4 w-4" />Exportar CSV</button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 border border-border bg-background p-3">
        {PRESETS.map((p) => (
          <button key={p.k} onClick={() => setPreset(p.k)} className={`px-3 py-1.5 text-sm border ${preset === p.k ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{p.l}</button>
        ))}
        {preset === "custom" && (<>
          <input type="date" value={cFrom} onChange={(e) => setCFrom(e.target.value)} className="border border-input bg-background px-2 py-1 text-sm" />
          <span className="text-sm text-muted-foreground">até</span>
          <input type="date" value={cTo} onChange={(e) => setCTo(e.target.value)} className="border border-input bg-background px-2 py-1 text-sm" />
        </>)}
        <span className="mx-2 h-6 w-px bg-border" />
        <select value={channel ?? ""} onChange={(e) => setChannel(e.target.value || null)} className="border border-input bg-background px-2 py-1.5 text-sm">
          <option value="">Todas as origens</option>{channelsAll.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={device ?? ""} onChange={(e) => setDevice(e.target.value || null)} className="border border-input bg-background px-2 py-1.5 text-sm">
          <option value="">Todos os dispositivos</option>{devices.map((d) => <option key={d}>{d}</option>)}
        </select>
        {(channel || device) && <button onClick={() => { setChannel(null); setDevice(null); }} className="text-sm text-primary underline">Limpar filtros</button>}
      </div>

      {cur.error && <p className="border border-destructive/40 p-3 text-sm text-destructive">Não foi possível carregar: {(cur.error as Error).message}</p>}
      {cur.isLoading ? <p className="text-muted-foreground">Carregando…</p> : (<>
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {cards.map((c) => {
            const d = deltaPercent(c.v, c.p); const Icon = d === null || d === 0 ? Minus : d > 0 ? ArrowUpRight : ArrowDownRight;
            return (
              <button key={c.id} onClick={() => setDrill(drill === c.id ? null : c.id)} className={`border bg-background p-4 text-left transition hover:border-primary ${drill === c.id ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.l}</p>
                <p className="mt-1 font-display text-4xl font-bold">{c.v ?? "—"}{c.v !== null && c.s}</p>
                <p className={`mt-1 inline-flex items-center gap-1 text-xs ${d === null || d === 0 ? "text-muted-foreground" : d > 0 ? "text-primary" : "text-destructive"}`}><Icon className="h-3.5 w-3.5" />{d === null ? "sem base anterior" : `${d > 0 ? "+" : ""}${d}% vs anterior`}</p>
              </button>
            );
          })}
        </div>
        {drill && <Drilldown kpi={drill} ev={ev} names={names} onClose={() => setDrill(null)} />}

        {/* Gráfico diário */}
        <Panel title="Evolução diária">
          <div className="h-72">
            <ResponsiveContainer><AreaChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis yAxisId="a" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis yAxisId="b" orientation="right" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ background: "var(--background)", border: "1px solid var(--border)" }} />
              <Legend />
              <Area yAxisId="a" type="monotone" dataKey="Visitas" stroke="var(--muted-foreground)" fill="var(--muted)" />
              <Area yAxisId="b" type="monotone" dataKey="WhatsApp" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} />
              <Area yAxisId="b" type="monotone" dataKey="Leads" stroke="var(--foreground)" fill="var(--foreground)" fillOpacity={0.15} />
            </AreaChart></ResponsiveContainer>
          </div>
        </Panel>

        {/* Google Ads */}
        <Panel title={`Google Ads — ${preset === "90" || preset === "custom" ? "últimos 30 dias" : PRESETS.find((p) => p.k === preset)?.l}`} action={<Link to="/admin/campanhas" className="text-sm text-primary underline">Gerenciar / pausar campanhas →</Link>}>
          {ads.isLoading ? <p className="text-sm text-muted-foreground">Consultando Google Ads…</p> : ads.error ? <p className="text-sm text-destructive">Google Ads indisponível: {(ads.error as Error).message}</p> : (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
                {[["Campanhas ativas", String(adsTotals.active)], ["Investimento", brl(adsTotals.cost)], ["Impressões", adsTotals.imp.toLocaleString("pt-BR")], ["Cliques", adsTotals.clicks.toLocaleString("pt-BR")], ["CTR", adsTotals.ctr.toFixed(2) + "%"], ["Conversões (Google)", adsTotals.conv.toFixed(0)], ["Custo por contato real", adsTotals.cpaReal ? brl(adsTotals.cpaReal) : "—"]].map(([l, v]) => (
                  <div key={l} className="border border-border p-3"><p className="text-[11px] uppercase tracking-wider text-muted-foreground">{l}</p><p className="mt-1 text-xl font-semibold">{v}</p></div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">"Custo por contato real" = investimento ÷ WhatsApp + formulários de visitantes que chegaram pelo Google Ads e aceitaram cookies ({adsTotals.real} no período).</p>
              {(ads.data?.daily.length ?? 0) > 0 && (
                <div className="mt-4 h-56"><ResponsiveContainer><BarChart data={ads.data!.daily.map((d) => ({ label: d.date.slice(8) + "/" + d.date.slice(5, 7), Investimento: Number(d.cost.toFixed(2)), Cliques: d.clicks }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="label" tick={{ fontSize: 11 }} /><YAxis yAxisId="a" tick={{ fontSize: 11 }} /><YAxis yAxisId="b" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "var(--background)", border: "1px solid var(--border)" }} /><Legend />
                  <Bar yAxisId="a" dataKey="Investimento" fill="var(--primary)" /><Bar yAxisId="b" dataKey="Cliques" fill="var(--muted-foreground)" />
                </BarChart></ResponsiveContainer></div>
              )}
            </>
          )}
        </Panel>

        {/* Fluxo */}
        <Panel title="Fluxo do site: origem → entrada → desfecho" action={<span className="text-xs text-muted-foreground">Use o filtro de origem acima para isolar um canal</span>}>
          {fl.links.length === 0 ? <Empty /> : (
            <div className="h-[420px]"><ResponsiveContainer>
              <Sankey data={fl} nodePadding={24} margin={{ left: 10, right: 140, top: 10, bottom: 10 }} link={{ stroke: "var(--primary)", strokeOpacity: 0.25 }} node={<SankeyNode />}>
                <Tooltip contentStyle={{ background: "var(--background)", border: "1px solid var(--border)" }} />
              </Sankey>
            </ResponsiveContainer></div>
          )}
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Funil */}
          <Panel title="Funil de conversão (sessões)">
            <div className="space-y-3">{fun.map((s, i) => {
              const pct = fun[0].n ? (s.n / fun[0].n) * 100 : 0; const step = i && fun[i - 1].n ? (s.n / fun[i - 1].n) * 100 : null;
              return (<div key={s.step}>
                <div className="flex justify-between text-sm"><span>{s.step}</span><span className="font-semibold">{s.n} <span className="font-normal text-muted-foreground">({pct.toFixed(1)}%)</span></span></div>
                <div className="mt-1 h-6 bg-muted"><div className="h-full bg-primary" style={{ width: `${Math.max(pct, 1)}%` }} /></div>
                {step !== null && step <= 100 && <p className="mt-0.5 text-xs text-muted-foreground">{step.toFixed(0)}% passaram da etapa anterior</p>}
              </div>);
            })}</div>
          </Panel>

          {/* Mapa de calor */}
          <Panel title="Mapa de calor: dia × hora (horário de Brasília)">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-[2px] text-[10px]">
                <thead><tr><th />{Array.from({ length: 24 }, (_, h) => <th key={h} className="font-normal text-muted-foreground">{h % 3 === 0 ? h : ""}</th>)}</tr></thead>
                <tbody>{hm.map((row, d) => (
                  <tr key={d}><td className="pr-1 text-muted-foreground">{WEEK[d]}</td>
                    {row.map((v, h) => <td key={h} title={`${WEEK[d]} ${h}h: ${v} páginas vistas`} className="h-6 min-w-[14px] bg-primary" style={{ opacity: v ? 0.12 + (v / hmMax) * 0.88 : 0.05 }} />)}
                  </tr>))}</tbody>
              </table>
              <p className="mt-2 text-xs text-muted-foreground">Quanto mais forte, mais acessos. Tráfego B2B real concentra em dias úteis, horário comercial.</p>
            </div>
          </Panel>
        </div>

        {/* Origens */}
        <Panel title="Desempenho por origem">
          {byChannel.length === 0 ? <Empty /> : (
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="py-2">Origem</th><th>Visitas</th><th>% do tráfego</th><th>WhatsApp</th><th>Formulários</th><th>Conversão</th><th /></tr></thead>
              <tbody>{byChannel.map((r) => (
                <tr key={r.c} className="border-b border-border/60">
                  <td className="py-2 font-medium">{r.c}</td><td>{r.sessions}</td><td>{k.sessions ? ((r.sessions / k.sessions) * 100).toFixed(1) : 0}%</td><td>{r.wa}</td><td>{r.leads}</td>
                  <td><span className={r.rate > 0 ? "font-semibold text-primary" : "text-muted-foreground"}>{r.rate.toFixed(1)}%</span></td>
                  <td>{!r.c.startsWith("Outros sites") && <button onClick={() => setChannel(channel === r.c ? null : r.c)} className="text-xs text-primary underline">{channel === r.c ? "remover filtro" : "filtrar"}</button>}</td>
                </tr>))}</tbody>
            </table></div>
          )}
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <Bars title="Campanhas (UTM)" rows={campaigns} />
          <Bars title="Produtos mais vistos" rows={topBy(ev.filter((e) => e.event === "product_view"), (e) => e.label)} fmt={(s) => names[s] ?? s} />
          <Bars title="Páginas mais vistas" rows={topBy(ev.filter((e) => e.event === "page_view"), (e) => e.path)} />
          <Bars title="De onde clicaram no WhatsApp" rows={topBy(ev.filter((e) => e.event === "whatsapp_click"), (e) => e.path)} />
          <Bars title="Sites que enviaram visitas" rows={topBy(ev.filter((e) => e.event === "page_view"), (e) => { try { const h = e.referrer ? new URL(e.referrer).hostname.replace(/^www\./, "") : null; return h && !h.includes("hprtbrasil") && !h.includes("lovable") ? h : null; } catch { return null; } })} />
          <Bars title="Dispositivos" rows={topBy(ev.filter((e) => e.event === "page_view"), (e) => e.device)} />
          <Bars title="Downloads" rows={topBy(ev.filter((e) => e.event === "download"), (e) => e.label)} />
          <Bars title="Cliques em pop-ups e banners" rows={topBy(ev.filter((e) => e.event === "banner_click"), (e) => e.label)} />
        </div>
        <p className="text-xs text-muted-foreground">Origem, WhatsApp e retorno do visitante só são medidos para quem aceitou cookies de medição. Para ver cada visitante e quem voltou e converteu, abra <Link to="/admin/jornadas" className="text-primary underline">Origens e jornadas</Link>.</p>
      </>)}
    </div>
  );
}

function SankeyNode(props: any) {
  const { x, y, width, height, payload } = props;
  const fill = payload.kind === "o" ? "var(--foreground)" : payload.kind === "r" ? "var(--primary)" : "var(--muted-foreground)";
  return (<g><rect x={x} y={y} width={width} height={height} fill={fill} />
    <text x={x + width + 6} y={y + height / 2} dy="0.35em" fontSize={12} fill="var(--foreground)">{payload.name} ({payload.value})</text></g>);
}

function Drilldown({ kpi, ev, names, onClose }: { kpi: Kpi; ev: Ev[]; names: Record<string, string>; onClose: () => void }) {
  const map: Record<Kpi, string[]> = { views: ["page_view"], sessions: ["page_view"], wa: ["whatsapp_click"], leads: ["contact_lead", "quote_request", "reseller_application"], conversion: ["whatsapp_click", "contact_lead", "quote_request", "reseller_application"], downloads: ["download"] };
  const list = ev.filter((e) => map[kpi].includes(e.event));
  const ch = sessionChannels(ev);
  return (
    <div className="border border-primary bg-background p-5">
      <div className="mb-4 flex items-center justify-between"><p className="font-semibold">Detalhamento</p><button onClick={onClose} aria-label="Fechar"><X className="h-4 w-4" /></button></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Bars title="Por página" rows={topBy(list, (e) => e.path, 8)} />
        <Bars title="Por origem" rows={topBy(list, (e) => (e.session_id ? ch.get(e.session_id) : null) ?? channelOf(e.utm, e.referrer), 8)} />
        <Bars title="Por produto / item" rows={topBy(list, (e) => e.label, 8)} fmt={(s) => names[s] ?? s} />
      </div>
      <p className="mt-4 mb-2 text-xs uppercase tracking-wider text-muted-foreground">Últimos registros</p>
      <ul className="max-h-60 divide-y divide-border overflow-auto text-sm">{list.slice(-30).reverse().map((e, i) => (
        <li key={i} className="flex justify-between gap-3 py-1.5"><span className="truncate">{e.path} {e.label && <span className="text-muted-foreground">· {names[e.label] ?? e.label}</span>}</span><span className="shrink-0 text-muted-foreground">{new Date(e.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span></li>
      ))}</ul>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (<section className="border border-border bg-background p-5">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>{action}</div>{children}
  </section>);
}
const Empty = () => <p className="text-sm text-muted-foreground">Sem dados no período.</p>;
function Bars({ title, rows, fmt }: { title: string; rows: [string, number][]; fmt?: (k: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (<Panel title={title}>{rows.length === 0 ? <Empty /> : (
    <ul className="space-y-2.5">{rows.map(([k, v]) => (<li key={k} className="text-sm">
      <div className="flex justify-between gap-3"><span className="truncate">{fmt ? fmt(k) : k}</span><span className="font-semibold">{v}</span></div>
      <div className="mt-1 h-1.5 bg-muted"><div className="h-full bg-primary" style={{ width: `${(v / max) * 100}%` }} /></div>
    </li>))}</ul>)}</Panel>);
}
