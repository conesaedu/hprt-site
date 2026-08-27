import { productList } from "./catalog";
import { downloads, type DownloadItem } from "@/lib/downloads-data";
import type { Product } from "./types";

export type { Product, SpecGroup, SpecRow, Highlight } from "./types";

export const products = productList;

export const productCategories: { id: string; label: string }[] = [
  { id: "all", label: "Tudo" },
  { id: "etiquetas-industrial", label: "Etiquetas · Industrial" },
  { id: "etiquetas-entrada", label: "Etiquetas · Entrada" },
  { id: "coletores", label: "Coletores de dados" },
  { id: "leitores", label: "Leitores de código de barras" },
  { id: "cupom", label: "Cupom / PDV" },
  { id: "a4", label: "Portátil A4" },
  { id: "pulseiras", label: "Pulseiras" },
  { id: "cartao", label: "Cartões" },
  { id: "fotos", label: "Fotos" },
  { id: "embaladora", label: "Embaladora" },
];

const bySlug = new Map(products.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function getProductByName(name: string): Product | undefined {
  const key = name.trim().toLowerCase();
  return products.find((p) => p.name.toLowerCase() === key);
}

/** Modelos da mesma linha, completando com os relacionados oficiais do fabricante. */
export function relatedProducts(product: Product, limit = 3): Product[] {
  const picked: Product[] = [];
  const push = (p?: Product) => {
    if (p && p.slug !== product.slug && !picked.some((x) => x.slug === p.slug)) picked.push(p);
  };
  product.related.forEach((slug) => push(bySlug.get(slug)));
  products.filter((p) => p.category === product.category).forEach(push);
  return picked.slice(0, limit);
}

/** Arquivos da central de downloads que citam este modelo. */
export function productDownloads(product: Product): DownloadItem[] {
  const key = product.name.toLowerCase().replace(/\s+/g, "");
  return downloads.filter((d) =>
    d.models.some((m) => m.toLowerCase().replace(/\s+/g, "").includes(key)),
  );
}
