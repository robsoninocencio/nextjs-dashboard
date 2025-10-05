import { fetchFilteredInvestimentos } from '@/modules/investimentos/data/investimentos';
import { InvestimentoCompleto } from '@/lib/types';
import { Decimal } from '@prisma/client/runtime/library';

// Tipagem inferida da função de busca para garantir consistência
// Este tipo é agora obsoleto e foi substituído por InvestimentoCompleto de @/lib/types
// export type InvestimentoComRelacoes = Awaited<
//   ReturnType<typeof fetchFilteredInvestimentos>
// >[number];
export type Totais = {
  rendimentoDoMes: number | Decimal;
  dividendosDoMes: number | Decimal;
  valorAplicado: number | Decimal;
  saldoAnterior: number | Decimal;
  saldoBruto: number | Decimal;
  valorResgatado: number | Decimal;
  impostoIncorrido: number | Decimal;
  impostoPrevisto: number | Decimal;
  saldoLiquido: number | Decimal;
};

export type GrupoInvestimento = {
  cliente: string;
  ano: string;
  mes: string;
  investimentos: InvestimentoCompleto[];
};

export type GrupoInvestimentoComTotais = GrupoInvestimento & { totals: Totais };

export type LatestInvestimento = {
  id: string;
  data: string;
  rendimentoDoMes: string;
  dividendosDoMes: string;
  valorAplicado: string;
  saldoBruto: string;
  valorResgatado: string;
  impostoIncorrido: string;
  impostoPrevisto: string;
  saldoLiquido: string;
};

// The database returns a Decimal for fields, but we later format it to a string with the formatCurrency function
export type LatestInvestimentoRaw = Omit<
  LatestInvestimento,
  | 'rendimentoDoMes'
  | 'dividendosDoMes'
  | 'valorAplicado'
  | 'saldoBruto'
  | 'valorResgatado'
  | 'impostoIncorrido'
  | 'impostoPrevisto'
  | 'saldoLiquido'
> & {
  rendimentoDoMes: number | Decimal;
  dividendosDoMes: number | Decimal;
  valorAplicado: number | Decimal;
  saldoBruto: number | Decimal;
  saldoAnterior: number | Decimal;
  valorResgatado: number | Decimal;
  impostoIncorrido: number | Decimal;
  impostoPrevisto: number | Decimal;
  saldoLiquido: number | Decimal;
};

export type InvestimentosTable = {
  id: string;
  clienteId: string;
  ativoId: string;
  bancoId: string;
  data: string;
  rendimentoDoMes: number | Decimal;
  dividendosDoMes: number | Decimal;
  valorAplicado: number | Decimal;
  saldoBruto: number | Decimal;
  valorResgatado: number | Decimal;
  impostoIncorrido: number | Decimal;
  impostoPrevisto: number | Decimal;
  saldoLiquido: number | Decimal;
};

export type InvestimentoForm = {
  id: string;
  data: string;
  clienteId: string;
  ativoId: string;
  bancoId: string;
  rendimentoDoMes: number | Decimal;
  dividendosDoMes: number | Decimal;
  valorAplicado: number | Decimal;
  saldoBruto: number | Decimal;
  saldoAnterior: number | Decimal;
  valorResgatado: number | Decimal;
  impostoIncorrido: number | Decimal;
  impostoPrevisto: number | Decimal;
  saldoLiquido: number | Decimal;
};
