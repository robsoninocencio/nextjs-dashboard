export type Banco = {
  id: string;
  nome: string;
};

export type BancosTableType = {
  id: string;
  nome: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedBancosTable = {
  id: string;
  nome: string;
  total_pending: string;
  total_paid: string;
};

export type BancoField = {
  id: string;
  nome: string;
};

export type BancoForm = {
  id: string;
  nome: string;
};
