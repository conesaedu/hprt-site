import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { Eyebrow } from "@/components/hprt/ui";
import { Mail, Clock, AlertTriangle, MessageCircle, CalendarCheck, Download } from "lucide-react";

const title = "Suporte técnico HPRT Brasil — Chamados, RMA e agendamento";
const description =
  "Suporte técnico oficial HPRT no Brasil pela Cogra Distribuidora: abertura de chamado, casos urgentes, RMA e agendamento de instalação com especialistas.";

export const Route = createFileRoute("/suporte")({
  component: SuportePage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/suporte" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/suporte" }],
  }),
});

const EMAIL = "suportetecnico@cogra.com.br";
const wa = (n: string) => `https://wa.me/55${n.replace(/\D/g, "")}`;

const team = [
  { name: "Charles Fernandes", role: "Especialista técnico", phone: "11 94375-8064" },
  { name: "Jefferson Luz", role: "Especialista técnico", phone: "11 97173-3807" },
  { name: "Davison Riveiro", role: "Especialista técnico", phone: "11 93365-8537" },
  { name: "Letícia Alves", role: "RMA e agendamento de treinamentos", phone: "11 94481-6739", email: "leticia.alves@cogra.com.br" },
  { name: "William Oliveira", role: "Administração geral HPRT", phone: "11 91770-1736" },
];

function SuportePage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <section className="border-b border-border pb-20 pt-44">
          <div className="wrap">
            <Eyebrow className="mb-6">Suporte técnico oficial</Eyebrow>
            <h1 className="mb-6 max-w-[46rem] text-[2.375rem] leading-[1.08] md:text-[3.125rem]">
              Engenharia HPRT. Suporte no Brasil.
            </h1>
            <p className="mb-10 max-w-[40rem] text-lg text-muted-foreground">
              A Cogra Distribuidora, distribuidora exclusiva HPRT no Brasil, faz o suporte técnico oficial de toda a linha:
              instalação, configuração, homologação e atendimento remoto.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90">
                <Mail className="size-4" /> Abrir chamado
              </a>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4 text-primary" /> Seg a sex, 08h às 18h (Brasília), exceto feriados
              </span>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-20">
          <div className="wrap grid gap-12 md:grid-cols-2">
            <div>
              <Eyebrow className="mb-4">Passo 1 · obrigatório</Eyebrow>
              <h2 className="mb-6 text-3xl">Abra o chamado por e-mail</h2>
              <p className="mb-4 text-muted-foreground">Envie para <a className="font-semibold text-primary hover:underline" href={`mailto:${EMAIL}`}>{EMAIL}</a> com:</p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Modelo do equipamento</li>
                <li>Número de série</li>
                <li>Descrição detalhada do problema</li>
                <li>Fotos, vídeos ou arquivos, quando houver</li>
                <li>Empresa e contato responsável</li>
              </ul>
            </div>
            <div>
              <Eyebrow className="mb-4">Depois do envio</Eyebrow>
              <h2 className="mb-6 text-3xl">O que acontece</h2>
              <ol className="space-y-4">
                {["Você recebe um número de chamado para acompanhar.", "A equipe técnica analisa as informações.", "Um especialista entra em contato para seguir o atendimento."].map((t, i) => (
                  <li key={t} className="flex gap-4"><span className="font-display text-2xl text-primary">0{i + 1}</span><span className="pt-1 text-muted-foreground">{t}</span></li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary py-20">
          <div className="wrap grid gap-10 md:grid-cols-2">
            <div>
              <AlertTriangle className="mb-4 size-6 text-primary" />
              <h2 className="mb-4 text-3xl">Caso urgente</h2>
              <p className="mb-3 text-muted-foreground">1. Abra o chamado por e-mail. 2. Chame a equipe no WhatsApp informando o número do chamado.</p>
              <p className="text-sm text-muted-foreground">O atendimento imediato depende da disponibilidade da equipe, da agenda do dia e da fila. O WhatsApp agiliza casos críticos, mas não substitui o chamado.</p>
            </div>
            <div>
              <CalendarCheck className="mb-4 size-6 text-primary" />
              <h2 className="mb-4 text-3xl">Para revendas</h2>
              <p className="mb-3 text-muted-foreground">Ainda com pouca experiência num modelo? Teste o equipamento completo antes de levar ao cliente: valida a configuração e evita retrabalho em campo.</p>
              <p className="text-muted-foreground">Agende um horário com a equipe para acompanhar a instalação por telefone, WhatsApp ou acesso remoto — impressoras, coletores, leitores e softwares.</p>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-20">
          <div className="wrap">
            <Eyebrow className="mb-4">Equipe</Eyebrow>
            <h2 className="mb-10 text-3xl">Especialistas e contatos</h2>
            <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {team.map((p) => (
                <div key={p.name} className="bg-background p-6">
                  <h3 className="text-lg">{p.name}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{p.role}</p>
                  <a href={wa(p.phone)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                    <MessageCircle className="size-4" /> {p.phone}
                  </a>
                  {p.email && <a href={`mailto:${p.email}`} className="mt-2 block text-sm text-muted-foreground hover:text-primary">{p.email}</a>}
                </div>
              ))}
              <div className="bg-background p-6">
                <h3 className="text-lg">RMA e chamados</h3>
                <p className="mb-4 text-sm text-muted-foreground">Abertura oficial</p>
                <a href={`mailto:${EMAIL}`} className="text-sm font-semibold text-primary hover:underline">{EMAIL}</a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="wrap flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="mb-2 text-2xl">Drivers e utilitários oficiais</h2>
              <p className="text-muted-foreground">Tudo o que você precisa para instalar está na central de downloads.</p>
            </div>
            <div className="flex gap-6">
              <Link to="/downloads" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"><Download className="size-4" /> Central de downloads</Link>
              <Link to="/garantia" className="font-semibold text-primary hover:underline">Garantia →</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
