import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listTrainings, registerForTraining, type Training } from "@/lib/trainings.functions";
import { Nav } from "@/components/hprt/Nav";
import { Footer } from "@/components/hprt/Footer";
import { Eyebrow, Btn, SectionHead } from "@/components/hprt/ui";
import { cn } from "@/lib/utils";
import { Calendar, CheckCircle, MapPin, Monitor, Users, X } from "lucide-react";

const title = "Treinamentos HPRT Brasil — Capacitação técnica e comercial";
const description =
  "Treinamentos técnicos e comerciais com a engenharia HPRT. Gratuitos para clientes que compram conosco. Inscreva sua equipe.";

const trainingsQueryOptions = queryOptions({
  queryKey: ["trainings"],
  queryFn: () => listTrainings(),
  staleTime: 1000 * 60 * 5,
});

export const Route = createFileRoute("/treinamentos")({
  component: TrainingsPage,
  loader: ({ context }) => context.queryClient.ensureQueryData(trainingsQueryOptions),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/treinamentos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/treinamentos" }],
  }),
});

function TrainingsPage() {
  const { data: trainings } = useSuspenseQuery(trainingsQueryOptions);
  const [selected, setSelected] = useState<Training | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <TrainingList trainings={trainings} onRegister={setSelected} />
        <Faq />
        <Cta />
      </main>
      <Footer />
      {selected && (
        <RegistrationModal
          training={selected}
          onClose={() => setSelected(null)}
          onSuccess={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function Hero() {
  return (
    <section className="border-b border-border pb-24 pt-44">
      <div className="wrap">
        <Eyebrow className="mb-6">Capacitação HPRT</Eyebrow>
        <h1 className="mb-6 max-w-[48rem] text-[2.375rem] leading-[1.08] md:text-[3.125rem]">
          Capacite sua equipe direto com quem entende de impressão e identificação.
        </h1>
        <p className="mb-9 max-w-[38rem] text-[1.0625rem] text-muted-foreground">
          Treinamentos técnicos e comerciais com a engenharia HPRT. Gratuitos para clientes que
          compram conosco.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-foreground">
          <span className="inline-flex items-center gap-2 rounded-sm bg-surface px-4 py-2.5">
            <CheckCircle className="size-4 text-signal" />
            Sem custo para clientes HPRT Brasil
          </span>
          <span className="inline-flex items-center gap-2 rounded-sm bg-surface px-4 py-2.5">
            <Monitor className="size-4 text-signal" />
            Online, presencial e híbrido
          </span>
        </div>
      </div>
    </section>
  );
}

function TrainingList({
  trainings,
  onRegister,
}: {
  trainings: Training[];
  onRegister: (t: Training) => void;
}) {
  return (
    <section id="agenda" className="py-24">
      <div className="wrap">
        <SectionHead
          eyebrow="Agenda"
          title="Próximos treinamentos"
        >
          Escolha o treinamento, envie os dados da sua equipe e reserve as vagas. Vamos confirmar sua
          inscrição por e-mail.
        </SectionHead>

        {trainings.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-10 text-center">
            <p className="text-muted-foreground">
              Nenhum treinamento aberto no momento. Deixe seu contato conosco e avisamos quando houver
              novas datas.
            </p>
            <div className="mt-6">
              <Btn href="/#trust" variant="ghost">
                Falar com um especialista
              </Btn>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainings.map((t) => (
              <TrainingCard key={t.id} training={t} onRegister={() => onRegister(t)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TrainingCard({ training, onRegister }: { training: Training; onRegister: () => void }) {
  const date = new Date(training.date);
  const isFull = training.spots <= 0;

  return (
    <article className="flex flex-col rounded-lg border border-border bg-surface p-6 transition-colors hover:border-border-strong">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span
          className={cn(
            "rounded-[2px] px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.08em]",
            training.type === "técnico"
              ? "bg-background text-muted-foreground"
              : "bg-signal/10 text-signal",
          )}
        >
          {training.type}
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[0.75rem] text-muted-foreground">
          <Users className="size-3.5" />
          {isFull ? "Esgotado" : `${training.spots} vagas`}
        </span>
      </div>

      <h3 className="mb-3 text-[1.25rem] leading-tight font-semibold text-foreground">
        {training.title}
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{training.description}</p>

      <div className="mt-auto space-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-faint" />
          <span>{formatDateTime(date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-faint" />
          <span>
            {training.format} · {training.location}
          </span>
        </div>
        <div className="text-xs text-faint">Público: {training.audience}</div>
      </div>

      <button
        onClick={onRegister}
        disabled={isFull}
        className={cn(
          "mt-6 w-full rounded-sm px-5 py-3 text-sm font-semibold transition-[transform,background-color]",
          isFull
            ? "cursor-not-allowed bg-muted text-muted-foreground"
            : "bg-signal text-primary-foreground hover:-translate-y-px hover:bg-signal-soft",
        )}
      >
        {isFull ? "Vagas esgotadas" : "Inscrever-se"}
      </button>
    </article>
  );
}

function RegistrationModal({
  training,
  onClose,
  onSuccess,
}: {
  training: Training;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    isClient: false,
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const register = useServerFn(registerForTraining);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      await register({
        data: {
          trainingId: training.id,
          name: form.name,
          email: form.email,
          company: form.company,
          phone: form.phone,
          isClient: form.isClient,
        },
      });
      setStatus("success");
      setTimeout(onSuccess, 2000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro ao enviar inscrição. Tente novamente.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-lg border border-border bg-background p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="size-5" />
        </button>

        {status === "success" ? (
          <div className="py-8 text-center">
            <CheckCircle className="mx-auto mb-4 size-12 text-signal" />
            <h3 className="mb-2 text-xl font-semibold">Inscrição recebida</h3>
            <p className="text-muted-foreground">
              Vamos confirmar sua vaga por e-mail em breve. Obrigado por escolher a HPRT Brasil.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="mb-2 inline-block rounded-[2px] bg-signal/10 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-signal">
                {training.type}
              </span>
              <h3 className="text-xl font-semibold leading-tight">{training.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDateTime(new Date(training.date))} · {training.format}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
                  Nome completo
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
                  E-mail corporativo
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                  placeholder="voce@empresa.com.br"
                />
              </div>
              <div>
                <label htmlFor="company" className="mb-1 block text-sm font-medium text-foreground">
                  Empresa
                </label>
                <input
                  id="company"
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className="w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground">
                  Telefone <span className="text-faint">(opcional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.isClient}
                  onChange={(e) => setForm((f) => ({ ...f, isClient: e.target.checked }))}
                  className="mt-1 size-4 rounded-sm border-border text-signal focus:ring-ring"
                />
                <span className="text-sm text-muted-foreground">
                  Já sou cliente HPRT Brasil (treinamento sem custo para clientes ativos).
                </span>
              </label>

              {errorMsg && (
                <div className="rounded-sm border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-sm bg-signal px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-signal-soft disabled:opacity-60"
              >
                {status === "submitting" ? "Enviando..." : "Confirmar inscrição"}
              </button>
              <p className="text-center text-xs text-faint">
                Ao se inscrever, você autoriza o contato da HPRT Brasil sobre este treinamento.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Faq() {
  const items = [
    {
      q: "É necessário ser cliente HPRT para participar?",
      a: "Não. Qualquer profissional pode se inscrever. Clientes HPRT Brasil ativos têm o treinamento sem custo; não clientes recebem uma proposta comercial após a inscrição.",
    },
    {
      q: "Como recebo o link ou acesso ao treinamento?",
      a: "Após confirmar sua vaga, enviamos o link da sala online, o endereço presencial ou as instruções do evento híbrido para o e-mail informado.",
    },
    {
      q: "Há certificado de participação?",
      a: "Sim. Emitimos certificado digital para participantes que confirmarem presença nos treinamentos técnicos e comerciais.",
    },
  ];

  return (
    <section className="border-y border-border bg-surface py-24">
      <div className="wrap">
        <SectionHead eyebrow="Dúvidas" title="Perguntas frequentes">
          Informações sobre inscrição, acesso e certificados.
        </SectionHead>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.q} className="rounded-lg border border-border bg-background p-6">
              <h3 className="mb-2 text-[1.0625rem] font-semibold leading-tight">{item.q}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="py-24">
      <div className="wrap">
        <div className="flex flex-col items-start justify-between gap-8 rounded-lg border border-border bg-surface p-8 md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-[1.75rem] leading-tight font-semibold">
              Quer um treinamento sob medida para sua equipe?
            </h2>
            <p className="text-muted-foreground">
              Fale conosco e montamos uma capacitação exclusiva na sua operação ou em nossa sede.
            </p>
          </div>
          <Btn href="/#trust">Falar com um especialista</Btn>
        </div>
      </div>
    </section>
  );
}

function formatDateTime(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}
