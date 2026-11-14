import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, field } from "@/components/admin/ImageUpload";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/site")({
  head: () => ({ meta: [{ title: "Personalizar site — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><SiteSettings /></AdminShell>,
});

type Bar = { enabled: boolean; text: string; link: string };

function SiteSettings() {
  const [bar, setBar] = useState<Bar>({ enabled: false, text: "", link: "" });
  const [ok, setOk] = useState(false);
  const q = useQuery({ queryKey: ["setting-announcement"], queryFn: async () => (await supabase.from("site_settings").select("value").eq("key", "announcement").maybeSingle()).data });
  useEffect(() => { if (q.data?.value) setBar({ enabled: false, text: "", link: "", ...(q.data.value as Partial<Bar>) }); }, [q.data]);
  const save = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("site_settings").upsert({ key: "announcement", value: bar, updated_at: new Date().toISOString() }); if (error) throw error; },
    onSuccess: () => { setOk(true); setTimeout(() => setOk(false), 2500); },
  });
  return (
    <div className="max-w-2xl space-y-6">
      <div><h1 className="font-display text-4xl font-bold uppercase">Personalizar site</h1><p className="text-sm text-muted-foreground">Ajustes que aparecem no site sem precisar mexer no código.</p></div>
      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-5 border border-border bg-background p-6">
        <div><p className="font-display text-xl font-bold uppercase">Faixa de aviso</p><p className="text-sm text-muted-foreground">Uma faixa fixa no rodapé de todas as páginas. Ex.: "Estaremos na Fispal 2026 — estande 120".</p></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={bar.enabled} onChange={(e) => setBar({ ...bar, enabled: e.target.checked })} /> Mostrar faixa no site</label>
        <Field label="Texto"><input maxLength={160} className={field} value={bar.text} onChange={(e) => setBar({ ...bar, text: e.target.value })} /></Field>
        <Field label="Link (opcional)" hint="Ex.: /treinamentos"><input className={field} value={bar.link} onChange={(e) => setBar({ ...bar, link: e.target.value })} /></Field>
        {bar.enabled && bar.text && <div className="bg-foreground px-4 py-3 text-sm font-semibold text-background">{bar.text}{bar.link && " →"}</div>}
        {save.error && <p className="text-sm text-destructive">{(save.error as Error).message}</p>}
        <button className="bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">{save.isPending ? "Salvando…" : ok ? "Salvo ✓" : "Salvar"}</button>
      </form>
    </div>
  );
}
