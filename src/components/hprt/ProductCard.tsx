import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ProductSummary } from "@/lib/products/summary";

/** Card leve de produto — usa apenas dados resumidos, sem carregar o catálogo completo. */
export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link
      to="/produtos/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col bg-background p-7 transition-colors hover:bg-surface"
    >
      <div className="mb-6 flex aspect-[4/3] items-center justify-center">
        <img
          src={product.thumb}
          alt={`HPRT ${product.name}`}
          loading="lazy"
          decoding="async"
          width={420}
          height={315}
          className="max-h-[11rem] w-auto object-contain transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.03]"
        />
      </div>
      <span className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-faint">
        {product.categoryLabel}
      </span>
      <h3 className="mb-2 font-display text-[1.375rem] font-semibold leading-none">{product.name}</h3>
      <p className="mb-5 text-[0.875rem] leading-relaxed text-muted-foreground">{product.tagline}</p>
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-4">
        <span className="font-mono text-[0.72rem] text-muted-foreground">{product.spec}</span>
        <ArrowRight className="size-4 text-faint transition-[transform,color] group-hover:translate-x-1 group-hover:text-signal" />
      </div>
    </Link>
  );
}
