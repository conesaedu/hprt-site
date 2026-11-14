import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAdminStatus } from "@/lib/admin.functions";

const nav = [
  { to: "/admin", label: "Visão geral", ready: true },
  { to: "/admin/leads", label: "Leads", ready: true },
  { to: "/admin/cotacoes", label: "Cotações", ready: true },
  { to: "/admin/revendas", label: "Revendas", ready: true },
  { to: "/admin/treinamentos", label: "Treinamentos", ready: true },
  { to: "/admin/analytics", label: "Analytics", ready: true },
  { to: "/admin/banners", label: "Pop-ups e banners", ready: true },
  { to: "/admin/blog", label: "Blog", ready: true },
  { to: "/admin/depoimentos", label: "Depoimentos", ready: true },
  { to: "/admin/midia", label: "Mídia", ready: true },
  { to: "/admin/site", label: "Personalizar site", ready: true },
  { to: "/admin/usuarios", label: "Usuários", ready: true },
  { to: "/admin/seguranca", label: "Segurança", ready: true },
  { to: "/admin/integracoes", label: "Integrações", ready: true },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const fetchStatus = useServerFn(getAdminStatus);
  const status = useQuery({ queryKey: ["admin-status"], queryFn: () => fetchStatus() });
  const qc = useQueryClient();
  const navigate = useNavigate();

  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { redirect: undefined }, replace: true });
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-60 shrink-0 bg-foreground text-background flex flex-col">
        <div className="p-5 border-b border-background/10">
          <p className="font-display text-xl font-bold uppercase">HPRT <span className="text-primary">Admin</span></p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/admin" }}
              className="block px-3 py-2 text-sm hover:bg-background/10"
              activeProps={{ className: "block px-3 py-2 text-sm bg-primary text-primary-foreground" }}>
              {n.label}
            </Link>
          ))}
          <a href="/" target="_blank" rel="noreferrer" className="mt-5 block px-3 py-2 text-sm text-background/60 hover:text-background">Ver site ↗</a>
        </nav>
        <div className="p-4 border-t border-background/10 text-xs space-y-2">
          <p className="truncate text-background/60">{status.data?.email}</p>
          <button onClick={signOut} className="underline">Sair</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-x-auto">
        {status.isLoading ? <p className="text-muted-foreground">Carregando…</p>
          : !status.data?.isAdmin ? (
            <div className="max-w-md bg-background p-8 border border-border">
              <h1 className="font-display text-2xl font-bold uppercase">Acesso pendente</h1>
              <p className="mt-2 text-sm text-muted-foreground">Sua conta foi criada, mas ainda não tem permissão de administrador. Peça a liberação ao responsável.</p>
            </div>
          ) : children}
      </main>
    </div>
  );
}
