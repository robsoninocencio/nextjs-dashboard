import { Suspense } from "react";

import SearchAno from "@/app/ui/shared/searchAno";
import SearchMes from "@/app/ui/shared/searchMes";
import SearchCliente from "@/app/ui/shared/searchCliente";
import SearchBanco from "@/app/ui/shared/searchBanco";
import SearchAtivo from "@/app/ui/shared/searchAtivo";
import SearchTipo from "@/app/ui/shared/searchTipo";

import { lusitana } from "@/app/ui/shared/fonts";
import Pagination from "@/app/ui/shared/pagination";
import { ButtonLinkCreate } from "@/app/ui/shared/buttonsLinkCreate";

import Table from "@/app/ui/investimentos/table";
import { InvestimentosTableSkeleton } from "@/app/ui/investimentos/skeletons";

import { fetchInvestimentosPages } from "@/lib/investimentos/data";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investimentos",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    queryAno?: string;
    queryMes?: string;
    queryCliente?: string;
    queryBanco?: string;
    queryAtivo?: string;
    queryTipo?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const queryAno = searchParams?.queryAno || "";
  const queryMes = searchParams?.queryMes || "";
  const queryCliente = searchParams?.queryCliente || "";
  const queryBanco = searchParams?.queryBanco || "";
  const queryAtivo = searchParams?.queryAtivo || "";
  const queryTipo = searchParams?.queryTipo || "";

  const totalPages = await fetchInvestimentosPages(
    queryAno,
    queryMes,
    queryCliente,
    queryBanco,
    queryAtivo,
    queryTipo
  );

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Investimentos</h1>
        <ButtonLinkCreate href="/dashboard/investimentos/create">
          Cadastrar Investimento
        </ButtonLinkCreate>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <SearchCliente placeholder="Buscar Cliente..." />
        <SearchAno placeholder="Buscar Ano..." />
        <SearchMes placeholder="Buscar Mes..." />
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <SearchBanco placeholder="Buscar Banco..." />
        <SearchAtivo placeholder="Buscar Ativo..." />
        <SearchTipo placeholder="Buscar Tipo..." />
      </div>
      <Suspense
        key={
          query +
          currentPage +
          queryAno +
          queryMes +
          queryCliente +
          queryBanco +
          queryAtivo +
          queryTipo
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
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
