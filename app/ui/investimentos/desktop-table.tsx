import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import { formatCurrency, formatToDecimals } from '@/lib/utils';
import { InvestimentoCompleto } from '@/lib/types';
import {
  Totais,
  GrupoInvestimento,
  GrupoInvestimentoComTotais,
} from '@/lib/investimentos/definitions';
import { ButtonLinkUpdate } from '@/app/ui/shared/buttonLinkUpdate';
import { ButtonLinkDelete } from '@/app/ui/investimentos/buttonLinkDelete';

import { Card, CardContent } from '@/components/ui/card';

type HeaderConfig = {
  label: string;
  key: string;
  condition?: boolean;
  render: (
    data: InvestimentoCompleto | Totais,
    type: 'investment' | 'group' | 'grand'
  ) => React.ReactNode;
};

// Helper para agrupar investimentos
const groupInvestimentos = (
  investimentos: InvestimentoCompleto[]
): Record<string, GrupoInvestimento> => {
  const grouped: Record<string, GrupoInvestimento> = {};
  if (!investimentos) return grouped;

  for (const inv of investimentos) {
    const key = `${inv.clientes.name}-${inv.ano}-${inv.mes}`;
    if (!grouped[key]) {
      grouped[key] = {
        cliente: inv.clientes.name,
        ano: inv.ano,
        mes: inv.mes,
        investimentos: [],
      };
    }
    grouped[key].investimentos.push(inv);
  }
  return grouped;
};

const calculatePercentage = (value: number, total: number) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

