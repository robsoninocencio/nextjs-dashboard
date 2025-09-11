import { ButtonLinkUpdate } from "@/app/ui/shared/buttonLinkUpdate";
import { ButtonLinkDelete } from "@/app/ui/categorias/buttonLinkDelete";

import { fetchFilteredCategorias } from "@/lib/categorias/data";
import type { CategoriaComPai } from "@/lib/categorias/definitions";

// Interface para os props do componente
interface CategoriasTableProps {
  currentPage: number;
  queryCategoria: string;
}

// Componente para exibir uma linha de categoria no layout mobile
function MobileCategoriaRow({ categoria }: { categoria: CategoriaComPai }) {
  return (
    <div key={categoria.id} className="mb-1 w-full rounded-md bg-white p-2">
      <div className="flex items-center justify-between pb-1">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium">{categoria.nome}</p>
          <p className="text-sm text-gray-500">
            Categoria Pai: {categoria.nomePai || categoria.parentId || "-"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="flex justify-end gap-1">
          <ButtonLinkUpdate
            href={{
              pathname: `/dashboard/categorias/${categoria.id}/edit`,
            }}
          />
          <ButtonLinkDelete id={categoria.id} />
        </div>
      </div>
    </div>
  );
}

// Componente para exibir a tabela de categorias no layout desktop
function DesktopCategoriasTable({
  categorias,
}: {
  categorias: CategoriaComPai[];
}) {
  return (
    <table className="hidden min-w-full text-gray-900 md:table">
      <thead className="rounded-lg text-left text-sm font-normal">
        <tr>
          {["Categoria", "Categoria Pai"].map((header) => (
            <th
              key={header}
              scope="col"
              // className="px-2 py-1.5 font-medium text-left"
              className="align-top px-3 py-2 text-sm font-semibold text-gray-700 uppercase tracking-wide bg-gray-100 border-b border-gray-300 text-left"
            >
              {header}
            </th>
          ))}

          <th scope="col" className="relative py-1.5 pl-2 pr-3">
            <span className="sr-only">Ações</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {categorias?.map((categoria) => (
          <tr
            key={categoria.id}
            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
          >
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
              <div className="flex items-center gap-3">
                <p>{categoria.nome}</p>
              </div>
            </td>

            <td className="whitespace-nowrap py-3 pl-6 pr-3">
              <div className="flex items-center gap-3">
                <p>{categoria.nomePai || categoria.parentId || "-"}</p>
              </div>
            </td>

            <td className="whitespace-nowrap py-1.5 pl-2 pr-3">
              <div className="flex justify-end gap-1">
                <ButtonLinkUpdate
                  href={{
                    pathname: `/dashboard/categorias/${categoria.id}/edit`,
                  }}
                />
                <ButtonLinkDelete id={categoria.id} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Componente principal
export default async function CategoriasTable({
  currentPage,
  queryCategoria,
}: CategoriasTableProps) {
  // Buscar dados de categorias
  const categoriasComNomePai = await fetchFilteredCategorias(
    currentPage,
    queryCategoria
  );

  if (!categoriasComNomePai || categoriasComNomePai.length === 0) {
    return (
      <p className="mt-6 text-center text-gray-500">
        Nenhuma categoria encontrada.
      </p>
    );
  }

  return (
    <div className="mt-4 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Layout para dispositivos móveis */}
          <div className="md:hidden">
            {categoriasComNomePai?.map((categoria) => (
              <MobileCategoriaRow key={categoria.id} categoria={categoria} />
            ))}
          </div>
          {/* Layout para desktop */}
          <DesktopCategoriasTable categorias={categoriasComNomePai} />
        </div>
      </div>
    </div>
  );
}
