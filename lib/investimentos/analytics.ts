import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { InvestmentFiltersParams } from './data';

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
    ativosFilter.ativo_categoria = {
      some: { categoriaId: { in: categoriaIds } },
    };
  }

  if (Object.keys(ativosFilter).length > 0) {
    whereConditions.push({ ativos: ativosFilter });
  }

  return whereConditions.length > 0 ? { AND: whereConditions } : {};
}

// Funções para analytics
export async function fetchPerformanceData(filters: InvestmentFiltersParams) {
  try {
    const { categoriaId } = filters;

    let categoriaIds: string[] = [];
    if (categoriaId) {
      categoriaIds = await getCategoriaIds(categoriaId);
    }

    const where = buildInvestimentosFilters(filters, categoriaIds);

    const performanceData = await prisma.investimentos.groupBy({
      by: ['ano', 'mes'],
      where,
      _sum: {
        saldoBruto: true,
        rendimentoDoMes: true,
        dividendosDoMes: true,
        valorAplicado: true,
        valorResgatado: true,
      },
      orderBy: [{ ano: 'asc' }, { mes: 'asc' }],
    });

    return performanceData.map(item => ({
      periodo: `${item.ano}-${item.mes.padStart(2, '0')}`,
      ano: item.ano,
      mes: item.mes,
      saldoBruto: item._sum.saldoBruto || 0,
      rendimentoDoMes: item._sum.rendimentoDoMes || 0,
      dividendosDoMes: item._sum.dividendosDoMes || 0,
      valorAplicado: item._sum.valorAplicado || 0,
      valorResgatado: item._sum.valorResgatado || 0,
    }));
  } catch (error) {
    console.error('Erro ao buscar dados de performance:', error);
    throw new Error('Erro ao buscar dados de performance.');
  }
}

export async function fetchAggregatedMetrics(filters: InvestmentFiltersParams) {
  try {
    const { categoriaId } = filters;

    let categoriaIds: string[] = [];
    if (categoriaId) {
      categoriaIds = await getCategoriaIds(categoriaId);
    }

    const where = buildInvestimentosFilters(filters, categoriaIds);

    // Get max ano and mes for filtered data
    const maxDate = await prisma.investimentos.findFirst({
      where,
      orderBy: [{ ano: 'desc' }, { mes: 'desc' }],
      select: { ano: true, mes: true },
    });

    // Aggregate sums for all except saldoBruto and saldoLiquido
    const metrics = await prisma.investimentos.aggregate({
      where,
      _sum: {
        valorAplicado: true,
        valorResgatado: true,
        rendimentoDoMes: true,
        dividendosDoMes: true,
        impostoIncorrido: true,
        impostoPrevisto: true,
      },
      _count: {
        id: true,
      },
    });

    // Get saldoBruto and saldoLiquido for max date
    let saldoBrutoAtual = 0;
    let saldoLiquidoAtual = 0;
    if (maxDate) {
      const saldoAgg = await prisma.investimentos.aggregate({
        where: {
          ...where,
          ano: maxDate.ano,
          mes: maxDate.mes,
        },
        _sum: {
          saldoBruto: true,
          saldoLiquido: true,
        },
      });
      saldoBrutoAtual = saldoAgg._sum.saldoBruto || 0;
      saldoLiquidoAtual = saldoAgg._sum.saldoLiquido || 0;
    }

    return {
      totalInvestido: metrics._sum.valorAplicado || 0,
      totalResgatado: metrics._sum.valorResgatado || 0,
      totalRendimento: metrics._sum.rendimentoDoMes || 0,
      totalDividendos: metrics._sum.dividendosDoMes || 0,
      saldoBrutoAtual,
      saldoLiquidoAtual,
      totalImpostos: (metrics._sum.impostoIncorrido || 0) + (metrics._sum.impostoPrevisto || 0),
      totalAtivos: metrics._count.id,
    };
  } catch (error) {
    console.error('Erro ao buscar métricas agregadas:', error);
    throw new Error('Erro ao buscar métricas agregadas.');
  }
}

export async function fetchDiversificationByCategory(filters: InvestmentFiltersParams) {
  try {
    const { categoriaId } = filters;

    let categoriaIds: string[] = [];
    if (categoriaId) {
      categoriaIds = await getCategoriaIds(categoriaId);
    }

    const where = buildInvestimentosFilters(filters, categoriaIds);

    // Buscar IDs dos ativos que correspondem aos filtros
    const ativos = await prisma.ativos.findMany({
      where: where.ativos || {},
      select: { id: true },
    });
    const ativoIds = ativos.map(a => a.id);

    if (ativoIds.length === 0) {
      return [];
    }

    const categoryData = await prisma.$queryRaw<Array<{ categoria: string; valor: number }>>(
      Prisma.sql`
        SELECT
          COALESCE(c.nome, 'Sem Categoria') as categoria,
          SUM(i."saldoBruto") as valor
        FROM investimentos i
        LEFT JOIN ativos a ON i."ativoId" = a.id
        LEFT JOIN ativo_categoria ac ON a.id = ac."ativoId"
        LEFT JOIN categorias c ON ac."categoriaId" = c.id
        WHERE i."ativoId" = ANY(${ativoIds}::uuid[])
        GROUP BY c.nome
        HAVING SUM(i."saldoBruto") > 0
        ORDER BY valor DESC
      `
    );

    return categoryData;
  } catch (error) {
    console.error('Erro ao buscar diversificação por categoria:', error);
    throw new Error('Erro ao buscar diversificação por categoria.');
  }
}

export async function fetchDiversificationByBank(filters: InvestmentFiltersParams) {
  try {
    const { categoriaId } = filters;

    let categoriaIds: string[] = [];
    if (categoriaId) {
      categoriaIds = await getCategoriaIds(categoriaId);
    }

    const where = buildInvestimentosFilters(filters, categoriaIds);

    // Buscar IDs dos ativos que correspondem aos filtros
    const ativos = await prisma.ativos.findMany({
      where: where.ativos || {},
      select: { id: true },
    });
    const ativoIds = ativos.map(a => a.id);

    if (ativoIds.length === 0) {
      return [];
    }

    const bankData = await prisma.$queryRaw<Array<{ banco: string; valor: number }>>(
      Prisma.sql`
        SELECT
          b.nome as banco,
          SUM(i."saldoBruto") as valor
        FROM investimentos i
        LEFT JOIN bancos b ON i."bancoId" = b.id
        WHERE i."ativoId" = ANY(${ativoIds}::uuid[])
        GROUP BY b.nome
        HAVING SUM(i."saldoBruto") > 0
        ORDER BY valor DESC
      `
    );

    return bankData;
  } catch (error) {
    console.error('Erro ao buscar diversificação por banco:', error);
    throw new Error('Erro ao buscar diversificação por banco.');
  }
}
