import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { Eyebrow } from "@/components/hprt/ui";

const title = "Política de Privacidade e Cookies — HPRT Brasil";
const description = "Como a HPRT Brasil trata dados de visitantes, formulários e cookies no site hprtbrasil.com.br, e como mudar suas escolhas.";

export const Route = createFileRoute("/privacidade")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacidade" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacidade" }],
  }),
});

const sections: [string, string[]][] = [
  ["Quem somos", [
    "Este site é operado pela HPRT Brasil, com distribuição da Cogra. Dúvidas sobre seus dados ou pedidos de acesso, correção ou exclusão podem ser enviados pelo WhatsApp +55 11 93429-4095 ou pelos formulários de contato do site.",
  ]],
  ["Dados que você nos envia", [
    "Quando você preenche um formulário (contato, cotação, revenda ou inscrição em treinamento), guardamos os dados informados — como nome, empresa, e-mail, telefone e mensagem — para responder ao seu pedido e para o relacionamento comercial. Esses dados ficam em nossa base e são acessados somente pela equipe autorizada.",
    "Ao clicar em um botão do WhatsApp, você é levado ao WhatsApp, que trata a conversa conforme a política da Meta.",
  ]],
  ["Estatísticas de visitas (Lovable)", [
    "Usamos as estatísticas de visitas da Lovable, a plataforma que hospeda o site. Ela não usa cookies, não guarda nada no seu dispositivo, não mantém endereços IP e não identifica visitantes. A Lovable coleta esses dados para nós. A política de privacidade da Lovable (https://lovable.dev/privacy) explica como ela trata esses dados.",
    "Ela registra as páginas visitadas, de onde o visitante veio, país, navegador, sistema operacional e tipo de dispositivo, tempo de permanência, velocidade de carregamento das páginas, erros e cliques em botões e links. Os dados detalhados ficam guardados por 90 dias e os resumos diários por um ano.",
    "Os cliques só são registrados depois que você aceita a medição de uso. Visitas às páginas, tempo na página, velocidade e erros são registrados para todos os visitantes, sem cookies e sem identificar ninguém. Para visitantes do Brasil, da União Europeia/EEE, do Reino Unido, da Suíça e do Canadá, a medição adicional só acontece depois do aceite; para os demais, acontece salvo se recusarem. Ela nunca acontece quando o navegador envia o sinal Global Privacy Control, mesmo após um aceite. Sua escolha fica salva no seu navegador por até 12 meses.",
  ]],
  ["Medição própria da HPRT Brasil", [
    "Registramos em nossa base as páginas vistas, a origem da visita (parâmetros de campanha como utm e identificadores de clique de anúncio) e ações como envio de formulário e clique no WhatsApp, para entender quais canais trazem contatos.",
    "Somente se você aceitar a medição de uso, guardamos no seu navegador um código anônimo e aleatório que permite reconhecer uma nova visita do mesmo navegador por até 90 dias. Sem o aceite, nenhum código é guardado no seu dispositivo.",
  ]],
  ["Publicidade (Google)", [
    "Usamos a tag do Google (Google Ads / Google Tag Manager) para medir os resultados dos nossos anúncios, como contatos gerados por formulário e WhatsApp. Com seu aceite de publicidade, o Google pode definir cookies no seu navegador e receber dados da sua visita, conforme a política de privacidade do Google. Sem o aceite, a tag funciona em modo restrito, sem cookies de publicidade.",
  ]],
  ["Outros serviços", [
    "As fontes do site são carregadas do Google Fonts, que recebe o endereço IP do navegador para entregar os arquivos. Links para Instagram, LinkedIn e YouTube levam a essas redes, que seguem as próprias políticas.",
    "A área administrativa usa um cookie/armazenamento de sessão necessário apenas para a equipe que faz login.",
  ]],
  ["Suas escolhas", [
    "Você pode aceitar, recusar ou mudar suas escolhas a qualquer momento pelo link “Configurações de cookies” no rodapé de todas as páginas. Você também pode exercer os direitos previstos na LGPD, como acesso, correção e exclusão dos seus dados, pelos contatos acima.",
  ]],
];

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <section className="border-b border-border pb-16 pt-44">
          <div className="wrap">
            <Eyebrow className="mb-6">Privacidade</Eyebrow>
            <h1 className="mb-6 max-w-[46rem] text-[2.375rem] leading-[1.08] md:text-[3.125rem]">Política de Privacidade e Cookies</h1>
            <p className="max-w-[40rem] text-lg text-muted-foreground">Como tratamos os dados de quem visita o site da HPRT Brasil.</p>
          </div>
        </section>
        <section className="py-16">
          <div className="wrap max-w-[48rem] space-y-10">
            {sections.map(([h, ps]) => (
              <div key={h}>
                <h2 className="mb-3 text-xl">{h}</h2>
                {ps.map((p) => <p key={p.slice(0, 30)} className="mb-3 text-muted-foreground">{p}</p>)}
              </div>
            ))}
            <button type="button" onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
              className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Abrir configurações de cookies
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
