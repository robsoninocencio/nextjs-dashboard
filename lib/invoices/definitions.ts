export type Invoice = {
  id: string;
  cliente_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pendente' or 'pago'.
  status: "pendente" | "pago";
};

export type LatestInvoice = {
  id: string;
  name: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  cliente_id: string;
  name: string;
  email: string;
  date: string;
  amount: number;
  status: "pendente" | "pago";
};

export type InvoiceForm = {
  id: string;
  cliente_id: string;
  amount: number;
  status: "pendente" | "pago";
};
