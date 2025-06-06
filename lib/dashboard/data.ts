import prisma from "@/prisma/lib/prisma";
import { formatCurrency } from "../utils";

export async function fetchCardData() {
  try {
    const [invoiceCount, clienteCount, paidSum, pendingSum] = await Promise.all(
      [
        prisma.invoices.count(),
        prisma.clientes.count(),
        prisma.invoices.aggregate({
          _sum: { amount: true },
          where: { status: "pago" },
        }),
        prisma.invoices.aggregate({
          _sum: { amount: true },
          where: { status: "pendente" },
        }),
      ]
    );

    return {
      numberOfInvoices: invoiceCount,
      numberOfClientes: clienteCount,
      totalPaidInvoices: formatCurrency(paidSum._sum.amount || 0),
      totalPendingInvoices: formatCurrency(pendingSum._sum.amount || 0),
    };
  } catch (error) {
    console.error("Erro ao buscar dados do painel:", error);
    throw new Error("Erro ao buscar dados do painel.");
  }
}

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
        cliente: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const latestInvoices = data.map((invoice) => ({
      id: invoice.id,
      amount: formatCurrency(invoice.amount),
      status: invoice.status,
      name: invoice.cliente?.name,
      email: invoice.cliente?.email,
    }));

    return latestInvoices;
  } catch (error) {
    console.error("Erro ao buscar as últimas faturas:", error);
    throw new Error("Não foi possível buscar as últimas faturas.");
  }
}
