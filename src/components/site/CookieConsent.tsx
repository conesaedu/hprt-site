import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { needsAnswer, onConsentChange, readChoice, saveChoices, type Purpose } from "@/lib/consent";

const PURPOSES: Purpose[] = ["analytics", "advertising"];
const ROWS: { id: Purpose; title: string; text: string }[] = [
  { id: "analytics", title: "Medição de uso, fornecida pela Lovable e pela HPRT Brasil", text: "Reconhece seu navegador quando você volta e mede cliques e outras ações para melhorarmos o site." },
  { id: "advertising", title: "Publicidade, fornecida pelo Google", text: "Usa cookies para medir os resultados dos nossos anúncios e mostrar anúncios mais relevantes." },
];

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [sel, setSel] = useState<Record<Purpose, boolean>>({ analytics: false, advertising: false });
  const [gpc, setGpc] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = () => setSel({ analytics: readChoice("analytics") === "granted", advertising: readChoice("advertising") === "granted" });

  useEffect(() => {
    setGpc((navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true);
    void needsAnswer(PURPOSES).then((n) => n && setOpen(true));
    const openSettings = () => { load(); setSettings(true); setOpen(true); };
    window.addEventListener("open-cookie-settings", openSettings);
    const off = onConsentChange(load);
    return () => { window.removeEventListener("open-cookie-settings", openSettings); off(); };
  }, []);

  useEffect(() => { if (open) ref.current?.focus(); }, [open, settings]);

  if (!open) return null;
  const all = (choice: "granted" | "denied") => { saveChoices({ analytics: choice, advertising: choice }); setOpen(false); setSettings(false); };
  const save = () => { saveChoices({ analytics: sel.analytics ? "granted" : "denied", advertising: sel.advertising ? "granted" : "denied" }); setOpen(false); setSettings(false); };
  const btn = "flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors";

  return (
    <div ref={ref} tabIndex={-1} role="region" aria-label="Aviso de cookies"
      className="fixed bottom-4 left-4 z-[60] w-[calc(100%-2rem)] max-w-md rounded-lg border border-border bg-card p-5 text-card-foreground shadow-2xl outline-none">
      <h2 className="mb-2 text-base font-semibold">{settings ? "Configurações de cookies" : "Sua privacidade"}</h2>
      {!settings ? (
        <p className="mb-4 text-sm text-muted-foreground">
          Contamos visitas sem cookies. Se você aceitar, também medimos cliques e outras ações e usamos cookies de publicidade para avaliar nossos anúncios.{" "}
          <Link to="/privacidade" className="underline hover:text-foreground">Política de privacidade</Link>
        </p>
      ) : (
        <div className="mb-4 space-y-3 text-sm">
          {gpc && <p className="rounded-md bg-muted p-2 text-muted-foreground">Seu navegador envia um sinal de privacidade (Global Privacy Control). Ele vale como recusa e mantém estas opções desligadas.</p>}
          <div className="rounded-md border border-border p-3">
            <div className="flex items-center justify-between font-medium"><span>Necessários</span><span className="text-xs text-muted-foreground">Sempre ativos</span></div>
            <p className="mt-1 text-muted-foreground">Fazem o site funcionar e guardam sua escolha sobre cookies.</p>
          </div>
          {ROWS.map((r) => (
            <label key={r.id} className="flex cursor-pointer items-start justify-between gap-3 rounded-md border border-border p-3">
              <span><span className="block font-medium">{r.title}</span><span className="mt-1 block text-muted-foreground">{r.text}</span></span>
              <input type="checkbox" role="switch" className="mt-1 size-4 accent-primary" disabled={gpc}
                checked={!gpc && sel[r.id]} onChange={(e) => setSel((s) => ({ ...s, [r.id]: e.target.checked }))} />
            </label>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <button type="button" onClick={() => all("denied")} className={`${btn} border border-border bg-background hover:bg-muted`}>Recusar tudo</button>
        <button type="button" onClick={() => all("granted")} className={`${btn} border border-border bg-background hover:bg-muted`}>Aceitar tudo</button>
      </div>
      <button type="button" onClick={settings ? save : () => { load(); setSettings(true); }}
        className={`mt-2 w-full ${btn} ${settings ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground underline hover:text-foreground"}`}>
        {settings ? "Salvar escolhas" : "Configurações de cookies"}
      </button>
    </div>
  );
}
