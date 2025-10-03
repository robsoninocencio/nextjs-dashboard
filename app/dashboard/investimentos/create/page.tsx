import Breadcrumbs from '@/app/ui/shared/breadcrumbs';

import Form from '@/app/ui/investimentos/create-form';

import { fetchClientes } from '@/lib/data/clientes';
import { fetchBancos } from '@/lib/data/bancos';
import { fetchAtivos } from '@/lib/data/ativos';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investimentos',
};

export default async function Page() {
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
      <Form clientes={clientes} bancos={bancos} ativos={ativos} />
    </main>
  );
}
