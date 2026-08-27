import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { PageHero } from "@/components/hprt/PageHero";
import { CtaStrip } from "@/components/hprt/Catalog";
import { GlobalTrust, Positioning, Stats } from "@/components/hprt/Sections";

const SITE = "https://hprtbrasil.lovable.app";
const TITLE = "Por que HPRT — tecnologia global com estrutura no Brasil";
const DESCRIPTION =
  "Engenharia própria, 56 linhas de produção, estoque de peças e suporte técnico no Brasil: os pilares que sustentam a HPRT dentro de operações críticas.";

export const Route = createFileRoute("/por-que-hprt")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/por-que-hprt` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/por-que-hprt` }],
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
              name: "Por que HPRT",
              item: `${SITE}/por-que-hprt`,
            },
          ],
        }),
      },
    ],
  }),
  component: WhyPage,
});

function WhyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav onDark />
      <main>
        <PageHero eyebrow="Por que HPRT?" title="Tecnologia global para competir. Estrutura local para permanecer.">
          Adotar uma nova tecnologia em uma operação crítica exige mais do que comparar
          especificações. Disponibilidade, suporte, peças e continuidade também fazem parte da
          decisão.
        </PageHero>
        <Stats />
        <Positioning hideHead />
        <GlobalTrust />
        <CtaStrip />
      </main>
      <Footer />
    </div>
  );
}
