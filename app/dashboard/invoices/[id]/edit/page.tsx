import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/shared/breadcrumbs';

import { fetchClientes } from '@/modules/clientes/data/clientes';

import Form from '@/app/ui/invoices/edit-form';

import { fetchInvoiceById } from '@/lib/data/invoices';
import type { Invoice } from '@/types';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Faturas',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const [invoice, clientes] = await Promise.all([fetchInvoiceById(id), fetchClientes()]);

  // A função fetchInvoiceById já deve retornar o tipo correto ou null.
  // O casting para 'Invoice' não é mais necessário se a função de fetch estiver bem tipada.
  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Faturas', href: '/dashboard/invoices' },
          {
            label: 'Atualizar Fatura',
            href: {
              pathname: `/dashboard/invoices/${id}/edit`,
            },
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} clientes={clientes} />
    </main>
  );
}
