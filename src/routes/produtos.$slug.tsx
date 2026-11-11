import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProduct } from "@/lib/products";
import { ProductDetail } from "@/components/hprt/ProductDetail";

const SITE = "https://hprtbrasil.lovable.app";

export const Route = createFileRoute("/produtos/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Produto não encontrado — HPRT Brasil" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    const title = `HPRT ${p.name} — ${p.tagline || p.categoryLabel} | HPRT Brasil`.slice(0, 70);
    const description = (
      p.summary[0] ??
      p.body[0] ??
      `Conheça a HPRT ${p.name}: especificações, aplicações e suporte técnico no Brasil.`
    ).slice(0, 155);
    const url = `${SITE}/produtos/${params.slug}`;
    const abs = (src: string) => (src.startsWith("http") ? src : `${SITE}${src}`);
    const image = p.gallery[0] ? abs(p.gallery[0]) : undefined;


    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: url },
        ...(p.gallery[0]
          ? [{ rel: "preload", as: "image", href: p.gallery[0], fetchpriority: "high" }]
          : []),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `HPRT ${p.name}`,
            description,
            brand: { "@type": "Brand", name: "HPRT" },
            category: p.categoryLabel,
            image: p.gallery.slice(0, 3).map(abs),

            url,
          }),
        },
      ],
    };
  },
  component: ProductRoute,
  notFoundComponent: ProductNotFound,
});

function ProductRoute() {
  const { product } = Route.useLoaderData();
  return <ProductDetail product={product} />;
}

function ProductNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-8 text-center">
      <h1 className="text-[2rem]">Produto não encontrado</h1>
      <p className="text-muted-foreground">
        Este modelo pode ter saído de linha. Veja o portfólio completo em{" "}
        <a href="/produtos" className="text-signal underline">
          /produtos
        </a>
        .
      </p>
    </div>
  );
}
