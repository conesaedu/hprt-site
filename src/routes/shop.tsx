import { createFileRoute, redirect } from "@tanstack/react-router";

// Endereço do site antigo (WordPress).
export const Route = createFileRoute("/shop")({
  beforeLoad: () => {
    throw redirect({ to: "/produtos", search: { linha: "all" }, statusCode: 301 });
  },
});
