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
