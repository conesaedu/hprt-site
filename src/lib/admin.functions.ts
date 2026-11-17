import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("Acesso restrito a administradores.");
}

export type StaffRole = "admin" | "editor" | "viewer";

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    const roles = (data ?? []).map((r) => r.role as string);
    const role: StaffRole | null = roles.includes("admin") ? "admin" : roles.includes("editor") ? "editor" : roles.includes("viewer") ? "viewer" : null;
    return { isAdmin: role === "admin", role, email: (context.claims as any)?.email ?? null };
  });

export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!staff) throw new Error("Acesso restrito à equipe.");
    const { data, error } = await context.supabase
      .from("contact_leads").select("*").order("created_at", { ascending: false }).limit(1000);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(LEAD_STATUSES).optional(), notes: z.string().max(2000).optional() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const patch: { updated_at: string; status?: string; notes?: string } = { updated_at: new Date().toISOString() };
    if (data.status) patch.status = data.status;
    if (data.notes !== undefined) patch.notes = data.notes;
    const { error } = await context.supabase.from("contact_leads").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
