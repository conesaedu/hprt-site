import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  downloadCategories,
  downloads,
  type DownloadCategory,
  type DownloadItem,
} from "@/lib/downloads-data";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { Eyebrow, Btn, SectionHead } from "@/components/hprt/ui";
import { cn } from "@/lib/utils";
import { Download, Monitor, Search } from "lucide-react";

const title = "Downloads HPRT Brasil — Drivers e utilitários oficiais";
const description =
  "Baixe drivers, utilitários e softwares oficiais das impressoras HPRT: etiquetas, pulseiras, cartões e cupom. Busque pelo modelo do seu equipamento.";

export const Route = createFileRoute("/downloads")({
  component: DownloadsPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/downloads" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/downloads" }],
  }),
});

function DownloadsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DownloadCategory | "todos">("todos");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return downloads.filter((d) => {
      if (category !== "todos" && d.category !== category) return false;
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.kind.toLowerCase().includes(q) ||
        d.models.some((m) => m.toLowerCase().includes(q))
      );
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <section className="border-b border-border pb-20 pt-44">
          <div className="wrap">
            <Eyebrow className="mb-6">Central de downloads</Eyebrow>
            <h1 className="mb-6 max-w-[46rem] text-[2.375rem] leading-[1.08] md:text-[3.125rem]">
              Drivers e utilitários oficiais para o seu equipamento HPRT.
            </h1>
            <p className="max-w-[38rem] text-[1.0625rem] text-muted-foreground">
              Encontre o arquivo certo pelo modelo da impressora. Instale sempre o driver antes de
              conectar o equipamento ao computador.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="wrap">
            <SectionHead eyebrow="Arquivos" title="Busque pelo modelo">
              Digite o modelo (ARES, GALA, CP-D80, TP80K…) ou filtre por linha de produto.
            </SectionHead>

            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por modelo ou arquivo"
                  aria-label="Buscar downloads"
                  className="w-full rounded-sm border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  active={category === "todos"}
                  onClick={() => setCategory("todos")}
                  label="Todos"
                />
                {downloadCategories.map((c) => (
                  <FilterChip
                    key={c}
                    active={category === c}
                    onClick={() => setCategory(c)}
                    label={c}
                  />
                ))}
              </div>
            </div>

            {results.length === 0 ? (
              <div className="rounded-lg border border-border bg-surface p-10 text-center">
                <p className="text-muted-foreground">
                  Nenhum arquivo encontrado para essa busca. Fale com o suporte e enviamos o driver
                  correto do seu modelo.
                </p>
                <div className="mt-6">
                  <Btn href="/onde-comprar" variant="ghost">
                    Falar com o suporte
                  </Btn>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {results.map((d) => (
                  <DownloadCard key={d.id} item={d} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="border-y border-border bg-surface py-20">
          <div className="wrap">
            <SectionHead eyebrow="Antes de instalar" title="Três passos para não errar">
              Procedimento recomendado pela engenharia HPRT Brasil.
            </SectionHead>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  n: "01",
                  t: "Instale o driver primeiro",
                  d: "Rode o instalador com o equipamento desligado ou desconectado do computador.",
                },
                {
                  n: "02",
                  t: "Conecte e selecione a porta",
                  d: "Ligue a impressora, conecte o cabo e confirme a porta USB ou de rede no driver.",
                },
                {
                  n: "03",
                  t: "Calibre com o utilitário",
                  d: "Use o HPRT Printer Utility para calibrar o sensor de etiqueta e ajustar velocidade e temperatura.",
                },
              ].map((s) => (
                <div key={s.n} className="rounded-lg border border-border bg-background p-6">
                  <span className="mb-3 block font-mono text-[0.7rem] tracking-[0.14em] text-signal">
                    {s.n}
                  </span>
                  <h3 className="mb-2 text-[1.0625rem] font-semibold leading-tight">{s.t}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="wrap">
            <div className="flex flex-col items-start justify-between gap-8 rounded-lg border border-border bg-surface p-8 md:flex-row md:items-center">
              <div>
                <h2 className="mb-2 text-[1.75rem] leading-tight font-semibold">
                  Não encontrou o arquivo do seu modelo?
                </h2>
                <p className="text-muted-foreground">
                  Nosso suporte técnico envia o driver, firmware ou manual específico do seu
                  equipamento.
                </p>
              </div>
              <Btn href="/onde-comprar">Falar com o suporte</Btn>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-sm border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-signal bg-signal text-primary-foreground"
          : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function DownloadCard({ item }: { item: DownloadItem }) {
  const available = item.file.length > 0;

  return (
    <article className="flex flex-col rounded-lg border border-border bg-surface p-6 transition-colors hover:border-border-strong">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-[2px] bg-background px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-muted-foreground">
          {item.kind}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] text-faint">
          <Monitor className="size-3.5" />
          {item.os}
        </span>
      </div>

      <h3 className="mb-2 text-[1.125rem] font-semibold leading-tight text-foreground">
        {item.title}
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {item.models.map((m) => (
          <span
            key={m}
            className="rounded-[2px] border border-border px-2 py-0.5 font-mono text-[0.68rem] text-muted-foreground"
          >
            {m}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-5">
        <span className="font-mono text-[0.72rem] text-faint">
          {item.format}
          {item.version ? ` · v${item.version}` : ""}
        </span>
        {available ? (
          <a
            href={item.file}
            className="inline-flex items-center gap-2 rounded-sm bg-signal px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-[transform,background-color] hover:-translate-y-px hover:bg-signal-soft"
          >
            <Download className="size-4" />
            Baixar
          </a>
        ) : (
          <span className="rounded-sm bg-muted px-5 py-2.5 text-sm font-semibold text-muted-foreground">
            Em breve
          </span>
        )}
      </div>
    </article>
  );
}
