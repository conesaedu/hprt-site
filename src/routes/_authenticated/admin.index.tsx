import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/admin/AdminShell";
import { listLeads } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Painel — HPRT Brasil" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Overview /></AdminShell>,
});

function Overview() {
  const fetchLeads = useServerFn(listLeads);
  const { data = [] } = useQuery({ queryKey: ["leads"], queryFn: () => fetchLeads() });
  const week = Date.now() - 7 * 864e5;
  const cards = [
    { label: "Leads totais", value: data.length },
    { label: "Novos (sem atendimento)", value: data.filter((l) => l.status === "new").length },
    { label: "Últimos 7 dias", value: data.filter((l) => new Date(l.created_at).getTime() > week).length },
  ];
  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl font-bold uppercase">Visão geral</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-background border border-border p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
            <p className="mt-2 font-display text-5xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
      <Link to="/admin/leads" className="inline-block bg-primary px-5 py-3 text-sm font-semibold uppercase text-primary-foreground">Ver leads</Link>
    </div>
  );
}
