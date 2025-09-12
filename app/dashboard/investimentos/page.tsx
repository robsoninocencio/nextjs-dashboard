import { Suspense } from "react";

import SearchAno from "@/app/ui/shared/searchAno";
import SearchMes from "@/app/ui/shared/searchMes";
import SearchCliente from "@/app/ui/shared/searchCliente";
import SearchBanco from "@/app/ui/shared/searchBanco";
import SearchAtivo from "@/app/ui/shared/searchAtivo";
import SearchTipo from "@/app/ui/shared/searchTipo";
import CategoriaFilter from "@/app/ui/shared/categoria-filter";

import { lusitana } from "@/app/ui/shared/fonts";
import Pagination from "@/app/ui/shared/pagination";
import { ButtonLinkCreate } from "@/app/ui/shared/buttonsLinkCreate";

import Table from "@/app/ui/investimentos/table";
import { InvestimentosTableSkeleton } from "@/app/ui/investimentos/skeletons";
import { fetchCategorias } from "@/lib/categorias/data";

import { fetchInvestimentosPages } from "@/lib/investimentos/data";

import { Card, CardContent } from "@/components/ui/card";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investimentos",
};

export default async function Page({
  searchParams,
}: {
  searchParams:
    | Promise<{
        page?: string;
        query?: string;
        queryCliente?: string;
        queryAno?: string;
        queryMes?: string;
        queryBanco?: string;
        queryAtivo?: string;
        queryTipo?: string;
        categoriaId?: string;
      }>
    | undefined;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const currentPage = Number(resolvedSearchParams.page) || 1;

  const query = resolvedSearchParams.query || "";

  const queryCliente = resolvedSearchParams.queryCliente || "";
  const queryAno = resolvedSearchParams.queryAno || "";
  let queryMes = resolvedSearchParams.queryMes || "";
  if (queryMes) {
    queryMes = queryMes.padStart(2, "0"); // transforma "1" em "01"
  }
  const categoriaId = resolvedSearchParams.categoriaId || "";

  const queryBanco = resolvedSearchParams.queryBanco || "";
  const queryAtivo = resolvedSearchParams.queryAtivo || "";
  const queryTipo = resolvedSearchParams.queryTipo || "";

  const [{ totalPages, totalItems }, categorias] = await Promise.all([
    fetchInvestimentosPages(
      queryAno,
      queryMes,
      queryCliente,
      queryBanco,
      queryAtivo,
      queryTipo,
      categoriaId
    ),
    fetchCategorias(),
  ]);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Investimentos</h1>
        <ButtonLinkCreate href="/dashboard/investimentos/create">
          Cadastrar Investimento
        </ButtonLinkCreate>
      </div>

      <Card className="mt-4">
        <CardContent>
          <div className="grid grid-cols-3 gap-4 md:mt-8">
            <SearchCliente placeholder="Buscar Cliente..." />
            <div className="flex gap-4">
              <SearchAno placeholder="Ano..." />
              <SearchMes placeholder="Mês..." />
            </div>
            <CategoriaFilter categorias={categorias} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 md:mt-8">
            <SearchBanco placeholder="Buscar Banco..." />
            <SearchAtivo placeholder="Buscar Ativo..." />
            <SearchTipo placeholder="Buscar Tipo..." />
          </div>
        </CardContent>
      </Card>

      <Suspense
        key={
          query +
          currentPage +
          queryAno +
          queryMes +
          queryCliente +
          queryBanco +
          queryAtivo +
          queryTipo +
          categoriaId
        }
        fallback={<InvestimentosTableSkeleton />}
      >
        <Table
          currentPage={currentPage}
          queryAno={queryAno}
          queryMes={queryMes}
          queryCliente={queryCliente}
          queryBanco={queryBanco}
          queryAtivo={queryAtivo}
          queryTipo={queryTipo}
          categoriaId={categoriaId}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
