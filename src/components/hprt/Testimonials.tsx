import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type T = { id: string; author: string; role: string | null; company: string; quote: string; logo_url: string | null };

/** Client testimonials managed in the admin panel; hidden when none are active. */
export function Testimonials() {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => { supabase.from("testimonials").select("id,author,role,company,quote,logo_url").eq("is_active", true).order("sort_order").then(({ data }) => setItems(data ?? [])); }, []);
  if (!items.length) return null;
  return (
    <section className="border-t border-border py-24">
      <div className="wrap">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Quem já opera com HPRT</p>
        <h2 className="mb-12 max-w-3xl text-[clamp(2rem,4vw,3.25rem)] leading-[0.95]">Operações que confiam na engenharia HPRT.</h2>
        <div className="grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure key={t.id} className="flex flex-col justify-between bg-background p-8">
              <blockquote className="text-lg leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                {t.logo_url && <img src={t.logo_url} alt={t.company} className="h-10 w-auto max-w-24 object-contain" loading="lazy" />}
                <div><p className="font-semibold">{t.author}</p><p className="text-sm text-muted-foreground">{[t.role, t.company].filter(Boolean).join(" · ")}</p></div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
