import { notFound } from "next/navigation";

import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import { fetchTipos } from "@/lib/tipos/data";

import Form from "@/app/ui/tipos/edit-form";

import { fetchTipoById } from "@/lib/tipos/data";
import type { Tipo } from "@/lib/tipos/definitions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipos",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [tipo, tipos] = await Promise.all([fetchTipoById(id), fetchTipos()]);

  if (!tipo) {
    notFound();
  }

  const typedInvoice: Tipo = {
    id: tipo.id,
    nome: tipo.nome,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Tipos", href: "/dashboard/tipos" },
          {
            label: "Atualizar Tipo",
            href: `/dashboard/tipos/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form tipo={typedInvoice} tipos={tipos} />
    </main>
  );
}
