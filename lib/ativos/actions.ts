"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

// Schema
const AtivoFormSchema = z.object({
  tipoId: z
    .string({ invalid_type_error: "Please select a tipo." })
    .optional()
    .transform((val) => (val === "" ? null : val)) // Transforma "" em null
    .refine((val) => val !== null, { message: "Please select a tipo." }), // Adiciona uma validação
  nome: z
    .string({ invalid_type_error: "Por favor, insira um nome." })
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(255, "O nome deve ter no máximo 255 caracteres."),

  categoriaIds: z.array(z.string()).optional(),
});

// Tipar explicitamente validatedFields.data
type AtivoData = z.infer<typeof AtivoFormSchema>;

// Types
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

// Utils - Função para evitar repetição e tornar o parsing mais robusto.
function getFormValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return value?.toString();
}

// Utils - Função para evitar repetição e tornar o parsing de array mais robusto.
function getFormArray(formData: FormData, key: string): string[] {
  return formData.getAll(key).map((v) => v.toString());
}

// Utils - Função para validar os campos do formulário usando Zod
function parseAtivoForm(formData: FormData) {
  return AtivoFormSchema.safeParse({
    tipoId: getFormValue(formData, "tipoId"),
    nome: getFormValue(formData, "nome"),
    categoriaIds: getFormArray(formData, "categoriaIds"),
  });
}

// Utils - Função para tratar erro de validação
function handleValidationError(
  formData: FormData,
  validatedFields: { success: false; error: z.ZodError }
): AtivoFormState {
  const fieldErrors = validatedFields.error.flatten().fieldErrors;

  return {
    errors: fieldErrors,
    message: "Preencha todos os campos obrigatórios.",
    submittedData: {
      tipoId: getFormValue(formData, "tipoId"),
      nome: getFormValue(formData, "nome"),
      categoriaIds: getFormArray(formData, "categoriaIds"),
    },
  };
}

// Utils - Função que retorna mensagem de erro padrão do Banco de Dados
function getDatabaseErrorMessage(action: "create" | "update") {
  return `Database Error: Failed to ${action} ativo.`;
}

// Utils - Função para salvar a ativo no banco
async function saveAtivoToDatabase(
  data: AtivoData,
  id?: string
): Promise<void> {
  const { nome, tipoId, categoriaIds } = data;
  console.log("Entrei em saveAtivoToDatabase()");

  if (id) {
    // Atualiza o ativo e recria as relações de categorias
    await prisma.$transaction([
      prisma.ativo_categoria.deleteMany({ where: { ativoId: id } }),
      prisma.ativos.update({
        where: { id },
        data: {
          nome,
          tipoId,
          ativo_categorias: {
            create: categoriaIds?.map((categoriaId) => ({
              categoria: { connect: { id: categoriaId } },
            })),
          },
        },
      }),
    ]);
  } else {
    // Criação com categorias relacionadas
    await prisma.ativos.create({
      data: {
        nome,
        tipoId,
        ativo_categorias: {
          create: categoriaIds?.map((categoriaId) => ({
            categoria: { connect: { id: categoriaId } },
          })),
        },
      },
    });
  }
}

// Actions - Ação de criação de ativo
export async function createAtivo(
  prevState: AtivoFormState,
  formData: FormData
): Promise<AtivoFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Dados do formulário recebidos: ", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseAtivoForm(formData);

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    if (process.env.NODE_ENV === "development") {
      console.log("validatedFields.error:", validatedFields.error);
    }
    return handleValidationError(formData, validatedFields);
  }

  // Cria ativo no banco de dados
  try {
    await saveAtivoToDatabase(validatedFields.data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Create Ativo Error:", error);
    }
    return { message: getDatabaseErrorMessage("create") };
  }

  // Atualiza e redireciona para a página
  revalidatePath("/dashboard/ativos");
  redirect("/dashboard/ativos");
}

export async function updateAtivo(
  id: string,
  prevState: AtivoFormState,
  formData: FormData
): Promise<AtivoFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Dados do formulário recebidos: ", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseAtivoForm(formData);

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    if (process.env.NODE_ENV === "development") {
      console.log("validatedFields.error:", validatedFields.error);
    }
    return handleValidationError(formData, validatedFields);
  }

  // Verifica se a ativo existe antes de tentar atualizar
  const existing = await prisma.ativos.findUnique({ where: { id } });
  if (!existing) {
    return { message: "Ativo not found. Cannot update." };
  }

  // Atualiza ativo no banco de dados
  try {
    await saveAtivoToDatabase(validatedFields.data, id);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update Ativo Error:", error);
    }
    return { message: getDatabaseErrorMessage("update") };
  }

  // Atualiza e redireciona para a página
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

    await prisma.ativos.delete({ where: { id } });
    revalidatePath("/dashboard/ativos");
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Delete Ativo Error:", error);
    }
    throw new Error("Failed to delete ativo.");
  }
}
