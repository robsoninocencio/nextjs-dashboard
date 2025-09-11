import { Suspense } from "react";

import Search from "@/app/ui/shared/search";

import { lusitana } from "@/app/ui/shared/fonts";
import Pagination from "@/app/ui/shared/pagination";
import { ButtonLinkCreate } from "@/app/ui/shared/buttonsLinkCreate";

import Table from "@/app/ui/bancos/table";
import { BancosTableSkeleton } from "@/app/ui/bancos/skeletons";

import { fetchBancosPages } from "@/lib/bancos/data";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bancos",
};

export default async function Page({
  searchParams,
}: {
  searchParams:
    | Promise<{
        query?: string;
        page?: string;
      }>
    | undefined;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const query = resolvedSearchParams.query || "";
  const currentPage = Number(resolvedSearchParams.page) || 1;

  const totalPages = await fetchBancosPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Bancos</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Pesquisar bancos..." />
        <ButtonLinkCreate href="/dashboard/bancos/create">
          Cadastrar Banco
        </ButtonLinkCreate>
      </div>
      <Suspense key={query + currentPage} fallback={<BancosTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