// Helper function para estilização condicional de valores
const StyledValue = ({
  value,
  type = 'default',
  isBold = false,
  showAsPercentage = false,
}: {
  value: number;
  type?:
    | 'profit'
    | 'loss'
    | 'neutral'
    | 'default'
    | 'tax'
    | 'balance'
    | 'good'
    | 'very-good'
    | 'excellent';
  isBold?: boolean;
  showAsPercentage?: boolean;
}) => {
  const isNegative = value < 0;
  const isZero = value === 0;

  const getStyles = () => {
    if (isZero) {
      return 'text-gray-600 bg-gray-50 border-gray-200';
    }

    switch (type) {
      case 'profit':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'loss':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-blue-600 bg-blue-50 border-blue-200';
      case 'tax':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-orange-600 bg-orange-50 border-orange-200';
      case 'balance':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-blue-600 bg-blue-50 border-blue-200';
      case 'neutral':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-gray-700 bg-yellow-100 border-gray-200';
      case 'good':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'very-good':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-emerald-700 bg-emerald-100 border-emerald-300';
      case 'excellent':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-emerald-900 bg-emerald-200 border-emerald-400';

      default:
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const styles = getStyles();
  const displayValue = showAsPercentage
    ? `${formatToDecimals(Math.abs(value), 6)}%`
    : formatCurrency(Math.abs(value));

  return (
    <span className={`font-medium py-1 rounded border ${styles} ${isBold ? 'font-bold' : ''}`}>
      {isNegative && !isZero && '-'}
      {displayValue}
    </span>
  );
};

const monthNames: { [key: string]: string } = {
  '01': 'Janeiro',
  '02': 'Fevereiro',
  '03': 'Março',
  '04': 'Abril',
  '05': 'Maio',
  '06': 'Junho',
  '07': 'Julho',
  '08': 'Agosto',
  '09': 'Setembro',
  '10': 'Outubro',
  '11': 'Novembro',
  '12': 'Dezembro',
};

const HeaderIndicator = ({ label, value }: { label: string; value: number }) => {
  const isPositive = value >= 0;
  const intensity = Math.min(Math.abs(value) / 10000, 1); // Normaliza a intensidade

  return (
    <div className='flex items-center gap-2 p-2 rounded-lg bg-white/50 border border-gray-100 shadow-sm'>
      <span className='text-xs font-medium text-gray-600 uppercase tracking-wide'>{label}:</span>
      <span
        className={`font-bold flex items-center gap-1.5 px-2 py-1 rounded-md text-sm ${
          isPositive
            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
            : 'text-red-700 bg-red-50 border border-red-200'
        }`}
        style={{
          backgroundColor: isPositive
            ? `rgba(16, 185, 129, ${0.1 + intensity * 0.15})`
            : `rgba(239, 68, 68, ${0.1 + intensity * 0.15})`,
        }}
      >
        {isPositive ? <ArrowUpIcon className='h-4 w-4' /> : <ArrowDownIcon className='h-4 w-4' />}
        {formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
};

const GroupHeaderRow = ({
  group,
  colSpan,
}: {
  group: GrupoInvestimentoComTotais;
  colSpan: number;
}) => {
  const evolucao = group.totals.saldoBruto - group.totals.saldoAnterior;
  const movimentacao = group.totals.valorAplicado - group.totals.valorResgatado;

  return (
    <TableRow className='border-y-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.001] transform'>
      <TableCell colSpan={colSpan} className='p-3'>
        <div className='flex items-center justify-between animate-in slide-in-from-left duration-500'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-1 h-8 bg-primary rounded-full animate-pulse'></div>
              <span className='text-foreground font-bold text-lg hover:text-primary transition-colors duration-200'>
                {group.cliente}
              </span>
            </div>
            <span className='text-primary/60 text-xl animate-in zoom-in duration-300 delay-100'>
              •
            </span>
            <span className='text-muted-foreground font-semibold text-base hover:text-foreground transition-colors duration-200'>
              {monthNames[group.mes]} de {group.ano}
            </span>
          </div>
          <div className='flex gap-8 animate-in slide-in-from-right duration-500 delay-200'>
            <HeaderIndicator label='Evolução' value={evolucao} />
            <HeaderIndicator label='Movimentação' value={movimentacao} />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

const TableHeaderRow = ({ visibleHeaders }: { visibleHeaders: HeaderConfig[] }) => (
  <TableRow className='border-b-2 border-primary/15 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 transition-all duration-200 sticky top-0 z-10 shadow-sm'>
    {['Banco', 'Ativo', 'Tipo', 'Categorias'].map(header => (
      <TableHead
        key={header}
        className='py-2 px-2 text-xs font-bold text-slate-700 uppercase tracking-wider text-left bg-white/90 backdrop-blur-sm border-r border-gray-100 last:border-r-0'
      >
        {header}
      </TableHead>
    ))}
    {visibleHeaders.map(({ label }) => (
      <TableHead
        key={label}
        className='py-2 px-2 text-xs font-bold text-slate-700 uppercase tracking-wider text-right bg-white/90 backdrop-blur-sm border-r border-gray-100 last:border-r-0'
      >
        {label}
      </TableHead>
    ))}
    <TableHead className='px-4 py-3 text-right bg-white/90 backdrop-blur-sm'>
      <span className='sr-only'>Ações</span>
    </TableHead>
  </TableRow>
);

const DynamicDataCells = ({
  data,
  visibleHeaders,
  type,
  cellClassName,
}: {
  data: InvestimentoCompleto | Totais;
  visibleHeaders: HeaderConfig[];
  type: 'investment' | 'group' | 'grand';
  cellClassName: string;
}) => (
  <>
    {visibleHeaders.map(header => (
      <TableCell key={header.key} className={cellClassName}>
        {header.render(data, type)}
      </TableCell>
    ))}
  </>
);

const InvestmentRow = ({
  investimento,
  visibleHeaders,
  searchParams,
}: {
  investimento: InvestimentoCompleto;
  visibleHeaders: HeaderConfig[];
  searchParams?: { [key: string]: string | string[] | undefined };
}) => (
  <TableRow
    key={investimento.id}
    className='border-b border-gray-100 text-sm hover:bg-gray-50/80 hover:shadow-sm transition-all group animate-in fade-in slide-in-from-bottom duration-300'
  >
    <TableCell className='whitespace-nowrap px-2 py-1 align-top font-medium text-gray-900 group-hover:text-gray-950 transition-colors duration-150'>
      <span className='inline-block hover:translate-x-1 transition-transform duration-200'>
        {investimento.bancos.nome}
      </span>
    </TableCell>
    <TableCell className='whitespace-nowrap px-2 py-1 align-top font-medium text-gray-900 group-hover:text-gray-950 transition-colors duration-150'>
      <span className='inline-block hover:translate-x-1 transition-transform duration-200'>
        {investimento.ativos.nome}
      </span>
    </TableCell>
    <TableCell className='whitespace-nowrap px-2 py-1 align-top text-gray-700 group-hover:text-gray-900 transition-colors duration-150'>
      <span className='inline-block hover:translate-x-1 transition-transform duration-200'>
        {investimento.ativos.tipos?.nome}
      </span>
    </TableCell>
    <TableCell className='whitespace-nowrap px-2 py-1 align-top'>
      <div className='flex flex-wrap gap-2'>
        {investimento.ativos.ativo_categorias.map(({ categoria }, index) => (
          <Badge
            key={categoria.id}
            variant='secondary'
            className='text-xs px-3 py-1 font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all cursor-default animate-in zoom-in duration-300'
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {categoria.nome}
          </Badge>
        ))}
      </div>
    </TableCell>
    <DynamicDataCells
      data={investimento}
      visibleHeaders={visibleHeaders}
      type='investment'
      cellClassName='whitespace-nowrap px-2 py-1 text-right align-top font-medium text-gray-900 group-hover:text-gray-950 transition-colors duration-150'
    />
    <TableCell className='whitespace-nowrap py-1 pl-2 pr-3 align-top'>
      <div className='flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-all duration-200'>
        <ButtonLinkUpdate
          href={{
            pathname: `/dashboard/investimentos/${investimento.id}/edit`,
            query: searchParams,
          }}
        />
        <ButtonLinkDelete id={investimento.id} />
      </div>
    </TableCell>
  </TableRow>
);

const GroupTotalRow = ({
  groupTotals,
  visibleHeaders,
  colSpan,
}: {
  groupTotals: Totais;
  visibleHeaders: HeaderConfig[];
  colSpan: number;
}) => {
  return (
    <>
      {/* Linha de espaçamento para separar visualmente dos investimentos */}
      <TableRow className='h-2 border-0 bg-transparent hover:bg-transparent'>
        <TableCell colSpan={colSpan} className='p-0 border-0' />
      </TableRow>
      <TableRow className='border-t-2 border-b-2 border-primary/20 bg-gradient-to-r from-primary/8 to-primary/12 font-semibold hover:from-primary/12 hover:to-primary/16 transition-all duration-200 shadow-sm'>
        <TableCell
          colSpan={4}
          className='px-3 py-2 text-left font-bold align-top text-primary text-base'
        >
          <div className='flex items-center gap-2'>
            <div className='w-1 h-6 bg-primary/60 rounded-full'></div>
            Total do Grupo
          </div>
        </TableCell>
        <DynamicDataCells
          data={groupTotals}
          visibleHeaders={visibleHeaders}
          type='group'
          cellClassName='whitespace-nowrap px-3 py-2 text-right align-top font-bold text-primary'
        />
        <TableCell className='whitespace-nowrap px-3 py-2 text-right align-top'></TableCell>
      </TableRow>
      {/* Linha de espaçamento para separar visualmente dos investimentos */}
      <TableRow className='h-3 border-0 bg-transparent hover:bg-transparent'>
        <TableCell colSpan={colSpan} className='p-0 border-0' />
      </TableRow>
    </>
  );
};

const GrandTotalRow = ({
  totais,
  visibleHeaders,
  colSpan,
}: {
  totais: Totais;
  visibleHeaders: HeaderConfig[];
  colSpan: number;
}) => {
  const evolucao = totais.saldoBruto - totais.saldoAnterior;
  const movimentacao = totais.valorAplicado - totais.valorResgatado;

  return (
    <TableFooter>
      <TableRow className='border-t-2 border-b-2 border-primary/20 bg-gradient-to-r from-primary/10 to-primary/15 hover:from-primary/15 hover:to-primary/20 transition-all duration-200 shadow-sm'>
        <TableCell colSpan={colSpan} className='p-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='w-1 h-10 bg-primary rounded-full'></div>
              <span className='text-foreground font-bold text-xl'>Sumário Geral</span>
            </div>
            <div className='flex gap-8'>
              <HeaderIndicator label='Evolução' value={evolucao} />
              <HeaderIndicator label='Movimentação' value={movimentacao} />
            </div>
          </div>
        </TableCell>
      </TableRow>
      <TableRow className='bg-gradient-to-r from-primary/20 to-primary/25 text-base font-bold hover:from-primary/25 hover:to-primary/30 transition-all duration-200 shadow-lg'>
        <TableCell
          colSpan={4}
          className='px-4 py-3 text-left font-bold text-xl align-top text-primary rounded-bl-lg'
        >
          <div className='flex items-center gap-3'>
            <div className='w-2 h-8 bg-primary rounded-full'></div>
            Total Geral
          </div>
        </TableCell>
        <DynamicDataCells
          data={totais}
          visibleHeaders={visibleHeaders}
          type='grand'
          cellClassName='whitespace-nowrap py-3 text-right align-top font-bold text-primary text-lg'
        />
        <TableCell className='whitespace-nowrap px-4 py-3 text-right align-top rounded-br-lg'></TableCell>
      </TableRow>
    </TableFooter>
  );
};

type DesktopTableProps = {
  investimentos: InvestimentoCompleto[];
  totais: Totais;
  searchParams?: { [key: string]: string | string[] | undefined };
  isLoading?: boolean;
};

const LoadingSkeleton = () => (
  <div className='hidden md:block w-full'>
    <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
      <div className='p-8 space-y-4'>
        {[1, 2, 3].map(i => (
          <div key={i} className='animate-pulse'>
            <div className='h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg mb-4'></div>
            <div className='h-12 bg-gray-100 rounded mb-2'></div>
            <div className='space-y-2'>
              {[1, 2, 3].map(j => (
                <div key={j} className='h-10 bg-gray-50 rounded'></div>
              ))}
            </div>
            <div className='h-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded mt-4'></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function DesktopInvestimentosTable({
  investimentos,
  totais,
  searchParams,
  isLoading = false,
}: DesktopTableProps) {
  const groupedInvestimentos: GrupoInvestimentoComTotais[] = useMemo(() => {
    if (!investimentos) {
      return [];
    }
    return Object.values(groupInvestimentos(investimentos)).map(group => {
      // Calcula os totais para cada grupo
      const groupTotals = group.investimentos.reduce(
        (acc, inv) => {
          acc.rendimentoDoMes += inv.rendimentoDoMes;
          acc.dividendosDoMes += inv.dividendosDoMes;
          acc.valorAplicado += inv.valorAplicado;
          acc.saldoAnterior += inv.saldoAnterior;
          acc.saldoBruto += inv.saldoBruto;
          acc.valorResgatado += inv.valorResgatado;
          acc.impostoIncorrido += inv.impostoIncorrido;
          acc.impostoPrevisto += inv.impostoPrevisto;
          acc.saldoLiquido += inv.saldoLiquido;
          return acc;
        },
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
      return {
        ...group,
        totals: groupTotals,
      };
    });
  }, [investimentos]);

  // A função render recebe o type da linha como argumento ("investment" | "group" | "grand").
  // Você pode usar esse parâmetro para decidir o que renderizar em cada caso.

  const { visibleHeaders, colSpan } = useMemo(() => {
    const headerConfig: HeaderConfig[] = [
      {
        label: 'Saldo Anterior',
        key: 'saldoAnterior',
        render: (data, type) => {
          if (type === 'grand') return '';
          return <StyledValue value={data.saldoAnterior} type='balance' />;
        },
      },
      {
        label: 'Rendimento',
        key: 'rendimentoDoMes',
        render: data => <StyledValue value={data.rendimentoDoMes} type='profit' />,
      },
      {
        label: 'Rendimento (%)',
        key: 'percentualRendimentoDoMes',
        render: data => {
          const percentage = calculatePercentage(
            data.rendimentoDoMes,
            data.saldoAnterior !== 0 ? data.saldoAnterior : data.valorAplicado
          );
          let type: 'profit' | 'neutral' | 'good' | 'very-good' | 'excellent' = 'profit';

          if (percentage >= 1) {
            type = 'excellent';
          } else if (percentage >= 0.8) {
            type = 'very-good';
          } else if (percentage >= 0.6) {
            type = 'good';
          } else if (percentage > 0) {
            type = 'neutral';
          }
          return <StyledValue value={percentage} type={type} showAsPercentage={true} />;
        },
      },
      {
        label: 'Dividendo',
        key: 'dividendosDoMes',
        condition: totais.dividendosDoMes > 0,
        render: data => <StyledValue value={data.dividendosDoMes} type='profit' />,
      },
      {
        label: 'Dividendo (%)',
        key: 'percentualDividendosDoMes',
        condition: totais.dividendosDoMes > 0,
        render: data => {
          const percentage = calculatePercentage(
            data.dividendosDoMes,
            data.saldoAnterior !== 0 ? data.saldoAnterior : data.valorAplicado
          );
          let type: 'profit' | 'neutral' | 'good' | 'very-good' | 'excellent' = 'profit';

          if (percentage >= 1) {
            type = 'excellent';
          } else if (percentage >= 0.8) {
            type = 'very-good';
          } else if (percentage >= 0.6) {
            type = 'good';
          } else if (percentage > 0) {
            type = 'neutral';
          }
          return <StyledValue value={percentage} type={type} showAsPercentage={true} />;
        },
      },
      {
        label: 'Rend + Div (%)',
        key: 'percentualRendMaisDivDoMes',
        condition: totais.dividendosDoMes > 0,
        render: data => {
          const percentage = calculatePercentage(
            data.rendimentoDoMes + data.dividendosDoMes,
            data.saldoAnterior !== 0 ? data.saldoAnterior : data.valorAplicado
          );
          let type: 'profit' | 'neutral' | 'good' | 'very-good' | 'excellent' = 'profit';

          if (percentage >= 1) {
            type = 'excellent';
          } else if (percentage >= 0.8) {
            type = 'very-good';
          } else if (percentage >= 0.6) {
            type = 'good';
          } else if (percentage > 0) {
            type = 'neutral';
          }
          return <StyledValue value={percentage} type={type} showAsPercentage={true} />;
        },
      },
      {
        label: 'Aplicações',
        key: 'valorAplicado',
        condition: totais.valorAplicado > 0,
        render: data => <StyledValue value={data.valorAplicado} type='loss' />,
      },
      {
        label: 'Resgates',
        key: 'valorResgatado',
        condition: totais.valorResgatado > 0,
        render: data => <StyledValue value={data.valorResgatado} type='loss' />,
      },
      {
        label: 'Saldo Bruto',
        key: 'saldoBruto',
        condition: totais.saldoBruto > 0,
        render: (data, type) => {
          if (type === 'grand') return '';
          return <StyledValue value={data.saldoBruto} type='balance' />;
        },
      },
      {
        label: '% Cresc Bruto',
        key: 'percentualDeCrescimentoSaldoBruto',
        render: (data, type) => {
          const base =
            type === 'grand'
              ? data.saldoAnterior
              : data.saldoAnterior !== 0
                ? data.saldoAnterior
                : data.valorAplicado;
          const percentage = calculatePercentage(data.saldoBruto - data.saldoAnterior, base);
          let gradiente: 'profit' | 'neutral' | 'good' | 'very-good' | 'excellent' = 'profit';

          if (percentage >= 1) {
            gradiente = 'excellent';
          } else if (percentage >= 0.8) {
            gradiente = 'very-good';
          } else if (percentage >= 0.6) {
            gradiente = 'good';
          } else if (percentage > 0) {
            gradiente = 'neutral';
          }
          return <StyledValue value={percentage} type={gradiente} showAsPercentage={true} />;
        },
      },
      {
        label: 'Imposto Incorrido',
        key: 'impostoIncorrido',
        condition: totais.impostoIncorrido > 0,
        render: data => <StyledValue value={data.impostoIncorrido} type='tax' />,
      },
      {
        label: 'Imposto Previsto',
        key: 'impostoPrevisto',
        condition: totais.impostoPrevisto > 0,
        render: data => <StyledValue value={data.impostoPrevisto} type='tax' />,
      },
      {
        label: 'Saldo Líquido',
        key: 'saldoLiquido',
        render: (data, type) => {
          if (type === 'grand') return '';
          return <StyledValue value={data.saldoLiquido} type='profit' isBold={true} />;
        },
      },
    ];

    const visibleHeaders = headerConfig.filter(({ condition = true }) => condition);
    const colSpan = 4 + visibleHeaders.length + 1; // 4 estáticos + dinâmicos + 1 ações
    return { visibleHeaders, colSpan };
  }, [totais]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!investimentos || investimentos.length === 0) {
    return (
      <div className='hidden md:block w-full'>
        <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
          <div className='p-12 text-center'>
            <div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Nenhum investimento encontrado
            </h3>
            <p className='text-gray-500'>Não há investimentos para exibir no momento.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className='hidden md:block w-full'
      role='region'
      aria-label='Tabela de investimentos por cliente'
    >
      <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
        <div className='overflow-x-auto' role='presentation'>
          <Table
            className='min-w-[700px] lg:min-w-[900px] xl:min-w-[1100px] w-full'
            role='table'
            aria-label='Investimentos organizados por cliente e período'
          >
            <TableBody role='rowgroup'>
              {groupedInvestimentos.map((group, groupIndex) => (
                <React.Fragment key={`${group.cliente}-${group.ano}-${group.mes}`}>
                  <GroupHeaderRow group={group} colSpan={colSpan} />
                  <TableHeaderRow visibleHeaders={visibleHeaders} />
                  {group.investimentos.map((investimento, index) => (
                    <InvestmentRow
                      key={investimento.id}
                      investimento={investimento}
                      visibleHeaders={visibleHeaders}
                      searchParams={searchParams}
                    />
                  ))}
                  <GroupTotalRow
                    groupTotals={group.totals}
                    visibleHeaders={visibleHeaders}
                    colSpan={colSpan}
                  />
                </React.Fragment>
              ))}
            </TableBody>
            {investimentos?.length > 0 && (
              <GrandTotalRow totais={totais} visibleHeaders={visibleHeaders} colSpan={colSpan} />
            )}
          </Table>
        </div>
      </div>
    </div>
  );
}
