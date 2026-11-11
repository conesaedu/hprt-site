import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import coletorImg from "@/assets/hero-coletor-logistica.webp";
import logisticaImg from "@/assets/segmento-logistica.webp";
import industriaImg from "@/assets/segmento-industria.webp";
import varejoImg from "@/assets/segmento-varejo.webp";
import saudeImg from "@/assets/segmento-saude.webp";
import { WHATSAPP_URL } from "@/components/hprt/ContactForm";

/* ---------- 1. Hero institucional ---------- */
export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-ink text-on-ink">
      <img
        src={coletorImg}
        alt="Operador de centro de distribuição usando o coletor HPRT M4 Plus"
        width={1600}
        height={900}
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
      <div className="wrap relative flex min-h-[92vh] flex-col justify-end pb-20 pt-40">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-on-ink-muted">
          HPRT · Fabricante global · Operação no Brasil
        </p>
        <h1 className="max-w-[15ch] text-[clamp(2.75rem,6.4vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.025em]">
          Tecnologia de impressão e identificação na{" "}
          <span className="text-signal">escala do seu negócio.</span>
        </h1>
        <p className="mt-8 max-w-[34rem] text-lg text-on-ink-muted">
          Impressoras, coletores e leitores projetados e fabricados pela HPRT — com estoque, peças e
          suporte técnico no Brasil.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/produtos" search={{ linha: "all" }} className="inline-flex items-center rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-signal-soft">
            Conhecer o portfólio
          </Link>
          <Link to="/onde-comprar" className="inline-flex items-center gap-1.5 rounded-full border border-on-ink/30 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-on-ink">
            Falar com um especialista <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <dl className="mt-20 grid max-w-3xl grid-cols-3 gap-8 border-t border-on-ink/15 pt-8">
          {[["56", "linhas de produção"], ["900+", "patentes registradas"], ["80+", "países atendidos"]].map(([v, l]) => (
            <div key={l}>
              <dt className="font-display text-3xl font-semibold md:text-4xl">{v}</dt>
              <dd className="mt-1 text-sm text-on-ink-muted">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------- 2. Famílias de produto ---------- */
const families = [
  { linha: "etiquetas-industrial", name: "Impressoras industriais", desc: "Operação 24/7 em centros de distribuição e manufatura.", img: "/products/1-1-e1783344570445.webp", model: "GRAND" },
  { linha: "coletores", name: "Coletores de dados", desc: "Android robusto para inventário, expedição e campo.", img: "/products/14-e1783344505492.webp", model: "M4 Plus" },
  { linha: "leitores", name: "Leitores de código", desc: "Leitura 1D e 2D com e sem fio, do PDV à esteira.", img: "/products/53-e1783344334739.webp", model: "N130 BT Plus" },
  { linha: "etiquetas-entrada", name: "Impressoras de mesa", desc: "Etiquetagem compacta para varejo e back-office.", img: "/products/26-e1783344651149.webp", model: "APOLLO" },
  { linha: "pulseiras", name: "Pulseiras e saúde", desc: "Identificação de pacientes e controle de acesso.", img: "/products/68-e1783344441979.webp", model: "NYX" },
  { linha: "a4", name: "Portáteis A4", desc: "Documentos e recibos sem tinta, em qualquer lugar.", img: "/products/72-e1783344485881.webp", model: "MT810" },
];

export function HomeFamilies() {
  return (
    <section className="bg-background py-28 md:py-36">
      <div className="wrap">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-[18ch] text-[clamp(2.25rem,4.2vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
            Um portfólio completo. Uma única engenharia.
          </h2>
          <Link to="/produtos" search={{ linha: "all" }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-signal hover:underline">
            Ver todos os produtos <ArrowUpRight className="size-4" />
          </Link>
        </div>
        {(() => {
          const [lead, ...rest] = families;
          return (
            <>
              <Link to="/produtos" search={{ linha: lead.linha }} className="group grid items-center gap-10 border-y border-border py-14 md:grid-cols-[1.1fr_1fr]">
                <div className="flex h-[22rem] items-center justify-center bg-surface">
                  <img src={lead.img} alt={`HPRT ${lead.model}`} loading="lazy" className="max-h-[80%] w-auto max-w-[70%] object-contain transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-signal">01 — {lead.model}</span>
                  <h3 className="mt-3 text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em]">{lead.name}</h3>
                  <p className="mt-4 max-w-md text-lg text-muted-foreground">{lead.desc}</p>
                  <dl className="mt-8 grid max-w-md grid-cols-2 gap-6 border-t border-border pt-6 text-sm">
                    <div><dt className="text-muted-foreground">Cabeça de impressão</dt><dd className="mt-1 font-semibold">Kyocera</dd></div>
                    <div><dt className="text-muted-foreground">Regime</dt><dd className="mt-1 font-semibold">Operação contínua</dd></div>
                  </dl>
                  <span className="mt-8 inline-flex items-center gap-1.5 font-semibold group-hover:text-signal">Explorar linha <ArrowUpRight className="size-4" /></span>
                </div>
              </Link>
              <div className="divide-y divide-border border-b border-border">
                {rest.map((f, i) => (
                  <Link key={f.linha} to="/produtos" search={{ linha: f.linha }} className="group grid items-center gap-6 py-8 sm:grid-cols-[4rem_10rem_1fr_auto]">
                    <span className="text-sm font-semibold text-faint">{String(i + 2).padStart(2, "0")}</span>
                    <div className="flex h-24 items-center justify-center"><img src={f.img} alt={`HPRT ${f.model}`} loading="lazy" className="max-h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.06]" /></div>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.01em] group-hover:text-signal">{f.name}</h3>
                      <p className="mt-1 text-muted-foreground">{f.desc}</p>
                    </div>
                    <span className="hidden items-center gap-2 text-sm font-semibold text-muted-foreground sm:inline-flex">{f.model} <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                  </Link>
                ))}
              </div>
              <div className="mt-16 grid gap-8 bg-ink p-10 text-on-ink md:grid-cols-[auto_1fr] md:items-center md:p-14">
                <div className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-tight text-signal">Kyocera</div>
                <p className="max-w-2xl text-lg text-on-ink-muted">
                  <span className="font-semibold text-on-ink">As impressoras HPRT usam cabeças de impressão térmica Kyocera</span> — referência mundial em durabilidade e precisão de ponto. O resultado é código de barras e 2D legível na primeira leitura, turno após turno.
                </p>
              </div>
            </>
          );
        })()}
      </div>
    </section>
  );
}

/* ---------- 3. Segmentos ---------- */
const segments = [
  { title: "Logística", desc: "Etiquetagem de alto volume e coleta de dados em docas e armazéns.", img: logisticaImg, to: "/solucoes" },
  { title: "Indústria", desc: "Rastreabilidade de linha, identificação de lotes e expedição.", img: industriaImg, to: "/solucoes" },
  { title: "Varejo", desc: "Precificação, PDV e leitura rápida no balcão.", img: varejoImg, to: "/solucoes" },
  { title: "Saúde", desc: "Pulseiras de pacientes e rastreio de amostras e materiais.", img: saudeImg, to: "/solucoes" },
];

export function HomeSegments() {
  return (
    <section className="bg-surface py-28 md:py-36">
      <div className="wrap">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Soluções por operação</p>
        <h2 className="mb-16 max-w-[20ch] text-[clamp(2.25rem,4.2vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
          Feito para o chão de operação real.
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {segments.map((s, i) => (
            <Link key={s.title} to={s.to} className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "md:row-span-2 md:aspect-auto" : ""} aspect-[16/11]`}>
              <img src={s.img} alt={`Operação de ${s.title.toLowerCase()}`} width={1280} height={960} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-on-ink">
                <h3 className="text-3xl font-semibold">{s.title}</h3>
                <p className="mt-2 max-w-sm text-on-ink-muted">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. Capacidade global (escuro) ---------- */
export function HomeCapability() {
  const items = [
    ["56", "linhas de produção", "Fábrica própria em Xiamen, da placa ao chassi."],
    ["400+", "engenheiros em P&D", "Cabeças de impressão, firmware e mecânica desenvolvidos em casa."],
    ["900+", "patentes", "Propriedade intelectual em impressão e identificação."],
    ["80+", "países", "O mesmo padrão de qualidade exportado para todos os continentes."],
  ];
  return (
    <section className="bg-ink py-28 text-on-ink md:py-36">
      <div className="wrap">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-on-ink-muted">Capacidade HPRT</p>
        <h2 className="max-w-[18ch] text-[clamp(2.25rem,4.2vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
          Uma das maiores fabricantes de impressão do mundo, <span className="text-signal">agora ao lado do seu negócio.</span>
        </h2>
        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl bg-on-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([v, l, d]) => (
            <div key={l} className="bg-ink p-8">
              <div className="font-display text-5xl font-semibold tracking-tight">{v}</div>
              <div className="mt-2 text-sm font-semibold">{l}</div>
              <p className="mt-4 text-sm text-on-ink-muted">{d}</p>
            </div>
          ))}
        </div>
        <Link to="/por-que-hprt" className="mt-12 inline-flex items-center gap-1.5 text-sm font-semibold text-signal hover:underline">
          Por que HPRT <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

/* ---------- 5. Destaque de produto ---------- */
export function HomeFlagship() {
  return (
    <section className="bg-background py-28 md:py-36">
      <div className="wrap grid items-center gap-16 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Em destaque · Impressora industrial</p>
          <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.03em]">GRAND</h2>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Alta performance 24/7 para centros de distribuição e manufatura. Construção metálica,
            até 14 ips e conectividade completa para integrar ao seu sistema.
          </p>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
            {[["14 ips", "velocidade"], ["203/300", "dpi"], ["24/7", "operação"]].map(([v, l]) => (
              <div key={l}><dt className="font-display text-2xl font-semibold">{v}</dt><dd className="text-sm text-muted-foreground">{l}</dd></div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/produtos/$slug" params={{ slug: "grand" }} className="inline-flex rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-signal-soft">Conhecer a GRAND</Link>
            <Link to="/produtos" search={{ linha: "etiquetas-industrial" }} className="inline-flex rounded-full border border-border-strong px-7 py-3.5 text-sm font-semibold hover:border-foreground">Linha industrial</Link>
          </div>
        </div>
        <div className="order-1 flex aspect-square items-center justify-center rounded-3xl bg-surface lg:order-2">
          <img src="/products/1-1-e1783344570445.webp" alt="Impressora industrial HPRT GRAND" loading="lazy" className="w-[78%] object-contain drop-shadow-2xl" />
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. Rede e presença local ---------- */
export function HomeNetwork() {
  const rows = [
    ["Centro de distribuição", "São Paulo — SP, estoque físico no país"],
    ["Peças e continuidade", "Reposição e assistência técnica local"],
    ["Canais autorizados", "Revendas e integradores em todo o Brasil"],
    ["Capacitação", "Agenda de treinamentos técnicos e comerciais"],
  ];
  return (
    <section className="border-t border-border bg-background py-28 md:py-36">
      <div className="wrap grid gap-16 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Presença local</p>
          <h2 className="max-w-[16ch] text-[clamp(2.25rem,4.2vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
            Escala global. Estrutura no Brasil.
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground">
            A operação brasileira é conduzida em parceria com a Cogra, distribuidora B2B com 25 anos de
            mercado.
          </p>
        </div>
        <ul>
          {rows.map(([k, v]) => (
            <li key={k} className="flex flex-col gap-1 border-t border-border py-6 last:border-b sm:flex-row sm:items-baseline sm:justify-between">
              <span className="text-xl font-semibold">{k}</span>
              <span className="text-muted-foreground">{v}</span>
            </li>
          ))}
          <li className="pt-8"><Link to="/treinamentos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-signal hover:underline">Ver agenda de treinamentos <ArrowUpRight className="size-4" /></Link></li>
        </ul>
      </div>
    </section>
  );
}

/* ---------- 7. Contato ---------- */
export function HomeContact() {
  return (
    <section className="bg-ink py-28 text-on-ink md:py-36">
      <div className="wrap text-center">
        <h2 className="mx-auto max-w-[20ch] text-[clamp(2.25rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
          Vamos dimensionar a tecnologia certa para a sua operação.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-on-ink-muted">Fale com um especialista ou encontre um canal autorizado HPRT.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/onde-comprar" className="inline-flex rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-signal-soft">Falar com um especialista</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener" className="inline-flex rounded-full border border-on-ink/30 px-7 py-3.5 text-sm font-semibold hover:border-on-ink">WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
