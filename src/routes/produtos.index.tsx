import { ArrowUpRight } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { useState } from "react";
import { Search } from "lucide-react";
import { productSummaries } from "@/lib/products/summary";
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

const FAMILIES = [
  {
    id: "industrial",
    n: "01",
    label: "Industrial pesada",
    claim: "Volume contínuo, 24/7, no chão de fábrica.",
    text: "Chassi metálico, mecanismo de alto ciclo e cabeça de impressão Kyocera nas linhas NEO, GALA e GRAND. A DELTA cobre etiquetas largas de até 168 mm.",
    tags: ["Cabeça Kyocera", "Chassi metálico", "Até 14 ips", "Operação 24/7"],
    cats: ["etiquetas-industrial"],
  },
  {
    id: "desktop",
    n: "02",
    label: "Desktop e ponto de venda",
    claim: "Compactas para expedição, balcão e PDV.",
    text: "Etiquetas de entrada, cupom térmico e impressão A4 portátil sem cartucho — para operações que precisam de confiabilidade em pouco espaço.",
    tags: ["Térmica direta", "Sem ribbon", "USB / Bluetooth"],
    cats: ["etiquetas-entrada", "cupom", "a4"],
  },
  {
    id: "mobilidade",
    n: "03",
    label: "Mobilidade e captura",
    claim: "Dados capturados onde a operação acontece.",
    text: "Coletores Android robustos e leitores 1D/2D para recebimento, inventário, picking e frente de caixa.",
    tags: ["Android", "Imager 2D", "Uso em campo"],
    cats: ["coletores", "leitores"],
  },
  {
    id: "especializada",
    n: "04",
    label: "Identificação especializada",
    claim: "Aplicações específicas, mesma engenharia.",
    text: "Pulseiras hospitalares, cartões, fotos por sublimação e embaladora automática para e-commerce.",
    tags: ["Saúde", "Credenciais", "Fotos", "Embalagem"],
    cats: ["pulseiras", "cartao", "fotos", "embaladora"],
  },
] as const;

const KYOCERA = new Set(["grand", "gala", "neo"]);

