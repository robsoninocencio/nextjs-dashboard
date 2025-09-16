"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

// Schemas
const TipoFormSchema = z.object({
  nome: z
    .string({ invalid_type_error: "Por favor, insira um nome." })
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(255, "O nome deve ter no máximo 255 caracteres."),
});

// tipar explicitamente validatedFields.data
type TipoData = z.infer<typeof TipoFormSchema>;

// Types
export type CreateTipoFormState = {
  errors?: Partial<{ nome: string[] }>;
  message?: string | null;
  submittedData?: { nome?: string };
};

export type UpdateTipoFormState = {
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
function parseTipoForm(formData: FormData) {
  return TipoFormSchema.safeParse({
    nome: getFormValue(formData, "nome"),
  });
}

// Utils - Função para tratar erro de validação
function handleValidationError(
  formData: FormData,
  validatedFields: { success: false; error: z.ZodError }
): CreateTipoFormState | UpdateTipoFormState {
  return {
    errors: validatedFields.error?.flatten().fieldErrors,
    message:
      "Campos obrigatórios ausentes. Falha ao Criar ou Atualizar o Tipo.",
    submittedData: {
      nome: getFormValue(formData, "nome"),
    },
  };
}

// Utils - Função que retorna mensagem de erro padrão do Tipo de Dados
function getDatabaseErrorMessage(action: "create" | "update") {
  return `Erro no Tipo de Dados: Falha ao ${action} o tipo.`;
}

async function saveTipoToDatabase(data: TipoData, id?: string): Promise<void> {
  if (id) {
    // Atualiza a tipo
    await prisma.tipos.update({
      where: { id },
      data: {
        nome: data.nome,
      },
    });
  } else {
    // Cria um novo tipo
    await prisma.tipos.create({
      data: {
        nome: data.nome,
      },
    });
  }
}

// Actions  - Ação de criação de tipo
export async function createTipo(
  prevState: CreateTipoFormState,
  formData: FormData
): Promise<CreateTipoFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Received FormData:", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseTipoForm(formData);
  if (process.env.NODE_ENV === "development") {
    console.log("validatedFields.error:", validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Cria tipo no tipo de dados
  try {
    await saveTipoToDatabase(validatedFields.data);
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("Create Tipo Error:", error);
    }
    // Tratamento de erro de violação de unicidade do Prisma (código P2002)
    if (error.code === "P2002" && error.meta?.target?.includes("nome")) {
      return {
        errors: { nome: ["Nome do tipo já existe."] },
        message: "Nome do tipo já existe.",
      };
    }
    return { message: getDatabaseErrorMessage("create") };
  }

  revalidatePath("/dashboard/tipos");
  redirect("/dashboard/tipos");
}

export async function updateTipo(
  id: string,
  prevState: UpdateTipoFormState,
  formData: FormData
): Promise<UpdateTipoFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Received FormData:", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseTipoForm(formData);
  if (process.env.NODE_ENV === "development") {
    console.log("validatedFields.error:", validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Verifica se o tipo existe antes de tentar atualizar
  const existing = await prisma.tipos.findUnique({ where: { id } });
  if (!existing) {
    return { message: "Tipo not found. Cannot update." };
  }

  // Atualiza tipo no tipo de dados
  try {
    await saveTipoToDatabase(validatedFields.data, id);
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update Tipo Error:", error);
    }
    // Tratamento de erro de violação de unicidade do Prisma (código P2002)
    if (error.code === "P2002" && error.meta?.target?.includes("nome")) {
      return {
        errors: { nome: ["Nome do tipo já existe."] },
        message: "Nome do tipo já existe.",
      };
    }
    return { message: getDatabaseErrorMessage("update") };
  }

  revalidatePath("/dashboard/tipos");
  redirect("/dashboard/tipos");
}

export async function deleteTipo(id: string) {
  if (!id) {
    throw new Error("Tipo ID for deletion is invalid.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Verifica se o tipo existe antes de deletar
      const tipo = await tx.tipos.findUnique({
        where: { id },
      });

      if (!tipo) {
        throw new Error("Tipo not found.");
      }

      // Apagar o tipo
      await tx.tipos.delete({
        where: { id },
      });
    });
  } catch (error) {
    console.error(
      `Erro no Tipo de Dados: Falha ao Deletar o Tipo com ID ${id}.`,
      error
    );
    throw new Error("Falha ao deletar o tipo.");
  }

  revalidatePath("/dashboard/tipos");
}
