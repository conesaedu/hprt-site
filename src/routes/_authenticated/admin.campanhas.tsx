import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdsOverview, setCampaignStatus } from "@/lib/ads.functions";
import { getAdminStatus } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/campanhas")({
  head: () => ({ meta: [{ title: "Campanhas — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Campanhas /></AdminShell>,
});

const RANGES = [["TODAY", "Hoje"], ["YESTERDAY", "Ontem"], ["LAST_7_DAYS", "Últimos 7 dias"], ["LAST_14_DAYS", "Últimos 14 dias"], ["LAST_30_DAYS", "Últimos 30 dias"], ["THIS_MONTH", "Este mês"], ["LAST_MONTH", "Mês passado"]] as const;
const TYPE: Record<string, string> = { PERFORMANCE_MAX: "Performance Max", SEARCH: "Pesquisa", DISPLAY: "Display", VIDEO: "YouTube", DEMAND_GEN: "Demand Gen" };
const STATUS: Record<string, string> = { ENABLED: "Ativa", PAUSED: "Pausada" };

function Campanhas() {
  const fetchOv = useServerFn(getAdsOverview);
  const setStatus = useServerFn(setCampaignStatus);
  const fetchMe = useServerFn(getAdminStatus);
  const me = useQuery({ queryKey: ["admin-status"], queryFn: () => fetchMe() });
  const [range, setRange] = useState<(typeof RANGES)[number][0]>("LAST_7_DAYS");
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["ads", range], queryFn: () => fetchOv({ data: { range } }) });
  const m = useMutation({
    mutationFn: (v: { id: string; status: "ENABLED" | "PAUSED" }) => setStatus({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ads"] }),
  });
  const cur = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: data?.currency ?? "BRL" });
  const t = (data?.campaigns ?? []).reduce((a, c) => ({ cost: a.cost + c.cost, clicks: a.clicks + c.clicks, impressions: a.impressions + c.impressions, conversions: a.conversions + c.conversions }), { cost: 0, clicks: 0, impressions: 0, conversions: 0 });
  const maxCost = Math.max(1, ...(data?.daily ?? []).map((d) => d.cost));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="font-display text-4xl font-bold uppercase">Campanhas</h1>
          <p className="text-sm text-muted-foreground">Google Ads ao vivo{data?.account ? ` · ${data.account}` : ""}. Meta, LinkedIn e TikTok entram aqui quando as contas forem conectadas.</p></div>
        <select value={range} onChange={(e) => setRange(e.target.value as typeof range)} className="border border-input bg-background px-3 py-2 text-sm">
          {RANGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      {error ? <p className="text-sm text-destructive">{(error as Error).message}</p> : isLoading || !data ? <p className="text-muted-foreground">Carregando dados do Google Ads…</p> : (
        <>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[["Investimento", cur(t.cost)], ["Impressões", t.impressions.toLocaleString("pt-BR")], ["Cliques", t.clicks.toLocaleString("pt-BR")],
              ["CTR", `${(t.impressions ? (t.clicks / t.impressions) * 100 : 0).toFixed(2)}%`], ["CPC médio", cur(t.clicks ? t.cost / t.clicks : 0)],
              ["Conversões", `${t.conversions.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}${t.conversions ? ` · ${cur(t.cost / t.conversions)} cada` : ""}`]].map(([l, v]) => (
              <div key={l} className="border border-border bg-background p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">{l}</p><p className="mt-2 font-display text-2xl font-bold">{v}</p></div>
            ))}
          </div>
          <div className="border border-border bg-background p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Investimento por dia</p>
            {data.daily.length === 0 ? <p className="text-sm text-muted-foreground">Sem veiculação no período.</p> : (
              <div className="flex h-40 items-end gap-1">
                {data.daily.map((d) => <div key={d.date} title={`${d.date.split("-").reverse().join("/")}: ${cur(d.cost)} · ${d.clicks} cliques · ${d.conversions} conv.`} className="flex-1 bg-primary/80 hover:bg-primary" style={{ height: `${Math.max(2, (d.cost / maxCost) * 100)}%` }} />)}
              </div>)}
          </div>
          <div className="overflow-x-auto border border-border bg-background">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground"><tr>
                {["Campanha", "Status", "Orçamento/dia", "Investido", "Impr.", "Cliques", "CTR", "CPC", "Conv.", "Custo/conv.", ""].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
              <tbody>{data.campaigns.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-3 py-2"><p className="font-semibold">{c.name}</p><p className="text-xs text-muted-foreground">{TYPE[c.type] ?? c.type}</p></td>
                  <td className="px-3 py-2"><span className={c.status === "ENABLED" ? "font-semibold text-primary" : "text-muted-foreground"}>{STATUS[c.status] ?? c.status}</span></td>
                  <td className="px-3 py-2">{cur(c.budget)}</td><td className="px-3 py-2">{cur(c.cost)}</td>
                  <td className="px-3 py-2">{c.impressions.toLocaleString("pt-BR")}</td><td className="px-3 py-2">{c.clicks}</td>
                  <td className="px-3 py-2">{(c.ctr * 100).toFixed(2)}%</td><td className="px-3 py-2">{cur(c.cpc)}</td>
                  <td className="px-3 py-2">{c.conversions.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}</td><td className="px-3 py-2">{c.conversions ? cur(c.cpa) : "—"}</td>
                  <td className="px-3 py-2">{me.data?.isAdmin && (c.status === "ENABLED" || c.status === "PAUSED") && (
                    <button disabled={m.isPending} onClick={() => { const next = c.status === "ENABLED" ? "PAUSED" : "ENABLED"; if (confirm(`${next === "PAUSED" ? "Pausar" : "Ativar"} a campanha "${c.name}"?`)) m.mutate({ id: c.id, status: next }); }}
                      className="border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted">{c.status === "ENABLED" ? "Pausar" : "Ativar"}</button>)}</td>
                </tr>))}</tbody>
            </table>
          </div>
          {m.error && <p className="text-sm text-destructive">{(m.error as Error).message}</p>}
          <div className="border border-border bg-background p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conversões por tipo de ação</p>
            {data.conversionsByAction.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma conversão no período.</p> :
              <ul className="space-y-1.5 text-sm">{data.conversionsByAction.map(([k, v]) => <li key={k} className="flex justify-between"><span>{k}</span><span className="font-semibold">{v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}</span></li>)}</ul>}
          </div>
        </>
      )}
    </div>
  );
}
