import { PrismaClient } from "../generated/prisma";

import { withAccelerate } from "@prisma/extension-accelerate";

import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from "./definitions";
import { formatCurrency } from "./utils";

// Inicializa o cliente Prisma com a extensão Accelerate
const prisma = new PrismaClient().$extends(withAccelerate());

export async function fetchRevenue() {
  try {
    const data = await prisma.revenue.findMany();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados de receita:", error);
    throw new Error(
      "Erro ao buscar dados de receita. Verifique o banco de dados."
    );
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await prisma.invoices.findMany({
      orderBy: { date: "desc" },
      take: 5,
      include: {
        customer: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        },
      },
    });

    const latestInvoices = data.map((invoice) => ({
      id: invoice.id,
      amount: formatCurrency(invoice.amount),
      name: invoice.customer?.name,
      image_url: invoice.customer?.image_url,
      email: invoice.customer?.email,
    }));

    return latestInvoices;
  } catch (error) {
    console.error("Erro ao buscar as últimas faturas:", error);
    throw new Error("Não foi possível buscar as últimas faturas.");
  }
}

export async function fetchCardData() {
  try {
    const [invoiceCount, customerCount, paidSum, pendingSum] =
      await Promise.all([
        prisma.invoices.count(),
        prisma.customers.count(),
        prisma.invoices.aggregate({
          _sum: { amount: true },
          where: { status: "paid" },
        }),
        prisma.invoices.aggregate({
          _sum: { amount: true },
          where: { status: "pending" },
        }),
      ]);

    return {
      numberOfInvoices: invoiceCount,
      numberOfCustomers: customerCount,
      totalPaidInvoices: formatCurrency(paidSum._sum.amount || 0),
      totalPendingInvoices: formatCurrency(pendingSum._sum.amount || 0),
    };
  } catch (error) {
    console.error("Erro ao buscar dados do painel:", error);
    throw new Error("Erro ao buscar dados do painel.");
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await prisma.invoices.findMany({
      where: {
        OR: [
          { customer: { name: { contains: query, mode: "insensitive" } } },
          { customer: { email: { contains: query, mode: "insensitive" } } },
          {
            amount: isNaN(Number(query))
              ? undefined
              : { equals: Number(query) },
          },
          { status: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            image_url: true,
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

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await prisma.invoices.count({
      where: {
        OR: [
          { customer: { name: { contains: query, mode: "insensitive" } } },
          { customer: { email: { contains: query, mode: "insensitive" } } },
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

export async function fetchInvoiceById(id: string) {
  if (!id) {
    throw new Error("O ID da fatura é obrigatório.");
  }

  try {
    const invoice = await prisma.invoices.findUnique({
      where: { id },
      select: {
        id: true,
        customer_id: true,
        amount: true,
        status: true,
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

export async function fetchCustomers() {
  try {
    const customers = await prisma.customers.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    return customers;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    throw new Error("Não foi possível buscar os clientes.");
  }
}

export async function fetchFilteredCustomers(query: string) {
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
    });

    return customers.map((customer) => {
      const totalPending = customer.invoices
        .filter((invoice) => invoice.status === "pending")
        .reduce((sum, invoice) => sum + invoice.amount, 0);

      const totalPaid = customer.invoices
        .filter((invoice) => invoice.status === "paid")
        .reduce((sum, invoice) => sum + invoice.amount, 0);

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
        total_pending: formatCurrency(totalPending),
        total_paid: formatCurrency(totalPaid),
      };
    });
  } catch (error) {
    console.error("Erro ao buscar clientes filtrados:", error);
    throw new Error("Erro ao buscar clientes filtrados.");
  }
}
