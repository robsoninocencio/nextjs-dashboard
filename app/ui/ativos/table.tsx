import Image from "next/image";

import { ButtonLinkUpdate } from "@/app/ui/shared/buttonLinkUpdate";

import { formatDateToLocal, formatCurrency } from "@/lib/utils";

import { fetchFilteredAtivos } from "@/lib/ativos/data";

import { ButtonLinkDelete } from "@/app/ui/ativos/buttonLinkDelete";

export default async function AtivosTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const ativos = await fetchFilteredAtivos(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {ativos?.map((ativo) => (
              <div
                key={ativo.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{ativo.nome}</p>
                    </div>
                    <div className="mb-2 flex items-center">
                      <p>{ativo.tipos?.nome}</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <ButtonLinkUpdate
                      href={`/dashboard/ativos/${ativo.id}/edit`}
                    />
                    <ButtonLinkDelete id={ativo.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Ativo
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Tipo
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {ativos?.map((ativo) => (
                <tr
                  key={ativo.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{ativo.nome}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{ativo.tipos?.nome}</p>
                    </div>
                  </td>

                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ButtonLinkUpdate
                        href={`/dashboard/ativos/${ativo.id}/edit`}
                      />
                      <ButtonLinkDelete id={ativo.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
