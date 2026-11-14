import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/depoimentos")({
  head: () => ({ meta: [{ title: "Depoimentos — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Testimonials /></AdminShell>,
});
type F = { id?: string; author: string; role: string; company: string; quote: string; logo_url: string; is_active: boolean; sort_order: number };
const empty: F = { author: "", role: "", company: "", quote: "", logo_url: "", is_active: true, sort_order: 0 };
const inp = "h-10 w-full border border-input bg-background px-3 text-sm";
function Testimonials() {
  const qc = useQueryClient(); const [f, setF] = useState<F | null>(null);
  const { data = [] } = useQuery({ queryKey: ["adm-testimonials"], queryFn: async () => { const { data, error } = await supabase.from("testimonials").select("*").order("sort_order"); if (error) throw error; return data; } });
  const inv = () => qc.invalidateQueries({ queryKey: ["adm-testimonials"] });
  const save = useMutation({ mutationFn: async (x: F) => { const row = { ...x, role: x.role || null, logo_url: x.logo_url || null }; delete row.id;
    const { error } = x.id ? await supabase.from("testimonials").update(row).eq("id", x.id) : await supabase.from("testimonials").insert(row); if (error) throw error; }, onSuccess: () => { setF(null); inv(); } });
  const del = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("testimonials").delete().eq("id", id); if (error) throw error; }, onSuccess: inv });
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between"><div><h1 className="font-display text-4xl font-bold uppercase">Depoimentos</h1>
        <p className="text-sm text-muted-foreground">Clientes que aparecem na página Por que HPRT. Sem depoimentos ativos, a seção fica oculta.</p></div>
        {!f && <button onClick={() => setF(empty)} className="bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">+ Novo depoimento</button>}</div>
      {f && <form onSubmit={(e) => { e.preventDefault(); save.mutate(f); }} className="grid gap-4 border border-border bg-background p-6 md:grid-cols-2">
        <label className="text-sm">Nome<input required className={inp} value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} /></label>
        <label className="text-sm">Cargo<input className={inp} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} /></label>
        <label className="text-sm">Empresa<input required className={inp} value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} /></label>
        <label className="text-sm">Ordem<input type="number" className={inp} value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} /></label>
        <label className="text-sm md:col-span-2">Depoimento<textarea required className="min-h-28 w-full border border-input bg-background p-3 text-sm" value={f.quote} onChange={(e) => setF({ ...f, quote: e.target.value })} /></label>
        <div className="text-sm"><p className="mb-1">Logo da empresa</p><ImageUpload value={f.logo_url} onChange={(v) => setF({ ...f, logo_url: v })} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} /> Ativo no site</label>
        <div className="flex gap-3 md:col-span-2"><button className="bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">{save.isPending ? "Salvando…" : "Salvar"}</button>
          <button type="button" onClick={() => setF(null)} className="px-5 py-2.5 text-sm underline">Cancelar</button></div>
        {save.error && <p className="text-sm text-destructive">{(save.error as Error).message}</p>}
      </form>}
      <div className="border border-border bg-background">{data.length === 0 ? <p className="p-6 text-sm text-muted-foreground">Nenhum depoimento ainda.</p> : data.map((t) => (
        <div key={t.id} className="flex items-center gap-4 border-b border-border p-4 last:border-0">
          <div className="flex-1"><p className="font-semibold">{t.author} · {t.company}</p><p className="line-clamp-1 text-sm text-muted-foreground">“{t.quote}”</p></div>
          <span className="text-xs">{t.is_active ? "Ativo" : "Oculto"}</span>
          <button className="text-sm underline" onClick={() => setF({ id: t.id, author: t.author, role: t.role ?? "", company: t.company, quote: t.quote, logo_url: t.logo_url ?? "", is_active: t.is_active, sort_order: t.sort_order })}>Editar</button>
          <button className="text-sm text-destructive underline" onClick={() => confirm("Excluir?") && del.mutate(t.id)}>Excluir</button></div>))}</div>
    </div>
  );
}
