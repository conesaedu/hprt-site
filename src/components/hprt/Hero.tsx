import { useEffect, useState } from "react";
import { heroGallery } from "@/lib/hprt-data";
import { cn } from "@/lib/utils";
import { Btn, Eyebrow } from "./ui";

const meta = [
  { value: "56", label: "linhas de produção" },
  { value: "900+", label: "patentes registradas" },
  { value: "80+", label: "países atendidos" },
];

const rows = [
  { name: "M4 Plus", tag: "Coletor Android" },
  { name: "Apollo", tag: "Etiquetas" },
  { name: "N130 BT Plus", tag: "Leitor Bluetooth" },
];

export function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % heroGallery.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="overflow-hidden border-b border-border pb-24 pt-44">
      <div className="wrap grid items-center gap-15 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Eyebrow className="mb-6">Fabricante global · Distribuição no Brasil</Eyebrow>
          <h1 className="mb-6 text-[2.375rem] leading-[1.08] md:text-[3.125rem]">
            Tecnologia de impressão e identificação na{" "}
            <span className="text-signal">escala do seu negócio</span>.
          </h1>
          <p className="mb-9 max-w-[30rem] text-[1.0625rem] text-muted-foreground">
            Impressoras térmicas, coletores de dados, leitores de código de barras e etiquetas — o
            mesmo portfólio que a HPRT exporta para 80 países, com estoque, suporte e preço pensados
            para o Brasil.
          </p>
          <div className="mb-14 flex flex-wrap gap-3.5">
            <Btn href="/produtos">Ver o portfólio completo</Btn>
            <Btn href="/por-que-hprt" variant="ghost">
              Nosso posicionamento
            </Btn>
          </div>
          <dl className="flex flex-wrap gap-9 font-mono text-[0.78rem] text-faint">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="mb-0.5 font-display text-xl font-semibold text-foreground">
                  {m.value}
                </dt>
                <dd>{m.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface px-8 py-10">
          <div className="relative h-[16.25rem] overflow-hidden border-b border-border bg-background">
            {heroGallery.map((src, i) => (
              <img
                key={src}
                src={src}
                alt="Equipamento HPRT em operação"
                loading={i === 0 ? "eager" : "lazy"}
                className={cn(
                  "absolute inset-0 size-full object-cover transition-opacity duration-1000",
                  i === idx ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
          {rows.map((r, i) => (
            <div
              key={r.name}
              className={cn(
                "flex items-center justify-between py-4",
                i < rows.length - 1 && "border-b border-border",
              )}
            >
              <b className="text-[0.9rem] font-semibold text-foreground">{r.name}</b>
              <span className="rounded-[2px] bg-surface-2 px-2 py-[3px] font-mono text-[0.65rem] tracking-[0.06em] text-muted-foreground">
                {r.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
