import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download, ArrowRight, ArrowUpRight, GraduationCap, Check } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
import { productDownloads, relatedProducts, type Product } from "@/lib/products";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Eyebrow } from "./ui";

export function ProductDetail({ product }: { product: Product }) {
  const related = relatedProducts(product);
  const files = productDownloads(product);

  return (
    <div className="min-h-screen bg-background">
      <Nav onDark />
      <main>
        <ProductHero product={product} />
        <Intro product={product} />
        {product.highlights.length > 0 ? <Highlights product={product} /> : null}
        {product.applications.length > 0 ? <Applications product={product} /> : null}
        {product.gallery.length > 1 ? <Gallery product={product} /> : null}
        {product.specGroups.length > 0 ? <Specs product={product} /> : null}
        <Decision product={product} files={files} />
        {related.length > 0 ? <Related product={product} related={related} /> : null}
      </main>
      <Footer />
    </div>
  );
}

/* ---------------------------------------------------------------- hero */

function ProductHero({ product }: { product: Product }) {
  return (
    <section className="relative overflow-hidden bg-ink pb-16 pt-36 text-on-ink md:pb-24 md:pt-40">
      <div className="pointer-events-none absolute inset-0 stage-glow" aria-hidden />
      <div className="pointer-events-none absolute inset-0 grid-rule opacity-60" aria-hidden />

      <div className="wrap relative">
        <nav className="mb-10 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-on-ink-muted">
          <Link to="/produtos" className="transition-colors hover:text-on-ink">
            Produtos
          </Link>
          <span aria-hidden>/</span>
          <span className="text-on-ink">{product.categoryLabel}</span>
        </nav>

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-on-ink-muted">
              <span className="inline-block size-[7px] rotate-45 rounded-[1px] bg-signal" />
              HPRT {product.categoryLabel}
            </span>
            <h1 className="mb-5 font-display text-[clamp(3.5rem,11vw,7.5rem)] font-bold leading-[0.86] tracking-[-0.03em]">
              {product.name}
            </h1>
            {product.tagline ? (
              <p className="mb-8 max-w-[32rem] text-[1.0625rem] leading-relaxed text-on-ink-muted">
                {product.tagline}.
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <a
                href="/#trust"
                className="inline-flex items-center gap-2 rounded-sm bg-signal px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-[transform,background-color] hover:-translate-y-px hover:bg-signal-soft"
              >
                Solicitar orçamento
                <ArrowRight className="size-4" />
              </a>
              <a
                href="#especificacoes"
                className="inline-flex items-center gap-2 rounded-sm border border-on-ink/25 px-6 py-3.5 text-sm font-semibold text-on-ink transition-colors hover:border-on-ink"
              >
                Ver especificações
              </a>
            </div>
          </div>

          <div className="relative">
            <img
              src={product.gallery[0]}
              alt={`Impressora HPRT ${product.name}`}
              width={720}
              height={720}
              className="product-shadow mx-auto max-h-[26rem] w-auto object-contain"
            />
          </div>
        </div>

        {product.keySpecs.length > 0 ? (
          <dl className="mt-14 grid gap-px border-t border-on-ink/15 sm:grid-cols-3">
            {product.keySpecs.map((s) => (
              <div key={s.label} className="border-b border-on-ink/10 py-6 pr-6">
                <dt className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-on-ink-muted">
                  {s.label}
                </dt>
                <dd className="font-display text-[1.5rem] font-semibold leading-tight text-on-ink">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- intro */

function Intro({ product }: { product: Product }) {
  const reveal = useReveal<HTMLDivElement>();
  const text = product.body.length > 0 ? product.body : product.summary;
  if (text.length === 0) return null;

  return (
    <section className="border-b border-border py-20 md:py-24">
      <div ref={reveal.ref} className={cn(reveal.className, "wrap grid gap-10 lg:grid-cols-[16rem_1fr]")}>
        <Eyebrow>O equipamento</Eyebrow>
        <div className="max-w-[44rem] space-y-6">
          {text.map((p) => (
            <p key={p.slice(0, 40)} className="text-[1.0625rem] leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- highlights */

function Highlights({ product }: { product: Product }) {
  /* Cada diferencial só recebe foto quando a imagem realmente mostra o que o
     texto afirma (curadoria em catalog.ts). O resto vira bloco tipográfico. */
  const withImage = product.highlights
    .map((h, i) => ({ h, i }))
    .filter(({ h }) => typeof h.image === "number" && product.gallery[h.image]);
  const textOnly = product.highlights
    .map((h, i) => ({ h, i }))
    .filter(({ h }) => !(typeof h.image === "number" && product.gallery[h.image]));

  return (
    <section className="border-b border-border bg-surface py-20 md:py-24">
      <div className="wrap">
        <div className="mb-14 max-w-[38rem]">
          <Eyebrow className="mb-4">Diferenciais</Eyebrow>
          <h2 className="text-[2.125rem] leading-[1.1]">
            O que faz a {product.name} valer a operação.
          </h2>
        </div>

        {withImage.length > 0 ? (
          <div className="flex flex-col gap-px bg-border">
            {withImage.map(({ h, i }, pos) => (
              <HighlightBand
                key={h.title}
                index={i}
                position={pos}
                title={h.title}
                desc={h.desc}
                image={product.gallery[h.image as number]}
                name={product.name}
              />
            ))}
          </div>
        ) : null}

        {textOnly.length > 0 ? (
          <div
            className={cn(
              "grid gap-px bg-border",
              withImage.length > 0 && "mt-px",
              textOnly.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
            )}
          >
            {textOnly.map(({ h, i }) => (
              <HighlightNote key={h.title} index={i} title={h.title} desc={h.desc} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function HighlightBand({
  index,
  position,
  title,
  desc,
  image,
  name,
}: {
  index: number;
  position: number;
  title: string;
  desc: string;
  image: string;
  name: string;
}) {
  const reveal = useReveal<HTMLDivElement>();
  const flip = position % 2 === 1;

  return (
    <div
      ref={reveal.ref}
      className={cn(reveal.className, "grid items-center gap-8 bg-background p-8 md:grid-cols-2 md:p-10")}
    >
      <div className={cn(flip && "md:order-2")}>
        <span className="mb-4 block font-mono text-[0.7rem] tracking-[0.14em] text-signal">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mb-3 max-w-[26rem] text-[1.4375rem] leading-tight">{title}</h3>
        {desc ? <p className="max-w-[30rem] text-[0.95rem] leading-relaxed text-muted-foreground">{desc}</p> : null}
      </div>
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-surface-2 p-8",
          flip && "md:order-1",
        )}
      >
        <img
          src={image}
          alt={`Detalhe da HPRT ${name}`}
          loading="lazy"
          width={520}
          height={380}
          className="max-h-[15rem] w-auto object-contain"
        />
      </div>
    </div>
  );
}

function HighlightNote({ index, title, desc }: { index: number; title: string; desc: string }) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <div
      ref={reveal.ref}
      className={cn(
        reveal.className,
        "group relative flex flex-col bg-background p-8 transition-colors hover:bg-surface-2",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute right-6 top-4 font-display text-[3.5rem] font-bold leading-none text-border/70 transition-colors group-hover:text-signal/25"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="mb-5 block h-px w-10 bg-signal" aria-hidden />
      <h3 className="relative mb-3 max-w-[22rem] text-[1.1875rem] leading-tight">{title}</h3>
      {desc ? (
        <p className="text-[0.9rem] leading-relaxed text-muted-foreground">{desc}</p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------- applications */

function Applications({ product }: { product: Product }) {
  return (
    <section className="border-b border-border py-20 md:py-24">
      <div className="wrap">
        <div className="mb-12 max-w-[38rem]">
          <Eyebrow className="mb-4">Onde ela trabalha</Eyebrow>
          <h2 className="text-[2.125rem] leading-[1.1]">Aplicações por segmento.</h2>
        </div>
        <div
          className={cn(
            "grid gap-px border border-border bg-border sm:grid-cols-2",
            product.applications.length % 3 === 0 || product.applications.length > 4
              ? "lg:grid-cols-3"
              : "lg:grid-cols-2",
          )}
        >
          {product.applications.map((a, i) => (
            <article
              key={a.title}
              className="group bg-background p-7 transition-colors hover:bg-surface"
            >
              <span className="mb-5 block font-mono text-[0.68rem] tracking-[0.12em] text-faint transition-colors group-hover:text-signal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mb-2.5 text-[1.125rem] leading-tight">{a.title}</h3>
              <p className="text-[0.9rem] leading-relaxed text-muted-foreground">{a.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- gallery */

function Gallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);

  return (
    <section className="border-b border-border bg-ink py-20 text-on-ink md:py-24">
      <div className="wrap">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-on-ink-muted">
              <span className="inline-block size-[7px] rotate-45 rounded-[1px] bg-signal" />
              Detalhes
            </span>
            <h2 className="text-[2.125rem] leading-[1.1] text-on-ink">
              Cada ângulo da {product.name}.
            </h2>
          </div>
          <span className="font-mono text-[0.72rem] text-on-ink-muted">
            {String(active + 1).padStart(2, "0")} / {String(product.gallery.length).padStart(2, "0")}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-on-ink/12">
          <div className="pointer-events-none absolute inset-0 stage-glow" aria-hidden />
          <img
            src={product.gallery[active]}
            alt={`HPRT ${product.name} — imagem ${active + 1}`}
            loading="lazy"
            width={1200}
            height={800}
            className="product-shadow relative mx-auto max-h-[30rem] w-auto py-12 object-contain"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {product.gallery.map((g, i) => (
            <button
              key={g}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagem ${i + 1} da ${product.name}`}
              aria-current={i === active}
              className={cn(
                "size-20 rounded-sm border p-2 transition-colors",
                i === active ? "border-signal" : "border-on-ink/15 hover:border-on-ink/50",
              )}
            >
              <img src={g} alt="" loading="lazy" className="size-full object-contain" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- specs */

function Specs({ product }: { product: Product }) {
  const [open, setOpen] = useState(product.specGroups[0]?.title ?? "");

  return (
    <section id="especificacoes" className="border-b border-border py-20 md:py-24">
      <div className="wrap">
        <div className="mb-12 max-w-[38rem]">
          <Eyebrow className="mb-4">Ficha técnica</Eyebrow>
          <h2 className="text-[2.125rem] leading-[1.1]">Especificações completas.</h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[15rem_1fr]">
          <nav className="hidden self-start lg:block lg:sticky lg:top-28">
            <ul className="space-y-1">
              {product.specGroups.map((g) => (
                <li key={g.title}>
                  <button
                    type="button"
                    onClick={() => setOpen(g.title)}
                    className={cn(
                      "w-full border-l-2 py-2 pl-4 text-left font-mono text-[0.72rem] uppercase tracking-[0.08em] transition-colors",
                      open === g.title
                        ? "border-signal text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {g.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            {product.specGroups.map((g) => {
              const isOpen = open === g.title;
              return (
                <div key={g.title} className="rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? "" : g.title)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[1.0625rem] font-semibold">{g.title}</span>
                    <span className="font-mono text-[0.72rem] text-faint">
                      {String(g.rows.length).padStart(2, "0")}
                    </span>
                  </button>
                  {isOpen ? (
                    <dl className="border-t border-border">
                      {g.rows.map((r) => (
                        <div
                          key={r.label}
                          className="grid gap-1 border-b border-border px-6 py-4 last:border-b-0 sm:grid-cols-[14rem_1fr] sm:gap-6"
                        >
                          <dt className="font-mono text-[0.72rem] uppercase tracking-[0.06em] text-muted-foreground">
                            {r.label}
                          </dt>
                          <dd className="text-[0.9375rem] leading-relaxed">{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ decision */

function Decision({
  product,
  files,
}: {
  product: Product;
  files: ReturnType<typeof productDownloads>;
}) {
  return (
    <section className="border-b border-border bg-surface py-20 md:py-24">
      <div className="wrap grid gap-8 lg:grid-cols-3">
        <article className="rounded-lg border border-border bg-background p-8">
          <Download className="mb-5 size-5 text-signal" />
          <h3 className="mb-2 text-[1.1875rem] leading-tight">Drivers e utilitários</h3>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            {files.length > 0
              ? `${files.length} arquivo${files.length > 1 ? "s" : ""} oficial${files.length > 1 ? "is" : ""} para a ${product.name}.`
              : "Enviamos o driver e o firmware certos do seu modelo."}
          </p>
          <ul className="mb-6 space-y-2">
            {files.slice(0, 3).map((f) => (
              <li key={f.id} className="flex items-start gap-2 text-[0.85rem] text-muted-foreground">
                <Check className="mt-0.5 size-3.5 shrink-0 text-signal" />
                {f.title}
              </li>
            ))}
          </ul>
          <Link
            to="/downloads"
            className="inline-flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-foreground transition-colors hover:text-signal"
          >
            Central de downloads <ArrowUpRight className="size-3.5" />
          </Link>
        </article>

        <article className="rounded-lg border border-border bg-background p-8">
          <GraduationCap className="mb-5 size-5 text-signal" />
          <h3 className="mb-2 text-[1.1875rem] leading-tight">Treinamento incluso</h3>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            Instalação, calibração e operação da linha HPRT com nosso time técnico — gratuito para
            clientes.
          </p>
          <Link
            to="/treinamentos"
            className="inline-flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-foreground transition-colors hover:text-signal"
          >
            Ver agenda <ArrowUpRight className="size-3.5" />
          </Link>
        </article>

        <article className="flex flex-col justify-between rounded-lg border border-transparent bg-ink p-8 text-on-ink">
          <div>
            <h3 className="mb-3 text-[1.375rem] leading-tight text-on-ink">
              Quer a {product.name} na sua operação?
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-on-ink-muted">
              Estoque físico em São Paulo, suporte técnico local e proposta comercial direta do
              distribuidor oficial.
            </p>
          </div>
          <a
            href="/#trust"
            className="inline-flex w-fit items-center gap-2 rounded-sm bg-signal px-5 py-3 text-sm font-semibold text-primary-foreground transition-[transform,background-color] hover:-translate-y-px hover:bg-signal-soft"
          >
            Falar com um especialista <ArrowRight className="size-4" />
          </a>
        </article>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- related */

function Related({ product, related }: { product: Product; related: Product[] }) {
  return (
    <section className="py-20 md:py-24">
      <div className="wrap">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[36rem]">
            <Eyebrow className="mb-4">Escolha de escala</Eyebrow>
            <h2 className="text-[2.125rem] leading-[1.1]">Outros modelos da mesma linha.</h2>
          </div>
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-foreground transition-colors hover:text-signal"
          >
            Portfólio completo <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {related.map((r) => (
            <ProductCard key={r.slug} product={r} />
          ))}
        </div>
        <p className="mt-6 font-mono text-[0.72rem] text-faint">
          Comparando a partir da {product.name}.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- shared card */

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/produtos/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col bg-background p-7 transition-colors hover:bg-surface"
    >
      <div className="mb-6 flex aspect-[4/3] items-center justify-center">
        <img
          src={product.gallery[0]}
          alt={`HPRT ${product.name}`}
          loading="lazy"
          width={420}
          height={315}
          className="max-h-[11rem] w-auto object-contain mix-blend-multiply transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.03]"
        />
      </div>
      <span className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-faint">
        {product.categoryLabel}
      </span>
      <h3 className="mb-2 font-display text-[1.375rem] font-semibold leading-none">{product.name}</h3>
      <p className="mb-5 text-[0.875rem] leading-relaxed text-muted-foreground">{product.tagline}</p>
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-4">
        <span className="font-mono text-[0.72rem] text-muted-foreground">
          {product.keySpecs[0]?.value ?? "Especificações"}
        </span>
        <ArrowRight className="size-4 text-faint transition-[transform,color] group-hover:translate-x-1 group-hover:text-signal" />
      </div>
    </Link>
  );
}
