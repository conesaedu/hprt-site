import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { PageHero } from "@/components/hprt/PageHero";
import { CtaStrip, Products, Solutions } from "@/components/hprt/Catalog";

const SITE = "https://hprtbrasil.lovable.app";
const TITLE = "Soluções HPRT por setor — varejo, logística, saúde e food";
const DESCRIPTION =
  "Impressão térmica, etiquetagem e captura de dados HPRT aplicadas a varejo, logística, saúde e alimentação, com suporte técnico e estoque no Brasil.";

export const Route = createFileRoute("/solucoes")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/solucoes` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/solucoes` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            { "@type": "ListItem", position: 2, name: "Soluções", item: `${SITE}/solucoes` },
          ],
        }),
      },
    ],
  }),
  component: SolutionsPage,
});

function SolutionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav onDark />
      <main>
        <PageHero
          eyebrow="Soluções por setor"
          title="A mesma marca resolve operações muito diferentes."
        >
          Do chão de fábrica ao balcão do PDV, o portfólio HPRT cobre etiquetagem, identificação,
          coleta de dados e impressão de cupom dentro do mesmo ecossistema de fabricante.
        </PageHero>
        <Solutions hideHead />
        <Products limit={8} />
        <CtaStrip />
      </main>
      <Footer />
    </div>
  );
}
