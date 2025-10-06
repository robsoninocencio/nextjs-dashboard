import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/shared/breadcrumbs';

import { fetchClientes } from '@/modules/clientes/data/clientes';

import Form from '@/app/ui/clientes/edit-form';

import { fetchClienteById } from '@/modules/clientes/data/clientes';
import type { Cliente } from '@/types';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clientes',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const [clienteRaw, clientes] = await Promise.all([fetchClienteById(id), fetchClientes()]);

  // O tipo Cliente é inferido diretamente da função fetchClienteById
  const cliente = clienteRaw;
  if (!cliente) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/clientes' },
          {
            label: 'Atualizar cliente',
            href: {
              pathname: `/dashboard/clientes/${id}/edit`,
            },
            active: true,
          },
        ]}
      />
      <Form cliente={cliente} clientes={clientes} />
    </main>
  );
}
