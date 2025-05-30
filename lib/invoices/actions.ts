"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import prisma from "@/prisma/lib/prisma";

// Schema
const InvoiceFormSchema = z.object({
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pendente", "pago"], {
    invalid_type_error: "Please select an invoice status.",
  }),
});

// tipar explicitamente validatedFields.data
type InvoiceData = z.infer<typeof InvoiceFormSchema>;

// Types
export type InvoiceFormState = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
  submittedData?: {
    customerId?: string;
    amount?: string;
    status?: string;
  };
};

// Utils - Função para evitar repetição e tornar o parsing mais robusto.
function getFormValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return value?.toString();
}

// Utils - Função para validar os campos do formulário usando Zod
function parseInvoiceForm(formData: FormData) {
  return InvoiceFormSchema.safeParse({
    customerId: getFormValue(formData, "customerId"),
    amount: getFormValue(formData, "amount"),
    status: getFormValue(formData, "status"),
  });
}

// Utils - Função para tratar erro de validação
function handleValidationError(
  formData: FormData,
  validatedFields: { success: false; error: z.ZodError }
): InvoiceFormState {
  return {
    errors: validatedFields.error?.flatten().fieldErrors,
    message: "Missing Fields. Failed to Create or Update Invoice.",
    submittedData: {
      customerId: getFormValue(formData, "customerId"),
      amount: getFormValue(formData, "amount"),
      status: getFormValue(formData, "status"),
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
  return `Database Error: Failed to ${action} invoice.`;
}

// Utils - Função para salvar a fatura no banco
async function saveInvoiceToDatabase(
  data: InvoiceData,
  id?: string
): Promise<void> {
  const amountInCents = data.amount * 100; // Armazenar em centavos para precisão
  const date = getCurrentDate();

  if (id) {
    // Atualiza a fatura
    await prisma.invoices.update({
      where: { id },
      data: {
        customer_id: data.customerId,
        amount: amountInCents,
        status: data.status,
      },
    });
  } else {
    // Cria uma nova fatura
    await prisma.invoices.create({
      data: {
        customer_id: data.customerId,
        amount: amountInCents,
        status: data.status,
        date,
      },
    });
  }
}

// Actions - Ação de criação de fatura
export async function createInvoice(
  prevState: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Received FormData:", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseInvoiceForm(formData);
  if (process.env.NODE_ENV === "development") {
    console.log("validatedFields.error:", validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Cria fatura no banco de dados
  try {
    await saveInvoiceToDatabase(validatedFields.data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Create Invoice Error:", error);
    }
    return { message: getDatabaseErrorMessage("create") };
  }

  // Atualiza e redireciona para a página de faturas
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState | never> {
  if (process.env.NODE_ENV === "development") {
    console.log("Received FormData:", [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseInvoiceForm(formData);
  if (process.env.NODE_ENV === "development") {
    console.log("validatedFields.error:", validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Verifica se a fatura existe antes de tentar atualizar
  const existing = await prisma.invoices.findUnique({ where: { id } });
  if (!existing) {
    return { message: "Invoice not found. Cannot update." };
  }

  // Atualiza fatura no banco de dados
  try {
    await saveInvoiceToDatabase(validatedFields.data, id);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update Invoice Error:", error);
    }
    return { message: getDatabaseErrorMessage("update") };
  }

  // Atualiza e redireciona para a página de faturas
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  if (!id) {
    throw new Error("Invoice ID for deletion is invalid.");
  }

  try {
    const invoice = await prisma.invoices.findUnique({ where: { id } });
    if (!invoice) {
      throw new Error("Invoice not found.");
    }

    await prisma.invoices.delete({
      where: { id: id },
    });
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Delete Invoice Error:", error);
    }
    throw new Error("Failed to delete invoice.");
  }
}
