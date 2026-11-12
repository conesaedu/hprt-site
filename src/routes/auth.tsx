import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s.redirect === "string" ? s.redirect : undefined }),
  head: () => ({ meta: [
    { title: "Acesso restrito — HPRT Brasil" },
    { name: "description", content: "Área interna da equipe HPRT Brasil." },
    { property: "og:title", content: "Acesso restrito — HPRT Brasil" },
    { property: "og:description", content: "Área interna da equipe HPRT Brasil." },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg("E-mail ou senha inválidos.");
      const safe = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/admin";
      navigate({ to: safe as "/admin", replace: true });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
      setBusy(false);
      setMsg(error ? error.message : "Conta criada. Confirme pelo link enviado ao seu e-mail e aguarde a liberação de acesso.");
    }
  }

  return (
    <main className="min-h-screen grid place-items-center bg-foreground px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-background p-8 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">HPRT Brasil · Área interna</p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase">{mode === "in" ? "Entrar" : "Criar acesso"}</h1>
        </div>
        <label className="block text-sm font-medium">E-mail
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border border-input bg-background px-3 py-2" />
        </label>
        <label className="block text-sm font-medium">Senha
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border border-input bg-background px-3 py-2" />
        </label>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <button disabled={busy} className="w-full bg-primary py-3 font-semibold uppercase text-primary-foreground disabled:opacity-60">
          {busy ? "Aguarde…" : mode === "in" ? "Entrar" : "Criar acesso"}
        </button>
        <button type="button" onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }} className="w-full text-sm text-muted-foreground underline">
          {mode === "in" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
        </button>
      </form>
    </main>
  );
}
