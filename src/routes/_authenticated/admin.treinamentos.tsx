import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { DEFAULT_FORM_FIELDS, FIELD_LABELS, normalizeFormFields, type FieldMode, type FormFields } from "@/lib/training-form";

export const Route = createFileRoute("/_authenticated/admin/treinamentos")({
  head: () => ({ meta: [{ title: "Treinamentos — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Trainings /></AdminShell>,
});
type F = { id?: string; title: string; type: string; audience: string; date: string; format: string; location: string; seats: number; spots: number; description: string; is_active: boolean; image_url: string; form_fields: FormFields };
const empty: F = { title: "", type: "técnico", audience: "", date: "", format: "online", location: "", seats: 20, spots: 20, description: "", is_active: true, image_url: "", form_fields: DEFAULT_FORM_FIELDS };
const inp = "h-10 w-full border border-input bg-background px-3 text-sm";
const RS: Record<string, string> = { pending: "Pendente", confirmed: "Confirmada", cancelled: "Cancelada" };
function Trainings() {
  const qc = useQueryClient(); const [f, setF] = useState<F | null>(null); const [view, setView] = useState<string | null>(null);
  const { data = [] } = useQuery({ queryKey: ["adm-trainings"], queryFn: async () => { const { data, error } = await supabase.from("trainings").select("*, training_registrations(count)").order("date", { ascending: false }); if (error) throw error; return data; } });
  const regs = useQuery({ queryKey: ["adm-regs", view], enabled: !!view, queryFn: async () => { const { data, error } = await supabase.from("training_registrations").select("*").eq("training_id", view!).order("created_at"); if (error) throw error; return data; } });
  const inv = () => { qc.invalidateQueries({ queryKey: ["adm-trainings"] }); qc.invalidateQueries({ queryKey: ["adm-regs"] }); };
  const save = useMutation({ mutationFn: async (x: F) => { const { id, ...rest } = { ...x, date: new Date(x.date).toISOString() }; const row = { ...rest, image_url: rest.image_url || null, form_fields: rest.form_fields as never };
    const { error } = id ? await supabase.from("trainings").update(row).eq("id", id) : await supabase.from("trainings").insert(row); if (error) throw error; }, onSuccess: () => { setF(null); inv(); } });
  const del = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("trainings").delete().eq("id", id); if (error) throw error; }, onSuccess: inv });
  const setReg = useMutation({ mutationFn: async ({ id, status }: { id: string; status: string }) => { const { error } = await supabase.from("training_registrations").update({ status }).eq("id", id); if (error) throw error; }, onSuccess: inv });
  const s = (k: keyof F) => (e: { target: { value: string } }) => setF({ ...f!, [k]: typeof empty[k] === "number" ? Number(e.target.value) : e.target.value });
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between"><div><h1 className="font-display text-4xl font-bold uppercase">Treinamentos</h1>
        <p className="text-sm text-muted-foreground">Agenda publicada em /treinamentos e as inscrições recebidas.</p></div>
        {!f && <button onClick={() => setF(empty)} className="bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">+ Novo treinamento</button>}</div>
      {f && <form onSubmit={(e) => { e.preventDefault(); save.mutate(f); }} className="grid gap-4 border border-border bg-background p-6 md:grid-cols-3">
        <label className="text-sm md:col-span-2">Título<input required className={inp} value={f.title} onChange={s("title")} /></label>
        <label className="text-sm">Data e hora<input required type="datetime-local" className={inp} value={f.date} onChange={s("date")} /></label>
        <label className="text-sm">Tipo<select className={inp} value={f.type} onChange={s("type")}><option>técnico</option><option>comercial</option></select></label>
        <label className="text-sm">Formato<select className={inp} value={f.format} onChange={s("format")}><option>online</option><option>presencial</option><option>híbrido</option></select></label>
        <label className="text-sm">Local / link<input required className={inp} value={f.location} onChange={s("location")} /></label>
        <label className="text-sm">Público<input required className={inp} value={f.audience} onChange={s("audience")} /></label>
        <label className="text-sm">Vagas totais<input type="number" min={1} className={inp} value={f.seats} onChange={s("seats")} /></label>
        <label className="text-sm">Vagas restantes<input type="number" min={0} className={inp} value={f.spots} onChange={s("spots")} /></label>
        <label className="text-sm md:col-span-3">Descrição<textarea required className="min-h-24 w-full border border-input bg-background p-3 text-sm" value={f.description} onChange={s("description")} /></label>
        <div className="text-sm md:col-span-3">Imagem de capa<ImageUpload value={f.image_url} onChange={(url) => setF({ ...f, image_url: url })} /></div>
        <FormFieldsEditor value={f.form_fields} onChange={(form_fields) => setF({ ...f, form_fields })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} /> Publicado</label>
        <div className="flex gap-3 md:col-span-3"><button className="bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">{save.isPending ? "Salvando…" : "Salvar"}</button>
          <button type="button" onClick={() => setF(null)} className="text-sm underline">Cancelar</button></div>
        {save.error && <p className="text-sm text-destructive md:col-span-3">{(save.error as Error).message}</p>}
      </form>}
      <div className="border border-border bg-background">{data.length === 0 ? <p className="p-6 text-sm text-muted-foreground">Nenhum treinamento cadastrado.</p> : data.map((t) => (
        <div key={t.id} className="border-b border-border p-4 last:border-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1"><p className="font-semibold">{t.title}</p><p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleString("pt-BR")} · {t.format} · {t.spots}/{t.seats} vagas · {t.is_active ? "Publicado" : "Oculto"}</p></div>
            <button className="text-sm underline" onClick={() => setView(view === t.id ? null : t.id)}>Inscrições ({(t.training_registrations as unknown as { count: number }[])?.[0]?.count ?? 0})</button>
            <button className="text-sm underline" onClick={() => setF({ id: t.id, title: t.title, type: t.type, audience: t.audience, date: new Date(t.date).toISOString().slice(0, 16), format: t.format, location: t.location, seats: t.seats, spots: t.spots, description: t.description, is_active: t.is_active, image_url: t.image_url ?? "", form_fields: normalizeFormFields(t.form_fields) })}>Editar</button>
            <button className="text-sm text-destructive underline" onClick={() => confirm("Excluir treinamento e inscrições?") && del.mutate(t.id)}>Excluir</button>
          </div>
          {view === t.id && <div className="mt-3 bg-muted/40 p-3 text-sm">{(regs.data ?? []).length === 0 ? <p className="text-muted-foreground">Sem inscrições.</p> : regs.data!.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-3 border-b border-border py-2 last:border-0">
              <span className="flex-1">{r.name} · {r.company} · {r.email}{r.phone ? ` · ${r.phone}` : ""}{r.is_client ? " · cliente" : ""}{Object.entries((r.answers ?? {}) as Record<string, string>).map(([k, v]) => <span key={k} className="block text-xs text-muted-foreground">{FIELD_LABELS[k as keyof typeof FIELD_LABELS] ?? k}: {v}</span>)}</span>
              <select value={r.status} onChange={(e) => setReg.mutate({ id: r.id, status: e.target.value })} className="h-8 border border-input bg-background px-2">{Object.entries(RS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            </div>))}</div>}
        </div>))}</div>
    </div>
  );
}

