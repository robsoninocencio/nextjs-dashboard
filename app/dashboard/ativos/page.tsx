import { Suspense } from 'react';

import Search from '@/components/shared/search';
import CategoriaFilter from '@/components/shared/categoria-filter';

import { lusitana } from '@/components/shared/fonts';
import Pagination from '@/components/shared/pagination';
import { ButtonLinkCreate } from '@/components/shared/buttonsLinkCreate';

import Table from '@/app/ui/ativos/table';
import { AtivosTableSkeleton } from '@/app/ui/ativos/skeletons';

import { fetchAtivosPages } from '@/modules/ativos/data/ativos';
import { fetchCategorias } from '@/modules/categorias/data/categorias';
import type { CategoriaComPai } from '@/types';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ativos',
};

export default async function Page({
  searchParams,
}: {
  searchParams:
    | Promise<{
        page?: string;
        query?: string;
        categoriaId?: string;
      }>
    | undefined;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const currentPage = Number(resolvedSearchParams.page) || 1;

  const query = resolvedSearchParams.query || '';
  const categoriaId = resolvedSearchParams.categoriaId || '';

  const [{ totalPages, totalItems }, categoriasRaw] = await Promise.all([
    fetchAtivosPages(query, categoriaId),
    fetchCategorias(),
  ]);

  // Cast to CategoriaComPai as the filter only uses id and nome
  const categorias = categoriasRaw as CategoriaComPai[];

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <h1 className={`${lusitana.className} text-2xl`}>Ativos</h1>
        <ButtonLinkCreate href='/dashboard/ativos/create'>Cadastrar Ativo</ButtonLinkCreate>
      </div>

      <div className='mt-4 flex items-center justify-between gap-4 md:mt-8'>
        <Search placeholder='Pesquisar ativos...' />
        <CategoriaFilter categorias={categorias} />
      </div>

      <Suspense key={query + currentPage + categoriaId} fallback={<AtivosTableSkeleton />}>
        <Table query={query} currentPage={currentPage} categoriaId={categoriaId} />
      </Suspense>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
