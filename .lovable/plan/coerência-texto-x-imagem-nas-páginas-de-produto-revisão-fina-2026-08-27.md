# Coerência texto x imagem nas páginas de produto + revisão fina

## O problema (confirmado)

Você está certo: no M3-H o diferencial 06 fala de "Tela de alta qualidade" mas a foto ao lado mostra o verso do aparelho.

A causa não é um erro isolado de conteúdo — é lógica de construção. Hoje o bloco de diferenciais pega a imagem por posição: diferencial 1 recebe a foto 2, diferencial 2 recebe a foto 3, e assim por diante, girando quando as fotos acabam. Como quase nenhum produto tem o mesmo número de fotos e de diferenciais (o M3-H tem 6 diferenciais e 5 fotos; o MT800 tem 6 diferenciais e 1 foto), a associação é praticamente aleatória em todo o catálogo. Nada garante que a foto mostre o que o texto afirma.

## O que vou fazer

1. Varrer os 25 produtos: ler cada diferencial e olhar cada imagem da galeria, uma por uma.
2. Definir manualmente, produto por produto, qual imagem sustenta cada diferencial (tela, verso, cabeça de impressão, painel, leitura de código, bateria, etc.).
3. Onde nenhuma imagem sustenta o texto, o bloco fica sem foto — com tratamento tipográfico/editorial forte, não com um buraco no layout. Melhor um bloco elegante sem imagem do que uma imagem que desmente o texto.
4. Nenhuma imagem repetida dentro do mesmo produto e a foto principal do herói não se repete nos diferenciais.

## Revisão fina do resto da página (aplicada na mesma rodada)

- **Produtos com 1 única imagem** (MT800, NYX-H, CP4100): hoje a galeria some e os diferenciais ficam sem apoio visual — vou dar a esses produtos um layout próprio, totalmente tipográfico, que não pareça uma página incompleta.
- **Grade de aplicações**: remover as células vazias de preenchimento e fazer a grade se adaptar ao número real de itens.
- **Fotos**: revisar o tratamento de fundo (o efeito de fusão atual pode escurecer ou sujar fotos com fundo não branco) e padronizar a apresentação sobre fundo claro e sobre fundo escuro.
- **Hierarquia e textos**: conferir título/subtítulo repetidos, títulos de diferenciais muito longos, e frases de galeria/especificações que citam o modelo de forma redundante.
- **CTAs**: garantir que "Solicitar orçamento" e "Falar com um especialista" levem ao lugar certo e não compitam entre si na mesma dobra.
- **Downloads por produto**: conferir se os arquivos listados correspondem realmente ao modelo da página (hoje o vínculo é por categoria em alguns casos).

## Nota técnica

- `src/lib/products/types.ts`: `Highlight` ganha um campo opcional de imagem (índice da galeria ou `null` para bloco sem foto).
- `src/lib/products/catalog.ts`: preenchimento curado desse campo nos 25 produtos.
- `src/components/hprt/ProductDetail.tsx`: `HighlightBand` passa a usar a imagem declarada em vez do cálculo por posição; variante sem imagem com layout próprio; ajustes na grade de aplicações e no tratamento das fotos.
- Verificação com screenshots de amostra em desktop e mobile, incluindo M3-H, MT800 (1 foto) e um industrial.
