import { Link } from "@tanstack/react-router";

const cols = [
  {
    title: "Produtos",
    links: [
      { label: "Etiquetas", href: "/produtos" },
      { label: "Coletores de dados", href: "/produtos" },
      { label: "Leitores de código de barras", href: "/produtos" },
      { label: "Impressão de cupom", href: "/produtos" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Por que HPRT", href: "/por-que-hprt" },
      { label: "Soluções por setor", href: "/solucoes" },
      { label: "Treinamentos", href: "/treinamentos" },
      { label: "Onde comprar", href: "/onde-comprar" },
      { label: "Seja revenda", href: "/seja-revenda" },
    ],
  },
  {
    title: "Contato",
    links: [
      { label: "Falar com um especialista", href: "/onde-comprar" },
      { label: "Suporte técnico", href: "/onde-comprar" },
      { label: "Downloads e drivers", href: "/downloads" },
      { label: "Garantia", href: "/garantia" },
      { label: "Suporte técnico", href: "/suporte" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-surface pb-8 pt-16">
      <div className="wrap">
        <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <img src="/brand/hprt-logo.png" alt="HPRT Brasil" className="mb-3.5 h-6 w-auto" />
            <p className="text-[0.84rem] leading-relaxed text-faint">
              Distribuição oficial HPRT no Brasil, operada por Cogra. Impressão térmica, captura de
              dados e identificação para operações de qualquer porte.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
                {col.title}
              </h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label} className="mb-2.5">
                    {l.href.startsWith("/") ? (
                      <Link
                        to={l.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-7 font-mono text-[0.78rem] text-faint">
          <span>© HPRT Brasil</span>
          <span>Distribuição: Cogra</span>
        </div>
      </div>
    </footer>
  );
}
