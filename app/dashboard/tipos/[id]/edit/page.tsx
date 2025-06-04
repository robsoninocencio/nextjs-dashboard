import { notFound } from "next/navigation";

import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import { fetchBancos } from "@/lib/bancos/data";

import Form from "@/app/ui/bancos/edit-form";

import { fetchBancoById } from "@/lib/bancos/data";
import type { Banco } from "@/lib/bancos/definitions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bancos",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [banco, bancos] = await Promise.all([
    fetchBancoById(id),
    fetchBancos(),
  ]);

  if (!banco) {
    notFound();
  }

  const typedInvoice: Banco = {
    id: banco.id,
    nome: banco.nome,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Bancos", href: "/dashboard/bancos" },
          {
            label: "Atualizar banco",
            href: `/dashboard/bancos/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form banco={typedInvoice} bancos={bancos} />
    </main>
  );
}
