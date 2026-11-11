import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ProductSummary } from "@/lib/products/summary";

const KYOCERA = new Set(["etiquetas-industrial"]);

/** Card de hardware — dados resumidos, sem carregar o catálogo completo. */
export function ProductCard({ product, featured = false }: { product: ProductSummary; featured?: boolean }) {
  return (
    <Link
      to="/produtos/$slug"
      params={{ slug: product.slug }}
      className="group relative flex flex-col bg-background transition-colors hover:bg-surface"
    >
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-surface ${featured ? "aspect-[16/10]" : "aspect-[5/4]"}`}
      >
        <img
          src={product.thumb}
          alt={`HPRT ${product.name} — ${product.tagline}`}
          loading="lazy"
          decoding="async"
          width={520}
          height={420}
          className={`w-auto object-contain transition-transform duration-700 group-hover:scale-[1.04] ${featured ? "max-h-[78%]" : "max-h-[72%]"}`}
        />
        {KYOCERA.has(product.category) && (
          <span className="absolute left-5 top-5 bg-foreground px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-background">
            Cabeça Kyocera
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className={`font-display font-semibold uppercase leading-none tracking-tight ${featured ? "text-[2.25rem]" : "text-[1.625rem]"}`}>
            {product.name}
          </h3>
          <ArrowUpRight className="size-5 shrink-0 text-faint transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
        </div>
        <p className="mb-6 text-[0.9rem] leading-relaxed text-muted-foreground">{product.tagline}</p>
        <dl className="mt-auto border-t border-border pt-4">
          <dt className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-faint">Especificação-chave</dt>
          <dd className="text-[0.875rem] font-medium text-foreground">{product.spec}</dd>
        </dl>
      </div>
    </Link>
  );
}
