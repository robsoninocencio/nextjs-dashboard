import { notFound } from 'next/navigation';

import Breadcrumbs from '@/app/ui/shared/breadcrumbs';

import { fetchClientes } from '@/lib/data/clientes';

import Form from '@/app/ui/clientes/edit-form';

import { fetchClienteById } from '@/lib/data/clientes';
import type { Cliente } from '@/lib/types/cliente';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clientes',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const [cliente, clientes] = await Promise.all([fetchClienteById(id), fetchClientes()]);

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
