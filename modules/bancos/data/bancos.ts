import { prisma } from '@/lib/prisma';

const ITEMS_PER_PAGE = 6;

export async function fetchBancosPages(query: string) {
  try {
    const count = await prisma.bancos.count({
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

export async function fetchFilteredBancos(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const bancos = await prisma.bancos.findMany({
      where: {
        OR: [{ nome: { contains: query, mode: 'insensitive' } }],
      },

      orderBy: { nome: 'asc' },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });

    return bancos;
  } catch (error) {
    console.error('Erro ao buscar bancos filtrados:', error);
    throw new Error('Erro ao buscar bancos filtrados.');
  }
}

export async function fetchBancos() {
  try {
    const bancos = await prisma.bancos.findMany({
      select: {
        id: true,
        nome: true,
      },
      orderBy: { nome: 'asc' },
    });

    return bancos;
  } catch (error) {
    console.error('Erro ao buscar bancos:', error);
    throw new Error('Não foi possível buscar os bancos.');
  }
}

export async function fetchBancoById(id: string) {
  if (!id) {
    throw new Error('O ID do banco é obrigatório.');
  }

  try {
    const banco = await prisma.bancos.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
      },
    });

    if (!banco) {
      throw new Error('Banco não encontrado.');
    }

    return banco;
  } catch (error) {
    console.error(`Erro ao buscar banco com ID ${id}:`, error);
    throw new Error('Erro ao buscar a banco.');
  }
}
