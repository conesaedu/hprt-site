import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, ImageUpload, field } from "@/components/admin/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { Markdown } from "@/lib/markdown";

export const Route = createFileRoute("/_authenticated/admin/blog/$id")({
  head: () => ({ meta: [{ title: "Editar artigo — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Editor /></AdminShell>,
});

const slugify = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
type F = { title: string; slug: string; excerpt: string; content: string; cover_url: string; category: string; seo_title: string; seo_description: string; status: string; published_at: string };

function Editor() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [f, setF] = useState<F | null>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [saved, setSaved] = useState("");
  const q = useQuery({ queryKey: ["admin-post", id], queryFn: async () => { const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single(); if (error) throw error; return data; } });
  useEffect(() => {
    const p = q.data; if (!p || f) return;
    setF({ title: p.title, slug: p.slug, excerpt: p.excerpt ?? "", content: p.content, cover_url: p.cover_url ?? "", category: p.category ?? "", seo_title: p.seo_title ?? "", seo_description: p.seo_description ?? "", status: p.status, published_at: p.published_at ? new Date(p.published_at).toISOString().slice(0, 16) : "" });
  }, [q.data, f]);

  const save = useMutation({
    mutationFn: async (v: F) => {
      const published_at = v.status === "published" ? (v.published_at ? new Date(v.published_at).toISOString() : new Date().toISOString()) : (v.published_at ? new Date(v.published_at).toISOString() : null);
      const { error } = await supabase.from("blog_posts").update({ title: v.title, slug: slugify(v.slug || v.title), excerpt: v.excerpt || null, content: v.content, cover_url: v.cover_url || null, category: v.category || null, seo_title: v.seo_title || null, seo_description: v.seo_description || null, status: v.status, published_at, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw new Error(error.message.includes("duplicate") ? "Já existe um artigo com este endereço." : error.message);
    },
    onSuccess: () => { setSaved(new Date().toLocaleTimeString("pt-BR")); qc.invalidateQueries({ queryKey: ["admin-posts"] }); },
  });
  const del = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("blog_posts").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => navigate({ to: "/admin/blog" }),
  });

  if (!f) return <p className="text-muted-foreground">Carregando…</p>;
  const set = (p: Partial<F>) => setF({ ...f, ...p });
  const seoT = f.seo_title || f.title; const seoD = f.seo_description || f.excerpt;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/blog" className="text-sm underline">← Todos os artigos</Link>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-muted-foreground">Salvo às {saved}</span>}
          {f.status === "published" && <a href={`/blog/${slugify(f.slug)}`} target="_blank" rel="noreferrer" className="text-sm underline">Ver no site</a>}
          <button onClick={() => confirm("Excluir este artigo?") && del.mutate()} className="text-sm text-destructive underline">Excluir</button>
          <button onClick={() => save.mutate({ ...f, status: "draft" })} className="border border-input px-4 py-2 text-sm">Salvar rascunho</button>
          <button onClick={() => { set({ status: "published" }); save.mutate({ ...f, status: "published" }); }} className="bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{f.status === "published" ? "Atualizar publicação" : "Publicar"}</button>
        </div>
      </div>
      {save.error && <p className="text-sm text-destructive">{(save.error as Error).message}</p>}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5 border border-border bg-background p-6">
          <input value={f.title} onChange={(e) => set({ title: e.target.value })} placeholder="Título" className="w-full border-0 bg-transparent font-display text-4xl font-bold uppercase outline-none" />
          <Field label="Resumo"><textarea rows={2} maxLength={300} className={field} value={f.excerpt} onChange={(e) => set({ excerpt: e.target.value })} /></Field>
          <div className="flex gap-4 border-b border-border text-sm">
            {(["edit", "preview"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={`pb-2 ${tab === t ? "border-b-2 border-primary font-semibold" : "text-muted-foreground"}`}>{t === "edit" ? "Escrever" : "Pré-visualizar"}</button>)}
          </div>
          {tab === "edit" ? (
            <>
              <textarea rows={22} className={`${field} font-sans leading-relaxed`} value={f.content} onChange={(e) => set({ content: e.target.value })} placeholder="Escreva o artigo aqui…" />
              <p className="text-xs text-muted-foreground">Dicas: linha começando com <b>## </b> vira subtítulo · <b>- </b> vira lista · <b>**texto**</b> fica em negrito · <b>[texto](https://link)</b> vira link · linha em branco separa parágrafos.</p>
            </>
          ) : <Markdown source={f.content} />}
        </div>
        <aside className="space-y-5">
          <div className="space-y-4 border border-border bg-background p-5">
            <Field label="Endereço" hint={`/blog/${slugify(f.slug || f.title)}`}><div className="flex gap-2"><input className={field} value={f.slug} onChange={(e) => set({ slug: e.target.value })} /><button type="button" onClick={() => set({ slug: slugify(f.title) })} className="border border-input px-2 text-xs">Do título</button></div></Field>
            <Field label="Categoria"><input className={field} list="cats" value={f.category} onChange={(e) => set({ category: e.target.value })} />
              <datalist id="cats"><option>Logística</option><option>Indústria</option><option>Varejo</option><option>Saúde</option><option>Tecnologia</option><option>Novidades</option></datalist></Field>
            <Field label="Data de publicação" hint="Data futura = artigo agendado."><input type="datetime-local" className={field} value={f.published_at} onChange={(e) => set({ published_at: e.target.value })} /></Field>
            <Field label="Imagem de capa"><ImageUpload value={f.cover_url} onChange={(u) => set({ cover_url: u })} /></Field>
          </div>
          <div className="space-y-4 border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-wider">Google</p>
            <Field label={`Título SEO (${seoT.length}/60)`}><input className={field} value={f.seo_title} onChange={(e) => set({ seo_title: e.target.value })} placeholder={f.title} /></Field>
            <Field label={`Descrição SEO (${seoD.length}/160)`}><textarea rows={3} className={field} value={f.seo_description} onChange={(e) => set({ seo_description: e.target.value })} placeholder={f.excerpt} /></Field>
            <div className="border border-border p-3">
              <p className="text-xs text-muted-foreground">hprtbrasil.com.br › blog › {slugify(f.slug || f.title)}</p>
              <p className="truncate text-base text-[color:var(--color-primary)]">{seoT.slice(0, 60)}</p>
              <p className="line-clamp-2 text-xs text-muted-foreground">{seoD.slice(0, 160) || "Sem descrição."}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
