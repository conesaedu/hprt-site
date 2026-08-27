export type SpecRow = { label: string; value: string };

export type SpecGroup = { title: string; rows: SpecRow[] };

export type Highlight = {
  title: string;
  desc: string;
  /**
   * Índice da imagem da galeria que sustenta visualmente este diferencial.
   * `null` (ou ausente) = nenhuma foto mostra o que o texto afirma; o bloco
   * é renderizado apenas com tipografia, nunca com uma imagem incoerente.
   */
  image?: number | null;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  tagline: string;
  body: string[];
  summary: string[];
  keySpecs: SpecRow[];
  highlights: Highlight[];
  applications: Highlight[];
  specGroups: SpecGroup[];
  gallery: string[];
  related: string[];
};
