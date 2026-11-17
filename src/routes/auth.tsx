import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s.redirect === "string" ? s.redirect : undefined }),
  head: () => ({ meta: [
    { title: "Acesso restrito — HPRT Brasil" },
    { name: "description", content: "Área interna da equipe HPRT Brasil." },
    { property: "og:title", content: "Acesso restrito — HPRT Brasil" },
    { property: "og:description", content: "Área interna da equipe HPRT Brasil." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [mode, setMode] = useState<"in" | "up" | "recover" | "reset">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery") setMode("reset");
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") { setMode("reset"); setMsg(null); }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    if (mode === "recover") {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: "https://hprtbrasil.com.br/auth",
      });
      setBusy(false);
      setMsg(error ? "Não foi possível enviar o link. Tente novamente em alguns minutos." : "Se este e-mail possui uma conta, você receberá um link para definir uma nova senha. Confira também o spam.");
      return;
    }
    if (mode === "reset") {
      const { error } = await supabase.auth.updateUser({ password });
      setBusy(false);
      if (error) { setMsg("Não foi possível alterar a senha. Solicite um novo link de recuperação."); return; }
      setPassword(""); setMode("in");
      setMsg("Senha atualizada. Entre com sua nova senha.");
      return;
    }
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
          <h1 className="mt-2 font-display text-3xl font-bold uppercase">{mode === "in" ? "Entrar" : mode === "up" ? "Criar acesso" : mode === "recover" ? "Recuperar senha" : "Nova senha"}</h1>
        </div>
        {mode !== "reset" && <label className="block text-sm font-medium">E-mail
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border border-input bg-background px-3 py-2" />
        </label>}
        {mode !== "recover" && <label className="block text-sm font-medium">Senha
          <input type="password" required minLength={8} autoComplete={mode === "in" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border border-input bg-background px-3 py-2" />
        </label>}
        {msg && <p role="status" className="text-sm text-muted-foreground">{msg}</p>}
        <Button type="submit" disabled={busy} className="w-full h-auto py-3 font-semibold uppercase">
          {busy ? "Aguarde…" : mode === "in" ? "Entrar" : mode === "up" ? "Criar acesso" : mode === "recover" ? "Enviar link de recuperação" : "Salvar nova senha"}
        </Button>
        {mode === "in" && <Button type="button" variant="link" disabled={busy} onClick={() => { setMode("recover"); setMsg(null); }} className="w-full">Esqueci minha senha</Button>}
        <Button type="button" variant="link" disabled={busy} onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }} className="w-full text-muted-foreground">
          {mode === "in" ? "Primeiro acesso? Criar conta" : "Voltar para entrar"}
        </Button>
      </form>
    </main>
  );
}
