import { Suspense } from 'react';

import Search from '@/components/shared/search';
import { lusitana } from '@/components/shared/fonts';
import Pagination from '@/components/shared/pagination';
import { ButtonLinkCreate } from '@/components/shared/buttonsLinkCreate';

import Table from '@/app/ui/invoices/table';
import { InvoicesTableSkeleton } from '@/app/ui/invoices/skeletons';

import { fetchInvoicesPages } from '@/lib/data/invoices';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices',
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

  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <h1 className={`${lusitana.className} text-2xl`}>Faturas</h1>
      </div>
      <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
        <Search placeholder='Pesquisar faturas...' />
        <ButtonLinkCreate href='/dashboard/invoices/create'>Cadastrar Fatura</ButtonLinkCreate>
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
