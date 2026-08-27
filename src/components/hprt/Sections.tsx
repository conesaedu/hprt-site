import { useCountUp, useReveal } from "@/hooks/use-reveal";
import { MoreLink, SectionHead } from "./ui";


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
    label: "Tecnologia própria",
    title: "Engenharia de quem fabrica",
    desc: "Tecnologias essenciais de impressão, captura e identificação desenvolvidas dentro do próprio ecossistema Hanin | HPRT, proporcionando maior controle sobre produto, evolução e compatibilidade.",
  },
  {
    num: "02",
    label: "Escala global",
    title: "Estrutura para grandes operações",
    desc: "56 linhas de produção, fabricação verticalizada e presença internacional para suportar desde projetos pontuais até grandes implantações.",
  },
  {
    num: "03",
    label: "Estrutura no Brasil",
    title: "Sua operação está aqui. Nosso suporte também.",
    desc: "A operação brasileira é conduzida em parceria com a Cogra, distribuidora B2B com 25 anos de mercado, estrutura comercial, estoque e atendimento técnico em São Paulo.",
  },
  {
    num: "04",
    label: "Peças e continuidade",
    title: "Operações críticas precisam de resposta rápida.",
    desc: "Peças e componentes essenciais das principais linhas HPRT são mantidos no Brasil para proporcionar maior agilidade ao suporte e reduzir impactos de eventuais paradas.",
  },
  {
    num: "05",
    label: "Suporte ao projeto",
    title: "Antes, durante e depois da implantação.",
    desc: "Apoio comercial e técnico para especificação, homologação, implantação e continuidade dos projetos.",
  },
  {
    num: "06",
    label: "Portfólio completo",
    title: "Mais padronização. Menos complexidade.",
    desc: "Impressoras industriais, desktop, PDV, coletores, leitores e soluções de identificação dentro do mesmo ecossistema de fabricante.",
  },
];

export function Positioning({ preview = false, hideHead = false }: { preview?: boolean; hideHead?: boolean } = {}) {
  const reveal = useReveal<HTMLDivElement>();
  const visible = preview ? pillars.slice(0, 3) : pillars;

  return (
    <section id="positioning" className="bg-surface py-30">
      <div className="wrap">
        {hideHead ? null : (
        <SectionHead
          eyebrow="Por que HPRT?"
          title="Tecnologia para entrar na sua operação. Estrutura para permanecer nela."
        >
          Adotar uma nova tecnologia em uma operação crítica exige mais do que comparar
          especificações. Disponibilidade, suporte, peças, capacidade de atendimento e continuidade
          também fazem parte da decisão. A HPRT combina escala industrial global com uma estrutura
          construída no Brasil para sustentar seus projetos.
        </SectionHead>
        )}

        <div
          ref={reveal.ref}
          className={`${reveal.className} grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-3`}
        >
          {visible.map((p) => (
            <div
              key={p.num}
              className="flex flex-col justify-between bg-background p-8 transition-colors duration-200 hover:bg-surface"
            >
              <div>
                <div className="mb-6 flex items-center justify-between gap-4">
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

        {preview ? (
          <div className="mt-9 flex justify-center">
            <MoreLink to="/por-que-hprt">Ver os 6 pilares da estrutura HPRT</MoreLink>
          </div>
        ) : (
          <div className="mt-12 border-l-2 border-signal pl-6">
            <p className="font-display text-[1.5rem] leading-[1.25] font-semibold text-foreground md:text-[1.75rem]">
              Tecnologia global para competir.
              <br />
              Estrutura local para permanecer.
            </p>
          </div>
        )}
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

