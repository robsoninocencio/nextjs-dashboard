export type Ativo = {
  id: string;
  nome: string;
  tipoId?: string | null;
  ativo_categorias?: {
    categoriaId: string;
  }[];
};

export type LatestAtivo = {
  id: string;
  nome: string;
};

export type AtivosTable = {
  id: string;
  nome: string;
  tipos: {
    nome: string;
  } | null;
  ativo_categorias: {
    categoria: {
      id: string;
      nome: string;
    };
  }[];
};

export type AtivoField = {
  id: string;
  nome: string;
  tipos: { nome: string } | null;
};

export type AtivoForm = {
  tipoId: string | null;
  nome: string;
};
