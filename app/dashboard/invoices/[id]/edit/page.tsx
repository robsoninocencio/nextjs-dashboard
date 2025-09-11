import { notFound } from "next/navigation";

import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import { fetchClientes } from "@/lib/clientes/data";

import Form from "@/app/ui/invoices/edit-form";

import { fetchInvoiceById } from "@/lib/invoices/data";
import type { Invoice } from "@/lib/invoices/definitions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faturas",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const [invoice, clientes] = await Promise.all([
    fetchInvoiceById(id),
    fetchClientes(),
  ]);

  if (!invoice) {
    notFound();
  }

  // Garantir que invoice.status tenha o tipo correto
  const typedInvoice: Invoice = {
    id: invoice.id,
    cliente_id: invoice.cliente_id,
    amount: invoice.amount,
    date: invoice.date.toISOString(), // Converte a data para string ISO
    status:
      invoice.status === "pendente" || invoice.status === "pago"
        ? invoice.status
        : "pendente",
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Faturas", href: "/dashboard/invoices" },
          {
            label: "Atualizar Fatura",
            href: {
              pathname: `/dashboard/invoices/${id}/edit`,
            },
            active: true,
          },
        ]}
      />
      <Form invoice={typedInvoice} clientes={clientes} />
    </main>
  );
}
