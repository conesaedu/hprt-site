import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const INBOX_STATUS: Record<string, string> = { novo: "Novo", em_contato: "Em contato", qualificado: "Qualificado", fechado: "Fechado", perdido: "Perdido" };
type Row = Record<string, unknown> & { id: string; status: string; notes: string | null; created_at: string; phone?: string };

/** Shared inbox (status + notes + WhatsApp) for reseller applications and quote requests. */
export function InboxPage({ table, title, intro, columns }: {
  table: "reseller_applications" | "quote_requests"; title: string; intro: string;
  columns: { key: string; label: string }[];
}) {
  const qc = useQueryClient();
  const [q, setQ] = useState(""); const [st, setSt] = useState("all"); const [open, setOpen] = useState<string | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["inbox", table],
    queryFn: async () => { const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false }); if (error) throw error; return data as unknown as Row[]; },
  });
  const upd = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: { status?: string; notes?: string } }) => {
      const { error } = await supabase.from(table).update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id); if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inbox", table] }),
  });
  const rows = useMemo(() => data.filter((r) => (st === "all" || r.status === st) && (!q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))), [data, q, st]);
  const csv = () => {
    const keys = ["created_at", "status", ...columns.map((c) => c.key), "notes"];
    const body = [keys.join(";"), ...rows.map((r) => keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(";"))].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\ufeff" + body], { type: "text/csv" })); a.download = `${table}.csv`; a.click();
  };
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div><h1 className="font-display text-4xl font-bold uppercase">{title}</h1><p className="text-sm text-muted-foreground">{intro}</p></div>
        <button onClick={csv} className="border border-border bg-background px-4 py-2 text-sm">Exportar CSV</button>
      </div>
      <div className="flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…" className="h-10 w-72 border border-input bg-background px-3 text-sm" />
        <select value={st} onChange={(e) => setSt(e.target.value)} className="h-10 border border-input bg-background px-3 text-sm">
          <option value="all">Todos os status</option>{Object.entries(INBOX_STATUS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <span className="self-center text-sm text-muted-foreground">{rows.length} registro(s)</span>
      </div>
      <div className="border border-border bg-background">
        {isLoading ? <p className="p-6 text-sm text-muted-foreground">Carregando…</p> : rows.length === 0 ? <p className="p-6 text-sm text-muted-foreground">Nenhum registro ainda.</p> : rows.map((r) => (
          <div key={r.id} className="border-b border-border p-4 last:border-0">
            <div className="flex flex-wrap items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{columns.slice(0, 2).map((c) => String(r[c.key] ?? "")).filter(Boolean).join(" · ")}</p>
                <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("pt-BR")}</p>
              </div>
              <select value={r.status} onChange={(e) => upd.mutate({ id: r.id, patch: { status: e.target.value } })} className="h-9 border border-input bg-background px-2 text-sm">
                {Object.entries(INBOX_STATUS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              {r.phone && <a href={`https://wa.me/55${String(r.phone).replace(/\D/g, "").replace(/^55/, "")}`} target="_blank" rel="noreferrer" className="bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">WhatsApp</a>}
              <button onClick={() => setOpen(open === r.id ? null : r.id)} className="text-sm underline">{open === r.id ? "Fechar" : "Detalhes"}</button>
            </div>
            {open === r.id && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <dl className="grid grid-cols-[9rem_1fr] gap-1 text-sm">
                  {columns.map((c) => <Fragment key={c.key}><dt className="text-muted-foreground">{c.label}</dt><dd>{String(r[c.key] ?? "—")}</dd></Fragment>)}
                </dl>
                <textarea defaultValue={r.notes ?? ""} placeholder="Anotações internas" onBlur={(e) => e.target.value !== (r.notes ?? "") && upd.mutate({ id: r.id, patch: { notes: e.target.value } })}
                  className="min-h-28 border border-input bg-background p-3 text-sm" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
