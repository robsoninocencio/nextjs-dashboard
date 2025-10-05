import { TableRow, TableCell } from '@/components/ui/table';
import { GrupoInvestimentoComTotais } from '@/modules/investimentos/types/investimento';
import HeaderIndicator from './HeaderIndicator';

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

const GroupHeaderRow = ({
  group,
  colSpan,
}: {
  group: GrupoInvestimentoComTotais;
  colSpan: number;
}) => {
  const evolucao =
    (typeof group.totals.saldoBruto === 'number'
      ? group.totals.saldoBruto
      : group.totals.saldoBruto.toNumber()) -
    (typeof group.totals.saldoAnterior === 'number'
      ? group.totals.saldoAnterior
      : group.totals.saldoAnterior.toNumber());
  const movimentacao =
    (typeof group.totals.valorAplicado === 'number'
      ? group.totals.valorAplicado
      : group.totals.valorAplicado.toNumber()) -
    (typeof group.totals.valorResgatado === 'number'
      ? group.totals.valorResgatado
      : group.totals.valorResgatado.toNumber());
  const rendimento = evolucao - movimentacao;

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
            <HeaderIndicator label='Rendimento' value={rendimento} />
            <HeaderIndicator label='Evolução' value={evolucao} />
            <HeaderIndicator label='Movimentação' value={movimentacao} />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default GroupHeaderRow;
