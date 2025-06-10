export type Tipo = {
  id: string;
  nome: string;
};

export type TiposTableType = {
  id: string;
  nome: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedTiposTable = {
  id: string;
  nome: string;
  total_pending: string;
  total_paid: string;
};

export type TipoField = {
  id?: string;
  nome: string;
};

export type TipoForm = {
  id: string;
  nome: string;
};
