export type Cliente = {
  id: string;
  name: string;
  email: string;
};

export type ClientesTableType = {
  id: string;
  name: string;
  email: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedClientesTable = {
  id: string;
  name: string;
  email: string;
  total_pending: string;
  total_paid: string;
};

export type ClienteField = {
  id: string;
  name: string;
  email: string;
};

export type ClienteForm = {
  id: string;
  name: string;
  email: string;
};
