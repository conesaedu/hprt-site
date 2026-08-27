# Hero da home: remover o "ruído" da imagem ao lado do H1

## O que está acontecendo (confirmado em runtime)

O carrossel do hero usa 5 imagens tiradas de `hprt.com` (`heroGallery` em `src/lib/hprt-data.ts`). Elas não são fotos de produto: são **banners verticais de página de marketing**, com título, layout e uma faixa de ícones no rodapé.

- Dimensões reais: 1921x1688, 1921x1965, 1921x2249, 1921x1954, 1921x1991 (proporções diferentes entre si).
- Caixa onde entram: 445x260 px (≈1.7:1), com `object-cover`.

Resultado: o `cover` corta um banner alto dentro de uma caixa larga e baixa. A faixa de ícones do banner fica **cortada ao meio** na borda inferior — é exatamente a "quebra" que aparece. Como cada imagem tem altura diferente, cada troca do carrossel (a cada 2,8s) corta num ponto diferente, aumentando o ruído.

## Correção proposta

Trocar os banners por **fotos reais de produto** já existentes no catálogo (`src/lib/products/catalog.ts`), sincronizadas com os três itens listados logo abaixo da imagem (M4 Plus, Apollo, N130 BT Plus).

Em `src/components/hprt/Hero.tsx`:

- Substituir `heroGallery` por uma lista fixa: a imagem principal de cada um dos 3 produtos já citados no card.
- Trocar `object-cover` por `object-contain` com padding, sobre `bg-surface` — as imagens de catálogo são PNG de produto recortado, então não há corte nem faixa cortada.
- Sincronizar o índice do carrossel com a linha destacada: a linha do produto exibido ganha destaque (nome em `text-signal` / borda ativa), transformando o bloco num mini-showcase coerente em vez de galeria aleatória.
- Manter o intervalo de troca e o crossfade atuais; manter `alt` descritivo por produto.

Em `src/lib/hprt-data.ts`: remover o export `heroGallery`, que deixa de ser usado.

Nenhuma outra página é afetada.

## Validação

- Screenshot do hero em 1280 e em 390 px, conferindo que não há elemento cortado na borda inferior.
- Conferir que as 3 imagens têm enquadramento consistente entre si durante o ciclo.
