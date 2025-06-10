"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import prisma from "@/prisma/lib/prisma";

// Schema
const AtivoFormSchema = z.object({
  tipoId: z
    .string({ invalid_type_error: "Please select a tipo." })
    .optional()
    .transform((val) => (val === "" ? null : val)), // Transforma "" em null
  nome: z
    .string({ invalid_type_error: "Por favor, insira um nome." })
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(255, "O nome deve ter no máximo 255 caracteres."),
});

// tipar explicitamente validatedFields.data
type AtivoData = z.infer<typeof AtivoFormSchema>;

// Types
export type AtivoFormState = {
  errors?: {
    tipoId?: string[];
    nome?: string[];
  };
  message?: string | null;
  submittedData?: {
    tipoId?: string;
    nome?: string;
  };
};

// Utils - Função para evitar repetição e tornar o parsing mais robusto.
function getFormValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return value?.toString();
}

// Utils - Função para validar os campos do formulário usando Zod
function parseAtivoForm(formData: FormData) {
  return AtivoFormSchema.safeParse({
    tipoId: getFormValue(formData, "tipoId"),
    nome: getFormValue(formData, "nome"),
  });
}

// Utils - Função para tratar erro de validação
function handleValidationError(
  formData: FormData,
  validatedFields: { success: false; error: z.ZodError }
): AtivoFormState {
  return {
    errors: validatedFields.error?.flatten().fieldErrors,
    message: "Missing Fields. Failed to Create or Update Ativo.",
    submittedData: {
      tipoId: getFormValue(formData, "tipoId"),
      nome: getFormValue(formData, "nome"),
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
  return `Database Error: Failed to ${action} ativo.`;
}

// Utils - Função para salvar a fatura no banco
async function saveAtivoToDatabase(
  data: AtivoData,
  id?: string
): Promise<void> {
  if (id) {
    // Atualiza a fatura
    await prisma.ativos.update({
      where: { id },
      data: {
        tipoId: data.tipoId,
        nome: data.nome,
      },
    });
  } else {
    // Cria uma nova fatura
    await prisma.ativos.create({
      data: {
        tipoId: data.tipoId,
        nome: data.nome,
      },
    });
  }
}

// Actions - Ação de criação de fatura
export async function createAtivo(
  prevState: AtivoFormState,
  formData: FormData
): Promise<AtivoFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Received FormData:", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseAtivoForm(formData);
  if (process.env.NODE_ENV === "development") {
    console.log("validatedFields.error:", validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Cria fatura no banco de dados
  try {
    await saveAtivoToDatabase(validatedFields.data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Create Ativo Error:", error);
    }
    return { message: getDatabaseErrorMessage("create") };
  }

  // Atualiza e redireciona para a página de faturas
  revalidatePath("/dashboard/ativos");
  redirect("/dashboard/ativos");
}

export async function updateAtivo(
  id: string,
  prevState: AtivoFormState,
  formData: FormData
): Promise<AtivoFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Received FormData:", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseAtivoForm(formData);
  if (process.env.NODE_ENV === "development") {
    console.log("validatedFields.error:", validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Verifica se a fatura existe antes de tentar atualizar
  const existing = await prisma.ativos.findUnique({ where: { id } });
  if (!existing) {
    return { message: "Ativo not found. Cannot update." };
  }

  // Atualiza fatura no banco de dados
  try {
    await saveAtivoToDatabase(validatedFields.data, id);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update Ativo Error:", error);
    }
    return { message: getDatabaseErrorMessage("update") };
  }

  // Atualiza e redireciona para a página de faturas
  revalidatePath("/dashboard/ativos");
  redirect("/dashboard/ativos");
}

export async function deleteAtivo(id: string) {
  if (!id) {
    throw new Error("Ativo ID for deletion is invalid.");
  }

  try {
    const ativo = await prisma.ativos.findUnique({ where: { id } });
    if (!ativo) {
      throw new Error("Ativo not found.");
    }

    await prisma.ativos.delete({
      where: { id: id },
    });
    revalidatePath("/dashboard/ativos");
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Delete Ativo Error:", error);
    }
    throw new Error("Failed to delete ativo.");
  }
}
