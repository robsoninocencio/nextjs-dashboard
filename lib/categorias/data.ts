import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import type { CategoriaComPai, CategoriaField } from "./definitions"; // Supondo que CategoriaComPai foi movido para definitions

const ITEMS_PER_PAGE = 50;

export async function fetchCategoriasPages(queryCategoria: string) {
  try {
    console.log("Entrei em fetchCategoriasPages()");
    const where: any = {};

    // Filtra por categoria, se fornecido
    if (queryCategoria) {
      where.nome = { contains: queryCategoria, mode: "insensitive" };
    }

    const count = await prisma.categorias.count({ where });
    console.log("count:", count);
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Erro ao buscar o número total de páginas:", error);
    throw new Error("Erro ao buscar o número total de páginas.");
  }
}

export async function fetchFilteredCategorias(
  currentPage: number,
  queryCategoria: string
): Promise<CategoriaComPai[]> {
  console.log("Entrei em fetchFilteredCategorias()");
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  console.log("queryCategoria = ", queryCategoria);

  try {
    let categorias: CategoriaComPai[];

    if (queryCategoria) {
      const searchTerm = `%${queryCategoria}%`;
      // Query com filtro
      categorias = await prisma.$queryRaw<CategoriaComPai[]>(Prisma.sql`
        SELECT
          c.id,
          c.nome,
          c."parentId",
          c."createdAt",
          c."updatedAt",
          p.nome AS "nomePai"
        FROM "categorias" c
        LEFT JOIN "categorias" p ON c."parentId" = p.id
        WHERE c.nome ILIKE ${searchTerm}
        ORDER BY LOWER(c.nome) ASC
        LIMIT ${ITEMS_PER_PAGE}
        OFFSET ${offset}
      `);
    } else {
      // Query sem filtro
      categorias = await prisma.$queryRaw<CategoriaComPai[]>(Prisma.sql`
        SELECT
          c.id,
          c.nome,
          c."parentId",
          c."createdAt",
          c."updatedAt",
          p.nome AS "nomePai"
        FROM "categorias" c
        LEFT JOIN "categorias" p ON c."parentId" = p.id
        ORDER BY LOWER(c.nome) ASC
        LIMIT ${ITEMS_PER_PAGE}
        OFFSET ${offset}
      `);
    }

    return categorias;
  } catch (error) {
    console.error("Erro ao buscar categorias filtradas:", error);
    throw new Error("Erro ao buscar categorias filtradas.");
  }
}

export async function fetchCategoriaById(id: string) {
  if (!id) {
    throw new Error("O ID da categoria é obrigatório.");
  }

  try {
    const categoria = await prisma.categorias.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        parentId: true,
      },
    });

    if (!categoria) {
      throw new Error("Categoria não encontrada.");
    }

    return categoria;
  } catch (error) {
    console.error(`Erro ao buscar categoria com ID ${id}:`, error);
    throw new Error("Erro ao buscar a categoria.");
  }
}

export async function fetchCategorias(): Promise<CategoriaField[]> {
  try {
    const categorias = await prisma.categorias.findMany({
      select: {
        id: true,
        nome: true,
        parentId: true,
      },
      orderBy: { nome: "asc" },
    });
    return categorias;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw new Error("Não foi possível buscar as categorias.");
  }
}
