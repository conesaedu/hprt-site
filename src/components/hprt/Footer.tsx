import logo from "@/assets/hprt-logo.png.asset.json";

const cols = [
  {
    title: "Produtos",
    links: ["Etiquetas", "Coletores de dados", "Leitores de código de barras", "Impressão de cupom"],
    href: "#products",
  },
  {
    title: "Empresa",
    links: ["Por que HPRT", "Soluções por setor", "Treinamentos", "Onde comprar"],
    href: "#positioning",
  },
  {
    title: "Contato",
    links: ["Falar com um especialista", "Suporte técnico"],
    href: "#trust",
  },
];

export function Footer() {
  return (
    <footer className="bg-surface pb-8 pt-16">
      <div className="wrap">
        <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <img src={logo.url} alt="HPRT Brasil" className="mb-3.5 h-6 w-auto" />
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
                  <li key={l} className="mb-2.5">
                    <a
                      href={col.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
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
