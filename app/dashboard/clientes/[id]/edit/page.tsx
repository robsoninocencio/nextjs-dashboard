import { notFound } from "next/navigation";

import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import { fetchClientes } from "@/lib/clientes/data";

import Form from "@/app/ui/clientes/edit-form";

import { fetchClienteById } from "@/lib/clientes/data";
import type { Cliente } from "@/lib/clientes/definitions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clientes",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [cliente, clientes] = await Promise.all([
    fetchClienteById(id),
    fetchClientes(),
  ]);

  if (!cliente) {
    notFound();
  }

  const typedInvoice: Cliente = {
    id: cliente.id,
    name: cliente.name,
    email: cliente.email,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Clientes", href: "/dashboard/clientes" },
          {
            label: "Atualizar cliente",
            href: `/dashboard/clientes/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form cliente={typedInvoice} clientes={clientes} />
    </main>
  );
}
