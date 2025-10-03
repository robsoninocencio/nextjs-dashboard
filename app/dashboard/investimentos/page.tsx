import { Suspense } from 'react';

import { ButtonLinkCreate } from '@/app/ui/shared/buttonsLinkCreate';
import { lusitana } from '@/app/ui/shared/fonts';
import Pagination from '@/app/ui/shared/pagination';
import { SidebarToggle } from '@/app/ui/dashboard/sidebar-toggle';

import { InvestimentosTableSkeleton } from '@/app/ui/investimentos/skeletons';
import { InvestmentFilters } from '@/app/ui/investimentos/InvestmentFilters';
import Table from '@/app/ui/investimentos/table';
import { MetricsCards } from '@/app/ui/investimentos/metrics-cards';
import { PerformanceChart } from '@/app/ui/investimentos/performance-chart';
import { ProfitabilityChart } from '@/app/ui/investimentos/profitability-chart';
import { DiversificationCharts } from '@/app/ui/investimentos/diversification-charts';

import { fetchInvestimentosPages } from '@/lib/investimentos/data';
import { fetchCategorias } from '@/lib/categorias/data';
import {
  fetchAggregatedMetrics,
  fetchPerformanceData,
  fetchDiversificationByCategory,
  fetchDiversificationByBank,
} from '@/lib/investimentos/analytics';

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

  const [
    { totalPages, totalItems },
    categorias,
    aggregatedMetrics,
    performanceData,
    categoryData,
    bankData,
  ] = await Promise.all([
    fetchInvestimentosPages(filters),
    fetchCategorias(),
    fetchAggregatedMetrics(filters),
    fetchPerformanceData(filters),
    fetchDiversificationByCategory(filters),
    fetchDiversificationByBank(filters),
  ]);

  // Gera uma chave estável para o Suspense, forçando-o a re-renderizar quando os filtros mudam.
  const suspenseKey = [currentPage, ...Object.values(filters)].join('-');

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between gap-4'>
        <h1 className={`${lusitana.className} text-2xl`}>Investimentos</h1>
        <div className='flex items-center gap-2'>
          <SidebarToggle />
          <ButtonLinkCreate href='/dashboard/investimentos/create'>
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
