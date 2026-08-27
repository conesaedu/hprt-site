# H1 da página /produtos: mais impacto, mantendo responsividade

## Diagnóstico (confirmado em runtime)

O H1 da vitrine `/produtos` já é fluido — usa `clamp(2.5rem, 6vw, 4.25rem)`:
- Mobile (390px): 40px
- Desktop (1280px): 68px (teto do clamp)

Mesmo assim parece "reduzido" por dois motivos:
1. **Teto baixo**: trava em 4.25rem mesmo em telas grandes. O hero de produto chega a 7.5rem.
2. **Medida estreita**: `max-w-[46rem]` força a frase em 4 linhas no desktop, passando ideia de texto comprimido.

## Mudança

Arquivo: `src/routes/produtos.index.tsx` (linha do `<h1>` e do container do hero).

- **H1**: `clamp(2.5rem, 6vw, 4.25rem)` → `clamp(2.5rem, 6vw, 5rem)`
  - Teto sobe de 68px para 80px em telas grandes.
  - Mínimo mantido em 40px no mobile — continua responsivo.
- **Container do hero**: `max-w-[46rem]` → `max-w-[52rem]`
  - Afrouxa a medida para a frase respirar e quebrar em ~3 linhas no desktop, em vez de 4.
- Ajustar `leading-[0.95]` → `leading-[0.92]` para acompanhar o tamanho maior sem ganhar altura excessiva.

Nenhuma outra página é tocada. O `prefers-reduced-motion` e o resto do hero (eyebrow, parágrafo) permanecem idênticos.

## Validação

- Playwright: screenshot desktop (1280) e mobile (390) do hero, conferir contagem de linhas e tamanho.
- Conferir que o H1 não estoura a largura do container nem cria órfão feio.
