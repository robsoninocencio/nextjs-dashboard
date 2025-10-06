import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/shared/breadcrumbs';

import { fetchCategorias } from '@/modules/categorias/data/categorias';

import Form from '@/app/ui/categorias/edit-form';

import { fetchCategoriaById } from '@/modules/categorias/data/categorias';
import type { Categoria } from '@/types';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorias',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const [categoriaRaw, categorias] = await Promise.all([fetchCategoriaById(id), fetchCategorias()]);

  // O tipo Categoria é inferido diretamente da função fetchCategoriaById
  const categoria = categoriaRaw;
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
