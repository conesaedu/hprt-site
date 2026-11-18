import { channelOf, isConversion, refHost } from "./channel";

export type JEvent = { event: string; path: string | null; label: string | null; session_id: string | null; visitor_id: string | null; referrer: string | null; device: string | null; utm: Record<string, string> | null; created_at: string };
export type Journey = {
  visitor: string; first: string; last: string; channel: string; campaign: string | null; source: string | null; term: string | null;
  sessions: number; pages: number; converted: boolean; returnedConverted: boolean; conversions: JEvent[]; events: JEvent[]; entry: string | null; device: string | null;
};

/** Groups raw events per anonymous visitor. "Voltou e converteu" = converted in a later visit than the first one. */
export function buildJourneys(events: JEvent[]): Journey[] {
  const by = new Map<string, JEvent[]>();
  for (const e of events) { const k = e.visitor_id ?? `s:${e.session_id}`; if (!by.has(k)) by.set(k, []); by.get(k)!.push(e); }
  const out: Journey[] = [];
  for (const [visitor, list] of by) {
    list.sort((a, b) => a.created_at.localeCompare(b.created_at));
    const first = list[0];
    const touch = list.find((e) => e.utm && Object.keys(e.utm).length) ?? null;
    const extRef = list.find((e) => { const h = refHost(e.referrer); return h && !h.endsWith("hprtbrasil.com.br") && !h.includes("lovable"); });
    const conversions = list.filter((e) => isConversion(e.event));
    const sessions = [...new Set(list.map((e) => e.session_id))];
    out.push({
      visitor, first: first.created_at, last: list[list.length - 1].created_at,
      channel: channelOf(touch?.utm, (touch ?? extRef ?? first).referrer),
      campaign: touch?.utm?.utm_campaign ?? null, source: touch?.utm?.utm_source ?? null, term: touch?.utm?.utm_term ?? null,
      sessions: sessions.length, pages: list.filter((e) => e.event === "page_view").length,
      converted: conversions.length > 0, returnedConverted: conversions.some((c) => c.session_id !== first.session_id),
      conversions, events: list, entry: first.path, device: first.device,
    });
  }
  return out.sort((a, b) => b.last.localeCompare(a.last));
}
