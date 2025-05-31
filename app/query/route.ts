import prisma from "../../prisma/lib/prisma";

async function listInvoices() {
  const data = await prisma.invoices.findMany({
    where: {
      amount: 666, // Filtra as faturas com o valor 666
    },
    select: {
      amount: true,
      cliente: {
        select: {
          name: true, // Seleciona o nome do cliente relacionado
        },
      },
    },
  });

  // Ajusta o formato dos dados para retornar apenas `amount` e `name`
  return data.map((invoice) => ({
    amount: invoice.amount,
    name: invoice.cliente?.name,
  }));
}

export async function GET() {
  try {
    const data = await listInvoices();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao listar faturas:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect(); // Certifique-se de desconectar o Prisma
  }
}
