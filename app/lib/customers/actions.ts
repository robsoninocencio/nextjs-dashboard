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
    .min(5, "O nome deve ter pelo menos 3 caracteres.")
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
const UpdateCustomer = FormSchema.omit({ id: true });

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

export async function createCustomer(prevState: State, formData: FormData) {
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

// export async function updateInvoice(
//   id: string,
//   prevState: State,
//   formData: FormData
// ) {
//   const validatedFields = UpdateCustomer.safeParse({
//     name: formData.get("name"),
//     amount: formData.get("amount"),
//     status: formData.get("status"),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: "Missing Fields. Failed to Update Invoice.",
//     };
//   }

//   const { name, amount, status } = validatedFields.data;
//   const amountInCents = amount * 100;

//   try {
//     await prisma.invoices.update({
//       where: { id: id },
//       data: {
//         customer_id: name,
//         amount: amountInCents,
//         status: status,
//       },
//     });
//   } catch (error) {
//     return { message: "Database Error: Failed to Update Invoice." };
//   }

//   revalidatePath("/dashboard/invoices");
//   redirect("/dashboard/invoices");
// }

// export async function deleteInvoice(id: string) {
//   await prisma.invoices.delete({
//     where: { id: id },
//   });
//   revalidatePath("/dashboard/invoices");
// }

export async function deleteCustomer(id: string) {
  await prisma.customers.delete({
    where: { id: id },
  });
  revalidatePath("/dashboard/customers");
}
