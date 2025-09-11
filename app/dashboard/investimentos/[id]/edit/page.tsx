import { notFound } from "next/navigation";

import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import { fetchClientes } from "@/lib/clientes/data";
import { fetchBancos } from "@/lib/bancos/data";
import { fetchAtivos } from "@/lib/ativos/data";

import Form from "@/app/ui/investimentos/edit-form";

import { fetchInvestimentoById } from "@/lib/investimentos/data";
import type { Investimento } from "@/lib/investimentos/definitions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investimentos",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [investimento, clientes, bancos, ativos] = await Promise.all([
    fetchInvestimentoById(id),
    fetchClientes(),
    fetchBancos(),
    fetchAtivos(),
  ]);

  if (!investimento) {
    notFound();
  }

  // The `fetchInvestimentoById` function already returns the data in the expected format.
  const typedInvestimento: Investimento = investimento;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Investimentos", href: "/dashboard/investimentos" },
          {
            label: "Atualizar Investimento",
            href: `/dashboard/investimentos/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        investimento={typedInvestimento}
        clientes={clientes}
        bancos={bancos}
        ativos={ativos}
      />
    </main>
  );
}
