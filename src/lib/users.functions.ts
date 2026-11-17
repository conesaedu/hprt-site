import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const ROLES = ["admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number];

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("Apenas administradores podem gerenciar usuários.");
}

function friendly(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("weak") || m.includes("easy to guess") || m.includes("pwned")) return "Senha muito fraca ou já vazada na internet. Use uma senha mais forte (misture letras, números e símbolos).";
  if (m.includes("already")) return "Este e-mail já tem conta.";
  return msg;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function loadRoles(sb: any) {
  const { data } = await sb.from("user_roles").select("user_id, role");
  return (data ?? []) as { user_id: string; role: string }[];
}

async function ensureNotLastAdmin(sb: any, userId: string) {
  const roles = await loadRoles(sb);
  const wasAdmin = roles.some((r) => r.user_id === userId && r.role === "admin");
  if (wasAdmin && roles.filter((r) => r.role === "admin").length <= 1) throw new Error("É necessário manter pelo menos um administrador.");
}

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = await admin();
    const { data, error } = await sb.auth.admin.listUsers({ perPage: 200 });
    if (error) throw new Error(error.message);
    const roles = await loadRoles(sb);
    return data.users.map((u) => {
      const r = roles.filter((x) => x.user_id === u.id).map((x) => x.role);
      const role: Role | null = r.includes("admin") ? "admin" : r.includes("editor") ? "editor" : r.includes("viewer") ? "viewer" : null;
      return { id: u.id, email: u.email ?? "", created_at: u.created_at, last_sign_in_at: u.last_sign_in_at ?? null, confirmed: !!u.email_confirmed_at, role, isMe: u.id === context.userId };
    });
  });

export const createAdminUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ email: z.string().trim().toLowerCase().email().max(200), password: z.string().min(8).max(100), role: z.enum(ROLES) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = await admin();
    // Conta já confirmada: a pessoa entra na hora com a senha definida.
    const { data: created, error } = await sb.auth.admin.createUser({ email: data.email, password: data.password, email_confirm: true });
    if (error) throw new Error(friendly(error.message));
    await sb.from("user_roles").delete().eq("user_id", created.user.id);
    const { error: rErr } = await sb.from("user_roles").insert({ user_id: created.user.id, role: data.role });
    if (rErr) throw new Error(rErr.message);
    return { ok: true };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ userId: z.string().uuid(), role: z.enum(ROLES) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.userId === context.userId && data.role !== "admin") throw new Error("Você não pode rebaixar o seu próprio acesso.");
    const sb = await admin();
    if (data.role !== "admin") await ensureNotLastAdmin(sb, data.userId);
    await sb.from("user_roles").delete().eq("user_id", data.userId);
    const { error } = await sb.from("user_roles").insert({ user_id: data.userId, role: data.role });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const revokeUserAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ userId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("Você não pode remover o seu próprio acesso.");
    const sb = await admin();
    await ensureNotLastAdmin(sb, data.userId);
    const { error } = await sb.from("user_roles").delete().eq("user_id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setUserPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ userId: z.string().uuid(), password: z.string().min(8).max(100) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = await admin();
    const { error } = await sb.auth.admin.updateUserById(data.userId, { password: data.password, email_confirm: true });
    if (error) throw new Error(friendly(error.message));
    return { ok: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ userId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("Você não pode excluir a sua própria conta.");
    const sb = await admin();
    await ensureNotLastAdmin(sb, data.userId);
    await sb.from("user_roles").delete().eq("user_id", data.userId);
    const { error } = await sb.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