function ProductIndex() {
  const { linha } = Route.useSearch();
  const [q, setQ] = useState("");
  const fromCat = FAMILIES.find((f) => (f.cats as readonly string[]).includes(linha));
  const active = FAMILIES.some((f) => f.id === linha) ? linha : fromCat ? fromCat.id : "all";
  const term = q.trim().toLowerCase();
  const families = FAMILIES.filter((f) => active === "all" || f.id === active)
    .map((f) => ({
      ...f,
      items: productSummaries.filter(
        (p) =>
          (f.cats as readonly string[]).includes(p.category) &&
          (!fromCat || p.category === linha) &&
          (!term || `${p.name} ${p.tagline} ${p.categoryLabel} ${p.spec}`.toLowerCase().includes(term)),
      ),
    }))
    .filter((f) => f.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Nav onDark />
      <main>
        <section className="bg-ink pb-20 pt-36 text-on-ink md:pt-44">
          <div className="wrap">
            <p className="mb-6 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-signal">Portfólio HPRT Brasil</p>
            <h1 className="max-w-[16ch] text-[clamp(2.5rem,6.5vw,5.75rem)] uppercase leading-[0.9] text-on-ink">
              Quatro famílias. Uma engenharia.
            </h1>
            <div className="mt-14 grid gap-px bg-on-ink/15 sm:grid-cols-2 lg:grid-cols-4">
              {FAMILIES.map((f) => {
                const count = productSummaries.filter((p) => (f.cats as readonly string[]).includes(p.category)).length;
                return (
                  <Link key={f.id} to="/produtos" search={{ linha: f.id }} hash={f.id}
                    className="group flex flex-col justify-between gap-8 bg-ink p-6 transition-colors hover:bg-on-ink/5">
                    <div className="flex items-start justify-between">
                      <span className="font-display text-[2.75rem] font-semibold leading-none text-signal">{f.n}</span>
                      <ArrowUpRight className="size-5 text-on-ink-muted transition-colors group-hover:text-signal" />
                    </div>
                    <div>
                      <div className="text-[1.05rem] font-semibold uppercase tracking-[0.03em]">{f.label}</div>
                      <div className="mt-1 text-[0.85rem] text-on-ink-muted">{count} modelos</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="wrap flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <nav className="-mb-4 flex gap-6 overflow-x-auto lg:mb-0" aria-label="Famílias de produto">
              {[{ id: "all", label: "Todas" }, ...FAMILIES].map((c) => (
                <Link key={c.id} to="/produtos" search={{ linha: c.id }}
                  className={cn(
                    "whitespace-nowrap border-b-2 pb-3 text-[0.85rem] font-semibold uppercase tracking-[0.04em] transition-colors lg:pb-2",
                    active === c.id ? "border-signal text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                  )}>
                  {c.label}
                </Link>
              ))}
            </nav>
            <label className="flex w-full items-center gap-2 border border-border-strong px-3 py-2 lg:w-72">
              <Search className="size-4 text-faint" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar modelo (ex.: GRAND, M4)"
                className="w-full bg-transparent text-[0.9rem] outline-none placeholder:text-faint" />
            </label>
          </div>
        </div>

        {families.length === 0 && (
          <p className="py-32 text-center text-muted-foreground">Nenhum modelo encontrado para “{q}”.</p>
        )}

        {families.map((f) => {
          const [lead, ...rest] = f.items;
          return (
            <section key={f.id} id={f.id} className="scroll-mt-24 border-b border-border py-20 md:py-28">
              <div className="wrap">
                <header className="mb-14 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
                  <div>
                    <div className="mb-4 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-signal">Família {f.n} · {f.items.length} {f.items.length === 1 ? "modelo" : "modelos"}</div>
                    <h2 className="text-[clamp(2rem,4.4vw,3.75rem)] uppercase leading-[0.92]">{f.label}</h2>
                    <p className="mt-4 text-[1.15rem] font-medium">{f.claim}</p>
                  </div>
                  <div>
                    <p className="text-[1rem] leading-relaxed text-muted-foreground">{f.text}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {f.tags.map((t) => (
                        <span key={t} className="border border-border-strong px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.06em]">{t}</span>
                      ))}
                    </div>
                  </div>
                </header>

                <Link to="/produtos/$slug" params={{ slug: lead.slug }}
                  className="group grid overflow-hidden border border-border bg-surface lg:grid-cols-[1.4fr_1fr]">
                  <div className="flex aspect-[16/10] items-center justify-center p-10">
                    <img src={lead.thumb} alt={`HPRT ${lead.name} — ${lead.tagline}`} loading="lazy" decoding="async" width={640} height={400}
                      className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <div className="flex flex-col justify-between gap-10 border-t border-border bg-background p-8 lg:border-l lg:border-t-0 lg:p-10">
                    <div>
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-faint">{lead.categoryLabel}</div>
                      <h3 className="mt-3 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold uppercase leading-[0.9] tracking-tight">{lead.name}</h3>
                      <p className="mt-4 text-[1rem] leading-relaxed text-muted-foreground">{lead.tagline}</p>
                      {KYOCERA.has(lead.slug) && (
                        <span className="mt-5 inline-block bg-signal px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-background">Cabeça Kyocera</span>
                      )}
                    </div>
                    <div className="flex items-end justify-between gap-6 border-t border-border pt-6">
                      <div>
                        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-faint">Especificação-chave</div>
                        <div className="mt-1 text-[1.05rem] font-semibold">{lead.spec}</div>
                      </div>
                      <span className="flex size-12 shrink-0 items-center justify-center bg-foreground text-background transition-colors group-hover:bg-signal">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </div>
                  </div>
                </Link>

                {rest.length > 0 && (
                  <div className="mt-px grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((p) => (
                      <Link key={p.slug} to="/produtos/$slug" params={{ slug: p.slug }}
                        className="group flex flex-col bg-background">
                        <div className="flex aspect-[4/3] items-center justify-center bg-surface p-8">
                          <img src={p.thumb} alt={`HPRT ${p.name} — ${p.tagline}`} loading="lazy" decoding="async" width={360} height={270}
                            className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-display text-[1.9rem] font-semibold uppercase leading-none tracking-tight">{p.name}</h3>
                            <ArrowUpRight className="size-5 shrink-0 text-faint transition-colors group-hover:text-signal" />
                          </div>
                          {KYOCERA.has(p.slug) && (
                            <span className="mt-3 self-start text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-signal">Cabeça Kyocera</span>
                          )}
                          <p className="mt-3 text-[0.92rem] leading-snug text-muted-foreground">{p.tagline}</p>
                          <div className="mt-auto border-t border-border pt-4 text-[0.88rem] font-medium">
                            <span className="mr-2 text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-faint">Spec</span>{p.spec}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </div>
  );
}
