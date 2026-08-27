# Diferenciar Produtos e Soluções de verdade

## Problema

Hoje `/produtos` e `/solucoes` se sobrepõem: a página de Soluções lista 4 cards curtos de setor e, no fim, mostra os mesmos 8 produtos — sem mapear cada setor aos modelos que o atendem. O visitante vê produtos nos dois lugares, organizados de forma diferente, e a distinção "por mercado" vs "por equipamento" nunca fica clara.

## Direção

Manter os dois itens no menu, mas separar o papel de cada página:

- **Soluções** = olhar por **mercado/setor**. Cada setor vira um bloco que diz quais linhas de equipamento atendem aquela operação, com link para `/produtos` já filtrado pela linha. Sem listar produtos diretamente.
- **Produtos** = olhar por **equipamento/linha**. Catálogo técnico, agora filtrável também via URL (`/produtos?linha=coletores`), para que os links vindos de Soluções cheguem já filtrados.

## Mudanças

### 1. Enriquecer dados de soluções — `src/lib/hprt-data.ts`

Estender o tipo `solutions` para incluir, por setor:
- `lines`: array de `{ id, label }` das categorias de produto que atendem o setor (ex.: Varejo → Etiquetas Entrada, Cupom/PDV, Leitores, Cartões).
- `desc` mais densa: o que a HPRT resolve naquela operação (não uma frase só).

Mapeamento por setor:
- **Varejo** → etiquetas-entrada, cupom, leitores, cartao
- **Logística** → etiquetas-industrial, coletores, leitores
- **Saúde** → pulseiras, leitores, etiquetas-entrada
- **Alimentação** → cupom, etiquetas-entrada

### 2. Reescrever componente `Solutions` — `src/components/hprt/Catalog.tsx`

- Cada card de setor passa a mostrar: num, título, narrativa, e as linhas que o atendem como **chips clicáveis** com `<Link to="/produtos" search={{ linha: id }}>` (exceto "all").
- Modo `preview` (home) mantém o card compacto + link "Ver soluções por setor" → `/solucoes`.
- Remover qualquer listagem de produtos dentro de Solutions.

### 3. Página Soluções — `src/routes/solucoes.tsx`

- Remover o bloco `<Products limit={8} />` (a duplicação).
- Estrutura final: `PageHero` + `Solutions` (com chips de linha por setor) + `CtaStrip`.
- Ajustar `head()`/description se necessário para refletir "por setor".

### 4. Filtro de Produtos dirigido por URL — `src/routes/produtos.index.tsx`

- Adicionar `validateSearch` nativo (sem zod-adapter): `{ linha: string }`, default `"all"`.
- Trocar o `useState("all")` por leitura de `Route.useSearch()` → o filtro ativo passa a ser o valor da URL.
- Ao clicar num chip de linha, usar `<Link to="/produtos" search={{ linha }}>` (ou `navigate`) para atualizar a URL.
- Manter o comportamento visual existente (chips, contagem de modelos).
- Atualizar `productCategories` no filtro para só destacar linhas relevantes.

### 5. Home — `src/routes/index.tsx`

- `<Solutions preview />` já linka para `/solucoes`. Sem mudança estrutural; o componente atualizado cuida do resto.

## Fora de escopo

- Não criar páginas/cases individuais por setor nesta etapa (era a opção "Aprofundar", não escolhida).
- Não mexer em Footer, Nav, Produtos `$slug`, treinamentos ou downloads.
