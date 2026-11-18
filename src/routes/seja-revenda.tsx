import { getVisitorId } from "@/lib/attribution";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { PageHero } from "@/components/hprt/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/components/site/SiteRuntime";

const title = "Seja revenda HPRT Brasil — Programa de parceiros";
const description = "Revenda impressoras de etiquetas, cupom, coletores e leitores HPRT com estoque no Brasil, suporte técnico local e condições comerciais para canais.";

export const Route = createFileRoute("/seja-revenda")({
  head: () => ({
    meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }],
    links: [{ rel: "canonical", href: "https://hprtbrasil.com.br/seja-revenda" }],
  }),
  component: ResellerPage,
});

const inp = "h-12 w-full rounded-sm border border-border bg-background px-4 text-sm";
const PILLARS = [
  ["Portfólio completo", "Etiquetas industriais, desktop, cupom, coletores e leitores num só fabricante."],
  ["Estoque no Brasil", "Pronta entrega a partir de São Paulo para atender o seu cliente sem importação."],
  ["Suporte técnico local", "Engenharia de aplicação, peças e assistência para o canal e para o cliente final."],
  ["Treinamento do time", "Agenda técnica e comercial para a sua equipe vender e instalar com segurança."],
];

function ResellerPage() {
  const [sent, setSent] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true); setErr("");
    const cut = (v: string | undefined, n = 150) => (v ? v.slice(0, n) : null);
    const { error } = await supabase.from("reseller_applications").insert({ company: d.company.slice(0, 150), cnpj: cut(d.cnpj, 30), contact_name: d.contact_name.slice(0, 150),
      email: d.email.slice(0, 150), phone: d.phone.slice(0, 30), city: cut(d.city), state: cut(d.state, 2), segment: cut(d.segment), monthly_volume: cut(d.monthly_volume), message: cut(d.message, 2000), visitor_id: getVisitorId() });
    setBusy(false);
    if (error) { setErr("Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp."); return; }
    track("reseller_application", d.company); setSent(true);
  }
  return (
    <div className="min-h-screen bg-background">
      <Nav onDark />
      <main>
        <PageHero eyebrow="Programa de parceiros" title="Venda a engenharia de uma das maiores fabricantes do mundo.">
          Integradores, revendas de automação e distribuidores regionais: leve o portfólio HPRT ao seu cliente com estoque, suporte e treinamento no Brasil.
        </PageHero>
        <section className="py-20">
          <div className="wrap grid gap-16 lg:grid-cols-[1fr_1.1fr]">
            <div className="grid content-start gap-px border border-border bg-border">
              {PILLARS.map(([a, b], i) => (
                <div key={a} className="bg-background p-7"><p className="mb-2 text-xs font-semibold text-primary">0{i + 1}</p>
                  <p className="font-display text-2xl font-bold uppercase">{a}</p><p className="mt-2 text-sm text-muted-foreground">{b}</p></div>))}
            </div>
            <div className="border border-border p-8">
              {sent ? (<><h2 className="text-4xl">Cadastro recebido.</h2><p className="mt-4 text-muted-foreground">Nosso time de canais analisa o perfil e retorna em até 2 dias úteis.</p></>) : (
                <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                  <h2 className="text-3xl sm:col-span-2">Quero ser revenda</h2>
                  <input name="company" required maxLength={150} placeholder="Razão social / empresa" className={`${inp} sm:col-span-2`} />
                  <input name="cnpj" maxLength={30} placeholder="CNPJ" className={inp} />
                  <input name="contact_name" required maxLength={150} placeholder="Seu nome" className={inp} />
                  <input name="email" type="email" required maxLength={150} placeholder="E-mail corporativo" className={inp} />
                  <input name="phone" required maxLength={30} placeholder="WhatsApp" className={inp} />
                  <input name="city" maxLength={150} placeholder="Cidade" className={inp} />
                  <input name="state" maxLength={2} placeholder="UF" className={inp} />
                  <select name="segment" className={inp} defaultValue=""><option value="" disabled>Perfil da empresa</option><option>Revenda de automação</option><option>Integrador de sistemas</option><option>Distribuidor regional</option><option>Software house / ERP</option><option>Outro</option></select>
                  <select name="monthly_volume" className={inp} defaultValue=""><option value="" disabled>Volume estimado/mês</option><option>Até 10 equipamentos</option><option>11 a 50</option><option>51 a 200</option><option>Mais de 200</option></select>
                  <textarea name="message" maxLength={2000} placeholder="Conte sobre seus clientes e mercados (opcional)" className="min-h-24 rounded-sm border border-border bg-background p-4 text-sm sm:col-span-2" />
                  {err && <p className="text-sm text-destructive sm:col-span-2">{err}</p>}
                  <button disabled={busy} className="rounded-sm bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground sm:col-span-2">{busy ? "Enviando…" : "Enviar cadastro"}</button>
                </form>)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
