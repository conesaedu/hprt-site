# Sair do one-page: rotas próprias para as seções da home

## Resposta curta

Hoje a home é one-page (âncoras `#products`, `#positioning`, `#solutions`, `#trust`) e só o resto do site tem páginas reais (`/produtos`, `/produtos/{modelo}`, `/treinamentos`, `/downloads`).

Para SEO, GEO (busca com IA) e velocidade, **páginas separadas ganham**:

- Âncoras nunca chegam ao servidor: `/#solucoes` e `/#trust` entregam exatamente o mesmo HTML de `/`. Para o Google e para os motores de IA existe **uma página só**, com um único título e uma única descrição.
- Cada rota própria tem title, description, og e JSON-LD próprios — é assim que uma resposta de IA cita "HPRT — soluções por setor" em vez de citar a home genérica.
- Velocidade: a home fica mais leve (menos conteúdo e menos imagens no carregamento inicial), melhorando LCP no mobile, que é o que o Google mede.

## O que fazer

1. Criar rotas reais para as três seções que hoje são âncoras:
   - `/por-que-hprt` — a seção de Posicionamento (6 pilares + fechamento)
   - `/solucoes` — soluções por setor
   - `/onde-comprar` — presença local / Cogra / prova global
2. Manter a home como **vitrine resumida**: hero, números, prévia de produtos, prévia de soluções, prova local — cada bloco com um "saiba mais" levando à página completa. Nada de conteúdo duplicado inteiro: a home mostra o resumo, a página traz o texto completo.
3. Navegação: a barra superior passa a usar links de página (`<Link to>`) em vez de âncoras, resolvendo de vez o comportamento irregular de clique.
4. Redirecionar/absorver as âncoras antigas para não quebrar links já compartilhados (`/#solutions` → `/solucoes`).

## Detalhes técnicos

- Rotas novas em `src/routes/por-que-hprt.tsx`, `src/routes/solucoes.tsx`, `src/routes/onde-comprar.tsx`, reaproveitando `Positioning`, `Solutions`, `Trust`/`GlobalTrust` já existentes (sem reescrever componente).
- Cada rota com `head()` próprio: title, description, og:title, og:description, og:url e canonical auto-referente em `https://hprtbrasil.lovable.app/...`.
- JSON-LD: `BreadcrumbList` nas novas páginas; a home mantém Organization/WebSite.
- `Nav.tsx`: substituir o handler `goToHash` por `<Link to>` tipado, com `activeProps` para estado ativo.
- Home: versões resumidas dos blocos (limitar cards de solução/produto exibidos) + CTA para a página completa; preload da imagem LCP do hero via `head().links`.
- `sitemap.xml` (se existir) atualizado com as três rotas; senão, incluir na próxima revisão de SEO.

## Fora de escopo

Não mexo em conteúdo de produto, treinamentos ou downloads nesta etapa.
