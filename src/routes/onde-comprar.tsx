import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { PageHero } from "@/components/hprt/PageHero";
import { CtaStrip, Trust } from "@/components/hprt/Catalog";

const SITE = "https://hprtbrasil.lovable.app";
const TITLE = "Onde comprar HPRT no Brasil — distribuição oficial Cogra";
const DESCRIPTION =
  "Distribuição oficial HPRT no Brasil operada pela Cogra: estoque em São Paulo, suporte técnico local e atendimento comercial para projetos de qualquer porte.";

export const Route = createFileRoute("/onde-comprar")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/onde-comprar` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/onde-comprar` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            {
              "@type": "ListItem",
              position: 2,
              name: "Onde comprar",
              item: `${SITE}/onde-comprar`,
            },
          ],
        }),
      },
    ],
  }),
  component: WhereToBuyPage,
});

function WhereToBuyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav onDark />
      <main>
        <PageHero
          eyebrow="Presença local"
          title="Fabricado com escala global, entregue com presença local."
        >
          A operação brasileira da HPRT é conduzida em parceria com a Cogra: estoque físico, suporte
          técnico e time comercial no país — não apenas um catálogo traduzido.
        </PageHero>
        <Trust hideHead />
        <CtaStrip />
      </main>
      <Footer />
    </div>
  );
}
