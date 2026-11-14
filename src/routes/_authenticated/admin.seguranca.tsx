import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/seguranca")({
  head: () => ({ meta: [{ title: "Segurança — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Security /></AdminShell>,
});
const T: Record<string, string> = { banners: "Pop-up", blog_posts: "Artigo", site_settings: "Configuração do site", user_roles: "Acesso de usuário", testimonials: "Depoimento", trainings: "Treinamento" };
const A: Record<string, string> = { INSERT: "Criou", UPDATE: "Alterou", DELETE: "Excluiu" };
function Security() {
  const { data = [], isLoading } = useQuery({ queryKey: ["audit"], queryFn: async () => {
    const { data, error } = await supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(200); if (error) throw error; return data; } });
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-4xl font-bold uppercase">Segurança</h1>
        <p className="text-sm text-muted-foreground">Registro de quem mudou o quê no painel (últimas 200 ações).</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        {[["Acesso ao painel", "Só contas com papel de administrador"], ["Senhas", "Bloqueio de senhas vazadas ativo"], ["Dados de contatos", "Leitura restrita a administradores"]].map(([a, b]) => (
          <div key={a} className="border border-border bg-background p-5"><p className="text-xs uppercase text-muted-foreground">{a}</p><p className="mt-1 font-semibold">{b}</p></div>))}
      </div>
      <div className="border border-border bg-background">
        {isLoading ? <p className="p-6 text-sm">Carregando…</p> : data.length === 0 ? <p className="p-6 text-sm text-muted-foreground">Nenhuma ação registrada ainda.</p> :
          <table className="w-full text-sm"><thead className="border-b border-border text-left text-muted-foreground"><tr><th className="p-3">Quando</th><th className="p-3">Ação</th><th className="p-3">Item</th><th className="p-3">Usuário</th></tr></thead>
            <tbody>{data.map((r) => <tr key={r.id} className="border-b border-border last:border-0"><td className="p-3">{new Date(r.created_at).toLocaleString("pt-BR")}</td>
              <td className="p-3">{A[r.action] ?? r.action}</td><td className="p-3">{T[r.table_name] ?? r.table_name}</td><td className="p-3 font-mono text-xs">{r.user_id?.slice(0, 8) ?? "sistema"}</td></tr>)}</tbody></table>}
      </div>
    </div>
  );
}
