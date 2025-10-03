import { Badge } from '@/components/ui/badge';
import { Totais } from '@/lib/types/investimento';
import { InvestimentoCompleto } from '@/lib/types';
import { formatCurrency, formatDateToMonth, formatDateToYear } from '@/lib/utils';
import { ButtonLinkDelete } from '@/app/ui/investimentos/buttonLinkDelete';
import { ButtonLinkUpdate } from '@/app/ui/shared/buttonLinkUpdate';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

// Componente para indicadores visuais com sistema de cores dinâmico
const MobileCardIndicator = ({
  label,
  value,
  type = 'default',
}: {
  label: string;
  value: number;
  type?: 'profit' | 'loss' | 'neutral' | 'default';
}) => {
  const isPositive = value >= 0;
  const intensity = Math.min(Math.abs(value) / 10000, 1); // Normaliza a intensidade

  const getIndicatorStyles = () => {
    if (type === 'profit' || (type === 'default' && isPositive)) {
      return {
        container: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        background: `rgba(16, 185, 129, ${0.1 + intensity * 0.15})`,
        icon: ArrowUpIcon,
      };
    } else if (type === 'loss' || (type === 'default' && !isPositive)) {
      return {
        container: 'bg-red-50 border-red-200 text-red-700',
        background: `rgba(239, 68, 68, ${0.1 + intensity * 0.15})`,
        icon: ArrowDownIcon,
      };
    } else {
      return {
        container: 'bg-blue-50 border-blue-200 text-blue-700',
        background: `rgba(59, 130, 246, ${0.1 + intensity * 0.15})`,
        icon: null,
      };
    }
  };

  const styles = getIndicatorStyles();
  const Icon = styles.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${styles.container} shadow-sm`}
      style={{ backgroundColor: styles.background }}
    >
      {Icon && <Icon className='h-3 w-3' />}
      <span>{label}</span>
      <span>{formatCurrency(Math.abs(value))}</span>
    </div>
  );
};

// Tipos e dados para a lista financeira do card mobile
type FinancialDataKey = keyof Pick<
  InvestimentoCompleto,
  | 'saldoAnterior'
  | 'rendimentoDoMes'
  | 'dividendosDoMes'
  | 'valorAplicado'
  | 'valorResgatado'
  | 'saldoBruto'
  | 'impostoIncorrido'
  | 'impostoPrevisto'
>;

type FinancialDataField = {
  key: FinancialDataKey;
  label: string;
  isSeparator?: boolean;
};

const financialDataFields: FinancialDataField[] = [
  { key: 'saldoAnterior', label: 'Saldo Anterior' },
  { key: 'rendimentoDoMes', label: 'Rendimento' },
  { key: 'dividendosDoMes', label: 'Dividendos' },
  { key: 'valorAplicado', label: 'Aplicação' },
  { key: 'valorResgatado', label: 'Resgate' },
  { key: 'saldoBruto', label: 'Saldo Bruto', isSeparator: true },
  { key: 'impostoIncorrido', label: 'Imposto Incorrido' },
  { key: 'impostoPrevisto', label: 'Imposto Previsto' },
];

const FinancialDataList = ({ investimento }: { investimento: InvestimentoCompleto }) => (
  <div className='space-y-2 text-sm'>
    {financialDataFields.map(({ key, label, isSeparator }) => {
      const value = investimento[key];
      if (typeof value === 'number' && value > 0) {
        return (
          <div
            key={label}
            className={`flex justify-between ${isSeparator ? 'border-t border-dashed pt-2' : ''}`}
          >
            <p className='text-gray-600'>{label}</p>
            <p className='font-medium text-gray-800'>{formatCurrency(value)}</p>
          </div>
        );
      }
      return null;
    })}
  </div>
);

// Componente para exibir uma linha de investimento no layout mobile
export function MobileInvestimentoRow({
  investimento,
  searchParams,
}: {
  investimento: InvestimentoCompleto;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const rendimentoTotal = investimento.rendimentoDoMes + investimento.dividendosDoMes;
  const movimentacao = investimento.valorAplicado - investimento.valorResgatado;

  return (
    <div
      key={investimento.id}
      className='mb-4 w-full rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 p-5 shadow-sm hover:shadow-md transition-all duration-200'
    >
      {/* Card Header */}
      <div className='mb-4 flex items-start justify-between'>
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-2'>
            <p className='text-lg font-bold text-gray-900'>{investimento.ativos.nome}</p>
            <MobileCardIndicator
              label='Saldo'
              value={investimento.saldoLiquido}
              type={investimento.saldoLiquido >= 0 ? 'profit' : 'loss'}
            />
          </div>
          <p className='text-sm text-gray-600 font-medium'>{investimento.bancos.nome}</p>
          <p className='text-xs text-gray-500 mt-1'>
            {formatDateToMonth(investimento.data.toISOString())} /{' '}
            {formatDateToYear(investimento.data.toISOString())}
          </p>
        </div>
        <div className='text-right'>
          <p className='text-sm font-semibold text-gray-700'>{investimento.clientes.name}</p>
        </div>
      </div>

      {/* Categories */}
      {investimento.ativos.ativo_categorias.length > 0 && (
        <div className='mb-4 flex flex-wrap gap-2'>
          {investimento.ativos.ativo_categorias.map(({ categoria }) => (
            <Badge
              key={categoria.id}
              variant='secondary'
              className='text-xs px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200'
            >
              {categoria.nome}
            </Badge>
          ))}
        </div>
      )}

      {/* Financial Indicators Row */}
      <div className='mb-4 flex flex-wrap gap-2'>
        {rendimentoTotal > 0 && (
          <MobileCardIndicator label='Rend' value={rendimentoTotal} type='profit' />
        )}
        {investimento.dividendosDoMes > 0 && (
          <MobileCardIndicator label='Div' value={investimento.dividendosDoMes} type='profit' />
        )}
        {movimentacao !== 0 && (
          <MobileCardIndicator
            label='Mov'
            value={movimentacao}
            type={movimentacao >= 0 ? 'profit' : 'loss'}
          />
        )}
      </div>

      {/* Financial Data */}
      <FinancialDataList investimento={investimento} />

      {/* Actions */}
      <div className='mt-4 flex justify-end gap-2 pt-3 border-t border-gray-100'>
        <ButtonLinkUpdate
          href={{
            pathname: `/dashboard/investimentos/${investimento.id}/edit`,
            query: searchParams,
          }}
        />
        <ButtonLinkDelete id={investimento.id} />
      </div>
    </div>
  );
}

// Componente para exibir os totais no layout mobile
export function MobileTotals({ totais }: { totais: Totais }) {
  const evolucao = totais.saldoBruto - totais.saldoAnterior;
  const movimentacao = totais.valorAplicado - totais.valorResgatado;
  const rendimento = evolucao - movimentacao;

  return (
    <div className='mb-1 w-full rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 p-5 mt-4 border border-primary/20 shadow-sm'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='w-1 h-8 bg-primary rounded-full'></div>
          <p className='text-xl font-bold text-gray-900'>Total Geral do Mês</p>
        </div>
        <div className='flex gap-3'>
          <MobileCardIndicator
            label='Rendimento'
            value={rendimento}
            type={rendimento >= 0 ? 'profit' : 'loss'}
          />
          <MobileCardIndicator
            label='Evolução'
            value={evolucao}
            type={evolucao >= 0 ? 'profit' : 'loss'}
          />
          <MobileCardIndicator
            label='Movimentação'
            value={movimentacao}
            type={movimentacao >= 0 ? 'profit' : 'loss'}
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        {Object.entries(totais).flatMap(([key, value]) => {
          if (typeof value === 'number' && value > 0) {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

            const isProfit =
              key.includes('rendimento') || key.includes('dividendos') || key.includes('saldo');
            const isLoss = key.includes('imposto') || key.includes('resgatado');

            return [
              <div key={key} className='bg-white/60 rounded-lg p-3 border border-gray-100'>
                <p className='text-xs text-gray-600 font-medium mb-1'>{label}</p>
                <p
                  className={`text-sm font-bold ${
                    isProfit ? 'text-emerald-700' : isLoss ? 'text-red-700' : 'text-gray-800'
                  }`}
                >
                  {formatCurrency(value)}
                </p>
              </div>,
            ];
          }
          return [];
        })}
      </div>
    </div>
  );
}
