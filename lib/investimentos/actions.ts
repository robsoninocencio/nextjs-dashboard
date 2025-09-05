"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import prisma from "@/prisma/lib/prisma";
import { fetchInvestimentoAnterior } from "@/lib/investimentos/data";
import { fetchAtivos } from "@/lib/ativos/data";

// Obtendo o ano atual para validação dinâmica do ano
const currentYear = new Date().getFullYear();

// Schema
const InvestimentoFormSchema = z.object({
  clienteId: z.string({
    invalid_type_error: "Por favor selecione um Cliente.",
  }),
  bancoId: z.string({
    invalid_type_error: "Por favor selecione um Banco.",
  }),
  ativoId: z.string({
    invalid_type_error: "Por favor selecione um Ativo.",
  }),
  ano: z.coerce
    .number()
    .int()
    .min(2000, "Ano inválido")
    .max(currentYear, {
      message: `Ano não pode ser maior que ${currentYear}.`,
    }),
  mes: z.coerce
    .number()
    .int()
    .min(1, "Mês deve estar entre 1 e 12")
    .max(12, "Mês inválido")
    .transform((val) => val.toString().padStart(2, "0")), // Garantindo o mês com 2 dígitos
  rendimentoDoMes: z.coerce.number().optional().default(0),
  dividendosDoMes: z.coerce.number().optional().default(0),
  valorAplicado: z.coerce.number().optional().default(0),
  saldoBruto: z.coerce.number().optional().default(0),
  valorResgatado: z.coerce.number().optional().default(0),
  impostoIncorrido: z.coerce.number().optional().default(0),
  impostoPrevisto: z.coerce.number().optional().default(0),
  saldoLiquido: z.coerce.number().optional().default(0),
});

// tipar explicitamente validatedFields.data
type InvestimentoData = z.infer<typeof InvestimentoFormSchema>;

// Types
export type InvestimentoFormState = {
  errors?: {
    clienteId?: string[];
    bancoId?: string[];
    ativoId?: string[];
    ano?: string[];
    mes?: string[];
    rendimentoDoMes?: string[];
    dividendosDoMes?: string[];
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
    valorAplicado?: string;
    saldoBruto?: string;
    valorResgatado?: string;
    impostoIncorrido?: string;
    impostoPrevisto?: string;
    saldoLiquido?: string;
    status?: string;
  };
};

// Utils - Função para evitar repetição e tornar o parsing mais robusto.
function getFormValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return value?.toString();
}

// Utils - Função para converter string de moeda para número
function getCurrencyValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key)?.toString();
  if (!value) return undefined;
  // Remove o prefixo, os separadores de milhar e substitui a vírgula decimal por ponto
  return value.replace("R$ ", "").replace(/\./g, "").replace(",", ".");
}

// Utils - Função para validar os campos do formulário usando Zod
function parseInvestimentoForm(formData: FormData) {
  return InvestimentoFormSchema.safeParse({
    clienteId: getFormValue(formData, "clienteId"),
    bancoId: getFormValue(formData, "bancoId"),
    ativoId: getFormValue(formData, "ativoId"),
    ano: getFormValue(formData, "ano") || new Date().getFullYear().toString(),
    mes:
      getFormValue(formData, "mes") || (new Date().getMonth() + 1).toString(),
    rendimentoDoMes: getCurrencyValue(formData, "rendimentoDoMes"),
    dividendosDoMes: getCurrencyValue(formData, "dividendosDoMes"),
    valorAplicado: getCurrencyValue(formData, "valorAplicado"),
    saldoBruto: getCurrencyValue(formData, "saldoBruto"),
    valorResgatado: getCurrencyValue(formData, "valorResgatado"),
    impostoIncorrido: getCurrencyValue(formData, "impostoIncorrido"),
    impostoPrevisto: getCurrencyValue(formData, "impostoPrevisto"),
    saldoLiquido: getCurrencyValue(formData, "saldoLiquido"),
  });
}

