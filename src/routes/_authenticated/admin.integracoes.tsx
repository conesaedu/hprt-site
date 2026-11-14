import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/admin/integracoes")({
  head: () => ({ meta: [{ title: "Integrações — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Integrations /></AdminShell>,
});

const items = [
  { name: "Leads do site", status: "Ativo", on: true, text: "Formulário de Onde comprar grava aqui no painel, em Leads." },
  { name: "Analytics próprio", status: "Ativo", on: true, text: "Visitas, produtos vistos, cliques no WhatsApp e downloads." },
  { name: "RVOPS (CRM)", status: "Preparado · desconectado", on: false, text: "Envio automático de leads para o CRM. Será ligado quando definirmos como separar HPRT e Cogra no funil." },
  { name: "Google Search Console", status: "Pendente", on: false, text: "Acompanhamento de buscas no Google. Conectar após publicar no domínio definitivo." },
];

function Integrations() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-bold uppercase">Integrações</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((i) => (
          <div key={i.name} className="border border-border bg-background p-6">
            <div className="flex items-center justify-between"><p className="font-display text-xl font-bold uppercase">{i.name}</p>
              <span className={`px-2 py-0.5 text-xs font-semibold ${i.on ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{i.status}</span></div>
            <p className="mt-2 text-sm text-muted-foreground">{i.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
