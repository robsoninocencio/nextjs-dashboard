"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import { Button } from "@/app/ui/shared/button";

import { InvestimentoForm } from "@/lib/investimentos/definitions";

import { ClienteField } from "@/lib/clientes/definitions";
import { BancoField } from "@/lib/bancos/definitions";
import { AtivoField } from "@/lib/ativos/definitions";

// import { updateInvestimento, State } from "@/app/lib/investimentos/actions";
import {
  updateInvestimento,
  InvestimentoFormState,
} from "@/lib/investimentos/actions";
import { formatDateToMonth, formatDateToYear } from "@/lib/utils";

export default function EditInvestimentoForm({
  investimento,
  clientes,
  bancos,
  ativos,
}: {
  investimento: InvestimentoForm;
  clientes: ClienteField[];
  bancos: BancoField[];
  ativos: AtivoField[];
}) {
  const initialState: InvestimentoFormState = { message: "", errors: {} };
  const updateInvestimentoWithId = updateInvestimento.bind(
    null,
    investimento.id
  );
  const [state, formAction] = useActionState(
    updateInvestimentoWithId,
    initialState
  );

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Investimento Ano */}
        <div className="mb-4">
          <label htmlFor="ano" className="mb-2 block text-sm font-medium">
            Ano
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="ano"
                name="ano"
                type="ano"
                defaultValue={formatDateToYear(investimento.data)}
                placeholder="Digite o ano"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="ano-error"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div id="ano-error" aria-live="polite" aria-atomic="true">
            {state.errors?.ano &&
              state.errors.ano.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Investimento Mês */}
        <div className="mb-4">
          <label htmlFor="mes" className="mb-2 block text-sm font-medium">
            Mes
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="mes"
                name="mes"
                type="mes"
                defaultValue={formatDateToMonth(investimento.data)}
                placeholder="Digite o mes"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="mes-error"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div id="mes-error" aria-live="polite" aria-atomic="true">
            {state.errors?.mes &&
              state.errors.mes.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Cliente Nome */}
        <div className="mb-4">
          <label htmlFor="clienteId" className="mb-2 block text-sm font-medium">
            Nome do Cliente
          </label>
          <div className="relative">
            <select
              id="clienteId"
              name="clienteId"
              defaultValue={investimento.clienteId}
              aria-describedby="clienteId-error"
              className={`peer block w-full cursor-pointer rounded-md border ${
                state.errors?.clienteId?.length
                  ? "border-red-500"
                  : "border-gray-200"
              } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
            >
              <option value="" disabled>
                Selecione um cliente
              </option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="clienteId-error" aria-live="polite" aria-atomic="true">
            {state.errors?.clienteId &&
              state.errors.clienteId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Banco Nome */}
        <div className="mb-4">
          <label htmlFor="bancoId" className="mb-2 block text-sm font-medium">
            Nome do Banco
          </label>
          <div className="relative">
            <select
              id="bancoId"
              name="bancoId"
              defaultValue={investimento.bancoId}
              aria-describedby="bancoId-error"
              className={`peer block w-full cursor-pointer rounded-md border ${
                state.errors?.bancoId?.length
                  ? "border-red-500"
                  : "border-gray-200"
              } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
            >
              <option value="" disabled>
                Selecione um banco
              </option>
              {bancos.map((banco) => (
                <option key={banco.id} value={banco.id}>
                  {banco.nome}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="bancoId-error" aria-live="polite" aria-atomic="true">
            {state.errors?.bancoId &&
              state.errors.bancoId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Ativo Nome */}
        <div className="mb-4">
          <label htmlFor="ativoId" className="mb-2 block text-sm font-medium">
            Nome do Ativo
          </label>
          <div className="relative">
            <select
              id="ativoId"
              name="ativoId"
              defaultValue={investimento.ativoId}
              aria-describedby="ativoId-error"
              className={`peer block w-full cursor-pointer rounded-md border ${
                state.errors?.ativoId?.length
                  ? "border-red-500"
                  : "border-gray-200"
              } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
            >
              <option value="" disabled>
                Selecione um Ativo
              </option>
              {ativos.map((ativo) => (
                <option key={ativo.id} value={ativo.id}>
                  {ativo.nome}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="ativoId-error" aria-live="polite" aria-atomic="true">
            {state.errors?.ativoId &&
              state.errors.ativoId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Investimento rendimentoDoMes */}
        <div className="mb-4">
          <label
            htmlFor="rendimentoDoMes"
            className="mb-2 block text-sm font-medium"
          >
            Rendimento do Mês
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="rendimentoDoMes"
                name="rendimentoDoMes"
                type="number"
                defaultValue={String(investimento.rendimentoDoMes)}
                step="0.01"
                placeholder="Entre com o valor exemplo (99,99)"
                className={`peer block w-full rounded-md border ${
                  state.errors?.rendimentoDoMes?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                aria-describedby="rendimentoDoMes-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="rendimentoDoMes-error" aria-live="polite" aria-atomic="true">
            {state.errors?.rendimentoDoMes &&
              state.errors.rendimentoDoMes.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Investimento valorAplicado */}
        <div className="mb-4">
          <label
            htmlFor="valorAplicado"
            className="mb-2 block text-sm font-medium"
          >
            Valores Aplicados
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="valorAplicado"
                name="valorAplicado"
                type="number"
                defaultValue={String(investimento.valorAplicado)}
                step="0.01"
                placeholder="Entre com o valor exemplo (99,99)"
                className={`peer block w-full rounded-md border ${
                  state.errors?.valorAplicado?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                aria-describedby="valorAplicado-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="valorAplicado-error" aria-live="polite" aria-atomic="true">
            {state.errors?.valorAplicado &&
              state.errors.valorAplicado.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Investimento saldoBruto */}
        <div className="mb-4">
          <label
            htmlFor="saldoBruto"
            className="mb-2 block text-sm font-medium"
          >
            Saldo Bruto
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="saldoBruto"
                name="saldoBruto"
                type="number"
                defaultValue={String(investimento.saldoBruto)}
                step="0.01"
                placeholder="Entre com o valor exemplo (99,99)"
                className={`peer block w-full rounded-md border ${
                  state.errors?.saldoBruto?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                aria-describedby="saldoBruto-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="saldoBruto-error" aria-live="polite" aria-atomic="true">
            {state.errors?.saldoBruto &&
              state.errors.saldoBruto.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Investimento valorResgatado */}
        <div className="mb-4">
          <label
            htmlFor="valorResgatado"
            className="mb-2 block text-sm font-medium"
          >
            Valores Resgatados
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="valorResgatado"
                name="valorResgatado"
                type="number"
                defaultValue={String(investimento.valorResgatado)}
                step="0.01"
                placeholder="Entre com o valor exemplo (99,99)"
                className={`peer block w-full rounded-md border ${
                  state.errors?.valorResgatado?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                aria-describedby="valorResgatado-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="valorResgatado-error" aria-live="polite" aria-atomic="true">
            {state.errors?.valorResgatado &&
              state.errors.valorResgatado.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Investimento impostoIncorrido */}
        <div className="mb-4">
          <label
            htmlFor="impostoIncorrido"
            className="mb-2 block text-sm font-medium"
          >
            Impostos Incorridos
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="impostoIncorrido"
                name="impostoIncorrido"
                type="number"
                defaultValue={String(investimento.impostoIncorrido)}
                step="0.01"
                placeholder="Entre com o valor exemplo (99,99)"
                className={`peer block w-full rounded-md border ${
                  state.errors?.impostoIncorrido?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                aria-describedby="impostoIncorrido-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div
            id="impostoIncorrido-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.impostoIncorrido &&
              state.errors.impostoIncorrido.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Investimento impostoPrevisto */}
        <div className="mb-4">
          <label
            htmlFor="impostoPrevisto"
            className="mb-2 block text-sm font-medium"
          >
            Impostos Previstos
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="impostoPrevisto"
                name="impostoPrevisto"
                type="number"
                defaultValue={String(investimento.impostoPrevisto)}
                step="0.01"
                placeholder="Entre com o valor exemplo (99,99)"
                className={`peer block w-full rounded-md border ${
                  state.errors?.impostoPrevisto?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                aria-describedby="impostoPrevisto-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="impostoPrevisto-error" aria-live="polite" aria-atomic="true">
            {state.errors?.impostoPrevisto &&
              state.errors.impostoPrevisto.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Investimento saldoLiquido */}
        <div className="mb-4">
          <label
            htmlFor="saldoLiquido"
            className="mb-2 block text-sm font-medium"
          >
            Saldo Líquido
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="saldoLiquido"
                name="saldoLiquido"
                type="number"
                defaultValue={String(investimento.saldoLiquido)}
                step="0.01"
                placeholder="Entre com o valor exemplo (99,99)"
                className={`peer block w-full rounded-md border ${
                  state.errors?.saldoLiquido?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                aria-describedby="saldoLiquido-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="saldoLiquido-error" aria-live="polite" aria-atomic="true">
            {state.errors?.saldoLiquido &&
              state.errors.saldoLiquido.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="my-6 text-sm text-red-700">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/investimentos"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Atualizar Investimento</Button>
      </div>
    </form>
  );
}
