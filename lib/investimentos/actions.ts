"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import prisma from "@/prisma/lib/prisma";

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
  rendimentoDoMes: z.coerce.number(),
  valorAplicado: z.coerce.number(),
  saldoBruto: z.coerce.number(),
  valorResgatado: z.coerce.number(),
  impostoIncorrido: z.coerce.number(),
  impostoPrevisto: z.coerce.number(),
  saldoLiquido: z.coerce.number(),
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

// Utils - Função para validar os campos do formulário usando Zod
function parseInvestimentoForm(formData: FormData) {
  return InvestimentoFormSchema.safeParse({
    clienteId: getFormValue(formData, "clienteId"),
    bancoId: getFormValue(formData, "bancoId"),
    ativoId: getFormValue(formData, "ativoId"),
    rendimentoDoMes: getFormValue(formData, "rendimentoDoMes"),
    valorAplicado: getFormValue(formData, "valorAplicado"),
    saldoBruto: getFormValue(formData, "saldoBruto"),
    valorResgatado: getFormValue(formData, "valorResgatado"),
    impostoIncorrido: getFormValue(formData, "impostoIncorrido"),
    impostoPrevisto: getFormValue(formData, "impostoPrevisto"),
    saldoLiquido: getFormValue(formData, "saldoLiquido"),
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
      rendimentoDoMes: getFormValue(formData, "rendimentoDoMes"),
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
function getCurrentDate() {
  // return new Date().toISOString().split("T")[0]; // Apenas a data (YYYY-MM-DD)
  return new Date(); // Gera um objeto Date válido para o Prisma
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
  const rendimentoDoMesInCents = data.rendimentoDoMes * 100;
  const valorAplicadoInCents = data.valorAplicado * 100;
  const saldoBrutoInCents = data.saldoBruto * 100;
  const valorResgatadoInCents = data.valorResgatado * 100;
  const impostoIncorridoInCents = data.impostoIncorrido * 100;
  const impostoPrevistoInCents = data.impostoPrevisto * 100;
  const saldoLiquidoInCents = data.saldoLiquido * 100;

  const date = getCurrentDate();

  if (id) {
    // Atualiza a fatura
    await prisma.investimentos.update({
      where: { id },
      data: {
        rendimentoDoMes: rendimentoDoMesInCents,
        valorAplicado: valorAplicadoInCents,
        saldoBruto: saldoBrutoInCents,
        valorResgatado: valorResgatadoInCents,
        impostoIncorrido: impostoIncorridoInCents,
        impostoPrevisto: impostoPrevistoInCents,
        saldoLiquido: saldoLiquidoInCents,
        clienteId: data.clienteId,
        bancoId: data.bancoId,
        ativoId: data.ativoId,
      },
    });
  } else {
    // Cria uma nova fatura
    await prisma.investimentos.create({
      data: {
        rendimentoDoMes: rendimentoDoMesInCents,
        valorAplicado: valorAplicadoInCents,
        saldoBruto: saldoBrutoInCents,
        valorResgatado: valorResgatadoInCents,
        impostoIncorrido: impostoIncorridoInCents,
        impostoPrevisto: impostoPrevistoInCents,
        saldoLiquido: saldoLiquidoInCents,
        clienteId: data.clienteId,
        bancoId: data.bancoId,
        ativoId: data.ativoId,
        data: date,
      },
    });
  }
}

// Actions - Ação de criação de fatura
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

  // Cria fatura no banco de dados
  try {
    await saveInvestimentoToDatabase(validatedFields.data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Create Investimento Error:", error);
    }
    return { message: getDatabaseErrorMessage("create") };
  }

  // Atualiza e redireciona para a página de faturas
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

  // Verifica se a fatura existe antes de tentar atualizar
  const existing = await prisma.investimentos.findUnique({ where: { id } });
  if (!existing) {
    return { message: "Investimento not found. Cannot update." };
  }

  // Atualiza fatura no banco de dados
  try {
    await saveInvestimentoToDatabase(validatedFields.data, id);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update Investimento Error:", error);
    }
    return { message: getDatabaseErrorMessage("update") };
  }

  // Atualiza e redireciona para a página de faturas
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
