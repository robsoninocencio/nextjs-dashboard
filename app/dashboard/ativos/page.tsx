import { Suspense } from "react";

import Search from "@/app/ui/shared/search";
import { lusitana } from "@/app/ui/shared/fonts";
import Pagination from "@/app/ui/shared/pagination";
import { ButtonLinkCreate } from "@/app/ui/shared/buttonsLinkCreate";

import Table from "@/app/ui/ativos/table";
import { AtivosTableSkeleton } from "@/app/ui/ativos/skeletons";

import { fetchAtivosPages } from "@/lib/ativos/data";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ativos",
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

  const totalPages = await fetchAtivosPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Ativos</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 md:mt-8">
        <Search placeholder="Pesquisar ativos..." />
        <ButtonLinkCreate href="/dashboard/ativos/create">
          Cadastrar Ativo
        </ButtonLinkCreate>
      </div>

      <Suspense key={query + currentPage} fallback={<AtivosTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
