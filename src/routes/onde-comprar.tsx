import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { PageHero } from "@/components/hprt/PageHero";
import { Trust } from "@/components/hprt/Catalog";
import { ContactForm, WHATSAPP_LABEL, WHATSAPP_URL } from "@/components/hprt/ContactForm";


const SITE = "https://hprtbrasil.com.br";
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
        <section className="border-b border-border py-16">
          <div className="wrap flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <h2 className="max-w-[32rem] text-[1.75rem] leading-snug">
              Dois caminhos para falar com o time: formulário ou WhatsApp.
            </h2>
            <div className="flex flex-wrap gap-3.5">
              <a
                href="#contato"
                className="inline-flex items-center rounded-sm bg-signal px-6 py-3 text-sm font-semibold text-primary-foreground transition-[transform,background-color] hover:-translate-y-px hover:bg-signal-soft"
              >
                Preencher formulário
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center rounded-sm border border-border-strong px-6 py-3 text-sm font-semibold transition-colors hover:border-signal hover:text-signal"
              >
                WhatsApp {WHATSAPP_LABEL}
              </a>
            </div>
          </div>
        </section>
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}

