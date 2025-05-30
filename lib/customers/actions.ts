"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import prisma from "@/prisma/lib/prisma";

// Schemas
const CustomerFormSchema = z.object({
  name: z
    .string({ invalid_type_error: "Por favor, insira um nome." })
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(255, "O nome deve ter no máximo 255 caracteres."),
  email: z
    .string({ invalid_type_error: "Por favor, insira um email." })
    .email("Por favor, insira um email válido.")
    .min(5, "O email deve ter pelo menos 5 caracteres.")
    .max(255, "O email deve ter no máximo 255 caracteres."),
});

// tipar explicitamente validatedFields.data
type CustomerData = z.infer<typeof CustomerFormSchema>;

// Types
export type CreateCustomerFormState = {
  errors?: Partial<{ name: string[]; email: string[] }>;
  message?: string | null;
  submittedData?: { name?: string; email?: string };
};

export type UpdateCustomerFormState = {
  errors?: Partial<{ name: string[]; email: string[] }>;
  message?: string | null;
  submittedData?: { name?: string; email?: string };
};

// Utils - Função para evitar repetição e tornar o parsing mais robusto.
function getFormValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return value ? value.toString() : undefined;
}

// Utils - Função para validar os campos do formulário usando Zod
function parseCustomerForm(formData: FormData) {
  return CustomerFormSchema.safeParse({
    name: getFormValue(formData, "name"),
    email: getFormValue(formData, "email"),
  });
}

// Utils - Função para tratar erro de validação
function handleValidationError(
  formData: FormData,
  validatedFields: { success: false; error: z.ZodError }
): CreateCustomerFormState | UpdateCustomerFormState {
  return {
    errors: validatedFields.error?.flatten().fieldErrors,
    message: "Missing Fields. Failed to Create or Update Invoice.",
    submittedData: {
      name: getFormValue(formData, "name"),
      email: getFormValue(formData, "email"),
    },
  };
}

// Utils - Função que retorna mensagem de erro padrão do Banco de Dados
function getDatabaseErrorMessage(action: "create" | "update") {
  return `Database Error: Failed to ${action} customer.`;
}

async function saveCustomerToDatabase(
  data: CustomerData,
  id?: string
): Promise<void> {
  if (id) {
    // Atualiza a cliente
    await prisma.customers.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
      },
    });
  } else {
    // Cria um novo cliente
    await prisma.customers.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }
}

// Actions  - Ação de criação de cliente
export async function createCustomer(
  prevState: CreateCustomerFormState,
  formData: FormData
): Promise<CreateCustomerFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Received FormData:", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseCustomerForm(formData);
  if (process.env.NODE_ENV === "development") {
    console.log("validatedFields.error:", validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Cria cliente no banco de dados
  try {
    await saveCustomerToDatabase(validatedFields.data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Create Customer Error:", error);
    }
    return { message: getDatabaseErrorMessage("create") };
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function updateCustomer(
  id: string,
  prevState: UpdateCustomerFormState,
  formData: FormData
): Promise<UpdateCustomerFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Received FormData:", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseCustomerForm(formData);
  if (process.env.NODE_ENV === "development") {
    console.log("validatedFields.error:", validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Verifica se o cliente existe antes de tentar atualizar
  const existing = await prisma.customers.findUnique({ where: { id } });
  if (!existing) {
    return { message: "Customer not found. Cannot update." };
  }

  // Atualiza cliente no banco de dados
  try {
    await saveCustomerToDatabase(validatedFields.data, id);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update Customer Error:", error);
    }
    return { message: getDatabaseErrorMessage("update") };
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function deleteCustomer(id: string) {
  if (!id) {
    throw new Error("Customer ID for deletion is invalid.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Primeiro, pegar o customer para obter a URL da imagem
      const customer = await tx.customers.findUnique({
        where: { id },
      });

      if (!customer) {
        throw new Error("Customer not found.");
      }

      // Apagar as faturas associadas ao customer
      await tx.invoices.deleteMany({
        where: { customer_id: id },
      });

      // Apagar o customer
      await tx.customers.delete({
        where: { id },
      });
    });
  } catch (error) {
    console.error(
      `Database Error: Failed to Delete Customer ID ${id} and their Invoices.`,
      error
    );
    throw new Error("Failed to delete customer and their invoices.");
  }

  revalidatePath("/dashboard/customers");
}
