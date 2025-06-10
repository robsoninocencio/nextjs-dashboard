import prisma from "@/prisma/lib/prisma";

const ITEMS_PER_PAGE = 7;

export async function fetchInvestimentosPages(query: string) {
  try {
    const count = await prisma.investimentos.count({
      where: {
        OR: [
          { clientes: { name: { contains: query, mode: "insensitive" } } },
          { clientes: { email: { contains: query, mode: "insensitive" } } },
          {
            rendimentoDoMes: isNaN(Number(query))
              ? undefined
              : { equals: Number(query) },
          },
        ],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Erro ao buscar o número total de páginas:", error);
    throw new Error("Erro ao buscar o número total de páginas.");
  }
}

export async function fetchFilteredInvestimentos(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const investimentos = await prisma.investimentos.findMany({
      where: {
        OR: [
          { clientes: { name: { contains: query, mode: "insensitive" } } },
          { bancos: { nome: { contains: query, mode: "insensitive" } } },
          { ativos: { nome: { contains: query, mode: "insensitive" } } },
          {
            ativos: {
              tipos: { nome: { contains: query, mode: "insensitive" } },
            },
          },
          {
            rendimentoDoMes: isNaN(Number(query))
              ? undefined
              : { equals: Number(query) },
          },
          {
            valorAplicado: isNaN(Number(query))
              ? undefined
              : { equals: Number(query) },
          },
          {
            saldoBruto: isNaN(Number(query))
              ? undefined
              : { equals: Number(query) },
          },
          {
            valorResgatado: isNaN(Number(query))
              ? undefined
              : { equals: Number(query) },
          },
          {
            impostoIncorrido: isNaN(Number(query))
              ? undefined
              : { equals: Number(query) },
          },
          {
            impostoPrevisto: isNaN(Number(query))
              ? undefined
              : { equals: Number(query) },
          },
          {
            saldoLiquido: isNaN(Number(query))
              ? undefined
              : { equals: Number(query) },
          },
        ],
      },
      include: {
        clientes: {
          select: {
            name: true,
          },
        },
        bancos: {
          select: {
            nome: true,
          },
        },
        ativos: {
          select: {
            nome: true,
            tipos: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      orderBy: { data: "desc" },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });

    return investimentos;
  } catch (error) {
    console.error("Erro ao buscar investimentos filtradas:", error);
    throw new Error("Erro ao buscar investimentos filtradas.");
  }
}

export async function fetchInvestimentoById(id: string) {
  if (!id) {
    throw new Error("O ID da investimento é obrigatório.");
  }

  try {
    const investimento = await prisma.investimentos.findUnique({
      where: { id },
      select: {
        id: true,
        clienteId: true,
        rendimentoDoMes: true,
        data: true,
      },
    });

    if (!investimento) {
      throw new Error("Investimento não encontrada.");
    }

    return {
      ...investimento,
      rendimentoDoMes: investimento.rendimentoDoMes / 100, // Converte de centavos para dólares
    };
  } catch (error) {
    console.error(`Erro ao buscar investimento com ID ${id}:`, error);
    throw new Error("Erro ao buscar a investimento.");
  }
}
