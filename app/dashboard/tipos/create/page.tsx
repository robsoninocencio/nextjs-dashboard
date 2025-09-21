import Breadcrumbs from '@/app/ui/shared/breadcrumbs';

import Form from '@/app/ui/tipos/create-form';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tipos',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tipos', href: '/dashboard/tipos' },
          {
            label: 'Cadastro de Tipo',
            href: '/dashboard/tipos/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
