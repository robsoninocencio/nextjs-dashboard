"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import prisma from "@/prisma/lib/prisma";

// Schemas
const BancoFormSchema = z.object({
  nome: z
    .string({ invalid_type_error: "Por favor, insira um nome." })
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(255, "O nome deve ter no máximo 255 caracteres."),
});

// tipar explicitamente validatedFields.data
type BancoData = z.infer<typeof BancoFormSchema>;

// Types
export type CreateBancoFormState = {
  errors?: Partial<{ nome: string[] }>;
  message?: string | null;
  submittedData?: { nome?: string };
};

export type UpdateBancoFormState = {
  errors?: Partial<{ nome: string[] }>;
  message?: string | null;
  submittedData?: { nome?: string };
};

// Utils - Função para evitar repetição e tornar o parsing mais robusto.
function getFormValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return value ? value.toString() : undefined;
}

// Utils - Função para validar os campos do formulário usando Zod
function parseBancoForm(formData: FormData) {
  return BancoFormSchema.safeParse({
    nome: getFormValue(formData, "nome"),
  });
}

// Utils - Função para tratar erro de validação
function handleValidationError(
  formData: FormData,
  validatedFields: { success: false; error: z.ZodError }
): CreateBancoFormState | UpdateBancoFormState {
  return {
    errors: validatedFields.error?.flatten().fieldErrors,
    message: "Missing Fields. Failed to Create or Update Invoice.",
    submittedData: {
      nome: getFormValue(formData, "nome"),
    },
  };
}

// Utils - Função que retorna mensagem de erro padrão do Banco de Dados
function getDatabaseErrorMessage(action: "create" | "update") {
  return `Database Error: Failed to ${action} banco.`;
}

async function saveBancoToDatabase(
  data: BancoData,
  id?: string
): Promise<void> {
  if (id) {
    // Atualiza a banco
    await prisma.bancos.update({
      where: { id },
      data: {
        nome: data.nome,
      },
    });
  } else {
    // Cria um novo banco
    await prisma.bancos.create({
      data: {
        nome: data.nome,
      },
    });
  }
}

// Actions  - Ação de criação de banco
export async function createBanco(
  prevState: CreateBancoFormState,
  formData: FormData
): Promise<CreateBancoFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Received FormData:", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseBancoForm(formData);
  if (process.env.NODE_ENV === "development") {
    console.log("validatedFields.error:", validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Cria banco no banco de dados
  try {
    await saveBancoToDatabase(validatedFields.data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Create Banco Error:", error);
    }
    return { message: getDatabaseErrorMessage("create") };
  }

  revalidatePath("/dashboard/bancos");
  redirect("/dashboard/bancos");
}

export async function updateBanco(
  id: string,
  prevState: UpdateBancoFormState,
  formData: FormData
): Promise<UpdateBancoFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Received FormData:", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseBancoForm(formData);
  if (process.env.NODE_ENV === "development") {
    console.log("validatedFields.error:", validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Verifica se o banco existe antes de tentar atualizar
  const existing = await prisma.bancos.findUnique({ where: { id } });
  if (!existing) {
    return { message: "Banco not found. Cannot update." };
  }

  // Atualiza banco no banco de dados
  try {
    await saveBancoToDatabase(validatedFields.data, id);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update Banco Error:", error);
    }
    return { message: getDatabaseErrorMessage("update") };
  }

  revalidatePath("/dashboard/bancos");
  redirect("/dashboard/bancos");
}

export async function deleteBanco(id: string) {
  if (!id) {
    throw new Error("Banco ID for deletion is invalid.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Primeiro, pegar o banco para obter a URL da imagem
      const banco = await tx.bancos.findUnique({
        where: { id },
      });

      if (!banco) {
        throw new Error("Banco not found.");
      }

      // Apagar o banco
      await tx.bancos.delete({
        where: { id },
      });
    });
  } catch (error) {
    console.error(
      `Database Error: Failed to Delete Banco ID ${id} and their Invoices.`,
      error
    );
    throw new Error("Failed to delete banco and their invoices.");
  }

  revalidatePath("/dashboard/bancos");
}
