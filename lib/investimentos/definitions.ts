import { fetchFilteredInvestimentos } from "@/lib/investimentos/data";

export type Investimento = {
  id: string;
  data: string;
  rendimentoDoMes: number;
  dividendosDoMes: number;
  valorAplicado: number;
  saldoBruto: number;
  saldoAnterior: number;
  valorResgatado: number;
  impostoIncorrido: number;
  impostoPrevisto: number;
  saldoLiquido: number;
  clienteId: string;
  bancoId: string;
  ativoId: string;
};

// Tipagem inferida da função de busca para garantir consistência
export type InvestimentoComRelacoes = Awaited<
  ReturnType<typeof fetchFilteredInvestimentos>
>[number];

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
  percentualDeCrescimentoSaldoBruto?: number | null;
};

export type GrupoInvestimento = {
  cliente: string;
  ano: string;
  mes: string;
  investimentos: InvestimentoComRelacoes[];
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
  | "rendimentoDoMes"
  | "dividendosDoMes"
  | "valorAplicado"
  | "saldoBruto"
  | "valorResgatado"
  | "impostoIncorrido"
  | "impostoPrevisto"
  | "saldoLiquido"
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
