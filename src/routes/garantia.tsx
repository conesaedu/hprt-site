import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { Eyebrow } from "@/components/hprt/ui";
import { Download, ShieldCheck, AlertTriangle, FileText } from "lucide-react";
import cert from "@/assets/certificado-garantia-hprt.pdf.asset.json";

const title = "Garantia HPRT Brasil — Prazos e condições oficiais";
const description =
  "Até 3 anos de garantia de fábrica nos equipamentos HPRT. Veja os prazos por tipo de produto, a cobertura da cabeça de impressão e como acionar a garantia.";

export const Route = createFileRoute("/garantia")({
  component: GarantiaPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/garantia" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/garantia" }],
  }),
});

const table: [string, string, string][] = [
  ["Impressora térmica de etiquetas", "2 anos", "6 meses ou 30 km*"],
  ["Impressora térmica de pulseiras", "2 anos", "6 meses ou 30 km*"],
  ["Impressora de cartões PVC", "3 anos", "6 meses"],
  ["Impressora de cupom", "3 anos", "6 meses ou 100 km*"],
  ["Balança com tela Android e IA", "1 ano", "6 meses ou 20 km*"],
  ["Terminal coletor de dados Android", "1 ano", "Não se aplica"],
  ["Leitor de códigos de barras", "1 ano", "Não se aplica"],
  ["Impressora de etiquetas doméstica (Qutie)", "6 meses", "6 meses"],
  ["Impressora de folha A4 portátil", "6 meses", "6 meses"],
  ["Câmera fotográfica com impressora acoplada", "6 meses", "6 meses"],
];

const voids = [
  ["Uso indevido", "Sobrecarga, materiais não recomendados, instalação incorreta ou manuseio impróprio."],
  ["Reparo não autorizado", "Manutenção, modificação ou reparo feito fora da assistência técnica oficial."],
  ["Danos físicos", "Quedas, impactos, exposição a líquidos, fogo ou outros acidentes."],
  ["Peças não originais", "Instalação de componentes ou modificações não autorizadas."],
  ["Ambiente inadequado", "Altas temperaturas, umidade excessiva ou presença de poeira."],
  ["Instruções não seguidas", "Limpeza, armazenamento e operação fora do manual do usuário."],
  ["Número de série alterado", "Remoção ou alteração do número de série ou da etiqueta de identificação."],
];

function GarantiaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <section className="border-b border-border pb-20 pt-44">
          <div className="wrap">
            <Eyebrow className="mb-6">Garantia de fábrica</Eyebrow>
            <h1 className="mb-6 max-w-[46rem] text-[2.375rem] leading-[1.08] md:text-[3.125rem]">
              Até 3 anos de garantia. Direto do fabricante.
            </h1>
            <p className="mb-10 max-w-[40rem] text-lg text-muted-foreground">
              A HPRT assegura ao comprador original que o produto está livre de defeitos de fabricação.
              Se houver defeito no período, a HPRT troca, repara ou substitui as peças sem custo.
            </p>
            <a
              href={cert.url}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Download className="size-4" /> Baixar certificado oficial (PDF)
            </a>
          </div>
        </section>

        <section className="border-b border-border py-20">
          <div className="wrap">
            <Eyebrow className="mb-4">Prazos por produto</Eyebrow>
            <h2 className="mb-10 text-3xl">Período de garantia</h2>
            <div className="overflow-x-auto border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="p-4 font-semibold">Tipo de produto</th>
                    <th className="p-4 font-semibold">Equipamento<span className="block text-xs font-normal text-muted-foreground">exceto cabeça de impressão</span></th>
                    <th className="p-4 font-semibold">Cabeça de impressão</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map(([p, e, c]) => (
                    <tr key={p} className="border-t border-border">
                      <td className="p-4">{p}</td>
                      <td className="p-4 font-semibold text-primary">{e}</td>
                      <td className="p-4 text-muted-foreground">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">* O que ocorrer primeiro (distância impressa).</p>
          </div>
        </section>

        <section className="border-b border-border py-20">
          <div className="wrap">
            <Eyebrow className="mb-4">Cobertura</Eyebrow>
            <h2 className="mb-10 text-3xl">O que anula a garantia</h2>
            <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {voids.map(([t, d]) => (
                <div key={t} className="bg-background p-6">
                  <AlertTriangle className="mb-3 size-5 text-primary" />
                  <h3 className="mb-2 text-lg">{t}</h3>
                  <p className="text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="wrap grid gap-10 md:grid-cols-2">
            <div>
              <Eyebrow className="mb-4">Como acionar</Eyebrow>
              <h2 className="mb-6 text-3xl">Solicitar garantia</h2>
              <ol className="space-y-4 text-muted-foreground">
                <li className="flex gap-3"><FileText className="mt-0.5 size-5 shrink-0 text-primary" />Procure a revenda autorizada onde comprou, com a nota fiscal de compra.</li>
                <li className="flex gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />Descreva o problema em detalhe. A revenda encaminha o caso ao importador oficial no Brasil e passa as orientações.</li>
              </ol>
            </div>
            <div className="border border-border bg-secondary p-8">
              <h3 className="mb-3 text-xl">Não sabe onde comprou ou precisa de ajuda?</h3>
              <p className="mb-6 text-sm text-muted-foreground">Nossa equipe orienta você e indica a revenda autorizada mais próxima.</p>
              <Link to="/onde-comprar" className="font-semibold text-primary hover:underline">Falar com a equipe HPRT Brasil →</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
