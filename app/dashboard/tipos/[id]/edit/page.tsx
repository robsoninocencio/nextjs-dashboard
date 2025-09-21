import { notFound } from 'next/navigation';

import Breadcrumbs from '@/app/ui/shared/breadcrumbs';

import { fetchTipos } from '@/lib/tipos/data';

import Form from '@/app/ui/tipos/edit-form';

import { fetchTipoById } from '@/lib/tipos/data';
import type { Tipo } from '@/lib/tipos/definitions';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tipos',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const [tipo, tipos] = await Promise.all([fetchTipoById(id), fetchTipos()]);

  if (!tipo) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tipos', href: '/dashboard/tipos' },
          {
            label: 'Atualizar Tipo',
            href: {
              pathname: `/dashboard/tipos/${id}/edit`,
            },
            active: true,
          },
        ]}
      />
      <Form tipo={tipo} tipos={tipos} />
    </main>
  );
}
