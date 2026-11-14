import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, ImageUpload, field } from "@/components/admin/ImageUpload";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/banners")({
  head: () => ({ meta: [{ title: "Pop-ups — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Banners /></AdminShell>,
});

const PAGES = [
  { v: "*", l: "Todas as páginas" }, { v: "/", l: "Home" }, { v: "/por-que-hprt", l: "Por que HPRT" },
  { v: "/produtos", l: "Produtos" }, { v: "/solucoes", l: "Soluções" }, { v: "/treinamentos", l: "Treinamentos" },
  { v: "/downloads", l: "Downloads" }, { v: "/onde-comprar", l: "Onde comprar" }, { v: "/blog", l: "Blog" },
];
const FREQ: Record<string, string> = { once_per_session: "1x por visita", every_7_days: "1x a cada 7 dias", always: "Sempre" };
type Form = { id?: string; title: string; subtitle: string; image_url: string; cta_label: string; cta_url: string; pages: string[]; frequency: string; is_active: boolean; start_at: string; end_at: string; sort_order: number };
const empty: Form = { title: "", subtitle: "", image_url: "", cta_label: "", cta_url: "", pages: ["/"], frequency: "once_per_session", is_active: true, start_at: "", end_at: "", sort_order: 0 };
const toLocal = (s: string | null) => (s ? new Date(s).toISOString().slice(0, 16) : "");

function Banners() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Form | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => { const { data, error } = await supabase.from("banners").select("*").order("sort_order"); if (error) throw error; return data; },
  });
  const save = useMutation({
    mutationFn: async (f: Form) => {
      const row = { title: f.title, subtitle: f.subtitle || null, image_url: f.image_url || null, cta_label: f.cta_label || null, cta_url: f.cta_url || null,
        pages: f.pages.length ? f.pages : ["/"], frequency: f.frequency, is_active: f.is_active, sort_order: f.sort_order,
        start_at: f.start_at ? new Date(f.start_at).toISOString() : null, end_at: f.end_at ? new Date(f.end_at).toISOString() : null, updated_at: new Date().toISOString() };
      const { error } = f.id ? await supabase.from("banners").update(row).eq("id", f.id) : await supabase.from("banners").insert(row);
      if (error) throw error;
    },
    onSuccess: () => { setForm(null); qc.invalidateQueries({ queryKey: ["admin-banners"] }); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("banners").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-banners"] }),
  });
  const toggle = useMutation({
    mutationFn: async (b: { id: string; is_active: boolean }) => { const { error } = await supabase.from("banners").update({ is_active: b.is_active }).eq("id", b.id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-banners"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div><h1 className="font-display text-4xl font-bold uppercase">Pop-ups e banners</h1>
          <p className="text-sm text-muted-foreground">Avisos que aparecem para o visitante: feiras, lançamentos, campanhas.</p></div>
        {!form && <button onClick={() => setForm(empty)} className="bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">+ Novo pop-up</button>}
      </div>

      {form && (
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="grid gap-5 border border-border bg-background p-6 md:grid-cols-2">
          <Field label="Título *"><input required maxLength={120} className={field} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Ordem"><input type="number" className={field} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></Field>
          <div className="md:col-span-2"><Field label="Texto"><textarea rows={3} maxLength={400} className={field} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></Field></div>
          <div className="md:col-span-2"><Field label="Imagem (opcional)"><ImageUpload value={form.image_url} onChange={(u) => setForm({ ...form, image_url: u })} /></Field></div>
          <Field label="Texto do botão"><input className={field} placeholder="Saiba mais" value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} /></Field>
          <Field label="Link do botão" hint="Ex.: /treinamentos ou https://…"><input className={field} value={form.cta_url} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} /></Field>
          <Field label="Começa em"><input type="datetime-local" className={field} value={form.start_at} onChange={(e) => setForm({ ...form, start_at: e.target.value })} /></Field>
          <Field label="Termina em"><input type="datetime-local" className={field} value={form.end_at} onChange={(e) => setForm({ ...form, end_at: e.target.value })} /></Field>
          <Field label="Frequência">
            <select className={field} value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
              {Object.entries(FREQ).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
          <Field label="Ativo"><label className="flex items-center gap-2 py-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Exibir no site</label></Field>
          <div className="md:col-span-2"><Field label="Onde aparece">
            <div className="flex flex-wrap gap-2">{PAGES.map((p) => {
              const on = form.pages.includes(p.v);
              return <button type="button" key={p.v} onClick={() => setForm({ ...form, pages: on ? form.pages.filter((x) => x !== p.v) : [...form.pages, p.v] })}
                className={`border px-3 py-1.5 text-sm ${on ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"}`}>{p.l}</button>;
            })}</div>
          </Field></div>
          {save.error && <p className="text-sm text-destructive md:col-span-2">{(save.error as Error).message}</p>}
          <div className="flex gap-3 md:col-span-2">
            <button disabled={save.isPending} className="bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">{save.isPending ? "Salvando…" : "Salvar"}</button>
            <button type="button" onClick={() => setForm(null)} className="border border-input px-5 py-2.5 text-sm">Cancelar</button>
          </div>
        </form>
      )}

      <div className="border border-border bg-background">
        {isLoading && <p className="p-6 text-muted-foreground">Carregando…</p>}
        {!isLoading && data.length === 0 && <p className="p-6 text-muted-foreground">Nenhum pop-up criado ainda.</p>}
        {data.map((b) => (
          <div key={b.id} className="flex items-center gap-4 border-t border-border p-4 first:border-t-0">
            {b.image_url ? <img src={b.image_url} alt="" className="h-14 w-24 object-cover" /> : <div className="h-14 w-24 bg-muted" />}
            <div className="flex-1">
              <p className="font-semibold">{b.title}</p>
              <p className="text-xs text-muted-foreground">{b.pages.map((p) => PAGES.find((x) => x.v === p)?.l ?? p).join(", ")} · {FREQ[b.frequency]}
                {b.end_at && ` · até ${new Date(b.end_at).toLocaleDateString("pt-BR")}`}</p>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={b.is_active} onChange={(e) => toggle.mutate({ id: b.id, is_active: e.target.checked })} /> Ativo</label>
            <button onClick={() => setForm({ id: b.id, title: b.title, subtitle: b.subtitle ?? "", image_url: b.image_url ?? "", cta_label: b.cta_label ?? "", cta_url: b.cta_url ?? "", pages: b.pages, frequency: b.frequency, is_active: b.is_active, start_at: toLocal(b.start_at), end_at: toLocal(b.end_at), sort_order: b.sort_order })} className="text-sm underline">Editar</button>
            <button onClick={() => confirm("Excluir este pop-up?") && del.mutate(b.id)} className="text-sm text-destructive underline">Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}
