import Breadcrumbs from '@/components/shared/breadcrumbs';

import Form from '@/app/ui/categorias/create-form';

import { fetchCategorias } from '@/modules/categorias/data/categorias';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorias',
};

export default async function Page() {
  const categorias = await fetchCategorias();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Categorias', href: '/dashboard/categorias' },
          {
            label: 'Cadastro de Categoria',
            href: '/dashboard/categorias/create',
            active: true,
          },
        ]}
      />
      <Form categorias={categorias} />
    </main>
  );
}
