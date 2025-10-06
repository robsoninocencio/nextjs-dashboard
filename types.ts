import type {
  clientes,
  invoices,
  bancos,
  ativos,
  categorias,
  tipos,
  investimentos,
} from '@prisma/client';

// Renomeando para o singular para manter a consistência com o código existente
export type Cliente = clientes;
export type Invoice = Omit<invoices, 'amount'> & {
  amount: number;
};
export type Banco = bancos;
export type Ativo = ativos;
export type Categoria = categorias;
export type Tipo = tipos;
export type Investimento = investimentos;

// Exemplo de tipo composto que pode ser útil
// Este tipo representa uma fatura com os dados do cliente incluídos.
export type InvoiceWithClienteDetails = Invoice & {
  cliente: {
    name: string;
    email: string;
  } | null;
};

// Tipos para formulários e tabelas que antes estavam em `definitions.ts`
export type ClienteField = Pick<Cliente, 'id' | 'name'>;
export type TipoField = Pick<Tipo, 'id' | 'nome'>;
export type CategoriaField = Pick<Categoria, 'id' | 'nome'>;
export type BancoField = Pick<Banco, 'id' | 'nome'>;
export type AtivoField = {
  id: string;
  nome: string;
  tipos: { nome: string } | null;
};

// Tipos que eram definidos em `definitions.ts`

// Usado em tabelas e filtros para exibir o nome da categoria pai
export type CategoriaComPai = Categoria & {
  nomePai?: string | null;
};

// Representa os dados de um investimento para uso em formulários
export type InvestimentoForm = {
  id: string;
  clienteId: string;
  bancoId: string;
  data: string;
  ativoId: string;
  ano: string;
  mes: string;
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

// Representa a estrutura completa de um investimento com relações
export type InvestimentoCompleto = Investimento & {
  clientes: Cliente;
  bancos: Banco;
  ativos: Ativo & {
    tipos: Tipo | null;
    ativo_categorias: {
      categoria: Categoria;
    }[];
  };
};

// Tipo para dados de receita, usado em gráficos
export type Revenue = {
  month: string;
  revenue: number;
};
