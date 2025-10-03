import { notFound } from 'next/navigation';

import Breadcrumbs from '@/app/ui/shared/breadcrumbs';

import { fetchCategorias } from '@/lib/data/categorias';

import Form from '@/app/ui/categorias/edit-form';

import { fetchCategoriaById } from '@/lib/data/categorias';
import type { Categoria } from '@/lib/types/categoria';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorias',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const [categoria, categorias] = await Promise.all([fetchCategoriaById(id), fetchCategorias()]);

  if (!categoria) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Categorias', href: '/dashboard/categorias' },
          {
            label: 'Atualizar Categoria',
            href: {
              pathname: `/dashboard/categorias/${id}/edit`,
            },
            active: true,
          },
        ]}
      />
      <Form categoria={categoria} categorias={categorias} />
    </main>
  );
}
