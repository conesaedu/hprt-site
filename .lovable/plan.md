# Página individual para cada produto

Sim — consegui varrer o site atual: as 25 páginas de produto de `hprtbrasil.com.br/produto/...` já estão extraídas (descrição, diferenciais, aplicações por segmento, tabela de especificações e galeria de imagens de cada modelo). Inclusive a **Delta**, que faltava no catálogo.

## O que será construído

**Uma página por produto** em `/produtos/{modelo}` (ex.: `/produtos/neo`, `/produtos/cp-d80`), com:

- Cabeçalho com categoria, nome do modelo e resumo comercial
- Galeria das fotos oficiais do produto
- Bloco "Principais diferenciais" (4 a 5 pontos por modelo)
- "Aplicações por segmento" (varejo, logística, saúde, manufatura, transporte…)
- Tabela completa de especificações técnicas
- Downloads relacionados ao modelo (driver/utilitário já hospedados)
- CTA de orçamento/suporte e link para treinamentos
- Produtos relacionados da mesma categoria

**Índice `/produtos`** com filtro por categoria (mesma linguagem visual do catálogo da home).

**Catálogo da home** passa a linkar cada card para a página do produto, em vez de só filtrar.

**SEO**: title, description e og tags próprios por modelo, H1 único, JSON-LD de Produto, imagem oficial como og:image.

## Detalhes técnicos

- Conteúdo em `src/lib/products/` como dados tipados (um arquivo de dados por categoria ou um índice único com `slug`, `specs`, `highlights`, `applications`, `gallery`).
- Rotas TanStack: `src/routes/produtos.index.tsx` e `src/routes/produtos.$slug.tsx` (404 para slug inexistente).
- Imagens continuam servidas das URLs oficiais do site atual (sem duplicar binários no projeto).
- Textos serão revisados/enxugados: o site atual repete o mesmo bloco duas vezes ("Principais Diferenciais" + "Resumo do Produto"); vou manter uma versão limpa.
- Nada de backend novo — conteúdo estático, rápido e indexável.

## Escopo em duas etapas

1. Estrutura + as 25 páginas com dados já extraídos.
2. Ajustes de copy modelo a modelo, se você quiser refinar depois.
