import { createFileRoute, redirect } from "@tanstack/react-router";

// Endereço do site antigo (WordPress).
export const Route = createFileRoute("/sobre")({
  beforeLoad: () => {
    throw redirect({ to: "/por-que-hprt", statusCode: 301 });
  },
});
