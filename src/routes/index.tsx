import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Footer } from "@/components/hprt/Footer";
import { HomeCapability, HomeContact, HomeFamilies, HomeFlagship, HomeHero, HomeNetwork, HomeSegments } from "@/components/hprt/home/HomeSections";
import { Nav } from "@/components/hprt/Nav";
import coletorImg from "@/assets/hero-coletor-logistica.webp";

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
      { property: "og:url", content: "https://hprtbrasil.com.br/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://hprtbrasil.com.br/" },
      { rel: "preload", as: "image", href: coletorImg, fetchpriority: "high" },
    ],
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
      <Nav onDark />
      <main>
        <HomeHero />
        <HomeFamilies />
        <HomeSegments />
        <HomeCapability />
        <HomeFlagship />
        <HomeNetwork />
        <HomeContact />
      </main>
      <Footer />
    </div>
  );
}

