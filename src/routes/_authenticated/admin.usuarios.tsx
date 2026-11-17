import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, field } from "@/components/admin/ImageUpload";
import { ROLE_HINT, ROLE_LABEL } from "@/lib/admin-access";
import type { StaffRole } from "@/lib/admin.functions";
import { createAdminUser, deleteUser, listAdminUsers, revokeUserAccess, setUserPassword, setUserRole } from "@/lib/users.functions";

export const Route = createFileRoute("/_authenticated/admin/usuarios")({
  head: () => ({ meta: [{ title: "Usuários e permissões — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Users /></AdminShell>,
});

const ROLES: StaffRole[] = ["admin", "editor", "viewer"];
const PILL: Record<StaffRole, string> = { admin: "bg-primary text-primary-foreground", editor: "bg-foreground text-background", viewer: "bg-muted text-foreground" };

function Users() {
  const list = useServerFn(listAdminUsers); const create = useServerFn(createAdminUser);
  const setRole = useServerFn(setUserRole); const revoke = useServerFn(revokeUserAccess);
  const del = useServerFn(deleteUser); const pass = useServerFn(setUserPassword);
  const qc = useQueryClient();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [role, setR] = useState<StaffRole>("editor");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const { data = [], isLoading, error } = useQuery({ queryKey: ["admin-users"], queryFn: () => list() });
  const done = (t: string) => { setMsg({ ok: true, t }); qc.invalidateQueries({ queryKey: ["admin-users"] }); };
  const fail = (e: unknown) => setMsg({ ok: false, t: (e as Error).message });

  const add = useMutation({ mutationFn: () => create({ data: { email, password, role } }), onSuccess: () => { done(`Acesso criado para ${email} como ${ROLE_LABEL[role]}. Já pode entrar com essa senha.`); setEmail(""); setPassword(""); }, onError: fail });
  const changeRole = useMutation({ mutationFn: (v: { userId: string; role: StaffRole }) => setRole({ data: v }), onSuccess: () => done("Papel atualizado."), onError: fail });
  const rev = useMutation({ mutationFn: (userId: string) => revoke({ data: { userId } }), onSuccess: () => done("Acesso ao painel removido."), onError: fail });
  const rm = useMutation({ mutationFn: (userId: string) => del({ data: { userId } }), onSuccess: () => done("Usuário excluído."), onError: fail });
  const pw = useMutation({ mutationFn: (v: { userId: string; password: string }) => pass({ data: v }), onSuccess: () => done("Nova senha definida. Repasse à pessoa."), onError: fail });

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-4xl font-bold uppercase">Usuários e permissões</h1><p className="text-sm text-muted-foreground">Quem acessa o painel e o que cada pessoa pode fazer. Contas criadas aqui já entram prontas, sem confirmação por e-mail.</p></div>

      <div className="grid gap-3 md:grid-cols-3">
        {ROLES.map((r) => (
          <div key={r} className="border border-border bg-background p-4">
            <span className={`inline-block px-2 py-0.5 text-xs font-semibold uppercase ${PILL[r]}`}>{ROLE_LABEL[r]}</span>
            <p className="mt-2 text-sm text-muted-foreground">{ROLE_HINT[r]}</p>
          </div>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setMsg(null); add.mutate(); }} className="grid gap-4 border border-border bg-background p-6 md:grid-cols-[1fr_1fr_200px_auto] md:items-end">
        <Field label="E-mail"><input required type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Senha inicial (mín. 8)"><input required minLength={8} className={field} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        <Field label="Papel"><select className={field} value={role} onChange={(e) => setR(e.target.value as StaffRole)}>{ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select></Field>
        <button disabled={add.isPending} className="bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">{add.isPending ? "Criando…" : "Criar acesso"}</button>
      </form>
      {msg && <p className={`text-sm ${msg.ok ? "text-primary" : "text-destructive"}`}>{msg.t}</p>}
      {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}

      <div className="overflow-x-auto border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-3">E-mail</th><th className="p-3">Papel</th><th className="p-3">Criado</th><th className="p-3">Último acesso</th><th className="p-3">Ações</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="p-6 text-muted-foreground">Carregando…</td></tr>}
            {data.map((u) => (
              <tr key={u.id} className="border-t border-border align-middle">
                <td className="p-3 font-semibold">{u.email}{u.isMe && <span className="ml-2 text-xs font-normal text-muted-foreground">(você)</span>}</td>
                <td className="p-3">
                  <select disabled={u.isMe} value={u.role ?? ""} onChange={(e) => { setMsg(null); changeRole.mutate({ userId: u.id, role: e.target.value as StaffRole }); }} className="border border-input bg-background px-2 py-1">
                    {!u.role && <option value="">Sem acesso</option>}
                    {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                  </select>
                </td>
                <td className="p-3">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="p-3">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Nunca entrou"}</td>
                <td className="p-3 whitespace-nowrap space-x-3">
                  {!u.isMe && <>
                    <button className="underline" onClick={() => { const p = prompt(`Nova senha para ${u.email} (mín. 8 caracteres):`); if (p && p.length >= 8) { setMsg(null); pw.mutate({ userId: u.id, password: p }); } }}>Definir senha</button>
                    {u.role && <button className="underline" onClick={() => confirm(`Remover o acesso de ${u.email} ao painel?`) && rev.mutate(u.id)}>Remover acesso</button>}
                    <button className="text-destructive underline" onClick={() => confirm(`Excluir a conta de ${u.email}? Isso não pode ser desfeito.`) && rm.mutate(u.id)}>Excluir</button>
                  </>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
