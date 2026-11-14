import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { InboxPage } from "@/components/admin/InboxPage";

export const Route = createFileRoute("/_authenticated/admin/cotacoes")({
  head: () => ({ meta: [{ title: "Cotações — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><InboxPage table="quote_requests" title="Cotações" intro="Pedidos de orçamento feitos nas páginas de produto."
    columns={[{ key: "product_name", label: "Produto" }, { key: "company", label: "Empresa" }, { key: "name", label: "Contato" }, { key: "quantity", label: "Quantidade" },
      { key: "email", label: "E-mail" }, { key: "phone", label: "Telefone" }, { key: "message", label: "Mensagem" }]} /></AdminShell>,
});
