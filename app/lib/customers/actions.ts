"use server";

import { z } from "zod";
import path from "path"; // Para lidar com caminhos de arquivo
import fs from "fs/promises"; // Para salvar o arquivo no sistema de arquivos
import { v4 as uuidv4 } from "uuid";

import prisma from "lib/prisma";
import type { customers } from "@/generated/prisma";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const FormSchema = z.object({
  id: z.string(),
  name: z
    .string({
      invalid_type_error: "Por favor, insira um nome.",
    })
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(255, "O nome deve ter no máximo 255 caracteres."),
  email: z
    .string({
      invalid_type_error: "Por favor, insira um email.",
    })
    .email("Por favor, insira um email válido.")
    .min(5, "O email deve ter pelo menos 5 caracteres.")
    .max(255, "O email deve ter no máximo 255 caracteres."),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Por favor, selecione uma imagem.",
    })
    .refine((file) => file.size < 5 * 1024 * 1024, {
      message: "O tamanho da imagem deve ser menor que 5MB.",
    }) // Exemplo: 5MB
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "A imagem deve ser do tipo JPG, PNG ou WebP.",
      }
    ),
});

const CreateCustomer = FormSchema.omit({ id: true });
const UpdateCustomer = FormSchema.omit({ id: true, image: true });

export type State = {
  errors?: Partial<
    Record<keyof Omit<customers, "id" | "image_url">, string[]> & {
      image?: string[];
    }
  >;
  message?: string | null;
  submittedData?: {
    name?: string;
    email?: string;
  };
};

export type CreateCustomerState = {
  errors?: Partial<
    Record<keyof Omit<customers, "id" | "image_url">, string[]> & {
      image?: string[];
    }
  >;
  message?: string;
  submittedData?: {
    name?: string;
    email?: string;
  };
};

export type UpdateCustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
  };
  message: string; // Garante que message seja sempre uma string
};

export async function createCustomer(
  prevState: CreateCustomerState,
  formData: FormData
) {
  // Validate form fields using Zod
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    image: formData.get("image") as File,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Customer.",
      submittedData: {
        name: (formData.get("name") as string) ?? undefined,
        email: (formData.get("email") as string) ?? undefined,
      },
    };
  }

  // Prepare data for insertion into the database
  const { name, email, image } = validatedFields.data;

  // Check if email already exists
  const existingCustomer = await prisma.customers.findUnique({
    where: { email },
  });
  if (existingCustomer) {
    return {
      errors: { email: ["Este email já está em uso."] },
      message: "Email já cadastrado.",
      submittedData: {
        // Retorna os dados validados para repopular o formulário
        name: name,
        email: email,
      },
    };
  }

  // Salvar imagem em /public/customers/
  const uploadDir = path.join(process.cwd(), "public/customers");
  await fs.mkdir(uploadDir, { recursive: true });

  const extension = path.extname(image.name);
  const fileName = `${uuidv4()}${extension}`;
  const filePath = path.join(uploadDir, fileName);

  try {
    const bytes = await image.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(bytes));
  } catch (error) {
    return {
      submittedData: {
        // Manter dados do formulário se o salvamento da imagem falhar
        name: name,
        email: email,
      },
      message: "Failed to save image file.",
    };
  }

  // URL pública da imagem
  const image_url = `/customers/${fileName}`;

  try {
    // Use transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      await tx.customers.create({
        data: {
          name: name,
          email: email,
          image_url,
        },
      });
    });
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Create Customer.",
    };
  }

  // Revalidate the cache for the customers page and redirect the user.
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function updateCustomer(
  id: string,
  prevState: UpdateCustomerState,
  formData: FormData
) {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Customer.",
    };
  }

  const { name, email } = validatedFields.data;

  try {
    await prisma.customers.update({
      where: { id: id },
      data: {
        name: name,
        email: email,
      },
    });
  } catch (error) {
    return { message: "Database Error: Failed to Update Customer." };
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function deleteCustomer(id: string) {
  console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`); // Log do ID recebido
  console.log(`Attempting to delete customer with ID: ${id}`); // Log do ID recebido

  if (!id) {
    console.error("Error: deleteCustomer called with undefined or empty ID.");
    // Considerar como tratar este caso. Lançar um erro específico ou retornar um objeto de erro.
    throw new Error("Customer ID for deletion is invalid.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Primeiro, exclua todas as faturas associadas a este cliente
      const deletedInvoices = await tx.invoices.deleteMany({
        where: { customer_id: id },
      });
      console.log(
        `Deleted ${deletedInvoices.count} invoices for customer ID: ${id}`
      );

      // Depois, exclua o cliente
      await tx.customers.delete({
        where: { id: id },
      });
      console.log(`Successfully deleted customer ID: ${id}`);
    });
  } catch (error) {
    console.error(
      `Database Error: Failed to Delete Customer ID ${id} and their Invoices.`,
      error
    );
    // Opcionalmente, você pode querer retornar um objeto de erro aqui
    // para informar a UI, similar ao que você faz em createCustomer.
    // Por exemplo: return { message: "Database Error: Failed to Delete Customer." };
    // No entanto, a função deleteCustomer atualmente não tem um tipo de retorno para isso.
    // Se for uma ação chamada via formulário com useActionState, você precisaria ajustar.
    // Se for chamada de outra forma (ex: botão simples), o tratamento de erro pode ser diferente.
    throw new Error("Failed to delete customer and their invoices."); // Lança o erro para ser tratado pelo chamador
  }
  revalidatePath("/dashboard/customers");
}
