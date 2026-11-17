import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, field } from "@/components/admin/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { downloadCategories } from "@/lib/downloads-data";

export const Route = createFileRoute("/_authenticated/admin/downloads")({
  head: () => ({ meta: [{ title: "Downloads — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Downloads /></AdminShell>,
});

const KINDS = ["Driver", "Utilitário", "Software", "Firmware", "Manual", "Ficha técnica"];
type F = { id?: string; title: string; description: string; category: string; kind: string; os: string; models: string; file_url: string; format: string; version: string; is_active: boolean; sort_order: number };
const empty: F = { title: "", description: "", category: downloadCategories[0], kind: "Driver", os: "Windows", models: "", file_url: "", format: "", version: "", is_active: true, sort_order: 0 };

function Downloads() {
  const qc = useQueryClient();
  const [f, setF] = useState<F | null>(null);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const { data = [], isLoading } = useQuery({ queryKey: ["admin-downloads"], queryFn: async () => { const { data, error } = await supabase.from("downloads").select("*").order("sort_order").order("created_at", { ascending: false }); if (error) throw error; return data; } });
  const save = useMutation({
    mutationFn: async (v: F) => {
      const row = { title: v.title, description: v.description, category: v.category, kind: v.kind, os: v.os, models: v.models.split(",").map((m) => m.trim().toUpperCase()).filter(Boolean), file_url: v.file_url, format: v.format, version: v.version || null, is_active: v.is_active, sort_order: v.sort_order };
      const { error } = v.id ? await supabase.from("downloads").update(row).eq("id", v.id) : await supabase.from("downloads").insert(row);
      if (error) throw error;
    },
    onSuccess: () => { setF(null); qc.invalidateQueries({ queryKey: ["admin-downloads"] }); },
  });
  const remove = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("downloads").delete().eq("id", id); if (error) throw error; }, onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-downloads"] }) });

  async function upload(file: File) {
    if (!f) return;
    setBusy(true); setErr("");
    const path = `${Date.now()}-${file.name.replace(/[^a-z0-9._-]+/gi, "-")}`;
    const { error } = await supabase.storage.from("downloads").upload(path, file);
    if (error) { setErr(error.message); setBusy(false); return; }
    const { data } = await supabase.storage.from("downloads").createSignedUrl(path, 60 * 60 * 24 * 365 * 10, { download: file.name });
    const ext = file.name.split(".").pop()?.toUpperCase() ?? "";
    const mb = (file.size / 1048576).toFixed(1);
    if (data) setF({ ...f, file_url: data.signedUrl, format: f.format || `${ext} · ${mb} MB` });
    setBusy(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-display text-4xl font-bold uppercase">Downloads</h1><p className="text-sm text-muted-foreground">Drivers, firmwares, manuais e fichas técnicas publicados na Central de Downloads do site.</p></div>
        <button onClick={() => setF({ ...empty })} className="bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Novo arquivo</button>
      </div>

      {f && (
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(f); }} className="grid gap-4 border border-border bg-background p-6 md:grid-cols-2">
          <Field label="Título"><input required className={field} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
          <Field label="Modelos (separados por vírgula)" hint="Ex.: ARES, GALA, GRAND"><input className={field} value={f.models} onChange={(e) => setF({ ...f, models: e.target.value })} /></Field>
          <div className="md:col-span-2"><Field label="Descrição"><textarea rows={2} className={field} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field></div>
          <Field label="Linha"><select className={field} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{downloadCategories.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Tipo"><select className={field} value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>{KINDS.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Sistema"><input className={field} value={f.os} onChange={(e) => setF({ ...f, os: e.target.value })} /></Field>
          <Field label="Versão"><input className={field} value={f.version} onChange={(e) => setF({ ...f, version: e.target.value })} /></Field>
          <div className="md:col-span-2 space-y-2">
            <Field label="Arquivo" hint="Envie o arquivo ou cole um link externo.">
              <input className={field} value={f.file_url} placeholder="https://…" onChange={(e) => setF({ ...f, file_url: e.target.value })} />
            </Field>
            <label className="inline-block cursor-pointer border border-input px-3 py-2 text-sm hover:bg-muted">{busy ? "Enviando…" : "Enviar arquivo"}<input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} /></label>
            {err && <p className="text-sm text-destructive">{err}</p>}
          </div>
          <Field label="Formato / tamanho"><input className={field} value={f.format} onChange={(e) => setF({ ...f, format: e.target.value })} /></Field>
          <Field label="Ordem"><input type="number" className={field} value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} /> Publicado no site</label>
          <div className="flex justify-end gap-3 md:col-span-2">
            {save.error && <p className="mr-auto text-sm text-destructive">{(save.error as Error).message}</p>}
            <button type="button" onClick={() => setF(null)} className="border border-input px-4 py-2 text-sm">Cancelar</button>
            <button disabled={save.isPending || busy} className="bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Salvar</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-3">Arquivo</th><th className="p-3">Linha / tipo</th><th className="p-3">Modelos</th><th className="p-3">Status</th><th className="p-3"></th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="p-6 text-muted-foreground">Carregando…</td></tr>}
            {!isLoading && data.length === 0 && <tr><td colSpan={5} className="p-6 text-muted-foreground">Nenhum arquivo cadastrado pelo painel ainda. Os arquivos originais do site continuam publicados.</td></tr>}
            {data.map((d) => (
              <tr key={d.id} className="border-t border-border">
                <td className="p-3"><p className="font-semibold">{d.title}</p><p className="text-muted-foreground">{d.format}{d.version ? ` · v${d.version}` : ""}</p></td>
                <td className="p-3">{d.category}<p className="text-muted-foreground">{d.kind} · {d.os}</p></td>
                <td className="p-3">{d.models.join(", ") || "—"}</td>
                <td className="p-3">{d.is_active ? "Publicado" : "Oculto"}</td>
                <td className="p-3 whitespace-nowrap space-x-3">
                  <button className="underline" onClick={() => setF({ id: d.id, title: d.title, description: d.description, category: d.category, kind: d.kind, os: d.os, models: d.models.join(", "), file_url: d.file_url, format: d.format, version: d.version ?? "", is_active: d.is_active, sort_order: d.sort_order })}>Editar</button>
                  <button className="text-destructive underline" onClick={() => confirm("Excluir este arquivo?") && remove.mutate(d.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
