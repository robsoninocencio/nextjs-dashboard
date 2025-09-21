import { prisma } from '@/lib/prisma';

const ITEMS_PER_PAGE = 6;

export async function fetchTiposPages(query: string) {
  try {
    const count = await prisma.tipos.count({
      where: {
        OR: [{ nome: { contains: query, mode: 'insensitive' } }],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Erro ao buscar o número total de páginas:', error);
    throw new Error('Erro ao buscar o número total de páginas.');
  }
}

export async function fetchFilteredTipos(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const tipos = await prisma.tipos.findMany({
      where: {
        OR: [{ nome: { contains: query, mode: 'insensitive' } }],
      },

      orderBy: { nome: 'asc' },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });

    return tipos;
  } catch (error) {
    console.error('Erro ao buscar tipos filtrados:', error);
    throw new Error('Erro ao buscar tipos filtrados.');
  }
}

export async function fetchTipos() {
  try {
    const tipos = await prisma.tipos.findMany({
      select: {
        id: true,
        nome: true,
      },
      orderBy: { nome: 'asc' },
    });

    return tipos;
  } catch (error) {
    console.error('Erro ao buscar tipos:', error);
    throw new Error('Não foi possível buscar os tipos.');
  }
}

export async function fetchTipoById(id: string) {
  if (!id) {
    throw new Error('O ID do tipo é obrigatório.');
  }

  try {
    const tipo = await prisma.tipos.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
      },
    });

    if (!tipo) {
      throw new Error('Tipo não encontrado.');
    }

    return tipo;
  } catch (error) {
    console.error(`Erro ao buscar tipo com ID ${id}:`, error);
    throw new Error('Erro ao buscar a tipo.');
  }
}
