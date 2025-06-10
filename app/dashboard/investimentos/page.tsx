import { Suspense } from "react";

import Search from "@/app/ui/shared/search";
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
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchInvestimentosPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Investimentos</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Pesquisar investimentos..." />
        <ButtonLinkCreate href="/dashboard/investimentos/create">
          Cadastrar Investimento
        </ButtonLinkCreate>
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<InvestimentosTableSkeleton />}
      >
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
