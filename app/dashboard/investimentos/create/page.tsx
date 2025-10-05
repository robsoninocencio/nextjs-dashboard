import Breadcrumbs from '@/components/shared/breadcrumbs';

import Form from '@/app/ui/investimentos/create-form';

import { fetchClientes } from '@/modules/clientes/data/clientes';
import { fetchBancos } from '@/modules/bancos/data/bancos';
import { fetchAtivos } from '@/modules/ativos/data/ativos';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investimentos',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const [clientes, bancos, ativos] = await Promise.all([
    fetchClientes(),
    fetchBancos(),
    fetchAtivos(),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Investimentos', href: '/dashboard/investimentos' },
          {
            label: 'Cadastro de Investimento',
            href: '/dashboard/investimentos/create',
            active: true,
          },
        ]}
      />
      <Form
        clientes={clientes}
        bancos={bancos}
        ativos={ativos}
        searchParams={resolvedSearchParams}
      />
    </main>
  );
}
