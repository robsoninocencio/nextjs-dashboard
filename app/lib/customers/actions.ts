"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/prisma/lib/prisma";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

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
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Por favor, selecione uma imagem.",
    })
    .refine((file) => file.size < 5 * 1024 * 1024, {
      message: "O tamanho da imagem deve ser menor que 5MB.",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "A imagem deve ser do tipo JPG, PNG ou WebP.",
      }
    ),
});

const UpdateCustomerSchema = CustomerFormSchema.omit({ image: true });

// Types
export type CreateCustomerState = {
  errors?: Partial<{ name: string[]; email: string[]; image: string[] }>;
  message?: string | null;
  submittedData?: { name?: string; email?: string };
};

export type UpdateCustomerState = {
  errors?: Partial<{ name: string[]; email: string[] }>;
  message?: string | null;
  submittedData?: { name?: string; email?: string };
};

// Utils
function getFormValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return value ? value.toString() : undefined;
}

function getFormFile(formData: FormData, key: string): File | undefined {
  const file = formData.get(key);
  return file instanceof File ? file : undefined;
}

function handleValidationError<T>(formData: FormData, error: z.ZodError): T {
  const flattened = error.flatten();
  return {
    errors: flattened.fieldErrors,
    message: "Missing Fields. Failed to Process Customer.",
    submittedData: {
      name: getFormValue(formData, "name"),
      email: getFormValue(formData, "email"),
    },
  } as unknown as T;
}

async function saveImageFile(image: File): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public/customers");
  await fs.mkdir(uploadDir, { recursive: true });
  const extension = path.extname(image.name);
  const fileName = `${uuidv4()}${extension}`;
  const filePath = path.join(uploadDir, fileName);
  const bytes = await image.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(bytes));
  return `/customers/${fileName}`;
}

// Actions
export async function createCustomer(
  prevState: CreateCustomerState,
  formData: FormData
): Promise<CreateCustomerState | never> {
  const image = getFormFile(formData, "image");

  // Parse form
  const parseResult = CustomerFormSchema.safeParse({
    name: getFormValue(formData, "name"),
    email: getFormValue(formData, "email"),
    image,
  });

  if (!parseResult.success) {
    return handleValidationError<CreateCustomerState>(
      formData,
      parseResult.error
    );
  }

  const { name, email } = parseResult.data;

  // Check duplicate email
  const existing = await prisma.customers.findUnique({ where: { email } });
  if (existing) {
    return {
      errors: { email: ["Este email já está em uso."] },
      message: "Email já cadastrado.",
      submittedData: { name, email },
    };
  }

  let image_url = "";
  try {
    if (image) image_url = await saveImageFile(image);
  } catch {
    return {
      message: "Failed to save image file.",
      submittedData: { name, email },
    };
  }

  try {
    await prisma.customers.create({
      data: { name, email, image_url },
    });
  } catch {
    return { message: "Database Error: Failed to Create Customer." };
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function updateCustomer(
  id: string,
  prevState: UpdateCustomerState,
  formData: FormData
): Promise<UpdateCustomerState | never> {
  // Parse form without image (optional on update)
  const parseResult = UpdateCustomerSchema.safeParse({
    name: getFormValue(formData, "name"),
    email: getFormValue(formData, "email"),
  });

  if (!parseResult.success) {
    return handleValidationError<UpdateCustomerState>(
      formData,
      parseResult.error
    );
  }

  const { name, email } = parseResult.data;

  try {
    await prisma.customers.update({
      where: { id },
      data: { name, email },
    });
  } catch {
    return { message: "Database Error: Failed to Update Customer." };
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
        select: { image_url: true },
      });

      if (!customer) {
        throw new Error("Customer not found.");
      }

      // Apagar as faturas associadas
      await tx.invoices.deleteMany({
        where: { customer_id: id },
      });

      // Apagar o customer
      await tx.customers.delete({
        where: { id },
      });

      // Depois de deletar do banco, apagar o arquivo da imagem no sistema
      if (customer.image_url) {
        // O image_url tem formato "/customers/filename.ext"
        const imagePath = path.join(
          process.cwd(),
          "public",
          customer.image_url
        );
        try {
          await fs.unlink(imagePath);
          console.log(`Image file deleted: ${imagePath}`);
        } catch (error) {
          // Pode ser que o arquivo já tenha sido deletado ou não exista
          console.warn(`Failed to delete image file: ${imagePath}`, error);
        }
      }
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
