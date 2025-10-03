import { prisma } from '@/lib/prisma';

import type { Ativo, AtivoField, AtivosTable } from '../types/ativo';

const ITEMS_PER_PAGE = 30;

/**
 * Busca todas as categorias filhas (recursivamente) de uma categoria pai.
 */
async function getCategoriaIds(categoriaId: string): Promise<string[]> {
  if (!categoriaId) return [];
  const categoria = await prisma.categorias.findUnique({
    where: { id: categoriaId },
    include: { subCategories: true },
  });

  if (!categoria) return [];

  const subIds = await Promise.all(categoria.subCategories.map(sub => getCategoriaIds(sub.id)));

  return [categoria.id, ...subIds.flat()];
}

function buildAtivosWhereClause(query: string, categoriaIds?: string[]): Record<string, any> {
  const andConditions: any[] = [];

  if (query) {
    andConditions.push({
      OR: [
        { nome: { contains: query, mode: 'insensitive' } },
        { tipos: { nome: { contains: query, mode: 'insensitive' } } },
      ],
    });
  }

  if (categoriaIds && categoriaIds.length > 0) {
    andConditions.push({
      ativo_categorias: {
        some: { categoriaId: { in: categoriaIds } },
      },
    });
  }

  return andConditions.length > 0 ? { AND: andConditions } : {};
}

export async function fetchAtivosPages(
  query: string,
  categoriaId?: string
): Promise<{ totalPages: number; totalItems: number }> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Entrei em fetchAtivosPages()');
      console.log('query', query);
      console.log('categoriaId', categoriaId);
    }

    let categoriaIds: string[] = [];
    if (categoriaId) {
      categoriaIds = await getCategoriaIds(categoriaId);
    }

    const where = buildAtivosWhereClause(query, categoriaIds);

    const totalItems = await prisma.ativos.count({ where });

    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

    if (process.env.NODE_ENV === 'development') {
      console.log('where:', JSON.stringify(where, null, 2));
      console.log('totalItems:', totalItems);
      console.log('totalPages:', totalPages);
    }

    return { totalPages, totalItems };
  } catch (error) {
    console.error('Erro ao buscar o número total de páginas:', error);

    throw new Error(
      error instanceof Error ? error.message : 'Erro ao buscar o número total de páginas.'
    );
  }
}

export async function fetchFilteredAtivos(
  currentPage: number,
  query: string,
  categoriaId: string
): Promise<AtivosTable[]> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Entrei em fetchFilteredAtivos()');
      console.log('currentPage', currentPage);
      console.log('query', query);
      console.log('categoriaId', categoriaId);
    }

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    let categoriaIds: string[] = [];
    if (categoriaId) {
      categoriaIds = await getCategoriaIds(categoriaId);
    }

    const where = buildAtivosWhereClause(query, categoriaIds);

    const ativos = await prisma.ativos.findMany({
      where,
      include: {
        tipos: {
          select: {
            nome: true,
          },
        },
        ativo_categorias: {
          select: {
            categoria: {
              select: { id: true, nome: true },
            },
          },
        },
      },
      orderBy: { nome: 'asc' },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });

    return ativos;
  } catch (error) {
    console.error('Erro ao buscar ativos filtradas:', error);
    throw new Error('Erro ao buscar ativos filtradas.');
  }
}

export async function fetchAtivos(): Promise<AtivoField[]> {
  try {
    const ativos = await prisma.ativos.findMany({
      select: {
        id: true,
        nome: true,
        tipos: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: { nome: 'asc' },
    });

    // console.log("ativos:", ativos);

    return ativos;
  } catch (error) {
    console.error('Erro ao buscar ativos:', error);
    throw new Error('Não foi possível buscar os ativos.');
  }
}

export async function fetchAtivoById(id: string) {
  if (!id) {
    throw new Error('O ID da ativo é obrigatório.');
  }

  try {
    const ativo = await prisma.ativos.findUnique({
      where: { id },
      select: {
        id: true,
        tipoId: true,
        nome: true,
        ativo_categorias: {
          select: {
            categoriaId: true,
          },
        },
      },
    });

    if (!ativo) {
      throw new Error('Ativo não encontrada.');
    }

    return ativo;
  } catch (error) {
    console.error(`Erro ao buscar ativo com ID ${id}:`, error);
    throw new Error('Erro ao buscar a ativo.');
  }
}
