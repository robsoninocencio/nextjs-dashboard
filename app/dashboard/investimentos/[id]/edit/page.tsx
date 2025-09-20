import { notFound } from "next/navigation";

import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import { fetchClientes } from "@/lib/clientes/data";
import { fetchBancos } from "@/lib/bancos/data";
import { fetchAtivos } from "@/lib/ativos/data";

import Form from "@/app/ui/investimentos/edit-form";

import { fetchInvestimentoById } from "@/lib/investimentos/data";
import type { InvestimentoForm } from "@/lib/investimentos/definitions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investimentos",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | undefined;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const resolvedSearchParams = searchParams ? await searchParams : {};

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
  const typedInvestimento: InvestimentoForm = investimento;

  const breadcrumbHref = {
    pathname: "/dashboard/investimentos",
    query: resolvedSearchParams,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Investimentos", href: breadcrumbHref },
          {
            label: "Atualizar Investimento",
            href: {
              pathname: `/dashboard/investimentos/${id}/edit`,
            },
            active: true,
          },
        ]}
      />
      <Form
        investimento={typedInvestimento}
        clientes={clientes}
        bancos={bancos}
        ativos={ativos}
        searchParams={resolvedSearchParams}
      />
    </main>
  );
}
