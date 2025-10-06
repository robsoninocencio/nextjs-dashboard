import { Suspense } from 'react';

import { ButtonLinkCreate } from '@/components/shared/buttonsLinkCreate';
import { lusitana } from '@/components/shared/fonts';
import Pagination from '@/components/shared/pagination';
import { SidebarToggle } from '@/app/ui/dashboard/sidebar-toggle';

import { InvestimentosTableSkeleton } from '@/app/ui/investimentos/skeletons';
import { InvestmentFilters } from '@/app/ui/investimentos/InvestmentFilters';
import Table from '@/app/ui/investimentos/table';
import { MetricsCards } from '@/app/ui/investimentos/metrics-cards';
import { PerformanceChart } from '@/app/ui/investimentos/performance-chart';
import { ProfitabilityChart } from '@/app/ui/investimentos/profitability-chart';
import { DiversificationCharts } from '@/app/ui/investimentos/diversification-charts';

import { fetchInvestimentosPages } from '@/modules/investimentos/data/investimentos';
import { fetchCategorias } from '@/modules/categorias/data/categorias';
import type { Categoria, CategoriaComPai } from '@/types';
import {
  fetchAggregatedMetrics,
  fetchPerformanceData,
  fetchDiversificationByCategory,
  fetchDiversificationByBank,
} from '@/modules/investimentos/analytics/investimento-analytics';
import { Decimal } from '@prisma/client/runtime/library';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investimentos',
};

type SearchParamsObject = {
  page?: string;
  query?: string;
  queryCliente?: string;
  queryAno?: string;
  queryMes?: string;
  queryBanco?: string;
  queryAtivo?: string;
  queryTipo?: string;
  categoriaId?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsObject>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const filters = {
    ano: resolvedSearchParams?.queryAno || '',
    mes: resolvedSearchParams?.queryMes ? resolvedSearchParams.queryMes.padStart(2, '0') : '',
    cliente: resolvedSearchParams?.queryCliente || '',
    banco: resolvedSearchParams?.queryBanco || '',
    ativo: resolvedSearchParams?.queryAtivo || '',
    tipo: resolvedSearchParams?.queryTipo || '',
    categoriaId: resolvedSearchParams?.categoriaId || '',
  };

  const urlFilters = {
    queryAno: filters.ano,
    queryMes: filters.mes,
    queryCliente: filters.cliente,
    queryBanco: filters.banco,
    queryAtivo: filters.ativo,
    queryTipo: filters.tipo,
    categoriaId: filters.categoriaId,
  };

  const [
    { totalPages, totalItems },
    categorias,
    aggregatedMetrics,
    performanceDataRaw,
    categoryData,
    bankData,
  ] = await Promise.all([
    fetchInvestimentosPages(filters),
    fetchCategorias() as Promise<CategoriaComPai[]>,
    fetchAggregatedMetrics(filters),
    fetchPerformanceData(filters),
    fetchDiversificationByCategory(filters),
    fetchDiversificationByBank(filters),
  ]);

  // Helper function to convert Decimal to number
  const toNumber = (value: Decimal | number | null | undefined): number => {
    if (value === null || value === undefined) return 0;
    return typeof value === 'number' ? value : value.toNumber();
  };

  // Convert Decimal fields to number for performanceData
  const performanceData = performanceDataRaw.map(item => ({
    ...item,
    saldoBruto: toNumber(item.saldoBruto),
    rendimentoDoMes: toNumber(item.rendimentoDoMes),
    dividendosDoMes: toNumber(item.dividendosDoMes),
    valorAplicado: toNumber(item.valorAplicado),
    valorResgatado: toNumber(item.valorResgatado),
  }));

  // Gera uma chave estável para o Suspense, forçando-o a re-renderizar quando os filtros mudam.
  const suspenseKey = [currentPage, ...Object.values(filters)].join('-');

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between gap-4'>
        <h1 className={`${lusitana.className} text-2xl`}>Investimentos</h1>
        <div className='flex items-center gap-2'>
          <SidebarToggle />
          <ButtonLinkCreate href='/dashboard/investimentos/create' filters={urlFilters}>
            Cadastrar Investimento
          </ButtonLinkCreate>
        </div>
      </div>

      {/* Cards de métricas */}
      <MetricsCards data={aggregatedMetrics} />

      {/* Gráficos de performance e rentabilidade */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6'>
        <PerformanceChart data={performanceData} />
        <ProfitabilityChart data={performanceData} />
      </div>

      {/* Gráficos de diversificação */}
      <DiversificationCharts categoryData={categoryData} bankData={bankData} />

      <InvestmentFilters categorias={categorias} />

      <Suspense key={suspenseKey} fallback={<InvestimentosTableSkeleton />}>
        <Table currentPage={currentPage} filters={filters} />
      </Suspense>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
