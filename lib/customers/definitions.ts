export type Customer = {
  id: string;
  name: string;
  email: string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
  email: string;
};

export type CustomerForm = {
  id: string;
  name: string;
  email: string;
};