const MODES: [FieldMode, string][] = [["off", "Não pedir"], ["optional", "Opcional"], ["required", "Obrigatório"]];
function FormFieldsEditor({ value, onChange }: { value: FormFields; onChange: (v: FormFields) => void }) {
  const keys = Object.keys(FIELD_LABELS) as (keyof typeof FIELD_LABELS)[];
  const setQ = (i: number, q: Partial<FormFields["custom"][number]>) => onChange({ ...value, custom: value.custom.map((c, j) => (j === i ? { ...c, ...q } : c)) });
  return (
    <fieldset className="space-y-3 border border-border p-4 md:col-span-3">
      <legend className="px-1 text-sm font-semibold">Informações pedidas na inscrição</legend>
      <p className="text-xs text-muted-foreground">Nome e e-mail são sempre obrigatórios.</p>
      <div className="grid gap-3 md:grid-cols-3">
        {keys.map((k) => (
          <label key={k} className="text-sm">{FIELD_LABELS[k]}
            <select className={inp} value={value[k]} onChange={(e) => onChange({ ...value, [k]: e.target.value as FieldMode })}>
              {MODES.map(([m, l]) => <option key={m} value={m}>{l}</option>)}
            </select>
          </label>
        ))}
        <label className="flex items-center gap-2 self-end text-sm"><input type="checkbox" checked={value.is_client} onChange={(e) => onChange({ ...value, is_client: e.target.checked })} /> Perguntar "Já é cliente HPRT?"</label>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Perguntas personalizadas</p>
        {value.custom.map((q, i) => (
          <div key={i} className="flex items-center gap-3">
            <input className={inp} placeholder="Ex.: Quais modelos sua equipe usa?" value={q.label} onChange={(e) => setQ(i, { label: e.target.value })} />
            <label className="flex shrink-0 items-center gap-1 text-sm"><input type="checkbox" checked={q.required} onChange={(e) => setQ(i, { required: e.target.checked })} /> Obrigatória</label>
            <button type="button" className="text-sm text-destructive underline" onClick={() => onChange({ ...value, custom: value.custom.filter((_, j) => j !== i) })}>Remover</button>
          </div>
        ))}
        {value.custom.length < 10 && <button type="button" className="text-sm underline" onClick={() => onChange({ ...value, custom: [...value.custom, { label: "", required: false }] })}>+ Adicionar pergunta</button>}
      </div>
    </fieldset>
  );
}
