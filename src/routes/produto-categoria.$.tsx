import { createFileRoute, redirect } from "@tanstack/react-router";
import { legacyCategory } from "@/lib/legacy-redirects";

export const Route = createFileRoute("/produto-categoria/$")({
  beforeLoad: ({ params }) => {
    const linha = legacyCategory(params._splat ?? "");
    throw redirect({ to: "/produtos", search: { linha: linha ?? "all" }, statusCode: 301 });
  },
});
