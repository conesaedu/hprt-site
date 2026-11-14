import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { InboxPage } from "@/components/admin/InboxPage";

export const Route = createFileRoute("/_authenticated/admin/revendas")({
  head: () => ({ meta: [{ title: "Revendas — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><InboxPage table="reseller_applications" title="Revendas" intro="Empresas que pediram para revender HPRT pelo formulário Seja revenda."
    columns={[{ key: "company", label: "Empresa" }, { key: "contact_name", label: "Contato" }, { key: "cnpj", label: "CNPJ" }, { key: "email", label: "E-mail" }, { key: "phone", label: "Telefone" },
      { key: "city", label: "Cidade" }, { key: "state", label: "UF" }, { key: "segment", label: "Segmento" }, { key: "monthly_volume", label: "Volume/mês" }, { key: "message", label: "Mensagem" }]} /></AdminShell>,
});
