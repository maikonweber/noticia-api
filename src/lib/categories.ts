import type { Category } from "./api/types";

export const CATEGORIES: {
  id: Category;
  label: string;
  description: string;
}[] = [
  {
    id: "investimentos",
    label: "Investimentos",
    description: "Mercado, economia e finanças",
  },
  {
    id: "tecnologia",
    label: "Tecnologia",
    description: "Inovação, gadgets e indústria tech",
  },
  {
    id: "programacao",
    label: "Programação",
    description: "Dev, open source e ferramentas",
  },
  {
    id: "esportes",
    label: "Esportes",
    description: "Futebol, competições e notícias esportivas",
  },
  {
    id: "entretenimento",
    label: "Entretenimento",
    description: "Cinema, música, TV e cultura pop",
  },
];

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label]),
);
