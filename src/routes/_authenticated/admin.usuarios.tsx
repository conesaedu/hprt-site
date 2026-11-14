import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, field } from "@/components/admin/ImageUpload";
import { createAdminUser, listAdminUsers, setAdminRole } from "@/lib/users.functions";

export const Route = createFileRoute("/_authenticated/admin/usuarios")({
  head: () => ({ meta: [{ title: "Usuários — HPRT Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminShell><Users /></AdminShell>,
});

function Users() {
  const list = useServerFn(listAdminUsers); const create = useServerFn(createAdminUser); const role = useServerFn(setAdminRole);
  const qc = useQueryClient();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [done, setDone] = useState("");
  const { data = [], isLoading, error } = useQuery({ queryKey: ["admin-users"], queryFn: () => list() });
  const add = useMutation({
    mutationFn: () => create({ data: { email, password } }),
    onSuccess: () => { setDone(`Acesso criado para ${email}. Já pode entrar com essa senha.`); setEmail(""); setPassword(""); qc.invalidateQueries({ queryKey: ["admin-users"] }); },
  });
  const toggle = useMutation({ mutationFn: (v: { userId: string; admin: boolean }) => role({ data: v }), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }) });
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-4xl font-bold uppercase">Usuários</h1><p className="text-sm text-muted-foreground">Quem acessa este painel. A conta criada aqui já entra pronta, sem confirmação por e-mail.</p></div>
      <form onSubmit={(e) => { e.preventDefault(); setDone(""); add.mutate(); }} className="grid gap-4 border border-border bg-background p-6 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <Field label="E-mail"><input required type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Senha inicial (mín. 8)"><input required minLength={8} className={field} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        <button disabled={add.isPending} className="bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">{add.isPending ? "Criando…" : "Criar administrador"}</button>
        {add.error && <p className="text-sm text-destructive md:col-span-3">{(add.error as Error).message}</p>}
        {done && <p className="text-sm text-primary md:col-span-3">{done}</p>}
      </form>
      {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
      <div className="border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-3">E-mail</th><th className="p-3">Criado</th><th className="p-3">Último acesso</th><th className="p-3">Administrador</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={4} className="p-6 text-muted-foreground">Carregando…</td></tr>}
            {data.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3 font-semibold">{u.email}{u.isMe && <span className="ml-2 text-xs text-muted-foreground">(você)</span>}</td>
                <td className="p-3">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="p-3">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—"}</td>
                <td className="p-3"><input type="checkbox" disabled={u.isMe} checked={u.isAdmin} onChange={(e) => toggle.mutate({ userId: u.id, admin: e.target.checked })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
