'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { fetchInvestimentoAnterior } from '@/lib/investimentos/data';
import { fetchAtivos } from '@/lib/ativos/data';

// ===================================================================
// 1. ESQUEMA DE VALIDAÇÃO E TIPOS
// ===================================================================

const currentYear = new Date().getFullYear();

/**
 * Pré-processador Zod para converter strings de moeda (ex: "R$ 1.234,56") para números.
 */
const currencyStringToNumber = z.preprocess(val => {
  if (typeof val !== 'string' || !val) return 0;
  // Remove todos os caracteres que não são dígitos, vírgula ou sinal de menos.
  // Em seguida, substitui a vírgula por ponto para a conversão.
  const cleanedVal = val.replace(/[^\d,-]/g, '').replace(',', '.');
  return parseFloat(cleanedVal) || 0;
}, z.number().default(0));

const InvestimentoFormSchema = z.object({
  clienteId: z.string({
    invalid_type_error: 'Por favor selecione um Cliente.',
  }),
  bancoId: z.string({
    invalid_type_error: 'Por favor selecione um Banco.',
  }),
  ativoId: z.string({
    invalid_type_error: 'Por favor selecione um Ativo.',
  }),
  ano: z.coerce
    .number()
    .int()
    .min(2000, 'Ano inválido')
    .max(currentYear, {
      message: `Ano não pode ser maior que ${currentYear}.`,
    }),
  mes: z.coerce
    .number()
    .int()
    .min(1, 'Mês deve estar entre 1 e 12')
    .max(12, 'Mês inválido')
    .transform(val => val.toString().padStart(2, '0')), // Garantindo o mês com 2 dígitos
  rendimentoDoMes: currencyStringToNumber,
  dividendosDoMes: currencyStringToNumber,
  valorAplicado: currencyStringToNumber,
  saldoAnterior: currencyStringToNumber,
  saldoBruto: currencyStringToNumber,
  valorResgatado: currencyStringToNumber,
  impostoIncorrido: currencyStringToNumber,
  impostoPrevisto: currencyStringToNumber,
  saldoLiquido: currencyStringToNumber,
});

type InvestimentoData = z.infer<typeof InvestimentoFormSchema>;

type SubmittedInvestimentoData = {
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
// Estado do formulário para useActionState
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
  submittedData?: SubmittedInvestimentoData;
};

// ===================================================================
// 2. FUNÇÕES AUXILIARES
// ===================================================================

/**
 * Retorna o último dia do mês para o ano e mês especificados.
 */
function getInvestimentoDate(ano: number, mes: number): Date {
  return new Date(Date.UTC(ano, mes, 0, 23, 59, 59, 999));
}

/**
 * Converte um valor numérico para centavos (inteiro).
 */
function toCents(value: number): number {
  return Math.round(value * 100);
}

/**
 * Calcula o rendimento do mês para ativos do tipo "CDB Automático".
 * Para outros ativos, retorna o valor já informado.
 */
async function calculateRendimentoCDB(
  data: InvestimentoData,
  investimentoAnterior: { saldoBruto: number } | null
): Promise<number> {
  const ativos = await fetchAtivos();
  const isCDBAutomatico = ativos.some(
    ativo => ativo.id === data.ativoId && ativo.nome === 'CDB Automático'
  );

  if (!isCDBAutomatico) {
    return data.rendimentoDoMes;
  }

  const saldoBrutoAnterior = investimentoAnterior?.saldoBruto ?? 0;
  return (
    data.saldoBruto -
    saldoBrutoAnterior +
    data.valorResgatado +
    data.impostoIncorrido -
    data.valorAplicado
  );
}

// ===================================================================
// 3. LÓGICA DE BANCO DE DADOS
// ===================================================================

/**
 * Prepara e salva os dados do investimento no banco de dados.
 * Cria um novo registro se o `id` não for fornecido, ou atualiza um existente.
 */
