import { useCountUp, useReveal } from "@/hooks/use-reveal";
import { comparison } from "@/lib/hprt-data";
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

export function Positioning() {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id="positioning" className="py-30">
      <div className="wrap">
        <SectionHead
          eyebrow="Posicionamento"
          title="Você não precisa pagar o prêmio de marca para ter o mesmo padrão de operação."
        >
          Quem domina essa categoria cobra o preço de dominar. A HPRT entrega a mesma cobertura de
          casos de uso, com a estrutura de uma das maiores fabricantes térmicas do mundo por trás.
        </SectionHead>

        <div
          ref={reveal.ref}
          className={`${reveal.className} overflow-hidden rounded-lg border border-border`}
        >
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-surface font-mono text-xs uppercase tracking-[0.06em] text-muted-foreground">
                <th className="border-b border-border px-6 py-5 font-normal">Critério</th>
                <th className="border-b border-border px-6 py-5 font-normal text-foreground">
                  HPRT
                </th>
                <th className="border-b border-border px-6 py-5 font-normal">
                  Alternativa premium
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={row.criterion}>
                  <td
                    className={`px-6 py-5 font-semibold text-foreground ${i < comparison.length - 1 ? "border-b border-border" : ""}`}
                  >
                    {row.criterion}
                  </td>
                  <td
                    className={`px-6 py-5 text-foreground ${i < comparison.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <span className="mr-2 font-bold text-signal">✓</span>
                    {row.hprt}
                  </td>
                  <td
                    className={`px-6 py-5 text-faint ${i < comparison.length - 1 ? "border-b border-border" : ""}`}
                  >
                    {row.other}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
