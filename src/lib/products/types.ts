export type SpecRow = { label: string; value: string };

export type SpecGroup = { title: string; rows: SpecRow[] };

export type Highlight = { title: string; desc: string };

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
