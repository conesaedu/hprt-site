import { createFileRoute, redirect } from "@tanstack/react-router";
import { legacyProductSlug } from "@/lib/legacy-redirects";

export const Route = createFileRoute("/produto/$")({
  beforeLoad: ({ params }) => {
    const slug = legacyProductSlug(params._splat ?? "");
    if (slug) throw redirect({ to: "/produtos/$slug", params: { slug }, statusCode: 301 });
    throw redirect({ to: "/produtos", search: { linha: "all" }, statusCode: 301 });
  },
});
