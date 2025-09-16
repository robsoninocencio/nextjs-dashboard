import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 6;

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await prisma.invoices.count({
      where: {
        OR: [
          { cliente: { name: { contains: query, mode: "insensitive" } } },
          { cliente: { email: { contains: query, mode: "insensitive" } } },
          {
            amount: isNaN(Number(query))
              ? undefined
              : { equals: Number(query) },
          },
          { status: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Erro ao buscar o número total de páginas:", error);
    throw new Error("Erro ao buscar o número total de páginas.");
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await prisma.invoices.findMany({
      where: {
        OR: [
          { cliente: { name: { contains: query, mode: "insensitive" } } },
          { cliente: { email: { contains: query, mode: "insensitive" } } },
          {
            amount: isNaN(Number(query))
              ? undefined
              : { equals: Number(query) },
          },
          { status: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        cliente: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: "desc" },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });

    return invoices;
  } catch (error) {
    console.error("Erro ao buscar faturas filtradas:", error);
    throw new Error("Erro ao buscar faturas filtradas.");
  }
}

export async function fetchInvoiceById(id: string) {
  if (!id) {
    throw new Error("O ID da fatura é obrigatório.");
  }

  try {
    const invoice = await prisma.invoices.findUnique({
      where: { id },
      select: {
        id: true,
        cliente_id: true,
        amount: true,
        status: true,
        date: true, // <-- Inclua ESTA LINHA
      },
    });

    if (!invoice) {
      throw new Error("Fatura não encontrada.");
    }

    return {
      ...invoice,
      amount: invoice.amount / 100, // Converte de centavos para dólares
    };
  } catch (error) {
    console.error(`Erro ao buscar fatura com ID ${id}:`, error);
    throw new Error("Erro ao buscar a fatura.");
  }
}
