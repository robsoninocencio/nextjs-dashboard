"use server";

import { revalidatePath } from "next/cache";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

import { prisma } from "@/lib/prisma";

export async function deleteCliente(id: string) {
  await prisma.clientes.delete({
    where: { id: id },
  });
  revalidatePath("/dashboard/clientes");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
