import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { InvestimentoCompleto } from '@/lib/definitions'; // Importando o tipo gerado pelo Prisma
import { Decimal } from '@prisma/client/runtime/library';

// Helper function to convert Decimal to number
const toNumber = (value: Decimal | number): number => {
  return typeof value === 'number' ? value : value.toNumber();
};

export type InvestmentFiltersParams = {
  ano: string;
  mes: string;
  cliente: string;
  banco: string;
  ativo: string;
  tipo: string;
  categoriaId?: string;
};

const ITEMS_PER_PAGE = 300;

/**
 * Busca todas as categorias filhas (recursivamente) de uma categoria pai.
 */
async function getCategoriaIds(categoriaId: string): Promise<string[]> {
  if (!categoriaId) {
    return [];
  }

  // Usando uma CTE recursiva para buscar todos os IDs de subcategorias de forma eficiente
  const result = await prisma.$queryRaw<Array<{ id: string }>>(
    Prisma.sql`
      WITH RECURSIVE SubCategories AS (
        SELECT id FROM "categorias" WHERE id = ${categoriaId}::uuid
        UNION ALL
        SELECT c.id FROM "categorias" c
        INNER JOIN SubCategories sc ON c."parentId" = sc.id
      )
      SELECT id FROM SubCategories;
    `
  );

  return result.map(r => r.id);
}

function buildInvestimentosFilters(
  filters: InvestmentFiltersParams,
  categoriaIds?: string[]
): Prisma.investimentosWhereInput {
  const { cliente, ano, mes, banco, ativo, tipo } = filters;
  const whereConditions: Prisma.investimentosWhereInput[] = [];

  if (cliente) {
    whereConditions.push({
      clientes: { name: { contains: cliente, mode: 'insensitive' } },
    });
  }

  if (ano) {
    whereConditions.push({ ano: { equals: ano } });
  }

  if (mes) {
    whereConditions.push({ mes: { equals: mes } });
  }

  if (banco) {
    whereConditions.push({
      bancos: { nome: { contains: banco, mode: 'insensitive' } },
    });
  }

  const ativosFilter: Record<string, any> = {};
  if (ativo) {
    ativosFilter.nome = { contains: ativo, mode: 'insensitive' };
  }
  if (tipo) {
    ativosFilter.tipos = { nome: { contains: tipo, mode: 'insensitive' } };
  }

  if (categoriaIds && categoriaIds.length > 0) {
    ativosFilter.ativo_categorias = {
      some: { categoriaId: { in: categoriaIds } },
    };
  }

  if (Object.keys(ativosFilter).length > 0) {
    whereConditions.push({ ativos: ativosFilter });
  }

  return whereConditions.length > 0 ? { AND: whereConditions } : {};
}

export async function fetchInvestimentosPages(
  filters: InvestmentFiltersParams
): Promise<{ totalPages: number; totalItems: number }> {
  try {
    const { categoriaId } = filters;

    let categoriaIds: string[] = [];
    if (categoriaId) {
      categoriaIds = await getCategoriaIds(categoriaId);
    }

    const where = buildInvestimentosFilters(filters, categoriaIds);

    const totalItems = await prisma.investimentos.count({ where });

    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

    return { totalPages, totalItems };
  } catch (error) {
    console.error('Erro ao buscar o número total de páginas:', error);

    throw new Error(
      error instanceof Error ? error.message : 'Erro ao buscar o número total de páginas.'
    );
  }
}

export async function fetchFilteredInvestimentos(
  filters: InvestmentFiltersParams,
  currentPage: number
): Promise<InvestimentoCompleto[]> {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const { categoriaId } = filters;

    let categoriaIds: string[] = [];
    if (categoriaId) {
      categoriaIds = await getCategoriaIds(categoriaId);
    }

    const where = buildInvestimentosFilters(filters, categoriaIds);

    const investimentos = await prisma.investimentos.findMany({
      where,
      include: {
        clientes: true,
        bancos: true,
        ativos: {
          include: {
            tipos: true,
            ativo_categorias: {
              include: {
                categoria: true,
              },
            },
          },
        },
      },
      orderBy: [
        { clientes: { name: 'asc' } },
        { ano: 'desc' },
        { mes: 'desc' },
        { bancos: { nome: 'asc' } },
        { ativos: { nome: 'asc' } },
      ],
      skip: offset,
      take: ITEMS_PER_PAGE,
    });

    return investimentos;
  } catch (error) {
    console.error('Erro ao buscar investimentos filtradas:', error);
    throw new Error('Erro ao buscar investimentos filtradas.');
  }
}

export async function fetchInvestimentoById(id: string) {
  if (!id) {
    throw new Error('O ID da investimento é obrigatório.');
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
        dividendosDoMes: true,
        valorAplicado: true,
        saldoBruto: true,
        saldoAnterior: true,
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
      throw new Error('Investimento não encontrada.');
    }

    return {
      ...investimento,
      data: investimento.data.toISOString(),
      rendimentoDoMes: toNumber(investimento.rendimentoDoMes) / 100,
      dividendosDoMes: toNumber(investimento.dividendosDoMes) / 100,
      valorAplicado: toNumber(investimento.valorAplicado) / 100,
      saldoBruto: toNumber(investimento.saldoBruto) / 100,
      saldoAnterior: toNumber(investimento.saldoAnterior) / 100,
      valorResgatado: toNumber(investimento.valorResgatado) / 100,
      impostoIncorrido: toNumber(investimento.impostoIncorrido) / 100,
      impostoPrevisto: toNumber(investimento.impostoPrevisto) / 100,
      saldoLiquido: toNumber(investimento.saldoLiquido) / 100,
    };
  } catch (error) {
    console.error(`Erro ao buscar investimento com ID ${id}:`, error);
    throw new Error('Erro ao buscar a investimento.');
  }
}

export async function fetchInvestimentoAnterior(
  ano: string,
  mes: string,
  clienteId: string,
  bancoId: string,
  ativoId: string
) {
  try {
    // Validar parâmetros
    if (!ano || !mes || !clienteId || !bancoId || !ativoId) {
      throw new Error('Os parâmetros ano, mes, clienteId, bancoId e ativoId são obrigatórios.');
    }

    // Converter ano e mês para números para calcular o mês anterior
    const anoNum = parseInt(ano);
    const mesNum = parseInt(mes);
    let anoAnterior = anoNum;
    let mesAnterior = mesNum - 1;

    if (mesAnterior === 0) {
      mesAnterior = 12;
      anoAnterior -= 1;
    }

    // Buscar o registro do mês anterior para o mesmo cliente, banco e ativo
    const registroAnterior = await prisma.investimentos.findFirst({
      where: {
        ano: anoAnterior.toString(),
        mes: mesAnterior.toString().padStart(2, '0'),
        clienteId,
        bancoId,
        ativoId,
      },
      select: {
        saldoBruto: true,
        saldoLiquido: true,
      },
    });

    if (!registroAnterior) {
      console.log('Nenhum investimento anterior encontrado.');
      return null;
    }

    // return registroAnterior;
    return {
      ...registroAnterior,

      saldoBruto: toNumber(registroAnterior.saldoBruto) / 100,

      saldoLiquido: toNumber(registroAnterior.saldoLiquido) / 100,
    };
  } catch (error) {
    console.error('Erro ao buscar o investimento anterior:', error);
    throw new Error('Erro ao buscar o investimento anterior.');
  }
}
