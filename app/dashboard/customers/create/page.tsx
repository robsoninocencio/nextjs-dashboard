import Form from "@/app/ui/customers/create-form";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";
import { fetchCustomers } from "@/lib/customers/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clientes",
};

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Clientes", href: "/dashboard/customers" },
          {
            label: "Cadastro de Cliente",
            href: "/dashboard/customers/create",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
