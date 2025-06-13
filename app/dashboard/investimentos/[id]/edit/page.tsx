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

  // Garantir que investimento tenha o tipo correto
  const typedInvestimento: Investimento = {
    id: investimento.id,
    data: investimento.data.toISOString(),
    rendimentoDoMes: investimento.rendimentoDoMes,
    valorAplicado: investimento.valorAplicado,
    saldoBruto: investimento.saldoBruto,
    valorResgatado: investimento.valorResgatado,
    impostoIncorrido: investimento.impostoIncorrido,
    impostoPrevisto: investimento.impostoPrevisto,
    saldoLiquido: investimento.saldoLiquido,
    clienteId: investimento.clienteId,
    bancoId: investimento.bancoId,
    ativoId: investimento.ativoId,
  };

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
