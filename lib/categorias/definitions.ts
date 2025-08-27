export type Categoria = {
  id: string;
  nome: string;
  parentId: string | null;
};

export type CategoriaComPai = Categoria & {
  nomePai: string | null;
};

export type LatestCategoria = {
  id: string;
  nome: string;
};

export type CategoriasTable = {
  id: string;
  nome: string;
  parentId: string;
};

export type CategoriaField = {
  id: string;
  nome: string;
  parentId: string | null;
};

export type CategoriaForm = {
  id: string;
  nome: string;
  parentId: string | null;
};