// Utils - Função para tratar erro de validação
function handleValidationError(
  formData: FormData,
  validatedFields: { success: false; error: z.ZodError }
): InvestimentoFormState {
  return {
    errors: validatedFields.error?.flatten().fieldErrors,
    message:
      "Preencha todos os campos obrigatórios. Houve erros na Criação ou Atualização do Investimento.",
    submittedData: {
      clienteId: getFormValue(formData, "clienteId"),
      bancoId: getFormValue(formData, "bancoId"),
      ativoId: getFormValue(formData, "ativoId"),
      ano: getFormValue(formData, "ano"),
      mes: getFormValue(formData, "mes"),
      rendimentoDoMes: getFormValue(formData, "rendimentoDoMes"),
      dividendosDoMes: getFormValue(formData, "dividendosDoMes"),
      valorAplicado: getFormValue(formData, "valorAplicado"),
      saldoBruto: getFormValue(formData, "saldoBruto"),
      valorResgatado: getFormValue(formData, "valorResgatado"),
      impostoIncorrido: getFormValue(formData, "impostoIncorrido"),
      impostoPrevisto: getFormValue(formData, "impostoPrevisto"),
      saldoLiquido: getFormValue(formData, "saldoLiquido"),
    },
  };
}

// Utils - Função auxiliar para formatação da data
function getInvestimentoDate(ano: number, mes: number): Date {
  // Último dia do mês especificado
  return new Date(Date.UTC(ano, mes, 0, 23, 59, 59, 999));
}

// Utils - Função que retorna mensagem de erro padrão do Banco de Dados
function getDatabaseErrorMessage(action: "create" | "update") {
  return `Database Error: Failed to ${action} investimento.`;
}

// Função para salvar investimento no banco
async function saveInvestimentoToDatabase(
  data: InvestimentoData,
  id?: string
): Promise<void> {
  console.log("Entrei em saveInvestimentoToDatabase()");
  let rendimentoDoMesInCents = Math.round(data.rendimentoDoMes * 100);
  const dividendosDoMesInCents = Math.round(data.dividendosDoMes * 100);
  const valorAplicadoInCents = Math.round(data.valorAplicado * 100);
  const saldoBrutoInCents = Math.round(data.saldoBruto * 100);
  const valorResgatadoInCents = Math.round(data.valorResgatado * 100);
  const impostoIncorridoInCents = Math.round(data.impostoIncorrido * 100);
  const impostoPrevistoInCents = Math.round(data.impostoPrevisto * 100);
  const saldoLiquidoInCents = Math.round(data.saldoLiquido * 100);

  const investimentoAnterior = await fetchInvestimentoAnterior(
    data.ano.toString(),
    data.mes.toString(),
    data.clienteId,
    data.bancoId,
    data.ativoId
  );

  if (investimentoAnterior) {
    console.log("investimentoAnterior:", investimentoAnterior);
    const ativos = await fetchAtivos();
    const selectedAtivo = ativos.find((ativo) => ativo.id === data.ativoId);
    if (selectedAtivo?.nome === "CDB Automático") {
      console.log("data.rendimentoDoMes:", data.rendimentoDoMes);
      console.log("data.saldoBruto:", data.saldoBruto);
      console.log(
        "investimentoAnterior.saldoBruto:",
        investimentoAnterior.saldoBruto
      );
      console.log("data.valorResgatado:", data.valorResgatado);
      console.log("data.impostoIncorrido:", data.impostoIncorrido);
      console.log("data.valorAplicado:", data.valorAplicado);
      data.rendimentoDoMes =
        data.saldoBruto -
        investimentoAnterior.saldoBruto +
        data.valorResgatado +
        data.impostoIncorrido -
        data.valorAplicado;
      rendimentoDoMesInCents = Math.round(data.rendimentoDoMes * 100);
      console.log("data.rendimentoDoMes:", data.rendimentoDoMes);
      console.log("rendimentoDoMesInCents:", rendimentoDoMesInCents);
    }
  } else {
    console.log("Nenhum investimento anterior encontrado.");
    const ativos = await fetchAtivos();
    const selectedAtivo = ativos.find((ativo) => ativo.id === data.ativoId);
    if (selectedAtivo?.nome === "CDB Automático") {
      data.rendimentoDoMes =
        data.saldoBruto +
        data.valorResgatado +
        data.impostoIncorrido -
        data.valorAplicado;
      rendimentoDoMesInCents = Math.round(data.rendimentoDoMes * 100);
    }
  }

  console.log("data.rendimentoDoMes =", data.rendimentoDoMes);
  console.log("rendimentoDoMesInCents =", rendimentoDoMesInCents);

  let percentualDeCrescimentoSaldoBruto = null;

  // Calcular o percentual se houver registro anterior
  if (investimentoAnterior && investimentoAnterior.saldoBruto !== 0) {
    percentualDeCrescimentoSaldoBruto =
      ((data.saldoBruto - investimentoAnterior.saldoBruto) /
        investimentoAnterior.saldoBruto) *
      100;
  }

  let percentualDeCrescimentoSaldoLiquido = null;

  // Calcular o percentual se houver registro anterior
  if (investimentoAnterior && investimentoAnterior.saldoLiquido !== 0) {
    percentualDeCrescimentoSaldoLiquido =
      ((data.saldoLiquido - investimentoAnterior.saldoLiquido) /
        investimentoAnterior.saldoLiquido) *
      100;
  }

  // const date = getCurrentDate();
  const date = getInvestimentoDate(data.ano, parseInt(data.mes, 10)); // Converte para número inteiro);

  console.log("data.mes.toString()", data.mes.toString());
  console.log("data.ano.toString()", data.ano.toString());

  if (id) {
    // Atualiza a investimento
    await prisma.investimentos.update({
      where: { id },
      data: {
        rendimentoDoMes: rendimentoDoMesInCents,
        dividendosDoMes: dividendosDoMesInCents,
        valorAplicado: valorAplicadoInCents,
        saldoBruto: saldoBrutoInCents,
        percentualDeCrescimentoSaldoBruto,
        valorResgatado: valorResgatadoInCents,
        impostoIncorrido: impostoIncorridoInCents,
        impostoPrevisto: impostoPrevistoInCents,
        saldoLiquido: saldoLiquidoInCents,
        percentualDeCrescimentoSaldoLiquido,
        clienteId: data.clienteId,
        bancoId: data.bancoId,
        ativoId: data.ativoId,
        data: date,
        ano: data.ano.toString(),
        mes: data.mes.toString(),
      },
    });
  } else {
    // Cria um novo investimento
    await prisma.investimentos.create({
      data: {
        rendimentoDoMes: rendimentoDoMesInCents,
        dividendosDoMes: dividendosDoMesInCents,
        valorAplicado: valorAplicadoInCents,
        saldoBruto: saldoBrutoInCents,
        percentualDeCrescimentoSaldoBruto,
        valorResgatado: valorResgatadoInCents,
        impostoIncorrido: impostoIncorridoInCents,
        impostoPrevisto: impostoPrevistoInCents,
        saldoLiquido: saldoLiquidoInCents,
        percentualDeCrescimentoSaldoLiquido,
        clienteId: data.clienteId,
        bancoId: data.bancoId,
        ativoId: data.ativoId,
        data: date,
        ano: data.ano.toString(),
        mes: data.mes.toString(),
      },
    });
  }
}

