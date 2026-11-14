import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { getPublishedPost } from "@/lib/blog.functions";
import { Markdown } from "@/lib/markdown";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPublishedPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData: p, params }) => {
    if (!p) return { meta: [{ title: "Artigo não encontrado — HPRT Brasil" }] };
    const t = p.seo_title || `${p.title} — HPRT Brasil`;
    const d = p.seo_description || p.excerpt || "";
    const meta = [
      { title: t }, { name: "description", content: d },
      { property: "og:title", content: t }, { property: "og:description", content: d },
      { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
      ...(p.cover_url ? [{ property: "og:image", content: p.cover_url }, { name: "twitter:image", content: p.cover_url }] : []),
    ];
    return {
      meta,
      links: [{ rel: "canonical", href: `https://hprtbrasil.lovable.app/blog/${params.slug}` }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: d, datePublished: p.published_at, dateModified: p.updated_at, image: p.cover_url ?? undefined, publisher: { "@type": "Organization", name: "HPRT Brasil" } }) }],
    };
  },
  notFoundComponent: () => (
    <><Nav /><main className="wrap pb-24 pt-40"><h1 className="font-display text-4xl font-bold uppercase">Artigo não encontrado</h1><Link to="/blog" className="mt-6 inline-block text-primary underline">Ver todos os artigos</Link></main><Footer /></>
  ),
  component: Post,
});

function Post() {
  const p = Route.useLoaderData();
  return (
    <>
      <Nav />
      <main className="pb-24 pt-36">
        <article className="wrap max-w-3xl">
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary">← Blog</Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</p>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,4rem)] font-bold uppercase leading-[0.95]">{p.title}</h1>
          {p.excerpt && <p className="mt-5 text-xl text-muted-foreground">{p.excerpt}</p>}
          <p className="mt-5 text-sm text-muted-foreground">{p.published_at && new Date(p.published_at).toLocaleDateString("pt-BR", { dateStyle: "long" })}</p>
          {p.cover_url && <img src={p.cover_url} alt={p.title} className="mt-10 aspect-[16/9] w-full object-cover" />}
          <div className="mt-10"><Markdown source={p.content} /></div>
        </article>
      </main>
      <Footer />
    </>
  );
}
