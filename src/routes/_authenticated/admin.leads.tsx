import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Fragment, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { LEAD_STATUSES, listLeads, updateLead } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  head: () => ({ meta: [{ title: "Leads — HPRT Brasil" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Leads /></AdminShell>,
});

const LABEL: Record<string, string> = { new: "Novo", contacted: "Em contato", qualified: "Qualificado", won: "Fechado", lost: "Perdido" };

function waLink(phone: string, name: string) {
  let d = phone.replace(/\D/g, "");
  if (d.length <= 11) d = "55" + d;
  return `https://wa.me/${d}?text=${encodeURIComponent(`Olá ${name.split(" ")[0]}, aqui é da HPRT Brasil. Recebemos seu contato pelo site.`)}`;
}

function Leads() {
  const fetchLeads = useServerFn(listLeads);
  const save = useServerFn(updateLead);
  const qc = useQueryClient();
  const { data = [], isLoading, error } = useQuery({ queryKey: ["leads"], queryFn: () => fetchLeads() });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [days, setDays] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const m = useMutation({
    mutationFn: (v: { id: string; status?: (typeof LEAD_STATUSES)[number]; notes?: string }) => save({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    const since = days === "all" ? 0 : Date.now() - Number(days) * 864e5;
    return data.filter((l) =>
      (status === "all" || l.status === status) &&
      new Date(l.created_at).getTime() >= since &&
      (!t || [l.name, l.company, l.email, l.phone, l.segment].some((f) => f?.toLowerCase().includes(t))));
  }, [data, q, status, days]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-bold uppercase">Leads <span className="text-muted-foreground text-2xl">({rows.length})</span></h1>
        <div className="flex flex-wrap gap-2">
          <input placeholder="Buscar nome, empresa, e-mail…" value={q} onChange={(e) => setQ(e.target.value)} className="border border-input bg-background px-3 py-2 text-sm w-64" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-input bg-background px-3 py-2 text-sm">
            <option value="all">Todos os status</option>
            {LEAD_STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
          </select>
          <select value={days} onChange={(e) => setDays(e.target.value)} className="border border-input bg-background px-3 py-2 text-sm">
            <option value="all">Todo o período</option><option value="7">7 dias</option><option value="30">30 dias</option><option value="90">90 dias</option>
          </select>
        </div>
      </div>
      {error && <p className="text-destructive text-sm">{(error as Error).message}</p>}
      <div className="bg-background border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="p-3">Data</th><th className="p-3">Contato</th><th className="p-3">Empresa</th><th className="p-3">Segmento / Necessidade</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="p-6 text-muted-foreground">Carregando…</td></tr>}
            {!isLoading && rows.length === 0 && <tr><td colSpan={6} className="p-6 text-muted-foreground">Nenhum lead encontrado.</td></tr>}
            {rows.map((l) => (
              <Fragment key={l.id}>
                <tr className="border-t border-border align-top">
                  <td className="p-3 whitespace-nowrap">{new Date(l.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</td>
                  <td className="p-3"><p className="font-semibold">{l.name}</p><p className="text-muted-foreground">{l.email}</p><p className="text-muted-foreground">{l.phone}</p></td>
                  <td className="p-3">{l.company}{l.role && <p className="text-muted-foreground">{l.role}</p>}</td>
                  <td className="p-3">{l.segment || "—"}<p className="text-muted-foreground">{l.need}</p></td>
                  <td className="p-3">
                    <select value={l.status} onChange={(e) => m.mutate({ id: l.id, status: e.target.value as any })} className="border border-input bg-background px-2 py-1">
                      {LEAD_STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
                    </select>
                  </td>
                  <td className="p-3 whitespace-nowrap space-x-3">
                    <a href={waLink(l.phone, l.name)} target="_blank" rel="noreferrer" className="font-semibold text-primary">WhatsApp</a>
                    <button onClick={() => setOpen(open === l.id ? null : l.id)} className="underline">Detalhes</button>
                  </td>
                </tr>
                {open === l.id && (
                  <tr key={l.id + "-d"} className="bg-muted/40"><td colSpan={6} className="p-4 space-y-3">
                    <p><b>Volume:</b> {l.volume || "—"} · <b>Origem:</b> {l.source}</p>
                    <p><b>Mensagem:</b> {l.message || "—"}</p>
                    <NotesEditor initial={l.notes ?? ""} onSave={(notes) => m.mutate({ id: l.id, notes })} />
                  </td></tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NotesEditor({ initial, onSave }: { initial: string; onSave: (v: string) => void }) {
  const [v, setV] = useState(initial);
  return (
    <div className="flex gap-2">
      <textarea value={v} onChange={(e) => setV(e.target.value)} placeholder="Anotações internas" className="flex-1 border border-input bg-background p-2" rows={2} />
      <button onClick={() => onSave(v)} className="bg-foreground px-4 text-background text-sm font-semibold">Salvar</button>
    </div>
  );
}
