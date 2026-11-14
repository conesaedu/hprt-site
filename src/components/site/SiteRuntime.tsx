import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Assistant } from "@/components/site/Assistant";

type Banner = { id: string; title: string; subtitle: string | null; image_url: string | null; cta_label: string | null; cta_url: string | null; pages: string[]; frequency: string };
type Bar = { enabled?: boolean; text?: string; link?: string };

function sessionId() {
  let s = sessionStorage.getItem("hprt_sid");
  if (!s) { s = crypto.randomUUID(); sessionStorage.setItem("hprt_sid", s); }
  return s;
}
const device = () => (window.innerWidth < 768 ? "mobile" : window.innerWidth < 1100 ? "tablet" : "desktop");

export function track(event: string, label?: string) {
  if (typeof window === "undefined" || location.pathname.startsWith("/admin") || location.pathname.startsWith("/auth")) return;
  void supabase.from("site_events").insert({
    event, label: label?.slice(0, 200) ?? null, path: location.pathname.slice(0, 300),
    session_id: sessionId(), referrer: document.referrer.slice(0, 300) || null, device: device(),
  }).then(() => undefined); // query builders are lazy: .then() sends it
}

function canShow(b: Banner) {
  const key = `hprt_banner_${b.id}`;
  if (b.frequency === "always") return true;
  if (b.frequency === "once_per_session") return !sessionStorage.getItem(key);
  const last = Number(localStorage.getItem(key) || 0);
  return Date.now() - last > 7 * 864e5;
}
function markShown(b: Banner) {
  const key = `hprt_banner_${b.id}`;
  sessionStorage.setItem(key, "1"); localStorage.setItem(key, String(Date.now()));
}

/** Analytics, pop-ups and announcement bar for the public site. */
export function SiteRuntime() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bar, setBar] = useState<Bar | null>(null);
  const [barClosed, setBarClosed] = useState(false);
  const [active, setActive] = useState<Banner | null>(null);
  const isPrivate = path.startsWith("/admin") || path.startsWith("/auth");

  useEffect(() => {
    supabase.from("banners").select("id,title,subtitle,image_url,cta_label,cta_url,pages,frequency").order("sort_order")
      .then(({ data }) => setBanners((data as Banner[]) ?? []));
    supabase.from("site_settings").select("value").eq("key", "announcement").maybeSingle()
      .then(({ data }) => setBar((data?.value as Bar) ?? null));
    setBarClosed(sessionStorage.getItem("hprt_bar_closed") === "1");
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      if (a.href.includes("wa.me")) track("whatsapp_click", a.textContent?.trim());
      else if (a.hasAttribute("download") || /\.(exe|zip|pdf)$/i.test(a.href)) track("download", a.href.split("/").pop());
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (isPrivate) return;
    track("page_view");
    const m = path.match(/^\/produtos\/([^/]+)/);
    if (m) track("product_view", m[1]);
  }, [path, isPrivate]);

  useEffect(() => {
    if (isPrivate || active) return;
    const b = banners.find((x) => (x.pages.includes("*") || x.pages.includes(path)) && canShow(x));
    if (!b) return;
    const t = setTimeout(() => { setActive(b); markShown(b); track("banner_view", b.title); }, 1500);
    return () => clearTimeout(t);
  }, [banners, path, isPrivate, active]);

  if (isPrivate) return null;
  return (
    <>
      <Assistant />
      {bar?.enabled && bar.text && !barClosed && (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-foreground text-background">
          <div className="wrap flex items-center justify-between gap-4 py-3 text-sm">
            {bar.link ? <a href={bar.link} className="font-semibold hover:text-primary">{bar.text} →</a> : <p className="font-semibold">{bar.text}</p>}
            <button aria-label="Fechar aviso" onClick={() => { setBarClosed(true); sessionStorage.setItem("hprt_bar_closed", "1"); }}><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}
      {active && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 p-4" onClick={() => setActive(null)}>
          <div className="relative w-full max-w-lg bg-background shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Fechar" onClick={() => setActive(null)} className="absolute right-3 top-3 z-10 bg-background/90 p-1.5"><X className="h-4 w-4" /></button>
            {active.image_url && <img src={active.image_url} alt={active.title} className="aspect-[16/9] w-full object-cover" />}
            <div className="p-7">
              <p className="font-display text-3xl font-bold uppercase leading-tight">{active.title}</p>
              {active.subtitle && <p className="mt-3 text-muted-foreground">{active.subtitle}</p>}
              {active.cta_url && (
                <a href={active.cta_url} onClick={() => track("banner_click", active.title)}
                  className="mt-6 inline-flex bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90">
                  {active.cta_label || "Saiba mais"}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
