import { useCountUp, useReveal } from "@/hooks/use-reveal";
import { SectionHead } from "./ui";

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, text } = useCountUp(value, suffix);
  return (
    <div>
      <span ref={ref} className="block font-display text-[2.125rem] font-semibold text-foreground">
        {text}
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.06em] text-faint">{label}</span>
    </div>
  );
}

export function Stats() {
  return (
    <section className="border-b border-border bg-surface py-11">
      <div className="wrap grid grid-cols-2 gap-6 md:grid-cols-4">
        <Stat value={2000} suffix="+" label="Colaboradores" />
        <Stat value={400} suffix="+" label="Engenheiros em P&D" />
        <Stat value={120} suffix="+" label="Parceiros no mundo" />
        <div>
          <span className="block font-display text-[2.125rem] font-semibold text-foreground">
            SP
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-faint">
            Estoque e suporte local
          </span>
        </div>
      </div>
    </section>
  );
}

const pillars = [
  {
    num: "01",
    label: "Escala fabril",
    title: "Fabricação própria em massa",
    desc: "56 linhas de produção, milhares de colaboradores e uma cadeia verticalizada que controla a tecnologia da matéria-prima ao produto final.",
  },
  {
    num: "02",
    label: "Engenharia interna",
    title: "Tecnologia de origem",
    desc: "Cabeças de impressão, mecanismos térmicos, RFID e firmware desenvolvidos internamente — não licenciados, não adaptados.",
  },
  {
    num: "03",
    label: "Portfólio completo",
    title: "Uma só fabricante, toda a cadeia",
    desc: "Etiquetas industriais, cupom fiscal, leitores, coletores, pulseiras, A4 portátil e cartão. Tudo integrado sob a mesma engenharia.",
  },
  {
    num: "04",
    label: "Brasil",
    title: "Suporte e estoque local",
    desc: "Distribuição própria em São Paulo, com a Cogra. Peças, consumíveis e atendimento técnico no mesmo país da sua operação.",
  },
];

export function Positioning() {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id="positioning" className="bg-surface py-30">
      <div className="wrap">
        <SectionHead
          eyebrow="Posicionamento"
          title="A autoridade térmica global, com suporte e estoque no Brasil."
        >
          A HPRT Brasil traz a escala de uma das maiores fabricantes de tecnologia de impressão do
          mundo — e aproxima essa robustez da sua operação, com distribuição, peças e atendimento em
          São Paulo.
        </SectionHead>

        <div
          ref={reveal.ref}
          className={`${reveal.className} grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-4`}
        >
          {pillars.map((p) => (
            <div
              key={p.num}
              className="flex flex-col justify-between bg-background p-8 transition-colors duration-200 hover:bg-surface"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-display text-3xl font-bold text-foreground">{p.num}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                    {p.label}
                  </span>
                </div>
                <h3 className="mb-3 text-[1.25rem] leading-tight">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
              <div className="mt-8 h-1 w-8 bg-signal" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GlobalTrust() {
  const brands = ["KFC", "Apple Retail", "7-Eleven", "Starbucks"];
  return (
    <section className="border-y border-border bg-surface py-[5.625rem]">
      <div className="wrap">
        <SectionHead
          eyebrow="Escala global · não é case Brasil"
          title="Marcas que confiam internacionalmente na Hanin | HPRT"
        >
          Deployments internacionais da fabricante por trás da HPRT — não operações no Brasil.
          Placeholder de texto até confirmação de autorização de uso de marca/logo com a Hanin.
        </SectionHead>
        <div className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
          {brands.map((b) => (
            <div
              key={b}
              className="bg-background px-5 py-8 text-center font-display text-xl font-bold tracking-[-0.01em] text-faint"
            >
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