async function saveInvestimentoToDatabase(data: InvestimentoData, id?: string) {
  const investimentoAnterior = await fetchInvestimentoAnterior(
    data.ano.toString(),
    data.mes.toString(),
    data.clienteId,
    data.bancoId,
    data.ativoId
  );

  const dadosAnterioresParaCalculo = {
    saldoBruto: data.saldoAnterior,
    saldoLiquido: investimentoAnterior?.saldoLiquido ?? 0,
  };

  const rendimentoDoMes = await calculateRendimentoCDB(data, dadosAnterioresParaCalculo);

  const payload = {
    rendimentoDoMes: toCents(rendimentoDoMes),
    dividendosDoMes: toCents(data.dividendosDoMes),
    valorAplicado: toCents(data.valorAplicado),
    saldoBruto: toCents(data.saldoBruto),
    saldoAnterior: toCents(data.saldoAnterior),
    valorResgatado: toCents(data.valorResgatado),
    impostoIncorrido: toCents(data.impostoIncorrido),
    impostoPrevisto: toCents(data.impostoPrevisto),
    saldoLiquido: toCents(data.saldoLiquido),
    clienteId: data.clienteId,
    bancoId: data.bancoId,
    ativoId: data.ativoId,
    data: getInvestimentoDate(data.ano, parseInt(data.mes, 10)),
    ano: data.ano.toString(),
    mes: data.mes.toString(),
  };

  if (id) {
    await prisma.investimentos.update({ where: { id }, data: payload });
  } else {
    await prisma.investimentos.create({ data: payload });
  }
}

// ===================================================================
// 4. SERVER ACTIONS
// ===================================================================

/**
 * Ação genérica para criar ou atualizar um investimento.
 * Unifica a lógica de validação e salvamento.
 */
async function saveInvestimento(
  id: string | undefined,
  prevState: InvestimentoFormState,
  formData: FormData
): Promise<InvestimentoFormState> {
  const rawFormData = Object.fromEntries(formData.entries());

  console.log('rawFormData:', rawFormData);

  const validatedFields = InvestimentoFormSchema.safeParse(rawFormData);

  console.log('validatedFields.data:', validatedFields.data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Verifique os campos e tente novamente.',
      submittedData: rawFormData as SubmittedInvestimentoData,
    };
  }

  try {
    if (id) {
      const existing = await prisma.investimentos.findUnique({ where: { id } });
      if (!existing) {
        return {
          message: 'Investimento não encontrado. Não foi possível atualizar.',
        };
      }
    }
    await saveInvestimentoToDatabase(validatedFields.data, id);
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Erro no banco de dados: Falha ao salvar o investimento.',
    };
  }

  // Build the redirect URL with filters
  const searchParamsString = formData.get('searchParams');
  let queryString = '';
  if (typeof searchParamsString === 'string' && searchParamsString) {
    try {
      // Filtra chaves com valores nulos ou indefinidos antes de criar a query string
      const params = JSON.parse(searchParamsString);
      const cleanedParams = Object.fromEntries(Object.entries(params).filter(([, v]) => v != null));
      queryString = new URLSearchParams(cleanedParams as Record<string, string>).toString();
    } catch (e) {
      console.error('Failed to parse searchParams for redirect', e);
    }
  }
  const redirectUrl = `/dashboard/investimentos?${queryString}`;

  revalidatePath('/dashboard/investimentos');
  redirect(redirectUrl);
}

/**
 * Server Action para criar um novo investimento.
 */
export async function createInvestimento(
  prevState: InvestimentoFormState,
  formData: FormData
): Promise<InvestimentoFormState> {
  return saveInvestimento(undefined, prevState, formData);
}

/**
 * Server Action para atualizar um investimento existente.
 */
export async function updateInvestimento(
  id: string,
  prevState: InvestimentoFormState,
  formData: FormData
): Promise<InvestimentoFormState> {
  return saveInvestimento(id, prevState, formData);
}

/**
 * Server Action para deletar um investimento.
 */
export async function deleteInvestimento(id: string) {
  if (!id) {
    throw new Error('Investimento ID for deletion is invalid.');
  }

  try {
    await prisma.investimentos.delete({
      where: { id: id },
    });
    revalidatePath('/dashboard/investimentos');
  } catch (error) {
    console.error('Database Error:', error);
    // É uma boa prática lançar o erro para que possa ser tratado
    // por um Error Boundary, se necessário.
    throw new Error('Erro no banco de dados: Falha ao deletar o investimento.');
  }
}
