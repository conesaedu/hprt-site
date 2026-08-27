import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { ProductCard } from "@/components/hprt/ProductCard";
import { Eyebrow } from "@/components/hprt/ui";
import { productCategories, productSummaries } from "@/lib/products/summary";
import { cn } from "@/lib/utils";

const SITE = "https://hprtbrasil.lovable.app";
const TITLE = "Portfólio HPRT — 25 modelos de impressão e identificação";
const DESCRIPTION =
  "Impressoras de etiquetas, cupom, cartões, pulseiras, coletores e leitores HPRT. Especificações completas, drivers e suporte técnico no Brasil.";

export const Route = createFileRoute("/produtos/")({
  validateSearch: (search: Record<string, unknown>) => ({
    linha: typeof search.linha === "string" && search.linha ? search.linha : "all",
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/produtos` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/produtos` }],
  }),
  component: ProductIndex,
});

function ProductIndex() {
  const { linha } = Route.useSearch();
  const active = productCategories.some((c) => c.id === linha) ? linha : "all";
  const visible = productSummaries.filter((p) => active === "all" || p.category === active);
  const cats = productCategories.filter(
    (c) => c.id === "all" || productSummaries.some((p) => p.category === c.id),
  );

  return (
    <div className="min-h-screen bg-background">
      <Nav onDark />
      <main>
        <section className="relative overflow-hidden bg-ink pb-16 pt-36 text-on-ink md:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-rule opacity-60" aria-hidden />
          <div className="wrap relative">
            <span className="mb-5 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-on-ink-muted">
              <span className="inline-block size-[7px] rotate-45 rounded-[1px] bg-signal" />
              Portfólio · {productSummaries.length} modelos
            </span>
            <h1 className="mb-6 text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[0.95] text-on-ink">
              Toda a operação de impressão e identificação em uma única marca.
            </h1>
            <p className="text-[1.0625rem] leading-relaxed text-on-ink-muted">
              Do chão de fábrica ao balcão do PDV: cada modelo com ficha técnica completa, drivers
              oficiais e suporte técnico local.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="wrap">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <Eyebrow>Filtrar por linha</Eyebrow>
              <span className="font-mono text-[0.72rem] text-faint">
                {String(visible.length).padStart(2, "0")} modelos
              </span>
            </div>

            <div className="mb-10 flex flex-wrap gap-2.5">
              {cats.map((c) => (
                <Link
                  key={c.id}
                  to="/produtos"
                  search={c.id === "all" ? { linha: "all" } : { linha: c.id }}
                  className={cn(
                    "rounded-full border bg-background px-4 py-2 font-mono text-[0.78rem] transition-colors",
                    active === c.id
                      ? "border-foreground text-foreground"
                      : "border-border-strong text-muted-foreground hover:border-foreground hover:text-foreground",
                  )}
                >
                  {c.label}
                </Link>
              ))}
            </div>

            <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
