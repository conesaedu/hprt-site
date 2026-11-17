import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAdminStatus } from "@/lib/admin.functions";
import { ROLE_LABEL, canOpen } from "@/lib/admin-access";

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
  { to: "/admin/downloads", label: "Downloads", ready: true },
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
  const { pathname } = useLocation();
  const role = status.data?.role ?? null;

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
          {nav.filter((n) => canOpen(role, n.to)).map((n) => (
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
          {role && <p className="text-background/60">{ROLE_LABEL[role]}</p>}
          <button onClick={signOut} className="underline">Sair</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-x-auto">
        {status.isLoading ? <p className="text-muted-foreground">Carregando…</p>
          : !role ? (
            <div className="max-w-md bg-background p-8 border border-border">
              <h1 className="font-display text-2xl font-bold uppercase">Acesso pendente</h1>
              <p className="mt-2 text-sm text-muted-foreground">Sua conta ainda não tem permissão no painel. Peça a liberação a um administrador.</p>
            </div>
          ) : !canOpen(role, pathname) ? (
            <div className="max-w-md bg-background p-8 border border-border">
              <h1 className="font-display text-2xl font-bold uppercase">Área restrita</h1>
              <p className="mt-2 text-sm text-muted-foreground">Seu papel ({ROLE_LABEL[role]}) não tem acesso a esta seção.</p>
            </div>
          ) : children}
      </main>
    </div>
  );
}
