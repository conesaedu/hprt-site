import { createFileRoute } from "@tanstack/react-router";
import { productSummaries } from "@/lib/products/summary";

const BASE = "https://hprtbrasil.com.br";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () => {
        const products = productSummaries
          .map((p) => `- [${p.name}](${BASE}/produtos/${p.slug}): ${p.tagline} (${p.categoryLabel}; ${p.spec}).`)
          .join("\n");
        const body = `# HPRT Brasil

> Site oficial da HPRT (Hanin) no Brasil: impressoras de etiquetas, cupom, pulseiras, cartões e fotos, coletores de dados, leitores de código de barras e embaladoras para operações B2B. Distribuição e suporte local pela Cogra.

## Páginas
- [Início](${BASE}/): Visão geral da HPRT Brasil e das linhas de produto.
- [Por que HPRT](${BASE}/por-que-hprt): Fabricante global com estrutura, peças e suporte no Brasil.
- [Produtos](${BASE}/produtos): Portfólio completo com ${productSummaries.length} modelos.
- [Soluções](${BASE}/solucoes): Produtos por operação (logística, indústria, varejo, saúde).
- [Treinamentos](${BASE}/treinamentos): Agenda de treinamentos.
- [Downloads](${BASE}/downloads): Drivers e materiais técnicos.
- [Onde comprar](${BASE}/onde-comprar): Contato comercial e WhatsApp.

## Produtos
${products}
`;
        return new Response(body, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
