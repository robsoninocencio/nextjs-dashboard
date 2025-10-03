import Breadcrumbs from '@/app/ui/shared/breadcrumbs';

import Form from '@/app/ui/ativos/create-form';

import { fetchTipos } from '@/lib/data/tipos';

import { Metadata } from 'next';
import { fetchCategorias } from '@/lib/data/categorias';

export const metadata: Metadata = {
  title: 'Ativos',
};

export default async function Page() {
  const [tipos, categorias] = await Promise.all([fetchTipos(), fetchCategorias()]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Ativos', href: '/dashboard/ativos' },
          {
            label: 'Cadastro de Ativo',
            href: '/dashboard/ativos/create',
            active: true,
          },
        ]}
      />
      <Form tipos={tipos} categorias={categorias} />
    </main>
  );
}
