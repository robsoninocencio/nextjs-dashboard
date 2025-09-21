import { Suspense } from 'react';

import Search from '@/app/ui/shared/search';
import { lusitana } from '@/app/ui/shared/fonts';
import Pagination from '@/app/ui/shared/pagination';
import { ButtonLinkCreate } from '@/app/ui/shared/buttonsLinkCreate';

import Table from '@/app/ui/clientes/table';

import { ClientesTableSkeleton } from '@/app/ui/clientes/skeletons';

import { fetchClientesPages } from '@/lib/clientes/data';

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

  const query = resolvedSearchParams.query || '';
  const currentPage = Number(resolvedSearchParams.page) || 1;

  const totalPages = await fetchClientesPages(query);

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <h1 className={`${lusitana.className} text-2xl`}>Clientes</h1>
      </div>
      <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
        <Search placeholder='Pesquisar clientes...' />
        <ButtonLinkCreate href='/dashboard/clientes/create'>Cadastrar Cliente</ButtonLinkCreate>
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
