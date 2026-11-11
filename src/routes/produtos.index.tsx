import { ArrowUpRight } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { useState } from "react";
import { Search } from "lucide-react";
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
  const [q, setQ] = useState("");
  const active = productCategories.some((c) => c.id === linha) ? linha : "all";
  const term = q.trim().toLowerCase();
  const visible = productSummaries.filter(
    (p) =>
      (active === "all" || p.category === active) &&
      (!term || `${p.name} ${p.tagline} ${p.categoryLabel} ${p.spec}`.toLowerCase().includes(term)),
  );
  const cats = productCategories.filter(
    (c) => c.id === "all" || productSummaries.some((p) => p.category === c.id),
  );
  const groups = cats
    .filter((c) => c.id !== "all")
    .map((c) => ({ ...c, items: visible.filter((p) => p.category === c.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Nav onDark />
      <main>
        <section className="bg-ink pb-20 pt-36 text-on-ink md:pt-44">
          <div className="wrap grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-end">
            <div>
              <p className="mb-6 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-signal">
                Portfólio HPRT Brasil
              </p>
              <h1 className="text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.92] text-on-ink">
                Engenharia de impressão e identificação.
              </h1>
            </div>
            <div className="border-l border-on-ink/20 pl-6">
              <p className="mb-6 text-[1.0625rem] leading-relaxed text-on-ink-muted">
                Do chão de fábrica ao balcão do PDV: ficha técnica completa, drivers oficiais e suporte técnico local.
              </p>
              <div className="flex gap-10">
                <div>
                  <div className="font-display text-[2.5rem] font-semibold leading-none">{productSummaries.length}</div>
                  <div className="mt-1 text-[0.75rem] uppercase tracking-[0.08em] text-on-ink-muted">modelos</div>
                </div>
                <div>
                  <div className="font-display text-[2.5rem] font-semibold leading-none">{cats.length - 1}</div>
                  <div className="mt-1 text-[0.75rem] uppercase tracking-[0.08em] text-on-ink-muted">linhas</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="wrap flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <nav className="-mb-4 flex gap-6 overflow-x-auto lg:mb-0" aria-label="Linhas de produto">
              {cats.map((c) => (
                <Link
                  key={c.id}
                  to="/produtos"
                  search={{ linha: c.id }}
                  className={cn(
                    "whitespace-nowrap border-b-2 pb-3 text-[0.85rem] font-semibold uppercase tracking-[0.04em] transition-colors lg:pb-2",
                    active === c.id
                      ? "border-signal text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c.label}
                </Link>
              ))}
            </nav>
            <label className="flex w-full items-center gap-2 border border-border-strong px-3 py-2 lg:w-72">
              <Search className="size-4 text-faint" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar modelo (ex.: GRAND, M4)"
                className="w-full bg-transparent text-[0.9rem] outline-none placeholder:text-faint"
              />
            </label>
          </div>
        </div>

        <section className="py-16 md:py-20">
          <div className="wrap space-y-20">
            {groups.length === 0 && (
              <p className="py-20 text-center text-muted-foreground">Nenhum modelo encontrado para “{q}”.</p>
            )}
            {groups.map((g, i) => (
              <div key={g.id}>
                <div className="mb-8 flex items-baseline justify-between gap-6 border-b-2 border-foreground pb-4">
                  <h2 className="text-[clamp(1.5rem,2.6vw,2.25rem)] uppercase leading-none">
                    <span className="mr-4 text-signal">{String(i + 1).padStart(2, "0")}</span>
                    {g.label}
                  </h2>
                  <span className="text-[0.8rem] text-muted-foreground">
                    {g.items.length} {g.items.length === 1 ? "modelo" : "modelos"}
                  </span>
                </div>
                <ul className="divide-y divide-border border-b border-border">
                  {g.items.map((p) => (
                    <li key={p.slug}>
                      <Link
                        to="/produtos/$slug"
                        params={{ slug: p.slug }}
                        className="group grid grid-cols-[96px_1fr_auto] items-center gap-5 py-5 transition-colors hover:bg-surface md:grid-cols-[180px_1.1fr_1fr_1fr_auto] md:gap-8 md:px-4"
                      >
                        <div className="flex aspect-[4/3] items-center justify-center bg-surface">
                          <img src={p.thumb} alt={`HPRT ${p.name} — ${p.tagline}`} loading="lazy" decoding="async" width={180} height={135} className="max-h-[82%] w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div>
                          <h3 className="font-display text-[clamp(1.5rem,2.4vw,2.25rem)] font-semibold uppercase leading-none tracking-tight">{p.name}</h3>
                          {p.category === "etiquetas-industrial" && (
                            <span className="mt-2 inline-block text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-signal">Cabeça Kyocera</span>
                          )}
                          <p className="mt-2 text-[0.85rem] text-muted-foreground md:hidden">{p.tagline}</p>
                        </div>
                        <p className="hidden text-[0.95rem] leading-snug text-muted-foreground md:block">{p.tagline}</p>
                        <div className="hidden md:block">
                          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-faint">Especificação-chave</div>
                          <div className="mt-1 text-[0.95rem] font-medium">{p.spec}</div>
                        </div>
                        <span className="flex size-10 items-center justify-center border border-border-strong transition-colors group-hover:border-signal group-hover:bg-signal group-hover:text-background">
                          <ArrowUpRight className="size-4" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
