'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { fetchCategorias } from '@/lib/categorias/data';

// Schema
const CategoriaFormSchema = z.object({
  parentId: z
    .string()
    .optional()
    .transform(val => (val === '' ? null : val)),
  nome: z.string().min(1, { message: 'O nome da categoria não pode estar vazio.' }),
});

// tipar explicitamente validatedFields.data
type CategoriaData = z.infer<typeof CategoriaFormSchema>;

// Types
export type CategoriaFormState = {
  errors?: {
    parentId?: string[];
    nome?: string[];
  };
  message?: string | null;
  submittedData?: {
    parentId?: string;
    nome?: string;
  };
};

// Utils - Função para evitar repetição e tornar o parsing mais robusto.
function getFormValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return value?.toString();
}

// Utils - Função para validar os campos do formulário usando Zod
function parseCategoriaForm(formData: FormData) {
  return CategoriaFormSchema.safeParse({
    parentId: getFormValue(formData, 'parentId'),
    nome: getFormValue(formData, 'nome'),
  });
}

// Utils - Função para tratar erro de validação
function handleValidationError(
  formData: FormData,
  validatedFields: { success: false; error: z.ZodError }
): CategoriaFormState {
  return {
    errors: validatedFields.error?.flatten().fieldErrors,
    message:
      'Preencha todos os campos obrigatórios. Houve erros na Criação ou Atualização do Categoria.',
    submittedData: {
      parentId: getFormValue(formData, 'parentId'),
      nome: getFormValue(formData, 'nome'),
    },
  };
}

// Utils - Função que retorna mensagem de erro padrão do Banco de Dados
function getDatabaseErrorMessage(action: 'create' | 'update') {
  return `Database Error: Failed to ${action} categoria.`;
}

// Função para salvar categoria no banco
async function saveCategoriaToDatabase(data: CategoriaData, id?: string): Promise<void> {
  console.log('Entrei em saveCategoriaToDatabase()');

  if (id) {
    // Atualiza a categoria
    await prisma.categorias.update({
      where: { id },
      data: {
        nome: data.nome,
        parentId: data.parentId,
      },
    });
  } else {
    // Cria um novo categoria
    await prisma.categorias.create({
      data: {
        nome: data.nome,
        parentId: data.parentId,
      },
    });
  }
}

// Actions - Ação de criação de categoria
export async function createCategoria(
  prevState: CategoriaFormState,
  formData: FormData
): Promise<CategoriaFormState | never> {
  if (process.env.NODE_ENV === 'development') {
    console.log('Received FormData:', [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseCategoriaForm(formData);
  if (process.env.NODE_ENV === 'development') {
    console.log('validatedFields.error:', validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Cria categoria no banco de dados
  try {
    await saveCategoriaToDatabase(validatedFields.data);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Create Categoria Error:', error);
    }
    return { message: getDatabaseErrorMessage('create') };
  }

  // Atualiza e redireciona para a página de categorias
  revalidatePath('/dashboard/categorias');
  redirect('/dashboard/categorias');
}

// Ação para atualizar categoria
export async function updateCategoria(
  id: string,
  prevState: CategoriaFormState,
  formData: FormData
): Promise<CategoriaFormState | never> {
  if (process.env.NODE_ENV === 'development') {
    console.log('Received FormData:', [...formData.entries()]);
  }

  // Valida os campos do formulário usando Zod
  const validatedFields = parseCategoriaForm(formData);
  if (process.env.NODE_ENV === 'development') {
    console.log('validatedFields.error:', validatedFields.error);
  }

  // Trata erros de validação - Se tiver erros retorna Senão continua.
  if (!validatedFields.success) {
    return handleValidationError(formData, validatedFields);
  }

  // Verifica se a categoria existe antes de tentar atualizar
  const existing = await prisma.categorias.findUnique({ where: { id } });
  if (!existing) {
    return { message: 'Categoria not found. Cannot update.' };
  }

  // Atualiza categoria no banco de dados
  try {
    await saveCategoriaToDatabase(validatedFields.data, id);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Update Categoria Error:', error);
    }
    return { message: getDatabaseErrorMessage('update') };
  }

  // Atualiza e redireciona para a página de categorias
  revalidatePath('/dashboard/categorias');
  redirect('/dashboard/categorias');
}

export async function deleteCategoria(id: string) {
  if (!id) {
    throw new Error('Categoria ID for deletion is invalid.');
  }

  try {
    const categoria = await prisma.categorias.findUnique({
      where: { id },
    });
    if (!categoria) {
      throw new Error('Categoria not found.');
    }

    await prisma.categorias.delete({
      where: { id: id },
    });
    revalidatePath('/dashboard/categorias');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Delete Categoria Error:', error);
    }
    throw new Error('Falha ao deletar o categoria.');
  }
}
