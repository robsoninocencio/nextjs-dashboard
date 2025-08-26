import prisma from "@/prisma/lib/prisma";
import { Prisma } from "../../generated/prisma";
import type { CategoriaField } from "./definitions";
type CategoriaModel = Prisma.categoriasGetPayload<{}>;

// import { categorias as CategoriaModel } from "@prisma/client";

interface Categoria {
  id: string;
  nome: string;
}

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
) {
  console.log("Entrei em fetchFilteredCategorias()");
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  console.log("queryCategoria", queryCategoria);

  try {
    // Para ordenação case-insensitive, a abordagem mais confiável com Prisma é usar uma query raw,
    // pois a API `findMany` não suporta `mode: 'insensitive'` no `orderBy`.
    // A query abaixo assume um banco de dados PostgreSQL, usando LOWER() para ordenar e ILIKE para filtrar.
    let categorias: CategoriaModel[];
    if (queryCategoria) {
      categorias = await prisma.$queryRaw`
        SELECT * FROM "categorias"
        WHERE "nome" ILIKE ${`%${queryCategoria}%`}
        ORDER BY LOWER("nome") ASC
        LIMIT ${ITEMS_PER_PAGE}
        OFFSET ${offset}
      `;
    } else {
      categorias = await prisma.$queryRaw`
        SELECT * FROM "categorias"
        ORDER BY LOWER("nome") ASC
        LIMIT ${ITEMS_PER_PAGE}
        OFFSET ${offset}
      `;
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

    // console.log("categorias:", categorias);

    return categorias.map((categoria) => ({
      id: categoria.id,
      nome: categoria.nome,
      parentId: categoria.parentId,
    }));
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw new Error("Não foi possível buscar os categorias.");
  }
}
