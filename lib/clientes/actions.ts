'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';

// Schemas
const ClienteFormSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Por favor, insira um nome.' })
    .min(3, 'O nome deve ter pelo menos 3 caracteres.')
    .max(255, 'O nome deve ter no máximo 255 caracteres.'),
  email: z
    .string({ invalid_type_error: 'Por favor, insira um email.' })
    .email('Por favor, insira um email válido.')
    .min(5, 'O email deve ter pelo menos 5 caracteres.')
    .max(255, 'O email deve ter no máximo 255 caracteres.'),
});

// tipar explicitamente validatedFields.data
type ClienteData = z.infer<typeof ClienteFormSchema>;

// Types
export type CreateClienteFormState = {
  errors?: Partial<{ name: string[]; email: string[] }>;
  message?: string | null;
  submittedData?: { name?: string; email?: string };
};

export type UpdateClienteFormState = {
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
function parseClienteForm(formData: FormData) {
  return ClienteFormSchema.safeParse({
    name: getFormValue(formData, 'name'),
    email: getFormValue(formData, 'email'),
  });
}

// Utils - Função para tratar erro de validação
function handleValidationError(
  formData: FormData,
  validatedFields: { success: false; error: z.ZodError }
): CreateClienteFormState | UpdateClienteFormState {
  return {
    errors: validatedFields.error?.flatten().fieldErrors,
    message: 'Missing Fields. Failed to Create or Update Invoice.',
    submittedData: {
      name: getFormValue(formData, 'name'),
      email: getFormValue(formData, 'email'),
    },
  };
}

// Utils - Função que retorna mensagem de erro padrão do Banco de Dados
function getDatabaseErrorMessage(action: 'create' | 'update') {
  return `Database Error: Failed to ${action} cliente.`;
}

async function saveClienteToDatabase(data: ClienteData, id?: string): Promise<void> {
  if (id) {
    // Atualiza a cliente
    await prisma.clientes.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
      },
    });
  } else {
    // Cria um novo cliente
    await prisma.clientes.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }
}

// Actions  - Ação de criação de cliente
export async function createCliente(
  prevState: CreateClienteFormState,
  formData: FormData
): Promise<CreateClienteFormState | never> {
  if (process.env.NODE_ENV === 'development') {
    console.log('Received FormData:', [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseClienteForm(formData);
  if (process.env.NODE_ENV === 'development') {
    console.log('validatedFields.error:', validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Cria cliente no banco de dados
  try {
    await saveClienteToDatabase(validatedFields.data);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Create Cliente Error:', error);
    }
    return { message: getDatabaseErrorMessage('create') };
  }

  revalidatePath('/dashboard/clientes');
  redirect('/dashboard/clientes');
}

export async function updateCliente(
  id: string,
  prevState: UpdateClienteFormState,
  formData: FormData
): Promise<UpdateClienteFormState | never> {
  if (process.env.NODE_ENV === 'development') {
    console.log('Received FormData:', [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseClienteForm(formData);
  if (process.env.NODE_ENV === 'development') {
    console.log('validatedFields.error:', validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    if (process.env.NODE_ENV === 'development') {
      console.log('validatedFields.error:', validatedFields.error);
    }
    return handleValidationError(formData, validatedFields);
  }

  // Verifica se o cliente existe antes de tentar atualizar
  const existing = await prisma.clientes.findUnique({ where: { id } });
  if (!existing) {
    return { message: 'Cliente not found. Cannot update.' };
  }

  // Atualiza cliente no banco de dados
  try {
    await saveClienteToDatabase(validatedFields.data, id);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Update Cliente Error:', error);
    }
    return { message: getDatabaseErrorMessage('update') };
  }

  revalidatePath('/dashboard/clientes');
  redirect('/dashboard/clientes');
}

export async function deleteCliente(id: string) {
  if (!id) {
    throw new Error('Cliente ID for deletion is invalid.');
  }

  try {
    await prisma.$transaction(async tx => {
      // Primeiro, pegar o cliente para obter a URL da imagem
      const cliente = await tx.clientes.findUnique({
        where: { id },
      });

      if (!cliente) {
        throw new Error('Cliente not found.');
      }

      // Apagar as faturas associadas ao cliente
      await tx.invoices.deleteMany({
        where: { cliente_id: id },
      });

      // Apagar o cliente
      await tx.clientes.delete({
        where: { id },
      });
    });
  } catch (error) {
    console.error(`Database Error: Failed to Delete Cliente ID ${id} and their Invoices.`, error);
    throw new Error('Failed to delete cliente and their invoices.');
  }

  revalidatePath('/dashboard/clientes');
}
