# Reordenar menu: "Por que HPRT" à frente de "Produtos"

## Resumo

Reordenar a barra superior para seguir a lógica consultiva B2B — autoridade antes do catálogo. O comprador precisa entender por que é seguro colocar a HPRT na operação *antes* de avaliar modelos.

## Mudança

Arquivo único: `src/components/hprt/Nav.tsx`, array `links`.

Nova ordem:

```text
Por que HPRT → Produtos → Soluções → Treinamentos → Downloads → Onde comprar
```

- Trocar a posição das duas primeiras entradas (`/por-que-hprt` passa a ser o primeiro item, `/produtos` o segundo).
- Nenhuma outra alteração: o CTA "Fale com um especialista" permanece, os `activeProps` e o comportamento de scroll/scrolled não mudam.

## Fora de escopo

Sem mexer em Footer, rotas, conteúdo ou estilos nesta etapa.
