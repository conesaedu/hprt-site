import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CtaStrip, Products, Solutions, Trust } from "@/components/hprt/Catalog";
import { Footer } from "@/components/hprt/Footer";
import { Hero } from "@/components/hprt/Hero";
import { Nav } from "@/components/hprt/Nav";
import { Positioning, Stats } from "@/components/hprt/Sections";
import { Btn, Eyebrow } from "@/components/hprt/ui";

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
      { property: "og:url", content: "https://hprtbrasil.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://hprtbrasil.lovable.app/" }],
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

const hashRedirects: Record<string, string> = {
  positioning: "/por-que-hprt",
  solutions: "/solucoes",
  trust: "/onde-comprar",
  products: "/produtos",
};

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const target = hashRedirects[window.location.hash.replace("#", "")];
    if (target) navigate({ to: target, replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Positioning preview />
        <Products limit={8} />
        <Solutions preview />
        <Trust compact />
        <CtaStrip />
        <TrainingCta />
      </main>
      <Footer />
    </div>
  );
}

function TrainingCta() {
  return (
    <section className="border-y border-border bg-surface py-24">
      <div className="wrap flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-[36rem]">
          <Eyebrow className="mb-4">Capacitação</Eyebrow>
          <h2 className="mb-3 text-[1.75rem] leading-tight font-semibold">
            Treine sua equipe com quem fabrica a tecnologia.
          </h2>
          <p className="text-muted-foreground">
            Treinamentos técnicos e comerciais HPRT, gratuitos para clientes que compram conosco.
            Inscreva-se e reserve a vaga da sua equipe.
          </p>
        </div>
        <Btn href="/treinamentos">Ver agenda de treinamentos</Btn>
      </div>
    </section>
  );
}
