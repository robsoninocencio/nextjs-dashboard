import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import Form from "@/app/ui/invoices/create-form";

import { fetchClientes } from "@/lib/clientes/data";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faturas",
};

export default async function Page() {
  const clientes = await fetchClientes();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Faturas", href: "/dashboard/invoices" },
          {
            label: "Cadastro de Fatura",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />
      <Form clientes={clientes} />
    </main>
  );
}
