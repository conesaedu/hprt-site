import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/components/site/SiteRuntime";
import { whatsappFor } from "@/components/hprt/ContactForm";

const inp = "h-11 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground";

/** "Solicitar orçamento" button + form that saves a quote request for the admin panel. */
export function QuoteButton({ slug, name, className, children }: { slug: string; name: string; className?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false); const [sent, setSent] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true); setErr("");
    const { error } = await supabase.from("quote_requests").insert({ product_slug: slug, product_name: name, quantity: d.quantity ? Number(d.quantity) : null,
      name: d.name.slice(0, 150), company: d.company.slice(0, 150), email: d.email.slice(0, 150), phone: d.phone.slice(0, 30), message: d.message?.slice(0, 2000) || null });
    setBusy(false);
    if (error) { setErr("Não foi possível enviar. Tente pelo WhatsApp."); return; }
    track("quote_request", name); setSent(true);
  }
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>{children}</button>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/60 p-4" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-lg bg-background p-7 text-foreground shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Fechar" onClick={() => setOpen(false)} className="absolute right-3 top-3 p-1.5"><X className="size-4" /></button>
            {sent ? (<><p className="font-display text-3xl font-bold uppercase">Pedido recebido</p><p className="mt-3 text-muted-foreground">Um especialista retorna com a proposta da {name} em até 1 dia útil.</p></>) : (
              <form onSubmit={submit} className="grid gap-3">
                <p className="font-display text-3xl font-bold uppercase">Orçamento · {name}</p>
                <input name="name" required maxLength={150} placeholder="Seu nome" className={inp} />
                <input name="company" required maxLength={150} placeholder="Empresa" className={inp} />
                <div className="grid grid-cols-2 gap-3"><input name="email" type="email" required maxLength={150} placeholder="E-mail" className={inp} />
                  <input name="phone" required maxLength={30} placeholder="WhatsApp" className={inp} /></div>
                <input name="quantity" type="number" min={1} placeholder="Quantidade estimada" className={inp} />
                <textarea name="message" maxLength={2000} placeholder="Aplicação / observações (opcional)" className="min-h-20 rounded-sm border border-border bg-background p-3 text-sm" />
                {err && <p className="text-sm text-destructive">{err}</p>}
                <button disabled={busy} className="mt-1 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground">{busy ? "Enviando…" : "Enviar pedido"}</button>
                <a href={whatsappFor(name)} target="_blank" rel="noreferrer" className="text-center text-sm font-semibold text-primary underline-offset-4 hover:underline">Prefere falar agora? Chamar no WhatsApp</a>
              </form>)}
          </div>
        </div>
      )}
    </>
  );
}
