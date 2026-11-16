export type FieldMode = "off" | "optional" | "required";
export type CustomQuestion = { label: string; required: boolean };
export type FormFields = {
  company: FieldMode; phone: FieldMode; cnpj: FieldMode; role: FieldMode; city: FieldMode;
  is_client: boolean; custom: CustomQuestion[];
};
export const DEFAULT_FORM_FIELDS: FormFields = {
  company: "required", phone: "optional", cnpj: "off", role: "off", city: "off", is_client: true, custom: [],
};
export const FIELD_LABELS: Record<"company" | "phone" | "cnpj" | "role" | "city", string> = {
  company: "Empresa", phone: "Telefone / WhatsApp", cnpj: "CNPJ", role: "Cargo / função", city: "Cidade / UF",
};
const modes = ["off", "optional", "required"];
export function normalizeFormFields(v: unknown): FormFields {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const m = (k: keyof typeof FIELD_LABELS): FieldMode => (modes.includes(o[k] as string) ? (o[k] as FieldMode) : DEFAULT_FORM_FIELDS[k]);
  const custom = Array.isArray(o.custom)
    ? (o.custom as unknown[]).filter((c): c is CustomQuestion => !!c && typeof (c as CustomQuestion).label === "string" && (c as CustomQuestion).label.trim() !== "").slice(0, 10)
        .map((c) => ({ label: c.label.slice(0, 200), required: !!c.required }))
    : [];
  return { company: m("company"), phone: m("phone"), cnpj: m("cnpj"), role: m("role"), city: m("city"), is_client: o.is_client !== false, custom };
}
/** Returns an error message or null. */
export function validateAnswers(ff: FormFields, d: { company?: string; phone?: string; answers: Record<string, string> }): string | null {
  const val = (k: string) => (k === "company" ? d.company : k === "phone" ? d.phone : d.answers[k])?.trim() ?? "";
  for (const k of Object.keys(FIELD_LABELS) as (keyof typeof FIELD_LABELS)[]) {
    if (ff[k] === "required" && !val(k)) return `Preencha o campo ${FIELD_LABELS[k]}.`;
  }
  for (const q of ff.custom) if (q.required && !(d.answers[q.label] ?? "").trim()) return `Responda: ${q.label}`;
  return null;
}
