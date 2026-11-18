// Pure analytics math for the admin dashboard (period KPIs, deltas, heatmap, funnel, flow).
import { channelOf, isConversion, type Utm } from "@/lib/channel";

export type Ev = { event: string; path: string | null; label: string | null; session_id: string | null; visitor_id: string | null; device: string | null; referrer: string | null; utm: Utm; created_at: string };

/** % change vs previous period; null when there is no base to compare. */
export function deltaPercent(cur: number | null, prev: number | null): number | null {
  if (cur === null || prev === null || prev === 0) return null;
  return Math.round(((cur - prev) / prev) * 1000) / 10;
}

export function kpis(events: Ev[]) {
  const pv = events.filter((e) => e.event === "page_view");
  const sessions = new Set(pv.map((e) => e.session_id).filter(Boolean)).size;
  const count = (t: string) => events.filter((e) => e.event === t).length;
  const leads = count("contact_lead") + count("quote_request") + count("reseller_application");
  const wa = count("whatsapp_click");
  const convSessions = new Set(events.filter((e) => isConversion(e.event)).map((e) => e.session_id).filter(Boolean)).size;
  return {
    views: pv.length, sessions, wa, leads, downloads: count("download"),
    conversion: sessions ? Math.round((convSessions / sessions) * 1000) / 10 : null,
    pagesPerSession: sessions ? Math.round((pv.length / sessions) * 10) / 10 : null,
  };
}

/** Channel of each session = first touch of that session. */
export function sessionChannels(events: Ev[]) {
  const m = new Map<string, string>();
  const sorted = [...events].sort((a, b) => a.created_at.localeCompare(b.created_at));
  for (const e of sorted) if (e.session_id && !m.has(e.session_id)) m.set(e.session_id, channelOf(e.utm, e.referrer));
  return m;
}

/** 7x24 grid (Sun..Sat x hour) of page views, in São Paulo time. */
export function heatmap(events: Ev[]) {
  const grid = Array.from({ length: 7 }, () => Array(24).fill(0) as number[]);
  for (const e of events) {
    if (e.event !== "page_view") continue;
    const d = new Date(new Date(e.created_at).getTime() - 3 * 3600e3);
    grid[d.getUTCDay()][d.getUTCHours()]++;
  }
  return grid;
}

/** Session funnel: visited → product page → engaged action → conversion. */
export function funnel(events: Ev[]) {
  const by = new Map<string, Set<string>>();
  for (const e of events) {
    if (!e.session_id) continue;
    const s = by.get(e.session_id) ?? new Set<string>(); by.set(e.session_id, s);
    s.add(e.event);
    if (e.event === "page_view" && e.path?.startsWith("/produtos/")) s.add("_product");
  }
  const all = [...by.values()];
  const has = (s: Set<string>, ...k: string[]) => k.some((x) => s.has(x));
  return [
    { step: "Visitou o site", n: all.length },
    { step: "Viu um produto", n: all.filter((s) => has(s, "_product", "product_view")).length },
    { step: "Interagiu (download / cotação aberta)", n: all.filter((s) => has(s, "download", "quote_open", "banner_click", "whatsapp_click", "contact_lead", "quote_request", "reseller_application")).length },
    { step: "Converteu (WhatsApp / formulário)", n: all.filter((s) => [...s].some(isConversion)).length },
  ];
}

const section = (p: string | null) => {
  if (!p || p === "/") return "Home";
  const seg = p.split("/")[1];
  return ({ produtos: "Produtos", solucoes: "Soluções", downloads: "Downloads", "onde-comprar": "Onde comprar", "por-que-hprt": "Por que HPRT", suporte: "Suporte", garantia: "Garantia", blog: "Blog", treinamentos: "Treinamentos", "seja-revenda": "Seja revenda" } as Record<string, string>)[seg] ?? "Outras";
};
const outcome = (s: Set<string>) => s.has("quote_request") || s.has("contact_lead") || s.has("reseller_application") ? "Formulário" : s.has("whatsapp_click") ? "WhatsApp" : "Saiu sem converter";

/** Origin → entry section → outcome links, for a Sankey. Optional channel filter. */
export function flow(events: Ev[], onlyChannel?: string | null) {
  const ch = sessionChannels(events);
  const sessions = new Map<string, { entry: string | null; ev: Set<string> }>();
  const sorted = [...events].sort((a, b) => a.created_at.localeCompare(b.created_at));
  for (const e of sorted) {
    if (!e.session_id) continue;
    const s = sessions.get(e.session_id) ?? { entry: null, ev: new Set<string>() };
    if (!s.entry && e.event === "page_view") s.entry = section(e.path);
    s.ev.add(e.event); sessions.set(e.session_id, s);
  }
  // Keep the chart readable: small referral sites collapse into "Outros sites".
  const size = new Map<string, number>(); for (const id of sessions.keys()) { const c = ch.get(id) ?? "Direto"; size.set(c, (size.get(c) ?? 0) + 1); }
  const label = (c: string) => (c.startsWith("Site: ") && (size.get(c) ?? 0) < 3 ? "Outros sites" : c);
  const links = new Map<string, number>();
  const add = (a: string, b: string) => links.set(`${a}|${b}`, (links.get(`${a}|${b}`) ?? 0) + 1);
  for (const [id, s] of sessions) {
    const c = ch.get(id) ?? "Direto";
    if (onlyChannel && c !== onlyChannel) continue;
    const entry = s.entry ?? "Home";
    add(`o:${label(c)}`, `p:${entry}`); add(`p:${entry}`, `r:${outcome(s.ev)}`);
  }
  const names = [...new Set([...links.keys()].flatMap((k) => k.split("|")))];
  return {
    nodes: names.map((n) => ({ name: n.slice(2), kind: n[0] })),
    links: [...links.entries()].map(([k, value]) => { const [a, b] = k.split("|"); return { source: names.indexOf(a), target: names.indexOf(b), value }; }),
  };
}

export function topBy<T>(list: T[], key: (t: T) => string | null | undefined, n = 10): [string, number][] {
  const m = new Map<string, number>();
  for (const t of list) { const k = key(t); if (k) m.set(k, (m.get(k) ?? 0) + 1); }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}
