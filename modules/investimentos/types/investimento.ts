import { fetchFilteredInvestimentos } from '@/modules/investimentos/data/investimentos';
import { InvestimentoCompleto } from '@/lib/types';

// Tipagem inferida da função de busca para garantir consistência
// Este tipo é agora obsoleto e foi substituído por InvestimentoCompleto de @/lib/types
// export type InvestimentoComRelacoes = Awaited<
//   ReturnType<typeof fetchFilteredInvestimentos>
// >[number];
export type Totais = {
  rendimentoDoMes: number;
  dividendosDoMes: number;
  valorAplicado: number;
  saldoAnterior: number;
  saldoBruto: number;
  valorResgatado: number;
  impostoIncorrido: number;
  impostoPrevisto: number;
  saldoLiquido: number;
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

// The database returns a number for fieds, but we later format it to a string with the formatCurrency function
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
  rendimentoDoMes: number;
  dividendosDoMes: number;
  valorAplicado: number;
  saldoBruto: number;
  saldoAnterior: number;
  valorResgatado: number;
  impostoIncorrido: number;
  impostoPrevisto: number;
  saldoLiquido: number;
};

export type InvestimentosTable = {
  id: string;
  clienteId: string;
  ativoId: string;
  bancoId: string;
  data: string;
  rendimentoDoMes: number;
  dividendosDoMes: number;
  valorAplicado: number;
  saldoBruto: number;
  valorResgatado: number;
  impostoIncorrido: number;
  impostoPrevisto: number;
  saldoLiquido: number;
};

export type InvestimentoForm = {
  id: string;
  data: string;
  clienteId: string;
  ativoId: string;
  bancoId: string;
  rendimentoDoMes: number;
  dividendosDoMes: number;
  valorAplicado: number;
  saldoBruto: number;
  saldoAnterior: number;
  valorResgatado: number;
  impostoIncorrido: number;
  impostoPrevisto: number;
  saldoLiquido: number;
};
