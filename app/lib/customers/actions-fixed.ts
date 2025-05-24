"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import prisma from "lib/prisma";

import fs from "fs/promises"; // Para salvar o arquivo no sistema de arquivos
import path from "path"; // Para lidar com caminhos de arquivo

import { v4 as uuidv4 } from "uuid";

const FormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: "Por favor, insira um nome.",
  }),
  email: z
    .string({
      invalid_type_error: "Por favor, insira um email.",
    })
    .email("Por favor, insira um email válido.")
    .min(5, "O email deve ter pelo menos 5 caracteres.")
    .max(255, "O email deve ter no máximo 255 caracteres."),
  image_url: z.string({
    invalid_type_error: "Por favor, insira uma imagem.",
  }),
});

const ImageFileSchema = z
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
  );

const CreateCustomer = FormSchema.omit({ id: true, image_url: true });
const UpdateCustomer = FormSchema.omit({ id: true, image_url: true });

export type State = {
  errors: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message: string | null;
};

export async function createCustomer(
  state: State | void,
  formData: FormData
): Promise<State | void> {
  console.log("FormData", formData);
  // Validate form fields using Zod
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  console.log("validatedFields", validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Customer.",
    };
  }

  // Prepare data for insertion into the database
  const { name, email } = validatedFields.data;

  const image = formData.get("image") as File;

  // Validate image file
  const imageValidation = ImageFileSchema.safeParse(image);
  if (!imageValidation.success) {
    const allErrors = Object.values(
      imageValidation.error.flatten().fieldErrors
    ).flat();
    return {
      errors: {
        image_url: allErrors,
      },
      message: "Invalid image file.",
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
      message: "Failed to save image file.",
      errors: {},
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
      errors: {},
    };
  }

  // Revalidate the cache for the customers page and redirect the user.
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}
