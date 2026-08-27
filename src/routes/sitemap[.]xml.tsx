import { createFileRoute } from "@tanstack/react-router";
import { productSummaries as products } from "@/lib/products/summary";

const SITE = "https://hprtbrasil.lovable.app";

const staticPaths = [
  "/",
  "/produtos",
  "/por-que-hprt",
  "/solucoes",
  "/onde-comprar",
  "/treinamentos",
  "/downloads",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = [...staticPaths, ...products.map((p) => `/produtos/${p.slug}`)];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join("\n")}
</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
