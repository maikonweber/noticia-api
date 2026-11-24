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
    id: "mercado-crypto",
    label: "Mercado Crypto",
    description: "Bitcoin, altcoins, DeFi e blockchain",
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
    description: "Música, celebridades, TV e cultura pop",
  },
  {
    id: "games",
    label: "Games",
    description: "Games, eSports, lançamentos e indústria",
  },
  {
    id: "cinema",
    label: "Cinema e Séries",
    description: "Filmes, séries, streaming e indústria audiovisual",
  },
  {
    id: "animes",
    label: "Animes",
    description: "Animes, mangás, spoilers e novidades — com destaque para One Piece",
  },
  {
    id: "seguranca",
    label: "Segurança",
    description: "Cibersegurança, ataques, vazamentos e alertas de vulnerabilidades",
  },
  {
    id: "ia",
    label: "Inteligência Artificial",
    description: "IA generativa, modelos, pesquisa e mercado de IA",
  },
  {
    id: "economia",
    label: "Economia",
    description: "Economia, negócios, empresas e mercado de trabalho",
  },
  {
    id: "brasil",
    label: "Brasil",
    description: "Política, governo e principais notícias do país",
  },
  {
    id: "mundo",
    label: "Mundo",
    description: "Notícias internacionais e geopolítica",
  },
  {
    id: "ciencia",
    label: "Ciência",
    description: "Ciência, espaço, saúde e pesquisa",
  },
];

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label]),
);
