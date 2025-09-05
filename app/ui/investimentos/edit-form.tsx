"use client";

import { useActionState, useState, ChangeEvent } from "react";
import Link from "next/link";
import {
  UserCircleIcon,
  CalendarIcon,
  CalendarDaysIcon,
  BuildingLibraryIcon,
  BriefcaseIcon,
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
import CustomCurrencyInput from "@/app/ui/shared/currency-input";
import { formatDateToMonth, formatDateToYear } from "@/lib/utils";

// Componente para erros
function InputError({ errors }: { errors?: string[] }) {
  if (!errors) return null;
  return (
    <>
      {errors.map((error) => (
        <p key={error} className="p-2 md:p-4 text-sm text-red-500">
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
  icon: Icon,
}: {
  id: string;
  label: string;
  options: { id: string; name: string }[];
  defaultValue?: string;
  errors?: string[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  icon: React.ElementType;
}) {
  return (
    <div>
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
          className={`peer block w-full cursor-pointer rounded-md border ${
            errors?.length ? "border-red-500" : "border-gray-200"
          } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
        >
          <option value="" disabled>
            Selecione o {label.toLowerCase()}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {id === "mes" ? `${option.id} - ${option.name}` : option.name}
            </option>
          ))}
        </select>
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
        <InputError errors={errors} />
      </div>
    </div>
  );
}

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

  // Encontra o ativo inicial para definir o estado dos campos condicionais
  const initialAtivo = ativos.find(
    (ativo) => ativo.id === investimento.ativoId
  );

  const [isRendaVariavel, setIsRendaVariavel] = useState(
    initialAtivo?.tipos?.nome === "RENDA VARIAVEL"
  );
  const [isCdbAutomatico, setCdbAutomatico] = useState(
    initialAtivo?.nome === "CDB AUTOMATICO"
  );

  // Função para atualizar o estado com base no ativo selecionado
  const handleAtivoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedAtivoId = e.target.value;
    const selectedAtivo = ativos.find((ativo) => ativo.id === selectedAtivoId);
    setIsRendaVariavel(selectedAtivo?.tipos?.nome === "RENDA VARIAVEL");
    setCdbAutomatico(selectedAtivo?.nome === "CDB AUTOMATICO");
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
      <div className="rounded-md bg-gray-50 p-2 md:p-4">
        {/* 1 Container flexível para Ano, Mês e Cliente */}
        <div className="flex flex-col md:flex-row md:space-x-4 p-2 md:p-4">
          {/* 1.1 Container para Ano e Mês */}
          <div className="flex space-x-4 md:w-1/2">
            {/* 1.1.1 Ano */}
            <div className="w-1/2">
              <SelectField
                id="ano"
                label="Ano"
                options={years}
                defaultValue={formatDateToYear(investimento.data)}
                errors={state.errors?.ano}
                icon={CalendarDaysIcon}
              />
            </div>
            {/* 1.1.2 Mês */}
            <div className="w-1/2">
              <SelectField
                id="mes"
                label="Mês"
                options={months}
                defaultValue={formatDateToMonth(investimento.data)}
                errors={state.errors?.mes}
                icon={CalendarIcon}
              />
            </div>
          </div>
          {/* 1.2 Cliente */}
          <div className="md:w-1/2 sm:mt-4 md:mt-0">
            <SelectField
              id="clienteId"
              label="Cliente"
              options={clientes}
              defaultValue={investimento.clienteId}
              errors={state.errors?.clienteId}
              icon={UserCircleIcon}
            />
          </div>
        </div>

        {/* 2 Container flexivel para Banco e Ativo */}
        <div className="flex flex-col md:flex-row md:space-x-4 p-2 md:p-4">
          {/* 2.1 Banco */}
          <div className="md:w-1/2">
            <SelectField
              id="bancoId"
              label="Banco"
              options={bancos.map((banco) => ({
                id: banco.id,
                name: banco.nome,
              }))}
              defaultValue={investimento.bancoId}
              errors={state.errors?.bancoId}
              icon={BuildingLibraryIcon}
            />
          </div>

          {/* 2.2 Ativo */}
          <div className="md:w-1/2 sm:mt-4 md:mt-0">
            <SelectField
              id="ativoId"
              label="Ativo"
              options={ativos.map((ativo) => ({
                id: ativo.id,
                name: `${ativo.nome}${
                  ativo.tipos ? ` (${ativo.tipos.nome})` : ""
                }`,
              }))}
              defaultValue={investimento.ativoId}
              errors={state.errors?.ativoId}
              icon={BriefcaseIcon}
              onChange={handleAtivoChange}
            />
          </div>
        </div>

        {/* 3 Container flexivel para rendimentoDoMes e dividendosDoMes */}
        <div className="flex flex-col md:flex-row md:space-x-4 p-2 md:p-4">
          {/* Investimento rendimentoDoMes */}
          {!isCdbAutomatico && (
            <div className="md:w-1/2">
              <label
                htmlFor="rendimentoDoMes"
                className="mb-2 block text-sm font-medium"
              >
                Rendimento do Mês
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative rounded-md">
                  <CustomCurrencyInput
                    id="rendimentoDoMes"
                    name="rendimentoDoMes"
                    placeholder="Entre com o valor exemplo (99,99)"
                    defaultValue={investimento.rendimentoDoMes}
                    aria-describedby="rendimentoDoMes-error"
                    hasError={!!state.errors?.rendimentoDoMes?.length}
                  />
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
            <div className="md:w-1/2 sm:mt-4 md:mt-0">
              <label
                htmlFor="dividendosDoMes"
                className="mb-2 block text-sm font-medium"
              >
                Dividendos do Mês
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative rounded-md">
                  <CustomCurrencyInput
                    id="dividendosDoMes"
                    name="dividendosDoMes"
                    placeholder="Entre com o valor exemplo (99,99)"
                    defaultValue={investimento.dividendosDoMes}
                    aria-describedby="dividendosDoMes-error"
                    hasError={!!state.errors?.dividendosDoMes?.length}
                  />
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
        </div>

        {/* 4 Container flexivel para valorAplicado e valorResgatado */}
        <div className="flex flex-col md:flex-row md:space-x-4 p-2 md:p-4">
          {/* Investimento valorAplicado */}
          <div className="md:w-1/2">
            <label
              htmlFor="valorAplicado"
              className="mb-2 block text-sm font-medium"
            >
              Valores Aplicados
            </label>
            <CustomCurrencyInput
              id="valorAplicado"
              name="valorAplicado"
              placeholder="Entre com o valor exemplo (99,99)"
              defaultValue={investimento.valorAplicado}
              aria-describedby="valorAplicado-error"
              hasError={!!state.errors?.valorAplicado?.length}
            />
            <div id="valorAplicado-error" aria-live="polite" aria-atomic="true">
              <InputError errors={state.errors?.valorAplicado} />
            </div>
          </div>

          {/* Investimento valorResgatado */}
          <div className="md:w-1/2 sm:mt-4 md:mt-0">
            <label
              htmlFor="valorResgatado"
              className="mb-2 block text-sm font-medium"
            >
              Valores Resgatados
            </label>
            <CustomCurrencyInput
              id="valorResgatado"
              name="valorResgatado"
              placeholder="Entre com o valor exemplo (99,99)"
              defaultValue={investimento.valorResgatado}
              aria-describedby="valorResgatado-error"
              hasError={!!state.errors?.valorResgatado?.length}
            />
            <div
              id="valorResgatado-error"
              aria-live="polite"
              aria-atomic="true"
            >
              <InputError errors={state.errors?.valorResgatado} />
            </div>
          </div>
        </div>

        {/* 5 Contaniner flexivel para impostoIncorrido e impostoPrevisto */}
        <div className="flex flex-col md:flex-row md:space-x-4 p-2 md:p-4">
          {/* Investimento impostoIncorrido */}
          <div className="md:w-1/2">
            <label
              htmlFor="impostoIncorrido"
              className="mb-2 block text-sm font-medium"
            >
              Impostos Incorridos
            </label>
            <CustomCurrencyInput
              id="impostoIncorrido"
              name="impostoIncorrido"
              placeholder="Entre com o valor exemplo (99,99)"
              defaultValue={investimento.impostoIncorrido}
              aria-describedby="impostoIncorrido-error"
              hasError={!!state.errors?.impostoIncorrido?.length}
            />
            <div
              id="impostoIncorrido-error"
              aria-live="polite"
              aria-atomic="true"
            >
              <InputError errors={state.errors?.impostoIncorrido} />
            </div>
          </div>

          {/* Investimento impostoPrevisto */}
          <div className="md:w-1/2 sm:mt-4 md:mt-0">
            <label
              htmlFor="impostoPrevisto"
              className="mb-2 block text-sm font-medium"
            >
              Impostos Previstos
            </label>
            <CustomCurrencyInput
              id="impostoPrevisto"
              name="impostoPrevisto"
              placeholder="Entre com o valor exemplo (99,99)"
              defaultValue={investimento.impostoPrevisto}
              aria-describedby="impostoPrevisto-error"
              hasError={!!state.errors?.impostoPrevisto?.length}
            />
            <div
              id="impostoPrevisto-error"
              aria-live="polite"
              aria-atomic="true"
            >
              <InputError errors={state.errors?.impostoPrevisto} />
            </div>
          </div>
        </div>

        {/* 6 Container flexivel para saldoBruto e SaldoLiquido */}
        <div className="flex flex-col md:flex-row md:space-x-4 p-2 md:p-4">
          {/* Investimento saldoBruto */}
          <div className="md:w-1/2">
            <label
              htmlFor="saldoBruto"
              className="mb-2 block text-sm font-medium"
            >
              Saldo Bruto
            </label>
            <CustomCurrencyInput
              id="saldoBruto"
              name="saldoBruto"
              placeholder="Entre com o valor exemplo (99,99)"
              defaultValue={investimento.saldoBruto}
              aria-describedby="saldoBruto-error"
              hasError={!!state.errors?.saldoBruto?.length}
            />
            <div id="saldoBruto-error" aria-live="polite" aria-atomic="true">
              <InputError errors={state.errors?.saldoBruto} />
            </div>
          </div>

          {/* 6.2 SaldoLiquido */}
          {/* Investimento saldoLiquido */}
          <div className="md:w-1/2 sm:mt-4 md:mt-0">
            <label
              htmlFor="saldoLiquido"
              className="mb-2 block text-sm font-medium"
            >
              Saldo Líquido
            </label>
            <CustomCurrencyInput
              id="saldoLiquido"
              name="saldoLiquido"
              placeholder="Entre com o valor exemplo (99,99)"
              defaultValue={investimento.saldoLiquido}
              aria-describedby="saldoLiquido-error"
              hasError={!!state.errors?.saldoLiquido?.length}
            />
            <div id="saldoLiquido-error" aria-live="polite" aria-atomic="true">
              <InputError errors={state.errors?.saldoLiquido} />
            </div>
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
