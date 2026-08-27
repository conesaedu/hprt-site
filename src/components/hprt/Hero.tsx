import { useEffect, useState } from "react";
import coletorImg from "@/assets/hero-coletor-logistica.jpg";
import etiquetasImg from "@/assets/hero-etiquetas-varejo.jpg";
import leitorImg from "@/assets/hero-leitor-pdv.jpg";
import { cn } from "@/lib/utils";
import { Btn, Eyebrow } from "./ui";

const meta = [
  { value: "56", label: "linhas de produção" },
  { value: "900+", label: "patentes registradas" },
  { value: "80+", label: "países atendidos" },
];

const showcase = [
  {
    slug: "m4-plus",
    name: "M4 Plus",
    tag: "Coletor Android",
    img: coletorImg,
    alt: "Operador de centro de distribuição usando coletor de dados Android para ler etiqueta de caixa",
  },
  {
    slug: "apollo",
    name: "Apollo",
    tag: "Etiquetas",
    img: etiquetasImg,
    alt: "Impressora térmica de etiquetas em bancada de retaguarda de loja imprimindo etiqueta de código de barras",
  },
  {
    slug: "n130-bt-plus",
    name: "N130 BT Plus",
    tag: "Leitor Bluetooth",
    img: leitorImg,
    alt: "Operadora de loja lendo o código de barras de um produto com leitor sem fio no ponto de venda",
  },
];

export function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % showcase.length), 2800);
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
            {showcase.map((item, i) => (
              <img
                key={item.slug}
                src={item.img}
                alt={`${item.name} — ${item.tag} HPRT`}
                loading={i === 0 ? "eager" : "lazy"}
                className={cn(
                  "absolute inset-0 size-full object-contain p-6 transition-opacity duration-1000",
                  i === idx ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
          {showcase.map((item, i) => (
            <div
              key={item.name}
              className={cn(
                "flex items-center justify-between py-4 transition-colors",
                i < showcase.length - 1 && "border-b border-border",
              )}
            >
              <b
                className={cn(
                  "text-[0.9rem] font-semibold transition-colors",
                  i === idx ? "text-signal" : "text-foreground",
                )}
              >
                {item.name}
              </b>
              <span
                className={cn(
                  "rounded-[2px] px-2 py-[3px] font-mono text-[0.65rem] tracking-[0.06em] transition-colors",
                  i === idx
                    ? "bg-signal/10 text-signal"
                    : "bg-surface-2 text-muted-foreground",
                )}
              >
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
