import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/shared/breadcrumbs';

import { fetchClientes } from '@/modules/clientes/data/clientes';
import { fetchBancos } from '@/modules/bancos/data/bancos';
import { fetchAtivos } from '@/modules/ativos/data/ativos';

import Form from '@/app/ui/investimentos/edit-form';

import { fetchInvestimentoById } from '@/modules/investimentos/data/investimentos';
import type { InvestimentoForm } from '@/lib/definitions';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investimentos',
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | undefined;
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
    pathname: '/dashboard/investimentos',
    query: resolvedSearchParams,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Investimentos', href: breadcrumbHref },
          {
            label: 'Atualizar Investimento',
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
