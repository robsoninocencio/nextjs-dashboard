import React from 'react';

import { Totais } from '@/modules/investimentos/types/investimento';
import {
  fetchFilteredInvestimentos,
  InvestmentFiltersParams,
} from '@/modules/investimentos/data/investimentos';

import { InvestimentoCompleto } from '@/lib/types';

import DesktopInvestimentosTable from '@/app/ui/investimentos/desktop-table';
import { MobileInvestimentoRow, MobileTotals } from '@/app/ui/investimentos/mobile-table';

import { Card, CardContent } from '@/components/ui/card';

// Interface para os props do componente
interface InvestimentosTableProps {
  currentPage: number;
  filters: InvestmentFiltersParams;
}

// Componente principal
export default async function Table({ currentPage, filters }: InvestimentosTableProps) {
  // Buscar dados de investimentos
  const investimentos: InvestimentoCompleto[] = await fetchFilteredInvestimentos(
    filters,
    currentPage
  );

  // Recria o objeto searchParams para passar aos componentes filhos.
  // Isso é necessário para que os links de edição e cancelamento preservem os filtros.
  const searchParams = {
    page: currentPage.toString(),
    queryAno: filters.ano,
    queryMes: filters.mes,
    queryCliente: filters.cliente,
    queryBanco: filters.banco,
    queryAtivo: filters.ativo,
    queryTipo: filters.tipo,
    categoriaId: filters.categoriaId,
  };

  // Calcular totais
  const totais: Totais = (investimentos || []).reduce(
    (acc, investimento) => ({
      rendimentoDoMes: acc.rendimentoDoMes + investimento.rendimentoDoMes,
      dividendosDoMes: acc.dividendosDoMes + investimento.dividendosDoMes,
      valorAplicado: acc.valorAplicado + investimento.valorAplicado,
      saldoAnterior: acc.saldoAnterior + investimento.saldoAnterior,
      saldoBruto: acc.saldoBruto + investimento.saldoBruto, // Removido Math.round para consistência
      valorResgatado: acc.valorResgatado + investimento.valorResgatado,
      impostoIncorrido: acc.impostoIncorrido + investimento.impostoIncorrido,
      impostoPrevisto: acc.impostoPrevisto + investimento.impostoPrevisto,
      saldoLiquido: acc.saldoLiquido + investimento.saldoLiquido,
    }),
    {
      rendimentoDoMes: 0,
      dividendosDoMes: 0,
      valorAplicado: 0,
      saldoBruto: 0,
      saldoAnterior: 0,
      valorResgatado: 0,
      impostoIncorrido: 0,
      impostoPrevisto: 0,
      saldoLiquido: 0,
    }
  );
  // console.log("totais**************************:", totais);

  if (!investimentos || investimentos.length === 0) {
    return <p className='mt-6 text-center text-gray-500'>Nenhum investimento encontrado.</p>;
  }

  return (
    <div className='mt-4 flow-root'>
      <div className='inline-block min-w-full align-middle'>
        <Card>
          <CardContent className='p-2 md:pt-0'>
            {/* Layout para dispositivos móveis */}
            <div className='md:hidden'>
              {investimentos.map(investimento => (
                <MobileInvestimentoRow
                  key={investimento.id}
                  investimento={investimento}
                  searchParams={searchParams}
                />
              ))}
              {investimentos?.length > 0 && <MobileTotals totais={totais} />}
            </div>
            {/* Layout para desktop */}
            <DesktopInvestimentosTable
              investimentos={investimentos}
              totais={totais}
              searchParams={searchParams}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
