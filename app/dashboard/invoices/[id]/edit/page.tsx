import { notFound } from "next/navigation";

import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import { fetchCustomers } from "@/app/lib/customers/data";

import Form from "@/app/ui/invoices/edit-form";

import { fetchInvoiceById } from "@/app/lib/invoices/data";
import type { Invoice } from "@/app/lib/invoices/definitions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  // Garantir que invoice.status tenha o tipo correto
  const typedInvoice: Invoice = {
    id: invoice.id,
    customer_id: invoice.customer_id,
    amount: invoice.amount,
    date: invoice.date.toISOString(), // Converte a data para string ISO
    status:
      invoice.status === "pending" || invoice.status === "paid"
        ? invoice.status
        : "pending",
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={typedInvoice} customers={customers} />
    </main>
  );
}
