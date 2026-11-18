import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { buildJourneys, type JEvent, type Journey } from "@/lib/journeys";

export const Route = createFileRoute("/_authenticated/admin/jornadas")({
  head: () => ({ meta: [{ title: "Origens e jornadas — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Jornadas /></AdminShell>,
});

const ACAO: Record<string, string> = { page_view: "Viu a página", product_view: "Viu o produto", whatsapp_click: "Clicou no WhatsApp", contact_lead: "Enviou contato", quote_request: "Pediu orçamento", reseller_application: "Pediu para ser revenda", download: "Baixou arquivo", banner_view: "Viu pop-up", banner_click: "Clicou no pop-up", assistant_open: "Abriu assistente" };
const UTM: Record<string, string> = { utm_source: "Origem", utm_medium: "Meio", utm_campaign: "Campanha", utm_term: "Palavra-chave", utm_content: "Conteúdo", gclid: "Clique Google Ads", fbclid: "Clique Meta", li_fat_id: "Clique LinkedIn", ttclid: "Clique TikTok" };
const dt = (s: string) => new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
const sel = "border border-input bg-background px-3 py-2 text-sm";

function Jornadas() {
  const [days, setDays] = useState(30);
  const [channel, setChannel] = useState("all"); const [campaign, setCampaign] = useState("all"); const [sit, setSit] = useState("all");
  const [open, setOpen] = useState<Journey | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["journeys", days],
    queryFn: async () => {
      const since = new Date(Date.now() - days * 864e5).toISOString();
      const [ev, cl, qr, rs] = await Promise.all([
        supabase.from("site_events").select("event,path,label,session_id,visitor_id,referrer,device,utm,created_at").gte("created_at", since).order("created_at", { ascending: false }).limit(20000),
        supabase.from("contact_leads").select("visitor_id,name,company").not("visitor_id", "is", null),
        supabase.from("quote_requests").select("visitor_id,name,company").not("visitor_id", "is", null),
        supabase.from("reseller_applications").select("visitor_id,contact_name,company").not("visitor_id", "is", null),
      ]);
      if (ev.error) throw ev.error;
      const who = new Map<string, string>();
      for (const r of [...(cl.data ?? []), ...(qr.data ?? [])]) who.set(r.visitor_id!, `${r.company} · ${r.name}`);
      for (const r of rs.data ?? []) who.set(r.visitor_id!, `${r.company} · ${r.contact_name}`);
      return { journeys: buildJourneys(ev.data as JEvent[]), who };
    },
  });
  const all = data?.journeys ?? [];
  const channels = useMemo(() => [...new Set(all.map((j) => j.channel))].sort(), [all]);
  const campaigns = useMemo(() => [...new Set(all.map((j) => j.campaign).filter(Boolean) as string[])].sort(), [all]);
  const rows = all.filter((j) => (channel === "all" || j.channel === channel) && (campaign === "all" || j.campaign === campaign) &&
    (sit === "all" || (sit === "conv" && j.converted) || (sit === "nao" && !j.converted) || (sit === "voltou" && j.returnedConverted) || (sit === "retorno" && j.sessions > 1 && !j.converted)));
  const byChannel = useMemo(() => {
    const m = new Map<string, { v: number; c: number; r: number }>();
    for (const j of all) { const x = m.get(j.channel) ?? { v: 0, c: 0, r: 0 }; x.v++; if (j.converted) x.c++; if (j.returnedConverted) x.r++; m.set(j.channel, x); }
    return [...m.entries()].sort((a, b) => b[1].v - a[1].v);
  }, [all]);
  const conv = rows.filter((j) => j.converted).length;

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-4xl font-bold uppercase">Origens e jornadas</h1>
        <p className="text-sm text-muted-foreground">Cada visitante do site, de onde veio (campanha, UTM, busca, IA, redes) e o que fez até converter — inclusive quem voltou dias depois.</p></div>
      <div className="flex flex-wrap gap-2">
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className={sel}><option value={1}>Hoje</option><option value={7}>7 dias</option><option value={30}>30 dias</option><option value={90}>90 dias</option></select>
        <select value={channel} onChange={(e) => setChannel(e.target.value)} className={sel}><option value="all">Todas as origens</option>{channels.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={campaign} onChange={(e) => setCampaign(e.target.value)} className={sel}><option value="all">Todas as campanhas (UTM)</option>{campaigns.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={sit} onChange={(e) => setSit(e.target.value)} className={sel}>
          <option value="all">Todos os visitantes</option><option value="conv">Converteram</option><option value="nao">Não converteram</option>
          <option value="voltou">Voltaram depois e converteram</option><option value="retorno">Voltaram e ainda não converteram</option></select>
      </div>
      {error ? <p className="text-sm text-destructive">{(error as Error).message}</p> : isLoading ? <p className="text-muted-foreground">Carregando…</p> : (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            {[["Visitantes", rows.length], ["Converteram", conv], ["Taxa de conversão", `${rows.length ? ((conv / rows.length) * 100).toFixed(1) : 0}%`], ["Voltaram e converteram", rows.filter((j) => j.returnedConverted).length]].map(([l, v]) => (
              <div key={l} className="border border-border bg-background p-5"><p className="text-xs uppercase tracking-wider text-muted-foreground">{l}</p><p className="mt-2 font-display text-4xl font-bold">{v}</p></div>))}
          </div>
          <div className="overflow-x-auto border border-border bg-background">
            <p className="px-4 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resultado por origem</p>
            <table className="mt-2 w-full text-sm"><thead className="text-left text-xs uppercase text-muted-foreground"><tr>{["Origem", "Visitantes", "Converteram", "Taxa", "Voltaram e converteram"].map((h) => <th key={h} className="px-4 py-2">{h}</th>)}</tr></thead>
              <tbody>{byChannel.map(([k, x]) => <tr key={k} onClick={() => setChannel(k)} className="cursor-pointer border-t border-border hover:bg-muted"><td className="px-4 py-2 font-semibold">{k}</td><td className="px-4 py-2">{x.v}</td><td className="px-4 py-2">{x.c}</td><td className="px-4 py-2">{((x.c / x.v) * 100).toFixed(1)}%</td><td className="px-4 py-2">{x.r}</td></tr>)}</tbody></table>
          </div>
          <div className="overflow-x-auto border border-border bg-background">
            <table className="w-full text-sm"><thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground"><tr>
              {["Visitante", "Primeira visita", "Origem", "Campanha / termo", "Visitas", "Páginas", "Conversão", "Última atividade"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
              <tbody>{rows.slice(0, 300).map((j) => (
                <tr key={j.visitor} onClick={() => setOpen(j)} className="cursor-pointer border-t border-border hover:bg-muted">
                  <td className="px-3 py-2">{data?.who.get(j.visitor) ?? <span className="text-muted-foreground">Anônimo #{j.visitor.slice(-5)}</span>}</td>
                  <td className="px-3 py-2">{dt(j.first)}</td><td className="px-3 py-2">{j.channel}</td>
                  <td className="px-3 py-2">{[j.campaign, j.term].filter(Boolean).join(" · ") || "—"}</td>
                  <td className="px-3 py-2">{j.sessions}</td><td className="px-3 py-2">{j.pages}</td>
                  <td className="px-3 py-2">{j.converted ? <span className="font-semibold text-primary">{ACAO[j.conversions[0].event]}{j.returnedConverted ? " (no retorno)" : ""}</span> : "—"}</td>
                  <td className="px-3 py-2">{dt(j.last)}</td>
                </tr>))}</tbody></table>
            {rows.length === 0 && <p className="p-5 text-sm text-muted-foreground">Nenhum visitante com esses filtros.</p>}
          </div>
        </>
      )}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-foreground/50" onClick={() => setOpen(null)}>
          <div className="h-full w-full max-w-xl overflow-y-auto bg-background p-6" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Fechar" onClick={() => setOpen(null)} className="float-right p-1"><X className="size-5" /></button>
            <h2 className="font-display text-2xl font-bold uppercase">{data?.who.get(open.visitor) ?? "Visitante anônimo"}</h2>
            <p className="text-sm text-muted-foreground">{open.sessions} visitas · {open.events.length} ações · entrou por {open.entry ?? "—"} · {open.device ?? ""}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 border border-border p-4 text-sm">
              <div><p className="text-xs uppercase text-muted-foreground">Origem</p><p>{open.channel}</p></div>
              {Object.entries(open.events.find((e) => e.utm)?.utm ?? {}).map(([k, v]) => <div key={k}><p className="text-xs uppercase text-muted-foreground">{UTM[k] ?? k}</p><p className="break-all">{v}</p></div>)}
            </div>
            <ol className="mt-5 space-y-2">
              {open.events.map((e, i) => {
                const newVisit = i > 0 && e.session_id !== open.events[i - 1].session_id;
                return (<li key={i}>
                  {newVisit && <p className="my-2 border-t border-border pt-2 text-xs font-semibold uppercase text-primary">Nova visita</p>}
                  <p className="text-sm"><span className="mr-2 text-xs text-muted-foreground">{dt(e.created_at)}</span>
                    <span className={e.event === "page_view" ? "" : "font-semibold"}>{ACAO[e.event] ?? e.event}</span>
                    <span className="text-muted-foreground"> · {e.label ?? e.path}</span></p>
                </li>);
              })}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