// Actions - Ação de criação de investimento
export async function createInvestimento(
  prevState: InvestimentoFormState,
  formData: FormData
): Promise<InvestimentoFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Received FormData:", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseInvestimentoForm(formData);
  if (process.env.NODE_ENV === "development") {
    console.log("validatedFields.error:", validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Cria investimento no banco de dados
  try {
    await saveInvestimentoToDatabase(validatedFields.data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Create Investimento Error:", error);
    }
    return { message: getDatabaseErrorMessage("create") };
  }

  // Atualiza e redireciona para a página de investimentos
  revalidatePath("/dashboard/investimentos");
  redirect("/dashboard/investimentos");
}

// Ação para atualizar investimento
export async function updateInvestimento(
  id: string,
  prevState: InvestimentoFormState,
  formData: FormData
): Promise<InvestimentoFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Received FormData:", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseInvestimentoForm(formData);
  if (process.env.NODE_ENV === "development") {
    console.log("validatedFields.error:", validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Verifica se a investimento existe antes de tentar atualizar
  const existing = await prisma.investimentos.findUnique({ where: { id } });
  if (!existing) {
    return { message: "Investimento not found. Cannot update." };
  }

  // Atualiza investimento no banco de dados
  try {
    await saveInvestimentoToDatabase(validatedFields.data, id);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update Investimento Error:", error);
    }
    return { message: getDatabaseErrorMessage("update") };
  }

  // Atualiza e redireciona para a página de investimentos
  revalidatePath("/dashboard/investimentos");
  redirect("/dashboard/investimentos");
}

export async function deleteInvestimento(id: string) {
  if (!id) {
    throw new Error("Investimento ID for deletion is invalid.");
  }

  try {
    const investimento = await prisma.investimentos.findUnique({
      where: { id },
    });
    if (!investimento) {
      throw new Error("Investimento not found.");
    }

    await prisma.investimentos.delete({
      where: { id: id },
    });
    revalidatePath("/dashboard/investimentos");
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Delete Investimento Error:", error);
    }
    throw new Error("Falha ao deletar o investimento.");
  }
}
