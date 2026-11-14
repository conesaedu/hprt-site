import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { listPublishedPosts } from "@/lib/blog.functions";

const title = "Blog HPRT Brasil — Impressão, identificação e automação";
const description = "Artigos técnicos sobre impressão térmica, etiquetas, coletores de dados e automação para logística, indústria, varejo e saúde.";

export const Route = createFileRoute("/blog/")({
  loader: () => listPublishedPosts(),
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://hprtbrasil.lovable.app/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = Route.useLoaderData();
  const [first, ...rest] = posts;
  return (
    <>
      <Nav onDark />
      <main>
        <section className="bg-foreground pb-16 pt-40 text-background">
          <div className="wrap">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Blog</p>
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.75rem,6vw,5.5rem)] font-bold uppercase leading-[0.92]">Engenharia aplicada à operação.</h1>
          </div>
        </section>
        <section className="wrap py-16">
          {posts.length === 0 ? <p className="text-lg text-muted-foreground">Em breve, os primeiros artigos.</p> : (
            <div className="space-y-12">
              {first && (
                <Link to="/blog/$slug" params={{ slug: first.slug }} className="group grid gap-8 border-b border-border pb-12 lg:grid-cols-2">
                  <div className="aspect-[16/10] overflow-hidden bg-muted">{first.cover_url && <img src={first.cover_url} alt={first.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}</div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{first.category}</p>
                    <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-tight group-hover:text-primary">{first.title}</h2>
                    {first.excerpt && <p className="mt-4 text-lg text-muted-foreground">{first.excerpt}</p>}
                    <p className="mt-6 text-sm text-muted-foreground">{first.published_at && new Date(first.published_at).toLocaleDateString("pt-BR", { dateStyle: "long" })}</p>
                  </div>
                </Link>
              )}
              <div className="grid gap-10 md:grid-cols-3">
                {rest.map((p) => (
                  <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group">
                    <div className="aspect-[16/10] overflow-hidden bg-muted">{p.cover_url && <img loading="lazy" src={p.cover_url} alt={p.title} className="h-full w-full object-cover" />}</div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight group-hover:text-primary">{p.title}</h3>
                    {p.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
