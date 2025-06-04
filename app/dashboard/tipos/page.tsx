import { Suspense } from "react";

import Search from "@/app/ui/shared/search";
import { lusitana } from "@/app/ui/shared/fonts";
import Pagination from "@/app/ui/shared/pagination";
import { ButtonLinkCreate } from "@/app/ui/shared/buttonsLinkCreate";

import Table from "@/app/ui/tipos/table";

import { TiposTableSkeleton } from "@/app/ui/tipos/skeletons";

import { fetchTiposPages } from "@/lib/tipos/data";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipos",
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

  const totalPages = await fetchTiposPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Tipos</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Pesquisar tipos..." />
        <ButtonLinkCreate href="/dashboard/tipos/create">
          Cadastrar Tipo
        </ButtonLinkCreate>
      </div>
      <Suspense key={query + currentPage} fallback={<TiposTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
