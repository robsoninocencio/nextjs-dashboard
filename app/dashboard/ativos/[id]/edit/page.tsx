import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/shared/breadcrumbs';

import Form from '@/app/ui/ativos/edit-form';

import { fetchTipos } from '@/lib/data/tipos';
import { fetchAtivoById } from '@/modules/ativos/data/ativos';
import { fetchCategorias } from '@/modules/categorias/data/categorias';

import type { Ativo } from '@/modules/ativos/types/ativo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ativos',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) {
    notFound();
  }
  const [ativo, tipos, categorias] = await Promise.all([
    fetchAtivoById(id),
    fetchTipos(),
    fetchCategorias(),
  ]);

  if (!ativo) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Ativos', href: '/dashboard/ativos' },
          {
            label: 'Atualizar Ativos',
            href: {
              pathname: `/dashboard/ativos/${id}/edit`,
            },
            active: true,
          },
        ]}
      />
      <Form ativo={ativo} tipos={tipos} categorias={categorias} />
    </main>
  );
}
