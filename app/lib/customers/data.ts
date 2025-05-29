import prisma from "@/prisma/lib/prisma";

const ITEMS_PER_PAGE = 6;

export async function fetchCustomersPages(query: string) {
  try {
    const count = await prisma.customers.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Erro ao buscar o número total de páginas:", error);
    throw new Error("Erro ao buscar o número total de páginas.");
  }
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const customers = await prisma.customers.findMany({
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

    return customers;
  } catch (error) {
    console.error("Erro ao buscar clientes filtrados:", error);
    throw new Error("Erro ao buscar clientes filtrados.");
  }
}

export async function fetchCustomers() {
  try {
    const customers = await prisma.customers.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image_url: true,
      },
      orderBy: { name: "asc" },
    });

    return customers;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    throw new Error("Não foi possível buscar os clientes.");
  }
}

export async function fetchCustomerById(id: string) {
  if (!id) {
    throw new Error("O ID do cliente é obrigatório.");
  }

  try {
    const customer = await prisma.customers.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image_url: true,
      },
    });

    if (!customer) {
      throw new Error("Cliente não encontrado.");
    }

    return customer;
  } catch (error) {
    console.error(`Erro ao buscar cliente com ID ${id}:`, error);
    throw new Error("Erro ao buscar a cliente.");
  }
}
