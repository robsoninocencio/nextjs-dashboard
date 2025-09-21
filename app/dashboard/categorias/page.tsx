import { Suspense } from 'react';

import SearchCategoria from '@/app/ui/shared/searchCategoria';

import { lusitana } from '@/app/ui/shared/fonts';
import Pagination from '@/app/ui/shared/pagination';
import { ButtonLinkCreate } from '@/app/ui/shared/buttonsLinkCreate';

import Table from '@/app/ui/categorias/table';
import { CategoriasTableSkeleton } from '@/app/ui/categorias/skeletons';

import { fetchCategoriasPages } from '@/lib/categorias/data';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorias',
};

export default async function Page({
  searchParams,
}: {
  searchParams:
    | Promise<{
        queryCategoria?: string;
        page?: string;
      }>
    | undefined;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const currentPage = Number(resolvedSearchParams.page) || 1;

  const queryCategoria = resolvedSearchParams.queryCategoria || '';

  const totalPages = await fetchCategoriasPages(queryCategoria);

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <h1 className={`${lusitana.className} text-2xl`}>Categorias</h1>
        <ButtonLinkCreate href='/dashboard/categorias/create'>Cadastrar Categoria</ButtonLinkCreate>
      </div>

      <div className='mt-4 md:mt-8'>
        <SearchCategoria placeholder='Buscar Categoria...' />
      </div>

      <Suspense key={currentPage + queryCategoria} fallback={<CategoriasTableSkeleton />}>
        <Table currentPage={currentPage} queryCategoria={queryCategoria} />
      </Suspense>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
