export type Ativo = {
  id: string;
  tipoId: string | null;
  nome: string;
};

export type LatestAtivo = {
  id: string;
  nome: string;
};

export type AtivosTable = {
  id: string;
  tipoId: string;
  nome: string;
};

export type AtivoForm = {
  tipoId: string | null;
  nome: string;
};
