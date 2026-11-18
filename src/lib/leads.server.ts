import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { LeadInput } from "./leads-schema";

function createSupabasePublic() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      // New-format sb_publishable_ keys are opaque, not JWTs. PostgREST
      // rejects them as Authorization Bearer, so send only apikey.
      global: {
        fetch: (input, init) => {
          const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
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

export async function insertLead(data: LeadInput) {
  const supabase = createSupabasePublic();
  const { error } = await supabase.from("contact_leads").insert({
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone,
    role: data.role || null,
    segment: data.segment || null,
    need: data.need || null,
    volume: data.volume || null,
    message: data.message || null,
    source: "onde-comprar",
    visitor_id: data.visitor_id ?? null,
  });

  if (error) throw new Error("Não foi possível registrar seu contato. Tente novamente.");

  return { success: true } as const;
}
