import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/midia")({
  head: () => ({ meta: [{ title: "Mídia — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Media /></AdminShell>,
});
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;
function Media() {
  const qc = useQueryClient(); const [busy, setBusy] = useState(false); const [copied, setCopied] = useState("");
  const { data = [], isLoading } = useQuery({ queryKey: ["media"], queryFn: async () => {
    const { data, error } = await supabase.storage.from("media").list("", { limit: 500, sortBy: { column: "created_at", order: "desc" } }); if (error) throw error;
    const files = data.filter((f) => f.id);
    if (!files.length) return [];
    const { data: urls } = await supabase.storage.from("media").createSignedUrls(files.map((f) => f.name), TEN_YEARS);
    return files.map((f, i) => ({ name: f.name, size: f.metadata?.size as number | undefined, url: urls?.[i]?.signedUrl ?? "" }));
  } });
  async function upload(list: FileList) {
    setBusy(true);
    for (const f of Array.from(list)) await supabase.storage.from("media").upload(`${Date.now()}-${f.name.replace(/[^a-z0-9.]+/gi, "-").toLowerCase()}`, f, { contentType: f.type });
    setBusy(false); qc.invalidateQueries({ queryKey: ["media"] });
  }
  const del = useMutation({ mutationFn: async (n: string) => { const { error } = await supabase.storage.from("media").remove([n]); if (error) throw error; }, onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }) });
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between"><div><h1 className="font-display text-4xl font-bold uppercase">Mídia</h1>
        <p className="text-sm text-muted-foreground">Biblioteca de imagens e arquivos usados em pop-ups, blog e depoimentos.</p></div>
        <label className="cursor-pointer bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">{busy ? "Enviando…" : "+ Enviar arquivos"}
          <input type="file" multiple className="hidden" onChange={(e) => e.target.files && upload(e.target.files)} /></label></div>
      {isLoading ? <p className="text-sm">Carregando…</p> : data.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum arquivo enviado ainda.</p> :
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{data.map((f) => (
          <div key={f.name} className="border border-border bg-background">
            <div className="flex aspect-[4/3] items-center justify-center bg-muted">{/\.(png|jpe?g|webp|gif|svg)$/i.test(f.name) ? <img src={f.url} alt={f.name} className="h-full w-full object-cover" loading="lazy" /> : <span className="text-xs uppercase text-muted-foreground">{f.name.split(".").pop()}</span>}</div>
            <div className="space-y-2 p-3"><p className="truncate text-xs">{f.name}</p>
              <div className="flex gap-3 text-xs"><button className="underline" onClick={() => { navigator.clipboard.writeText(f.url); setCopied(f.name); }}>{copied === f.name ? "Copiado!" : "Copiar link"}</button>
                <button className="text-destructive underline" onClick={() => confirm("Excluir arquivo?") && del.mutate(f.name)}>Excluir</button></div></div>
          </div>))}</div>}
    </div>
  );
}
