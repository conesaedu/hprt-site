import { createFileRoute } from "@tanstack/react-router";
import { CtaStrip, Products, Solutions, Trust } from "@/components/hprt/Catalog";
import { Footer } from "@/components/hprt/Footer";
import { Hero } from "@/components/hprt/Hero";
import { Nav } from "@/components/hprt/Nav";
import { GlobalTrust, Positioning, Stats } from "@/components/hprt/Sections";

const title = "HPRT Brasil — Impressão térmica e captura de dados";
const description =
  "Impressoras térmicas, coletores de dados, leitores de código de barras e etiquetas HPRT, com estoque, suporte técnico e distribuição no Brasil.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "HPRT Brasil",
          description,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Rua Luiz Seraphico Jr., 511 — Jardim Caravelas",
            addressLocality: "São Paulo",
            addressRegion: "SP",
            addressCountry: "BR",
          },
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Positioning />
        <GlobalTrust />
        <Products />
        <Solutions />
        <Trust />
        <CtaStrip />
      </main>
      <Footer />
    </div>
  );
}
