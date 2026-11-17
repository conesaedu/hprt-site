import { createFileRoute, redirect } from "@tanstack/react-router";

// Endereço do site antigo (WordPress).
export const Route = createFileRoute("/suporte-tecnico")({
  beforeLoad: () => {
    throw redirect({ to: "/suporte", statusCode: 301 });
  },
});
