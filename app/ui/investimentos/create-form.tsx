"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/shared/button";

import {
  createInvestimento,
  InvestimentoFormState,
} from "@/lib/investimentos/actions";

import { ClienteField } from "@/lib/clientes/definitions";
import { BancoField } from "@/lib/bancos/definitions";
import { AtivoField } from "@/lib/ativos/definitions";

// Interface para props do componente
interface FormProps {
  clientes: ClienteField[];
  bancos: BancoField[];
  ativos: AtivoField[];
}

// Botão com estado pendente (loading)
function SubmitInvestimentoButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? "Cadastrando Investimento..." : "Cadastrar Investimento"}
    </Button>
  );
}

// Componente para erros
function InputError({ errors }: { errors?: string[] }) {
  if (!errors) return null;
  return (
    <>
      {errors.map((error) => (
        <p key={error} className="mt-2 text-sm text-red-500">
          {error}
        </p>
      ))}
    </>
  );
}

// Componente para selects
function SelectField({
  id,
  label,
  options,
  defaultValue,
  errors,
  onChange,
}: {
  id: string;
  label: string;
  options: { id: string; name: string }[];
  defaultValue?: string;
  errors?: string[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-2 rounded-md">
        <select
          id={id}
          name={id}
          defaultValue={defaultValue ?? ""}
          required
          aria-describedby={`${id}-error`}
          onChange={onChange}
          className={`peer block w-full rounded-md border ${
            errors?.length ? "border-red-500" : "border-gray-200"
          } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
        >
          <option value="" disabled>
            Selecione {label.toLowerCase()}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
        <InputError errors={errors} />
      </div>
    </div>
  );
}

// Formulário principal de criação de fatura
export default function Form({ clientes, bancos, ativos }: FormProps) {
  const initialState: InvestimentoFormState = {
    errors: {},
    message: "",
    submittedData: {},
  };

  // console.log("ativos3:", ativos);

  const [state, formAction] = useActionState(createInvestimento, initialState);
  const [isRendaVariavel, setIsRendaVariavel] = useState(false);
  const [isCdbAutomatico, setCdbAutomatico] = useState(false);

  // Função para atualizar isRendaVariavel com base no ativo selecionado
  const handleAtivoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAtivoId = e.target.value;
    const selectedAtivo = ativos.find((ativo) => ativo.id === selectedAtivoId);
    setIsRendaVariavel(selectedAtivo?.tipos?.nome === "Renda Variável");
    setCdbAutomatico(selectedAtivo?.nome === "CDB Automático");
  };

  // Opções para ano e mês (1 a 12)
  const years = Array.from({ length: 15 }, (_, i) => ({
    id: (2025 - i).toString(),
    name: (2025 - i).toString(),
  }));
  const months = [
    { id: "01", name: "Janeiro" },
    { id: "02", name: "Fevereiro" },
    { id: "03", name: "Março" },
    { id: "04", name: "Abril" },
    { id: "05", name: "Maio" },
    { id: "06", name: "Junho" },
    { id: "07", name: "Julho" },
    { id: "08", name: "Agosto" },
    { id: "09", name: "Setembro" },
    { id: "10", name: "Outubro" },
    { id: "11", name: "Novembro" },
    { id: "12", name: "Dezembro" },
  ];

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Container flexível para Ano, Mês e Nome do Cliente */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Container para Ano e Mês */}
          <div className="flex space-x-4 mb-4 md:mb-0 md:w-1/2">
            {/* Ano */}
            <div className="w-1/2">
              <SelectField
                id="ano"
                label="Ano"
                options={years}
                defaultValue={state.submittedData?.ano?.toString()}
                errors={state.errors?.ano}
              />
            </div>
            {/* Mês */}
            <div className="w-1/2">
              <SelectField
                id="mes"
                label="Mês"
                options={months}
                defaultValue={state.submittedData?.mes?.toString()}
                errors={state.errors?.mes}
              />
            </div>
          </div>

          {/* Container para Nome do Cliente */}
          <div className="md:w-1/2">
            <div className="mb-4">
              <label
                htmlFor="clienteId"
                className="mb-2 block text-sm font-medium"
              >
                Nome do Cliente
              </label>
              <div className="relative">
                <select
                  id="clienteId"
                  name="clienteId"
                  defaultValue={state.submittedData?.clienteId ?? ""}
                  required
                  aria-describedby="clienteId-error"
                  className={`peer block w-full cursor-pointer rounded-md border ${
                    state.errors?.clienteId?.length
                      ? "border-red-500"
                      : "border-gray-200"
                  } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                >
                  <option value="" disabled>
                    Selecione o cliente
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
                <InputError errors={state.errors?.clienteId} />
              </div>
            </div>
          </div>
        </div>

        {/* Banco Nome e Ativo Nome agrupados para layout responsivo */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Banco Nome */}
          <div className="mb-4 md:mb-0 md:w-1/2">
            <label htmlFor="bancoId" className="mb-2 block text-sm font-medium">
              Nome do Banco
            </label>
            <div className="relative">
              <select
                id="bancoId"
                name="bancoId"
                defaultValue={state.submittedData?.bancoId ?? ""}
                required
                aria-describedby="bancoId-error"
                className={`peer block w-full cursor-pointer rounded-md border ${
                  state.errors?.bancoId?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              >
                <option value="" disabled>
                  Selecione o banco
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
              <InputError errors={state.errors?.bancoId} />
            </div>
          </div>

          {/* Ativo Nome */}
          <div className="mb-4 md:mb-0 md:w-1/2">
            <label htmlFor="ativoId" className="mb-2 block text-sm font-medium">
              Nome do Ativo
            </label>
            <div className="relative">
              <select
                id="ativoId"
                name="ativoId"
                defaultValue={state.submittedData?.ativoId ?? ""}
                required
                aria-describedby="ativoId-error"
                onChange={handleAtivoChange}
                className={`peer block w-full cursor-pointer rounded-md border ${
                  state.errors?.ativoId?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              >
                <option value="" disabled>
                  Selecione o ativo
                </option>
                {ativos.map((ativo) => (
                  <option key={ativo.id} value={ativo.id}>
                    {ativo.nome}
                    {ativo.tipos ? ` (${ativo.tipos.nome})` : ""}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="ativoId-error" aria-live="polite" aria-atomic="true">
              <InputError errors={state.errors?.ativoId} />
            </div>
          </div>
        </div>

        {/* Investimento rendimentoDoMes */}

        {!isCdbAutomatico && (
          <div className="mt-4 mb-4">
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
                  step="0.01"
                  placeholder="Entre com o valor exemplo (99,99)"
                  defaultValue={state.submittedData?.rendimentoDoMes}
                  aria-describedby="rendimentoDoMes-error"
                  className={`peer block w-full rounded-md border ${
                    state.errors?.rendimentoDoMes?.length
                      ? "border-red-500"
                      : "border-gray-200"
                  } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>

            <div
              id="rendimentoDoMes-error"
              aria-live="polite"
              aria-atomic="true"
            >
              <InputError errors={state.errors?.rendimentoDoMes} />
            </div>
          </div>
        )}

        {/* Investimento dividendosDoMes */}
        {isRendaVariavel && (
          <div className="mt-4 mb-4">
            <label
              htmlFor="dividendosDoMes"
              className="mb-2 block text-sm font-medium"
            >
              Dividendos do Mês
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="dividendosDoMes"
                  name="dividendosDoMes"
                  type="number"
                  step="0.01"
                  placeholder="Entre com o valor exemplo (99,99)"
                  defaultValue={state.submittedData?.dividendosDoMes}
                  aria-describedby="dividendosDoMes-error"
                  className={`peer block w-full rounded-md border ${
                    state.errors?.dividendosDoMes?.length
                      ? "border-red-500"
                      : "border-gray-200"
                  } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>

            <div
              id="dividendosDoMes-error"
              aria-live="polite"
              aria-atomic="true"
            >
              <InputError errors={state.errors?.dividendosDoMes} />
            </div>
          </div>
        )}

        {/* Investimento valorAplicado */}
        <div className="mt-4 mb-4">
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
                step="0.01"
                placeholder="Entre com o valor exemplo (99,99)"
                defaultValue={state.submittedData?.valorAplicado}
                aria-describedby="valorAplicado-error"
                className={`peer block w-full rounded-md border ${
                  state.errors?.valorAplicado?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="valorAplicado-error" aria-live="polite" aria-atomic="true">
            <InputError errors={state.errors?.valorAplicado} />
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
                step="0.01"
                placeholder="Entre com o valor exemplo (99,99)"
                defaultValue={state.submittedData?.saldoBruto}
                aria-describedby="saldoBruto-error"
                className={`peer block w-full rounded-md border ${
                  state.errors?.saldoBruto?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="saldoBruto-error" aria-live="polite" aria-atomic="true">
            <InputError errors={state.errors?.saldoBruto} />
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
                step="0.01"
                placeholder="Entre com o valor exemplo (99,99)"
                defaultValue={state.submittedData?.valorResgatado}
                aria-describedby="valorResgatado-error"
                className={`peer block w-full rounded-md border ${
                  state.errors?.valorResgatado?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="valorResgatado-error" aria-live="polite" aria-atomic="true">
            <InputError errors={state.errors?.valorResgatado} />
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
                step="0.01"
                placeholder="Entre com o valor exemplo (99,99)"
                defaultValue={state.submittedData?.impostoIncorrido}
                aria-describedby="impostoIncorrido-error"
                className={`peer block w-full rounded-md border ${
                  state.errors?.impostoIncorrido?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div
            id="impostoIncorrido-error"
            aria-live="polite"
            aria-atomic="true"
          >
            <InputError errors={state.errors?.impostoIncorrido} />
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
                step="0.01"
                placeholder="Entre com o valor exemplo (99,99)"
                defaultValue={state.submittedData?.impostoPrevisto}
                aria-describedby="impostoPrevisto-error"
                className={`peer block w-full rounded-md border ${
                  state.errors?.impostoPrevisto?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="impostoPrevisto-error" aria-live="polite" aria-atomic="true">
            <InputError errors={state.errors?.impostoPrevisto} />
          </div>
        </div>

        {/* Investimento SaldoLiquido */}
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
                step="0.01"
                placeholder="Entre com o valor exemplo (99,99)"
                defaultValue={state.submittedData?.saldoLiquido}
                aria-describedby="saldoLiquido-error"
                className={`peer block w-full rounded-md border ${
                  state.errors?.saldoLiquido?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="saldoLiquido-error" aria-live="polite" aria-atomic="true">
            <InputError errors={state.errors?.saldoLiquido} />
          </div>
        </div>

        {/* Mensagem de erro geral */}
        {state.message && (
          <div
            aria-live="polite"
            aria-atomic="true"
            className="mt-6 text-sm text-red-700"
          >
            {state.message}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/investimentos"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <SubmitInvestimentoButton />
      </div>
    </form>
  );
}
