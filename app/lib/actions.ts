"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "../generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";
import { redirect } from "next/navigation";

// Inicializa o cliente Prisma com a extensão Accelerate
const prisma = new PrismaClient().$extends(withAccelerate());

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
    // date: formData.get("date") ?? new Date().toISOString(), // Use o valor do formulário ou o padrão
  });

  const amountInCents = amount * 100;
  const date = new Date(); // Gera um objeto Date válido para o Prisma

  // Insere a fatura no banco de dados usando Prisma
  await prisma.invoices.create({
    data: {
      customer_id: customerId,
      amount: amountInCents,
      status,
      date,
    },
  });

  // Revalida o caminho para atualizar os dados no frontend
  revalidatePath("/dashboard/invoices");

  // Redireciona o usuário para a página de faturas
  redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  await prisma.invoices.update({
    where: { id: id },
    data: {
      customer_id: customerId,
      amount: amountInCents,
      status: status,
    },
  });

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await prisma.invoices.delete({
    // Use Prisma's delete method
    where: { id: id },
  });
  revalidatePath("/dashboard/invoices");
}
