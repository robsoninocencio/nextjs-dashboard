import { notFound } from "next/navigation";

import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import { fetchCustomers } from "@/app/lib/customers/data";

import Form from "@/app/ui/customers/edit-form";

import { fetchCustomerById } from "@/app/lib/customers/data";
import type { Customer } from "@/app/lib/customers/definitions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clientes",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [customer, customers] = await Promise.all([
    fetchCustomerById(id),
    fetchCustomers(),
  ]);

  if (!customer) {
    notFound();
  }

  const typedInvoice: Customer = {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    image_url: customer.image_url,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Clientes", href: "/dashboard/customers" },
          {
            label: "Atualizar cliente",
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form customer={typedInvoice} customers={customers} />
    </main>
  );
}
