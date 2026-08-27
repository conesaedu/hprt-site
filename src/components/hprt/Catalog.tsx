import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { solutions } from "@/lib/hprt-data";
import { products, productCategories } from "@/lib/products";
import { cn } from "@/lib/utils";
import { Btn, Eyebrow, MoreLink, SectionHead } from "./ui";

export function Products({ limit }: { limit?: number } = {}) {
  const [active, setActive] = useState("all");
  const filtered = products.filter((p) => active === "all" || p.category === active);
  const visible = limit ? filtered.slice(0, limit) : filtered;
  const cats = productCategories.filter(
    (c) => c.id === "all" || products.some((p) => p.category === c.id),
  );

  return (
    <section id="products" className="border-y border-border bg-surface py-30">
      <div className="wrap">
        <SectionHead eyebrow="Portfólio" title="Um catálogo completo, não uma linha de produtos.">
          Da etiqueta industrial ao coletor Android, a mesma marca cobre a operação inteira — o que
          hoje exige três ou quatro fornecedores diferentes.
        </SectionHead>

        <div className="mb-11 flex flex-wrap gap-2.5">
          {cats.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={cn(
                "rounded-full border bg-background px-4 py-2 font-mono text-[0.78rem] transition-colors",
                active === c.id
                  ? "border-foreground text-foreground"
                  : "border-border-strong text-muted-foreground hover:border-foreground hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-3 lg:grid-cols-4">
          {visible.map((p) => (
            <Link
              key={p.slug}
              to="/produtos/$slug"
              params={{ slug: p.slug }}
              className="group flex flex-col items-center gap-2 bg-background px-5 pb-6 pt-5 text-center transition-shadow hover:shadow-[inset_0_0_0_1px_var(--foreground)]"
            >
              <div className="mb-1 flex aspect-square w-full items-center justify-center">
                <img
                  src={p.gallery[0]}
                  alt={`Produto HPRT ${p.name}`}
                  loading="lazy"
                  className="max-h-[6.25rem] max-w-[85%] object-contain transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.04]"
                />
              </div>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.05em] text-faint">
                {p.categoryLabel}
              </span>
              <h3 className="font-display text-lg font-semibold">{p.name}</h3>
              <p className="text-[0.78rem] text-muted-foreground">{p.tagline}</p>
            </Link>
          ))}
        </div>

        <div className="mt-9 flex justify-center">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-foreground transition-colors hover:text-signal"
          >
            Ver todos os {products.length} modelos <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Solutions({ preview = false, hideHead = false }: { preview?: boolean; hideHead?: boolean } = {}) {
  return (
    <section id="solutions" className="py-30">
      <div className="wrap">
        {hideHead ? null : (
          <SectionHead
            eyebrow="Soluções por setor"
            title="A mesma marca resolve operações muito diferentes."
          />
        )}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((s) => (
            <article
              key={s.num}
              className="flex flex-col rounded-lg border border-border p-8 transition-[transform,border-color] hover:-translate-y-1 hover:border-foreground"
            >
              <div className="mb-4 font-mono text-xs text-faint">{s.num}</div>
              <h3 className="mb-2.5 text-[1.1875rem]">{s.title}</h3>
              <p className="mb-6 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-auto flex flex-wrap gap-2">
                {s.lines.map((l) => (
                  <Link
                    key={l.id}
                    to="/produtos"
                    search={{ linha: l.id }}
                    className="rounded-full border border-border-strong bg-background px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.04em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
        {preview ? (
          <div className="mt-9 flex justify-center">
            <MoreLink to="/solucoes">Ver soluções por setor</MoreLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function Trust({ compact = false, hideHead = false }: { compact?: boolean; hideHead?: boolean } = {}) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id="trust" className="border-b border-border bg-surface py-28">
      <div ref={reveal.ref} className={`${reveal.className} wrap grid items-center gap-16 lg:grid-cols-2`}>
        <div>
          {hideHead ? null : (
            <>
              <Eyebrow className="mb-4">Presença local</Eyebrow>
              <h2 className="mb-5 text-[2rem] leading-tight">
                Fabricado com escala global, entregue com presença local.
              </h2>
            </>
          )}
          <p className="mb-7 text-[0.97rem] text-muted-foreground">
            A operação brasileira da HPRT é conduzida em parceria com a Cogra, distribuidora B2B com
            25 anos de mercado — o que significa estoque físico, suporte técnico e um time comercial
            no país, não apenas um catálogo traduzido.
          </p>
          <ul className="border-b border-border">
            {[
              ["Fábrica", "Xiamen, China — 56 linhas de produção"],
              ["Distrib.", "São Paulo — SP, operação própria"],
              ["Suporte", "Time técnico e comercial local"],
            ].map(([k, v]) => (
              <li key={k} className="flex gap-3.5 border-t border-border py-3.5 text-[0.9rem]">
                <b className="min-w-[4.375rem] font-mono text-[0.78rem]">{k}</b>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>

        {compact ? (
          <div className="rounded-lg border border-border bg-background p-9">
            <div className="mb-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
              Centro de distribuição · Brasil
            </div>
            <div className="mb-7 text-[0.9375rem] leading-relaxed">
              Rua Luiz Seraphico Jr., 511 — Jardim Caravelas, São Paulo, SP
            </div>
            <MoreLink to="/onde-comprar">Onde comprar e falar com um especialista</MoreLink>
          </div>
        ) : (
        <div className="rounded-lg border border-border bg-background p-9 font-mono">
          <img
            src="https://hprtbrasil.com.br/wp-content/uploads/2026/01/company-1024x439.jpg"
            alt="Operação e centro de distribuição HPRT"
            loading="lazy"
            className="mb-6 w-full rounded-sm"
          />
          <div className="mb-2 text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
            Centro de distribuição · Brasil
          </div>
          <div className="mb-6 text-[0.9375rem] leading-relaxed">
            Rua Luiz Seraphico Jr., 511 — Jardim Caravelas, São Paulo, SP
          </div>
          <div className="mb-2 text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
            Operado por
          </div>
          <div className="text-[0.9375rem] leading-relaxed">
            Cogra — distribuidora B2B, 25 anos de mercado
          </div>
        </div>
        )}
      </div>
    </section>
  );
}

export function CtaStrip() {
  return (
    <section className="border-b border-border py-20">
      <div className="wrap flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
        <h2 className="max-w-[30rem] text-[1.75rem] leading-snug">
          Pronto para trocar o fornecedor sem trocar o padrão de operação?
        </h2>
        <div className="flex shrink-0 flex-wrap gap-3.5">
          <Btn href="/produtos" variant="ghost">
            Ver portfólio
          </Btn>
          <Btn href="/onde-comprar">Falar com um especialista</Btn>
        </div>
      </div>
    </section>
  );
}
