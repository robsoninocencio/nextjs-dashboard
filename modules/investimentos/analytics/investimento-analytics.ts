import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { InvestmentFiltersParams } from '@/modules/investimentos/data/investimentos';
import { Decimal } from '@prisma/client/runtime/library';

// Helper function to convert Decimal to number
const toNumber = (value: Decimal | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  return typeof value === 'number' ? value : value.toNumber();
};

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
      saldoBruto: toNumber(item._sum.saldoBruto),
      rendimentoDoMes: toNumber(item._sum.rendimentoDoMes),
      dividendosDoMes: toNumber(item._sum.dividendosDoMes),
      valorAplicado: toNumber(item._sum.valorAplicado),
      valorResgatado: toNumber(item._sum.valorResgatado),
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
      saldoBrutoAtual =
        typeof saldoAgg._sum.saldoBruto === 'number'
          ? saldoAgg._sum.saldoBruto
          : saldoAgg._sum.saldoBruto?.toNumber() || 0;
      saldoLiquidoAtual =
        typeof saldoAgg._sum.saldoLiquido === 'number'
          ? saldoAgg._sum.saldoLiquido
          : saldoAgg._sum.saldoLiquido?.toNumber() || 0;
    }

    return {
      totalInvestido: toNumber(metrics._sum.valorAplicado),
      totalResgatado: toNumber(metrics._sum.valorResgatado),
      totalRendimento: toNumber(metrics._sum.rendimentoDoMes),
      totalDividendos: toNumber(metrics._sum.dividendosDoMes),
      saldoBrutoAtual,
      saldoLiquidoAtual,
      totalImpostos:
        toNumber(metrics._sum.impostoIncorrido) + toNumber(metrics._sum.impostoPrevisto),
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

    let finalWhere: Prisma.investimentosWhereInput = where;

    // Se o mês não for especificado, devemos encontrar o mês mais recente para os filtros dados (especialmente o ano).
    if (!filters.mes) {
      const latestEntry = await prisma.investimentos.findFirst({
        where, // Usa os filtros já aplicados (ex: ano=2024, cliente=X)
        orderBy: [{ ano: 'desc' }, { mes: 'desc' }],
        select: { ano: true, mes: true },
      });

      // Se encontrarmos uma data, usamos ela para a consulta final.
      if (latestEntry) {
        // Constrói o filtro final para usar o ano e mês mais recentes encontrados.
        finalWhere.ano = latestEntry.ano;
        finalWhere.mes = latestEntry.mes;
      }
    }

    // 1. Agrupa os investimentos por ativo para obter o saldo de cada um
    const assetBalances = await prisma.investimentos.groupBy({
      by: ['ativoId'],
      where: finalWhere,
      _sum: {
        saldoBruto: true,
      },
    });

    if (assetBalances.length === 0) {
      return [];
    }

    const assetIds = assetBalances.map(b => b.ativoId);

    // 2. Busca as categorias para os ativos encontrados
    const assetsWithCategories = await prisma.ativos.findMany({
      where: { id: { in: assetIds } },
      select: {
        id: true,
        ativo_categorias: {
          select: { categoria: { select: { nome: true } } },
        },
      },
    });

    // 3. Agrega os saldos por categoria
    const categoryTotals: { [key: string]: number } = {};
    const assetIdToBalanceMap = new Map(
      assetBalances.map(ab => [ab.ativoId, toNumber(ab._sum.saldoBruto)])
    );

    for (const asset of assetsWithCategories) {
      const categoryName = asset.ativo_categorias[0]?.categoria.nome || 'Sem Categoria';
      const balance = assetIdToBalanceMap.get(asset.id) || 0;
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + balance;
    }

    return Object.entries(categoryTotals)
      .map(([categoria, valor]) => ({ categoria, valor }))
      .sort((a, b) => b.valor - a.valor);
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

    let finalWhere = where;

    // Se o mês não for especificado, devemos encontrar o mês mais recente para os filtros dados (especialmente o ano).
    if (!filters.mes) {
      const latestEntry = await prisma.investimentos.findFirst({
        where, // Usa os filtros já aplicados (ex: ano=2024, cliente=X)
        orderBy: [{ ano: 'desc' }, { mes: 'desc' }],
        select: { ano: true, mes: true },
      });

      // Se encontrarmos uma data, usamos ela para a consulta final.
      if (latestEntry) {
        // Constrói o filtro final para usar o ano e mês mais recentes encontrados.
        finalWhere = {
          ...where,
          ano: latestEntry.ano,
          mes: latestEntry.mes,
        };
      }
    }

    const bankData = await prisma.investimentos.groupBy({
      by: ['bancoId'], // Agrupa pelo ID do banco
      where: finalWhere,
      _sum: {
        saldoBruto: true,
      },
      orderBy: {
        _sum: {
          saldoBruto: 'desc',
        },
      },
    });

    if (bankData.length === 0) {
      return [];
    }

    // 1. Extrair os IDs dos bancos do resultado do groupBy
    const bankIds = bankData.map(item => item.bancoId);

    // 2. Buscar os nomes dos bancos correspondentes aos IDs
    const bancos = await prisma.bancos.findMany({
      where: {
        id: { in: bankIds },
      },
      select: { id: true, nome: true },
    });

    // 3. Criar um mapa de ID para Nome para facilitar a busca
    const bankIdToNameMap = new Map(bancos.map(b => [b.id, b.nome]));

    // 4. Mapear o resultado final, substituindo o ID pelo nome do banco
    return bankData.map(item => ({
      banco: bankIdToNameMap.get(item.bancoId) || 'Banco Desconhecido',
      valor: toNumber(item._sum.saldoBruto),
    }));
  } catch (error) {
    console.error('Erro ao buscar diversificação por banco:', error);
    throw new Error('Erro ao buscar diversificação por banco.');
  }
}
