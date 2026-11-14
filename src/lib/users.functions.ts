import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("Acesso restrito a administradores.");
}

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    if (error) throw new Error(error.message);
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const admins = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));
    return data.users.map((u) => ({
      id: u.id, email: u.email ?? "", created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null, isAdmin: admins.has(u.id), isMe: u.id === context.userId,
    }));
  });

export const createAdminUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ email: z.string().email().max(200), password: z.string().min(8).max(100) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Created already confirmed so the person can sign in immediately.
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({ email: data.email, password: data.password, email_confirm: true });
    if (error) throw new Error(error.message.includes("already") ? "Este e-mail já tem conta." : error.message);
    await supabaseAdmin.from("user_roles").upsert({ user_id: created.user.id, role: "admin" }, { onConflict: "user_id,role" });
    return { ok: true };
  });

export const setAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ userId: z.string().uuid(), admin: z.boolean() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.userId === context.userId && !data.admin) throw new Error("Você não pode remover seu próprio acesso.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.admin) await supabaseAdmin.from("user_roles").upsert({ user_id: data.userId, role: "admin" }, { onConflict: "user_id,role" });
    else await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId).eq("role", "admin");
    return { ok: true };
  });
