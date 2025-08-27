"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  TagIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import { Button } from "@/app/ui/shared/button";

import { Ativo, AtivoForm } from "@/lib/ativos/definitions";
import { TipoField } from "@/lib/tipos/definitions";
import { CategoriaField } from "@/lib/categorias/definitions";

// import { updateAtivo, State } from "@/app/lib/ativos/actions";
import { updateAtivo, AtivoFormState } from "@/lib/ativos/actions";

export default function EditAtivoForm({
  ativo,
  tipos,
  categorias,
}: {
  ativo: Ativo;
  tipos: TipoField[];
  categorias: CategoriaField[];
}) {
  const initialState: AtivoFormState = { message: "", errors: {} };
  const updateAtivoWithId = updateAtivo.bind(null, ativo.id);
  const [state, formAction] = useActionState(updateAtivoWithId, initialState);

  // Garantir que ativo.tipoId não seja null ou undefined para defaultValue
  const tipoIdValue = ativo.tipoId ?? "";
  // @ts-ignore - Supondo que 'ativo' venha com as categorias relacionadas do banco
  const categoriaIdsValue =
    ativo.ativo_categorias?.map((ac) => ac.categoriaId) ?? [];

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Ativo Name */}
        <div className="mb-4">
          <label htmlFor="nome" className="mb-2 block text-sm font-medium">
            Ativo
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="nome"
                name="nome"
                type="text"
                defaultValue={ativo.nome}
                placeholder="Digite o nome do ativo"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="nome-error"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div id="nome-error" aria-live="polite" aria-atomic="true">
            {state.errors?.nome &&
              state.errors.nome.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Tipo Nome */}
        <div className="mb-4">
          <label htmlFor="tipo" className="mb-2 block text-sm font-medium">
            Escolha o tipo
          </label>
          <div className="relative">
            <select
              id="tipo"
              name="tipoId"
              className={`peer block w-full cursor-pointer rounded-md border ${
                state.errors?.tipoId?.length
                  ? "border-red-500"
                  : "border-gray-200"
              } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              defaultValue={tipoIdValue}
              aria-describedby="tipoId-error"
            >
              <option value="" disabled>
                Select a tipo
              </option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="tipoId-error" aria-live="polite" aria-atomic="true">
            {state.errors?.tipoId &&
              state.errors.tipoId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Categoria Nome */}
        <div className="mb-4">
          <label
            htmlFor="categoriaIds"
            className="mb-2 block text-sm font-medium"
          >
            Categorias
          </label>
          <div className="relative">
            <select
              id="categoriaIds"
              name="categoriaIds"
              multiple
              defaultValue={categoriaIdsValue}
              aria-describedby="categoriaIds-error"
              className={`peer block w-full cursor-pointer rounded-md border ${
                state.errors?.categoriaIds?.length
                  ? "border-red-500"
                  : "border-gray-200"
              } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 h-32`}
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-gray-500" />
          </div>
          <div id="categoriaIds-error" aria-live="polite" aria-atomic="true">
            {state.errors?.categoriaIds &&
              state.errors.categoriaIds.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Mensagens Geral de Erro */}
        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="my-6 text-sm text-red-700">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/ativos"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Atualizar Ativo</Button>
      </div>
    </form>
  );
}
