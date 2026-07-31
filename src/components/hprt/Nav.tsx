import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/hprt-logo.png.asset.json";
import { cn } from "@/lib/utils";
import { Btn } from "./ui";

const links = [
  { href: "#products", label: "Produtos" },
  { href: "#positioning", label: "Por que HPRT" },
  { href: "#solutions", label: "Soluções" },
  { href: "/treinamentos", label: "Treinamentos" },
  { href: "#trust", label: "Onde comprar" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <a href="#hero" className="flex items-center">
          <img src={logo.url} alt="HPRT Brasil" className="h-[26px] w-auto" />
        </a>
        <nav className="hidden gap-9 md:flex">
          {links.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.href}
                to={l.href}
                activeProps={{ className: "text-foreground" }}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ),
          )}
        </nav>
        <div className="flex items-center">
          <Btn href="#trust" variant="ghost">
            Fale com um especialista
          </Btn>
        </div>
      </div>
    </header>
  );
}
