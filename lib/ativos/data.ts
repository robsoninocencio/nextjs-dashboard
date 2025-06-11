import prisma from "@/prisma/lib/prisma";

const ITEMS_PER_PAGE = 6;

export async function fetchAtivosPages(query: string) {
  try {
    const count = await prisma.ativos.count({
      where: {
        OR: [{ tipos: { nome: { contains: query, mode: "insensitive" } } }],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Erro ao buscar o número total de páginas:", error);
    throw new Error("Erro ao buscar o número total de páginas.");
  }
}

export async function fetchFilteredAtivos(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const ativos = await prisma.ativos.findMany({
      where: {
        OR: [
          { tipos: { nome: { contains: query, mode: "insensitive" } } },
          { nome: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        tipos: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: { nome: "asc" },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });

    return ativos;
  } catch (error) {
    console.error("Erro ao buscar ativos filtradas:", error);
    throw new Error("Erro ao buscar ativos filtradas.");
  }
}

export async function fetchAtivos() {
  try {
    const ativos = await prisma.ativos.findMany({
      select: {
        id: true,
        nome: true,
      },
      orderBy: { nome: "asc" },
    });

    return ativos;
  } catch (error) {
    console.error("Erro ao buscar ativos:", error);
    throw new Error("Não foi possível buscar os ativos.");
  }
}

export async function fetchAtivoById(id: string) {
  if (!id) {
    throw new Error("O ID da ativo é obrigatório.");
  }

  try {
    const ativo = await prisma.ativos.findUnique({
      where: { id },
      select: {
        id: true,
        tipoId: true,
        nome: true,
      },
    });

    if (!ativo) {
      throw new Error("Ativo não encontrada.");
    }

    return ativo;
  } catch (error) {
    console.error(`Erro ao buscar ativo com ID ${id}:`, error);
    throw new Error("Erro ao buscar a ativo.");
  }
}
