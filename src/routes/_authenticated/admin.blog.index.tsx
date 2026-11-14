import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/blog/")({
  head: () => ({ meta: [{ title: "Blog — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Posts /></AdminShell>,
});

function Posts() {
  const navigate = useNavigate();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => { const { data, error } = await supabase.from("blog_posts").select("id,title,slug,status,published_at,updated_at,category").order("updated_at", { ascending: false }); if (error) throw error; return data; },
  });
  const create = useMutation({
    mutationFn: async () => {
      const slug = `novo-artigo-${Date.now().toString(36)}`;
      const { data, error } = await supabase.from("blog_posts").insert({ title: "Novo artigo", slug }).select("id").single();
      if (error) throw error; return data.id;
    },
    onSuccess: (id) => navigate({ to: "/admin/blog/$id", params: { id } }),
  });
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div><h1 className="font-display text-4xl font-bold uppercase">Blog</h1><p className="text-sm text-muted-foreground">Artigos técnicos e novidades publicados em /blog.</p></div>
        <button onClick={() => create.mutate()} disabled={create.isPending} className="bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">+ Novo artigo</button>
      </div>
      <div className="border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-3">Título</th><th className="p-3">Categoria</th><th className="p-3">Status</th><th className="p-3">Atualizado</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={4} className="p-6 text-muted-foreground">Carregando…</td></tr>}
            {!isLoading && data.length === 0 && <tr><td colSpan={4} className="p-6 text-muted-foreground">Nenhum artigo ainda.</td></tr>}
            {data.map((p) => {
              const scheduled = p.status === "published" && p.published_at && new Date(p.published_at) > new Date();
              return (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3"><Link to="/admin/blog/$id" params={{ id: p.id }} className="font-semibold hover:text-primary">{p.title}</Link><p className="text-xs text-muted-foreground">/blog/{p.slug}</p></td>
                  <td className="p-3">{p.category || "—"}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 text-xs font-semibold ${p.status === "published" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{scheduled ? "Agendado" : p.status === "published" ? "Publicado" : "Rascunho"}</span></td>
                  <td className="p-3 text-muted-foreground">{new Date(p.updated_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
