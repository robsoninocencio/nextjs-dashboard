import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// Tipos base gerados pelo Prisma
export type Investimento = Prisma.investimentosGetPayload<{}>;
export type Cliente = Prisma.clientesGetPayload<{}>;
export type Banco = Prisma.bancosGetPayload<{}>;
export type Ativo = Prisma.ativosGetPayload<{}>;
export type Tipo = Prisma.tiposGetPayload<{}>;
export type Categoria = Prisma.categoriasGetPayload<{}>;
export type Invoice = Prisma.invoicesGetPayload<{}>;
export type User = Prisma.usersGetPayload<{}>;

// Tipos com relações
export type InvestimentoCompleto = Prisma.investimentosGetPayload<{
  include: {
    clientes: true;
    bancos: true;
    ativos: {
      include: {
        tipos: true;
        ativo_categorias: {
          include: { categoria: true };
        };
      };
    };
  };
}>;

export type AtivoCompleto = Prisma.ativosGetPayload<{
  include: {
    tipos: true;
    ativo_categorias: {
      include: { categoria: true };
    };
  };
}>;

export type ClienteCompleto = Prisma.clientesGetPayload<{
  include: {
    invoices: true;
    investimentos: true;
  };
}>;

export type BancoCompleto = Prisma.bancosGetPayload<{
  include: {
    investimentos: true;
  };
}>;

// Tipos para formulários (derivados dos tipos base)
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

export type AtivoForm = Pick<Ativo, 'nome'> & {
  tipoId: string | null;
  categoriaIds?: string[];
};

export type BancoForm = Pick<Banco, 'nome'>;

export type ClienteForm = Pick<Cliente, 'name' | 'email'>;

export type TipoForm = Pick<Tipo, 'nome'>;

export type CategoriaForm = Pick<Categoria, 'nome' | 'parentId'>;

export type InvoiceForm = Pick<Invoice, 'amount' | 'date' | 'status'> & {
  cliente_id: string;
};

// Tipos para tabelas (com campos calculados ou formatados)
export type AtivosTable = AtivoCompleto & {
  // Adicionar campos calculados se necessário
};

export type BancosTable = BancoCompleto & {
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedBancosTable = {
  id: string;
  nome: string;
  total_pending: string;
  total_paid: string;
};

export type InvoicesTable = Invoice & {
  name: string;
  email: string;
};

export type LatestInvoice = {
  id: string;
  name: string;
  email: string;
  amount: string;
};

export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

// Tipos para campos de formulário (para selects, etc.)
export type AtivoField = Pick<AtivoCompleto, 'id' | 'nome'> & {
  tipos: Pick<Tipo, 'nome'> | null;
};

export type BancoField = Pick<Banco, 'id' | 'nome'>;

export type ClienteField = Pick<Cliente, 'id' | 'name' | 'email'>;

export type TipoField = Pick<Tipo, 'id' | 'nome'>;

export type CategoriaField = Pick<Categoria, 'id' | 'nome'>;

// Estados de formulário para Server Actions
export type InvestimentoFormState = {
  errors?: {
    clienteId?: string[];
    bancoId?: string[];
    ativoId?: string[];
    ano?: string[];
    mes?: string[];
    rendimentoDoMes?: string[];
    dividendosDoMes?: string[];
    saldoAnterior?: string[];
    valorAplicado?: string[];
    saldoBruto?: string[];
    valorResgatado?: string[];
    impostoIncorrido?: string[];
    impostoPrevisto?: string[];
    saldoLiquido?: string[];
  };
  message?: string | null;
  submittedData?: {
    clienteId?: string;
    bancoId?: string;
    ativoId?: string;
    ano?: string;
    mes?: string;
    rendimentoDoMes?: string;
    dividendosDoMes?: string;
    saldoAnterior?: string;
    valorAplicado?: string;
    saldoBruto?: string;
    valorResgatado?: string;
    impostoIncorrido?: string;
    impostoPrevisto?: string;
    saldoLiquido?: string;
  };
};

export type AtivoFormState = {
  errors?: {
    tipoId?: string[];
    nome?: string[];
    categoriaIds?: string[];
  };
  message?: string | null;
  submittedData?: {
    tipoId?: string;
    nome?: string;
    categoriaIds?: string[];
  };
};

export type BancoFormState = {
  errors?: {
    nome?: string[];
  };
  message?: string | null;
  submittedData?: {
    nome?: string;
  };
};

export type ClienteFormState = {
  errors?: {
    name?: string[];
    email?: string[];
  };
  message?: string | null;
  submittedData?: {
    name?: string;
    email?: string;
  };
};

export type TipoFormState = {
  errors?: {
    nome?: string[];
  };
  message?: string | null;
  submittedData?: {
    nome?: string;
  };
};

export type CategoriaFormState = {
  errors?: {
    nome?: string[];
    parentId?: string[];
  };
  message?: string | null;
  submittedData?: {
    nome?: string;
    parentId?: string;
  };
};

export type InvoiceFormState = {
  errors?: {
    cliente_id?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
  submittedData?: {
    cliente_id?: string;
    amount?: string;
    status?: string;
  };
};
