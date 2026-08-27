# Página de produto: do dado ao desejo

Sim — as 25 páginas de produto de `hprtbrasil.com.br/produto/...` já foram varridas (descrição, diferenciais, aplicações por segmento, tabela técnica completa e galeria oficial). Inclusive a **Delta**, que faltava no catálogo.

Mas o conteúdo de lá é **dado bruto**: parágrafo repetido, tabela WooCommerce, foto solta. A página nova usa esse conteúdo como matéria-prima e entrega uma experiência de produto — o cliente precisa querer o equipamento antes de olhar a especificação.

## A experiência da página `/produtos/{modelo}`

**1. Abertura cinematográfica**
Tela cheia, fundo escuro industrial, o equipamento em grande escala com iluminação lateral e sombra projetada. Nome do modelo em tipografia enorme; ao lado, três números que definem o produto (velocidade, resolução, largura de impressão) em mono, como painel de instrumento. Nada de "produto adicionado ao carrinho".

**2. Prova de performance em movimento**
Os números-chave contam sozinhos, com contadores que animam ao entrar na tela e uma barra comparativa quando o modelo lidera a categoria (ex.: NEO, 10 ips). Perceptível em 3 segundos, sem ler texto.

**3. Diferenciais como capítulos, não bullets**
Cada diferencial vira uma faixa com foto oficial do produto de um lado e uma frase forte do outro, alternando o lado a cada bloco. Rótulo numerado (01–05), título curto, uma linha de explicação. Foco em benefício, não em jargão.

**4. Aplicações por segmento com identidade**
Grade de cartões (varejo, logística, saúde, manufatura, transporte) com ícone linear e microcópia direta — "identificação de amostras e medicamentos" —, cada um com hover que revela a aplicação concreta.

**5. Especificações que dá vontade de ler**
Tabela reconstruída em blocos temáticos (impressão, mídia, conectividade, físico, ambiente) com âncoras laterais, tipografia mono, alinhamento em grade e alto contraste. Colapsável no mobile. Botão de comparar com outro modelo da mesma categoria.

**6. Galeria em detalhe**
As fotos oficiais em visualização grande, com miniaturas e zoom nos detalhes (cabeça de impressão, painel, conectividade).

**7. Fechamento de decisão**
Bloco com: downloads do modelo (drivers já hospedados), treinamento correspondente, e CTA de orçamento com suporte e estoque no Brasil. Abaixo, 3 modelos relacionados da mesma linha, apresentados como escolha de escala — não como "veja também".

## Índice `/produtos`

Vitrine, não listagem: filtro por categoria, cards com produto em destaque sobre fundo neutro, especificação-chave visível, e hover que eleva o equipamento. O catálogo da home passa a linkar direto para cada página.

## Linguagem visual

Mantém a identidade que já construímos — laranja HPRT como sinal, cinzas industriais, IBM Plex Mono nos dados, Barlow nos títulos — e sobe o nível com: fundos escuros nos heros de produto, sombras de estúdio, revelação por scroll, régua de grade fina e muito espaço em branco. Sem gradiente roxo, sem card genérico.

## Detalhes técnicos

- Conteúdo tipado em `src/lib/products/` (um arquivo por modelo ou índice único com `slug`, `hero`, `keySpecs`, `highlights`, `applications`, `specGroups`, `gallery`, `downloads`, `related`).
- Rotas TanStack: `src/routes/produtos.index.tsx` e `src/routes/produtos.$slug.tsx`, com 404 para slug inexistente.
- Animações com Motion (reveal por scroll, contadores, parallax leve no hero), respeitando `prefers-reduced-motion`.
- Imagens servidas das URLs oficiais, com `loading="lazy"` e proporção fixa para evitar salto de layout.
- SEO por modelo: title/description próprios, H1 único, og:image com a foto oficial, JSON-LD de Produto.
- Sem backend novo: conteúdo estático, rápido e indexável.

## Etapas

1. Estrutura de dados + a página de produto completa em 2 modelos-piloto (um de etiquetas industrial e um leitor) para você aprovar o nível visual.
2. Rollout dos 25 modelos + índice `/produtos` + integração com o catálogo da home.
