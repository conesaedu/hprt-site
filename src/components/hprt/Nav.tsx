import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/hprt-logo.png.asset.json";
import { cn } from "@/lib/utils";
import { Btn } from "./ui";

const links = [
  { href: "/produtos", label: "Produtos" },
  { href: "/por-que-hprt", label: "Por que HPRT" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/treinamentos", label: "Treinamentos" },
  { href: "/downloads", label: "Downloads" },
  { href: "/onde-comprar", label: "Onde comprar" },
];

export function Nav({ onDark = false }: { onDark?: boolean } = {}) {
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const light = onDark && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,padding] duration-300",
        scrolled
          ? "border-border bg-background/95 py-3.5 backdrop-blur-md"
          : "bg-transparent py-[18px]",
      )}
    >
      <div className="wrap flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo.url} alt="HPRT Brasil" className="h-[26px] w-auto" />
        </Link>
        <nav className="hidden gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              activeProps={{ className: "text-foreground" }}
              className={cn(
                "text-sm font-medium transition-colors",
                light
                  ? "text-on-ink-muted hover:text-on-ink"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center">
          <Btn
            href="/onde-comprar"
            variant="ghost"
            className={light ? "border-on-ink/30 text-on-ink hover:border-on-ink" : undefined}
          >
            Fale com um especialista
          </Btn>
        </div>
      </div>
    </header>
  );
}
