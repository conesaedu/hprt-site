import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle, MessageCircle } from "lucide-react";
import { submitLead } from "@/lib/leads.functions";
import { leadSchema, type LeadInput } from "@/lib/leads-schema";
import { SectionHead } from "./ui";
import { cn } from "@/lib/utils";

export const WHATSAPP_NUMBER = "5511934294095";
export const WHATSAPP_LABEL = "+55 11 93429-4095";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Vim pelo site da HPRT Brasil e quero falar com um especialista.",
)}`;

/** WhatsApp link with a message naming the product the visitor is looking at. */
export function whatsappFor(product?: string) {
  const msg = product
    ? `Olá! Estou avaliando a impressora HPRT ${product} no site e gostaria de falar com um especialista sobre aplicação e cotação.`
    : "Olá! Vim pelo site da HPRT Brasil e quero falar com um especialista.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

const segments = ["Varejo / PDV", "Logística", "Saúde", "Alimentação", "Indústria", "Outro"];
const needs = [
  "Etiquetas e códigos",
  "Cupom / PDV",
  "Coletor de dados",
  "Leitor de código",
  "Pulseiras / cartões",
  "Outro",
];
const volumes = ["1 a 5 equipamentos", "6 a 20", "21 a 100", "Mais de 100", "Ainda avaliando"];

const empty: LeadInput = {
  name: "",
  company: "",
  email: "",
  phone: "",
  role: "",
  segment: "",
  need: "",
  volume: "",
  message: "",
};

export function ContactForm() {
  const send = useServerFn(submitLead);
  const [form, setForm] = useState<LeadInput>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [failure, setFailure] = useState("");

  const set = (k: keyof LeadInput) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFailure("");
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      await send({ data: parsed.data });
      setStatus("done");
      setForm(empty);
    } catch {
      setStatus("idle");
      setFailure("Não foi possível enviar agora. Tente novamente ou fale com a gente no WhatsApp.");
    }
  }

  return (
    <section id="contato" className="scroll-mt-28 border-t border-border bg-surface py-24">
      <div className="wrap">
        <SectionHead eyebrow="Fale com um especialista" title="Conte sobre a sua operação">
          Preencha os dados do projeto e nosso time comercial responde com especificação,
          disponibilidade e condições. Prefere conversar agora? Chame no WhatsApp.
        </SectionHead>

        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div className="rounded-lg border border-border bg-background p-6 md:p-8">
            {status === "done" ? (
              <div className="flex flex-col items-start gap-4 py-8">
                <CheckCircle className="size-8 text-signal" />
                <h3 className="text-[1.375rem] font-semibold leading-tight">
                  Pedido registrado. Já está com o time comercial.
                </h3>
                <p className="max-w-[34rem] text-muted-foreground">
                  Retornamos em horário comercial. Se for urgente, fale no WhatsApp.
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-sm bg-signal px-5 py-3 text-sm font-semibold text-primary-foreground"
                >
                  <MessageCircle className="size-4" />
                  Falar no WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Nome"
                  value={form.name}
                  onChange={set("name")}
                  error={errors.name}
                  autoComplete="name"
                  required
                />
                <Field
                  label="Empresa"
                  value={form.company}
                  onChange={set("company")}
                  error={errors.company}
                  autoComplete="organization"
                  required
                />
                <Field
                  label="E-mail corporativo"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  error={errors.email}
                  autoComplete="email"
                  required
                />
                <Field
                  label="Telefone / WhatsApp"
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  error={errors.phone}
                  autoComplete="tel"
                  required
                />
                <Field
                  label="Cargo ou área"
                  value={form.role ?? ""}
                  onChange={set("role")}
                  error={errors.role}
                />
                <Select
                  label="Setor"
                  value={form.segment ?? ""}
                  onChange={set("segment")}
                  options={segments}
                />
                <Select
                  label="O que você precisa"
                  value={form.need ?? ""}
                  onChange={set("need")}
                  options={needs}
                />
                <Select
                  label="Volume estimado"
                  value={form.volume ?? ""}
                  onChange={set("volume")}
                  options={volumes}
                />
                <div className="md:col-span-2">
                  <Field
                    label="Detalhes do projeto"
                    textarea
                    value={form.message ?? ""}
                    onChange={set("message")}
                    error={errors.message}
                  />
                </div>

                {failure ? (
                  <p className="md:col-span-2 text-sm text-destructive">{failure}</p>
                ) : null}

                <div className="md:col-span-2 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center gap-2 rounded-sm bg-signal px-6 py-3 text-sm font-semibold text-primary-foreground transition-[transform,background-color] hover:-translate-y-px hover:bg-signal-soft disabled:opacity-60"
                  >
                    {status === "sending" ? "Enviando…" : "Enviar pedido"}
                  </button>
                  <span className="text-xs text-faint">
                    Usamos seus dados apenas para responder a este contato.
                  </span>
                </div>
              </form>
            )}
          </div>

          <aside className="flex flex-col gap-5">
            <div className="rounded-lg border border-border bg-background p-6">
              <h3 className="mb-2 text-[1.125rem] font-semibold">Atendimento direto</h3>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Time comercial e técnico em São Paulo, com estoque local e peças das principais
                linhas HPRT.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-sm border border-signal px-5 py-3 text-sm font-semibold text-signal transition-colors hover:bg-signal hover:text-primary-foreground"
              >
                <MessageCircle className="size-4" />
                WhatsApp {WHATSAPP_LABEL}
              </a>
            </div>
            <div className="rounded-lg border border-border bg-background p-6">
              <h3 className="mb-3 text-[1.125rem] font-semibold">O que acontece depois</h3>
              <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li>
                  <span className="mr-2 font-mono text-[0.7rem] text-signal">01</span>
                  Entendemos a operação e o volume.
                </li>
                <li>
                  <span className="mr-2 font-mono text-[0.7rem] text-signal">02</span>
                  Indicamos os modelos e o consumível certo.
                </li>
                <li>
                  <span className="mr-2 font-mono text-[0.7rem] text-signal">03</span>
                  Enviamos proposta com prazo e suporte incluído.
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  textarea = false,
  required = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = `f-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  const common = cn(
    "w-full rounded-sm border bg-background px-3 py-3 text-sm outline-none focus:ring-1 focus:ring-ring",
    error ? "border-destructive" : "border-input",
  );
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
        {required ? <span className="ml-1 text-signal">*</span> : null}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          maxLength={1200}
          onChange={(e) => onChange(e.target.value)}
          className={common}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          maxLength={255}
          onChange={(e) => onChange(e.target.value)}
          className={common}
        />
      )}
      {error ? <p className="mt-1.5 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const id = `s-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">Selecione</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
