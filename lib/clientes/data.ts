import prisma from "@/prisma/lib/prisma";

const ITEMS_PER_PAGE = 15;

export async function fetchClientesPages(query: string) {
  try {
    const count = await prisma.clientes.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    console.log("count:", count);
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Erro ao buscar o número total de páginas:", error);
    throw new Error("Erro ao buscar o número total de páginas.");
  }
}

export async function fetchFilteredClientes(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const clientes = await prisma.clientes.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        invoices: {
          select: {
            status: true,
            amount: true,
          },
        },
      },
      orderBy: { name: "asc" },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });

    return clientes;
  } catch (error) {
    console.error("Erro ao buscar clientes filtrados:", error);
    throw new Error("Erro ao buscar clientes filtrados.");
  }
}

export async function fetchClientes() {
  try {
    const clientes = await prisma.clientes.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: "asc" },
    });

    return clientes;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    throw new Error("Não foi possível buscar os clientes.");
  }
}

export async function fetchClienteById(id: string) {
  if (!id) {
    throw new Error("O ID do cliente é obrigatório.");
  }

  try {
    const cliente = await prisma.clientes.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!cliente) {
      throw new Error("Cliente não encontrado.");
    }

    return cliente;
  } catch (error) {
    console.error(`Erro ao buscar cliente com ID ${id}:`, error);
    throw new Error("Erro ao buscar a cliente.");
  }
}
