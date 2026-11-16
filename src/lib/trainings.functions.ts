import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { normalizeFormFields, validateAnswers, type FormFields } from "@/lib/training-form";

const trainingSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  type: z.enum(["técnico", "comercial"]),
  audience: z.string().min(1),
  date: z.string().datetime({ offset: true }),
  format: z.enum(["presencial", "online", "híbrido"]),
  location: z.string().min(1),
  seats: z.number().int().positive(),
  spots: z.number().int().min(0),
  description: z.string().min(1),
  is_active: z.boolean(),
  image_url: z.string().nullable().optional(),
  form_fields: z.unknown().transform((v): FormFields => normalizeFormFields(v)),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export type Training = z.infer<typeof trainingSchema>;

function createSupabasePublic() {
  return createClient<Database>(
    process.env['SUPABASE_URL']!,
    process.env['SUPABASE_PUBLISHABLE_KEY']!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      // New-format sb_publishable_ keys are opaque, not JWTs. PostgREST
      // rejects them as Authorization Bearer, so send only apikey.
      global: {
        fetch: (input, init) => {
          const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    },
  );
}

export const listTrainings = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createSupabasePublic();
  const { data, error } = await supabase
    .from("trainings")
    .select("*")
    .eq("is_active", true)
    .order("date", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((t) => trainingSchema.parse(t));
});

const registerSchema = z.object({
  trainingId: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  company: z.string().max(150).optional(),
  phone: z.string().max(50).optional(),
  isClient: z.boolean().default(false),
  answers: z.record(z.string().max(200), z.string().max(1000)).default({}),
});

export const registerForTraining = createServerFn({ method: "POST" })
  .inputValidator((input) => registerSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = createSupabasePublic();

    const { data: training, error: trainingError } = await supabase
      .from("trainings")
      .select("spots, form_fields")
      .eq("id", data.trainingId)
      .eq("is_active", true)
      .single();

    if (trainingError || !training) {
      throw new Error("Treinamento não encontrado ou inativo.");
    }

    if (training.spots <= 0) {
      throw new Error("Não há mais vagas disponíveis para este treinamento.");
    }

    const ff = normalizeFormFields(training.form_fields);
    const err = validateAnswers(ff, { company: data.company, phone: data.phone, answers: data.answers });
    if (err) throw new Error(err);
    const allowed = new Set([...(["cnpj", "role", "city"] as const).filter((k) => ff[k] !== "off"), ...ff.custom.map((q) => q.label)]);
    const answers = Object.fromEntries(Object.entries(data.answers).filter(([k, v]) => allowed.has(k) && v.trim()));

    const { error: insertError } = await supabase.from("training_registrations").insert({
      training_id: data.trainingId,
      name: data.name,
      email: data.email,
      company: ff.company === "off" ? "" : (data.company ?? "").trim(),
      phone: ff.phone === "off" ? null : data.phone?.trim() || null,
      is_client: ff.is_client ? data.isClient : false,
      answers,
      status: "pending",
    });

    if (insertError) throw insertError;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: updateError } = await supabaseAdmin
      .from("trainings")
      .update({ spots: training.spots - 1 })
      .eq("id", data.trainingId);

    if (updateError) console.error("spots update failed", updateError);

    return { success: true };
  });
