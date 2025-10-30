import { Suspense } from 'react';

import Search from '@/components/shared/search';

import { lusitana } from '@/components/shared/fonts';
import Pagination from '@/components/shared/pagination';
import { ButtonLinkCreate } from '@/components/shared/buttonsLinkCreate';

import Table from '@/app/ui/clientes/table';
import { ClientesTableSkeleton } from '@/app/ui/clientes/skeletons';

import { fetchClientesPages } from '@/modules/clientes/data/clientes';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clientes',
};

export default async function Page({
  searchParams,
}: {
  searchParams:
    | Promise<{
        query?: string;
        page?: string;
      }>
    | undefined;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const currentPage = Number(resolvedSearchParams.page) || 1;
  const query = resolvedSearchParams.query || '';

  const totalPages = await fetchClientesPages(query);

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <h1 className={`${lusitana.className} text-2xl`}>Clientes</h1>
        <ButtonLinkCreate href='/dashboard/clientes/create'>Cadastrar Cliente</ButtonLinkCreate>
      </div>
      <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
        <Search placeholder='Pesquisar clientes...' />
      </div>
      <Suspense key={query + currentPage} fallback={<ClientesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
