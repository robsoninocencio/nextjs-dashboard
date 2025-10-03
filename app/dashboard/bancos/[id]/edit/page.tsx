import { notFound } from 'next/navigation';

import Breadcrumbs from '@/app/ui/shared/breadcrumbs';

import { fetchBancos } from '@/lib/data/bancos';

import Form from '@/app/ui/bancos/edit-form';

import { fetchBancoById } from '@/lib/data/bancos';
import type { Banco } from '@/lib/types/banco';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bancos',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const [banco, bancos] = await Promise.all([fetchBancoById(id), fetchBancos()]);

  if (!banco) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Bancos', href: '/dashboard/bancos' },
          {
            label: 'Atualizar banco',
            href: { pathname: `/dashboard/bancos/${id}/edit` },
            active: true,
          },
        ]}
      />
      <Form banco={banco} bancos={bancos} />
    </main>
  );
}
