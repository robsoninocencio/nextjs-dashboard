import prisma from "@/prisma/lib/prisma";

const ITEMS_PER_PAGE = 50;

export async function fetchInvestimentosPages(
  queryAno: string,
  queryMes: string,
  queryCliente: string,
  queryBanco: string,
  queryAtivo: string,
  queryTipo: string
) {
  try {
    console.log("Entrei em fetchInvestimentosPages()");
    const where: any = {};

    // Filtra por cliente, se fornecido
    if (queryCliente) {
      where.clientes = {
        name: { contains: queryCliente, mode: "insensitive" },
      };
    }

    // Filtra por ano, se fornecido
    if (queryAno) {
      where.ano = { equals: queryAno };
    }

    // Filtra por mes, se fornecido
    if (queryMes) {
      where.mes = { equals: queryMes };
    }

    // Filtra por banco, se fornecido
    if (queryBanco) {
      where.bancos = {
        nome: { contains: queryBanco, mode: "insensitive" },
      };
    }

    if (queryAtivo || queryTipo) {
      where.ativos = {
        ...(queryAtivo && {
          nome: { contains: queryAtivo, mode: "insensitive" },
        }),
        ...(queryTipo && {
          tipos: { nome: { contains: queryTipo, mode: "insensitive" } },
        }),
      };
    }

    const count = await prisma.investimentos.count({ where });
    console.log("count:", count);
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Erro ao buscar o número total de páginas:", error);
    throw new Error("Erro ao buscar o número total de páginas.");
  }
}

export async function fetchFilteredInvestimentos(
  currentPage: number,
  queryAno: string,
  queryMes: string,
  queryCliente: string,
  queryBanco: string,
  queryAtivo: string,
  queryTipo: string
) {
  console.log("Entrei em fetchFilteredInvestimentos()");
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  console.log("queryAno", queryAno);
  console.log("queryMes", queryMes);
  console.log("queryCliente", queryCliente);
  console.log("queryBanco", queryBanco);
  console.log("queryAtivo", queryAtivo);
  console.log("queryTipo", queryTipo);

  try {
    const where: any = {};

    // Filtra por cliente, se fornecido
    if (queryCliente) {
      where.clientes = {
        name: { contains: queryCliente, mode: "insensitive" },
      };
    }

    // Filtra por ano, se fornecido
    if (queryAno) {
      where.ano = { equals: queryAno };
    }

    // Filtra por mes, se fornecido
    if (queryMes) {
      where.mes = { equals: queryMes };
    }

    // Filtra por banco, se fornecido
    if (queryBanco) {
      where.bancos = {
        nome: { contains: queryBanco, mode: "insensitive" },
      };
    }

    if (queryAtivo || queryTipo) {
      where.ativos = {
        ...(queryAtivo && {
          nome: { contains: queryAtivo, mode: "insensitive" },
        }),
        ...(queryTipo && {
          tipos: { nome: { contains: queryTipo, mode: "insensitive" } },
        }),
      };
    }

    const investimentos = await prisma.investimentos.findMany({
      where,
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
      orderBy: [
        { ano: "desc" },
        { mes: "desc" },
        { bancos: { nome: "asc" } },
        { ativos: { nome: "asc" } },
      ],
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
        data: true,
        ano: true,
        mes: true,
        rendimentoDoMes: true,
        valorAplicado: true,
        saldoBruto: true,
        valorResgatado: true,
        impostoIncorrido: true,
        impostoPrevisto: true,
        saldoLiquido: true,
        clienteId: true,
        bancoId: true,
        ativoId: true,
      },
    });

    if (!investimento) {
      throw new Error("Investimento não encontrada.");
    }

    return {
      ...investimento,
      rendimentoDoMes: investimento.rendimentoDoMes / 100,
      valorAplicado: investimento.valorAplicado / 100,
      saldoBruto: investimento.saldoBruto / 100,
      valorResgatado: investimento.valorResgatado / 100,
      impostoIncorrido: investimento.impostoIncorrido / 100,
      impostoPrevisto: investimento.impostoPrevisto / 100,
      saldoLiquido: investimento.saldoLiquido / 100,
    };
  } catch (error) {
    console.error(`Erro ao buscar investimento com ID ${id}:`, error);
    throw new Error("Erro ao buscar a investimento.");
  }
}

export async function fetchInvestimentoGroupByClienteAnoMes() {
  try {
    // Usando o groupBy do Prisma para agrupar os dados corretamente
    const resultado = await prisma.investimentos.groupBy({
      by: ["clienteId", "ano", "mes"], // Agrupar por clienteId, ano e mês
      _sum: {
        rendimentoDoMes: true,
        valorAplicado: true,
        saldoBruto: true,
        valorResgatado: true,
        impostoIncorrido: true,
        impostoPrevisto: true,
        saldoLiquido: true,
      },
      _count: {
        id: true,
      },
      orderBy: [{ clienteId: "asc" }, { ano: "desc" }, { mes: "desc" }],
    });

    // Estruturando os resultados
    const agrupados = resultado.reduce(
      (acc: Record<string, any>, investimento) => {
        const clienteId = investimento.clienteId;

        if (!acc[clienteId]) {
          acc[clienteId] = {
            Cliente: "", // Inicializa o nome do cliente (vai ser preenchido depois)
            investimentos: [],
          };
        }

        // Adicionando os dados de cada investimento ao cliente
        acc[clienteId].investimentos.push({
          ano: investimento.ano,
          mes: investimento.mes,
          rendimentoDoMes: investimento._sum.rendimentoDoMes ?? 0,
          valorAplicado: investimento._sum.valorAplicado ?? 0,
          saldoBruto: investimento._sum.saldoBruto ?? 0,
          valorResgatado: investimento._sum.valorResgatado ?? 0,
          impostoIncorrido: investimento._sum.impostoIncorrido ?? 0,
          impostoPrevisto: investimento._sum.impostoPrevisto ?? 0,
          saldoLiquido: investimento._sum.saldoLiquido ?? 0,
        });

        return acc;
      },
      {}
    );

    // Transformando os resultados para incluir o nome do cliente
    const resultadoFormatado = await Promise.all(
      Object.keys(agrupados).map(async (clienteId) => {
        // Busca o nome do cliente pelo ID
        const cliente = await prisma.clientes.findUnique({
          where: { id: clienteId },
          select: { name: true },
        });

        // Adicionando o nome do cliente ao resultado
        agrupados[clienteId].Cliente = cliente?.name ?? "Cliente Desconhecido";

        return agrupados[clienteId];
      })
    );

    return resultadoFormatado;
  } catch (error) {
    console.error("Erro ao buscar os investimentos agrupados:", error);
    throw new Error("Erro ao buscar os investimentos agrupados.");
  }
}
