export type Categoria = {
  id: string;
  parentId: string | null;
  nome: string;
};

export type LatestCategoria = {
  id: string;
  nome: string;
};

export type CategoriasTable = {
  id: string;
  parentId: string;
  nome: string;
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
