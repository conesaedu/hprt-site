import { createFileRoute, redirect } from "@tanstack/react-router";

// Endereço do site antigo (WordPress).
export const Route = createFileRoute("/contato")({
  beforeLoad: () => {
    throw redirect({ to: "/onde-comprar", statusCode: 301 });
  },
});
