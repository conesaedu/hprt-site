import { productSummaries } from "@/lib/products/summary";

// Endereços do site antigo (WordPress) → páginas do site novo.
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export function legacyProductSlug(path: string): string | null {
  const key = norm(path.split("/").filter(Boolean).pop() ?? "");
  if (!key) return null;
  const exact = productSummaries.find((p) => norm(p.slug) === key || norm(p.name) === key);
  if (exact) return exact.slug;
  // ex.: "impressora-grand-203dpi" → maior nome de produto contido no endereço
  const partial = productSummaries
    .filter((p) => key.includes(norm(p.slug)) && norm(p.slug).length >= 3)
    .sort((a, b) => b.slug.length - a.slug.length)[0];
  return partial?.slug ?? null;
}

const CATEGORY_RULES: [RegExp, string][] = [
  [/coletor/, "coletores"],
  [/leitor|scanner/, "leitores"],
  [/industrial/, "etiquetas-industrial"],
  [/cupo|pdv|termica-de-recibo|recibo/, "cupom"],
  [/pulseira/, "pulseiras"],
  [/cartao|cartoes|cracha/, "cartao"],
  [/foto/, "fotos"],
  [/a4|portatil|movel/, "a4"],
  [/etiqueta/, "etiquetas-entrada"],
];

export function legacyCategory(path: string): string | null {
  const p = path.toLowerCase();
  return CATEGORY_RULES.find(([re]) => re.test(p))?.[1] ?? null;
}
