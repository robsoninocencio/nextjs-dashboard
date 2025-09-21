import Form from '@/app/ui/clientes/create-form';
import Breadcrumbs from '@/app/ui/shared/breadcrumbs';
import { fetchClientes } from '@/lib/clientes/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clientes',
};

export default async function Page() {
  const clientes = await fetchClientes();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/clientes' },
          {
            label: 'Cadastro de Cliente',
            href: '/dashboard/clientes/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
