export type Product = {
  name: string;
  cat: string;
  catLabel: string;
  desc: string;
  img: string;
};

export const categories: { id: string; label: string }[] = [
  { id: "all", label: "Tudo" },
  { id: "etiquetas-industrial", label: "Etiquetas – Industrial" },
  { id: "etiquetas-entrada", label: "Etiquetas – Entrada" },
  { id: "coletores", label: "Coletores de Dados" },
  { id: "leitores", label: "Leitores de Códigos de Barras" },
  { id: "cupom", label: "Impressora de Cupom" },
  { id: "a4", label: "Impressora Portátil A4" },
  { id: "pulseiras", label: "Impressora de Pulseiras" },
  { id: "cartao", label: "Impressora de Cartão" },
  { id: "fotos", label: "Impressora de Fotos" },
  { id: "embaladora", label: "Embaladora Automática" },
];


export const products: Product[] = [
  { name: "Neo", cat: "etiquetas-industrial", catLabel: "Etiquetas · Industrial", desc: "Operação contínua de alto volume.", img: "/products/64-e1783344463114.webp" },
  { name: "Grand", cat: "etiquetas-industrial", catLabel: "Etiquetas · Industrial", desc: "Robustez para centros de distribuição.", img: "/products/1-1-e1783344570445.webp" },
  { name: "Gala", cat: "etiquetas-industrial", catLabel: "Etiquetas · Industrial", desc: "Precisão de leitura de código de barras.", img: "/products/43-e1783344591470.webp" },
  { name: "HT500", cat: "etiquetas-entrada", catLabel: "Etiquetas · Entrada", desc: "Entrada para pequenas e médias operações.", img: "/products/74-e1783344139409.webp" },
  { name: "Ares", cat: "etiquetas-entrada", catLabel: "Etiquetas · Entrada", desc: "Compacta, para varejo e PDV.", img: "/products/30-e1783344629464.webp" },
  { name: "Apollo", cat: "etiquetas-entrada", catLabel: "Etiquetas · Entrada", desc: "Etiquetagem essencial, baixo custo.", img: "/products/26-e1783344651149.webp" },
  { name: "M4 Plus", cat: "coletores", catLabel: "Coletores de Dados", desc: "Robusto para logística e campo.", img: "/products/14-e1783344505492.webp" },
  { name: "M3-H", cat: "coletores", catLabel: "Coletores de Dados", desc: "Equilíbrio entre performance e porte.", img: "/products/9-e1783344527267.webp" },
  { name: "M2 Plus", cat: "coletores", catLabel: "Coletores de Dados", desc: "Entrada em coleta Android.", img: "/products/4-e1783344551137.webp" },
  { name: "P300", cat: "leitores", catLabel: "Leitores de Códigos de Barras", desc: "Alto desempenho, alto giro.", img: "/products/82-e1783344093291.webp" },
  { name: "M300C", cat: "leitores", catLabel: "Leitores de Códigos de Barras", desc: "Leitura versátil, médio porte.", img: "/products/78-e1783344114193.webp" },
  { name: "N180", cat: "leitores", catLabel: "Leitores de Códigos de Barras", desc: "Confiável no dia a dia do varejo.", img: "/products/61-e1783344256595.webp" },
  { name: "N130 BT Plus H", cat: "leitores", catLabel: "Leitores de Códigos de Barras", desc: "Versão hospitalar, resistente a desinfetantes.", img: "/products/60-e1783344279337.webp" },
  { name: "N130 BT Plus", cat: "leitores", catLabel: "Leitores de Códigos de Barras", desc: "Bluetooth, operação sem fio no PDV.", img: "/products/53-e1783344334739.webp" },
  { name: "N80", cat: "leitores", catLabel: "Leitores de Códigos de Barras", desc: "Modelo compacto e essencial.", img: "/products/47-e1783344394455.webp" },
  { name: "TP80K", cat: "cupom", catLabel: "Impressora de Cupom", desc: "Cupom fiscal para PDV.", img: "/products/TP80K.webp" },
  { name: "MT800", cat: "a4", catLabel: "Impressora Portátil A4", desc: "Térmica, sem tinta, direto do bolso.", img: "/products/MT800.webp" },
  { name: "MT810", cat: "a4", catLabel: "Impressora Portátil A4", desc: "Mobilidade para times externos.", img: "/products/72-e1783344485881.webp" },
  { name: "Gamma", cat: "pulseiras", catLabel: "Impressora de Pulseiras", desc: "Eventos e ambientes hospitalares.", img: "/products/21-e1783344195304.webp" },
  { name: "NYX-H", cat: "pulseiras", catLabel: "Impressora de Pulseiras", desc: "Controle de acesso.", img: "/products/Design-sem-nome-e1783344217571.webp" },
  { name: "NYX", cat: "pulseiras", catLabel: "Impressora de Pulseiras", desc: "Pulseiras térmicas para eventos e clínicas.", img: "/products/68-e1783344441979.webp" },
  { name: "CP-D80", cat: "cartao", catLabel: "Impressora de Cartão", desc: "Cartões PVC para credenciamento.", img: "/products/34-e1783344238765.webp" },
  { name: "CP4100", cat: "fotos", catLabel: "Impressora de Fotos", desc: "Sublimação térmica para fotos instantâneas.", img: "/products/73-e1783344612255.webp" },
  { name: "EP-50A", cat: "embaladora", catLabel: "Embaladora Automática", desc: "Embalagem all-in-one para e-commerce.", img: "/products/All-in-One-E-commerce-Packaging-Machine-2-e1783345462569.webp" },
];



export type SolutionLine = { id: string; label: string };

export type Solution = {
  num: string;
  title: string;
  desc: string;
  lines: SolutionLine[];
};

export const solutions: Solution[] = [
  {
    num: "01",
    title: "Varejo",
    desc:
      "Etiquetagem de precificação, cupom fiscal no PDV e leitura rápida de código de barras no balcão. Do back-office ao checkout, a mesma marca entrega a operação completa de identificação e venda.",
    lines: [
      { id: "etiquetas-entrada", label: "Etiquetas · Entrada" },
      { id: "cupom", label: "Cupom / PDV" },
      { id: "leitores", label: "Leitores" },
      { id: "cartao", label: "Cartões" },
    ],
  },
  {
    num: "02",
    title: "Logística",
    desc:
      "Etiquetagem de alto volume em centros de distribuição, coleta de dados em campo e leitura de códigos em esteiras e docas. Rastreabilidade ponta a ponta com equipamentos robustos para o chão de operação.",
    lines: [
      { id: "etiquetas-industrial", label: "Etiquetas · Industrial" },
      { id: "coletores", label: "Coletores" },
      { id: "leitores", label: "Leitores" },
    ],
  },
  {
    num: "03",
    title: "Saúde",
    desc:
      "Identificação de pacientes com pulseiras térmicas, rastreabilidade de materiais e etiquetas para amostras e prontuários. Equipamentos resistentes a desinfetantes para o ambiente hospitalar.",
    lines: [
      { id: "pulseiras", label: "Pulseiras" },
      { id: "leitores", label: "Leitores" },
      { id: "etiquetas-entrada", label: "Etiquetas · Entrada" },
    ],
  },
  {
    num: "04",
    title: "Alimentação",
    desc:
      "Impressão de cupom para food service e delivery, etiquetagem de produtos e preparações com equipamentos térmicos compactos. Identificação de pedidos e embalagens em ritmo de alto giro.",
    lines: [
      { id: "cupom", label: "Cupom / PDV" },
      { id: "etiquetas-entrada", label: "Etiquetas · Entrada" },
    ],
  },
];
