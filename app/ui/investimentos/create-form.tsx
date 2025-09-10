"use client";

import Link from "next/link";
import { useActionState, useState, ChangeEvent } from "react";
import { useFormStatus } from "react-dom";
import {
  UserCircleIcon,
  CalendarIcon,
  CalendarDaysIcon,
  BuildingLibraryIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/shared/button";

import {
  createInvestimento,
  InvestimentoFormState,
} from "@/lib/investimentos/actions";

import { ClienteField } from "@/lib/clientes/definitions";
import { BancoField } from "@/lib/bancos/definitions";
import { AtivoField } from "@/lib/ativos/definitions";
import { SelectField, CurrencyField } from "@/app/ui/shared/form-fields";

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

// Formulário principal de criação do investimento
export default function Form({ clientes, bancos, ativos }: FormProps) {
  const initialState: InvestimentoFormState = { errors: {}, message: null };

  const [state, formAction] = useActionState(createInvestimento, initialState);
  const [isRendaVariavel, setIsRendaVariavel] = useState(false);
  const [isCdbAutomatico, setCdbAutomatico] = useState(false);

  // Função para atualizar isRendaVariavel com base no ativo selecionado
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
                defaultValue={state.submittedData?.ano}
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
                defaultValue={state.submittedData?.mes}
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
              defaultValue={state.submittedData?.clienteId}
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
              defaultValue={state.submittedData?.bancoId}
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
              defaultValue={state.submittedData?.ativoId}
              errors={state.errors?.ativoId}
              icon={BriefcaseIcon}
              onChange={handleAtivoChange}
            />
          </div>
        </div>

        {/* 3 Container flexivel para rendimentoDoMes e dividendosDoMes */}
        <div className="flex flex-col md:flex-row md:space-x-4 p-2 md:p-4">
          {/* 3.1 rendimentoDoMes */}
          {!isCdbAutomatico && (
            <div className="md:w-1/2">
              <CurrencyField
                id="rendimentoDoMes"
                label="Rendimento do Mês"
                placeholder="Entre com o valor exemplo (99,99)"
                defaultValue={state.submittedData?.rendimentoDoMes}
                errors={state.errors?.rendimentoDoMes}
              />
            </div>
          )}

          {/* 3.3 saldoAnterior */}
          <div className="md:w-1/2">
            <CurrencyField
              id="saldoAnterior"
              label="Saldo Anterior"
              placeholder="Entre com o saldo anterior (99,99)"
              defaultValue={state.submittedData?.saldoAnterior}
              errors={state.errors?.saldoAnterior}
            />
          </div>

          {/* 3.2 dividendosDoMes */}
          {isRendaVariavel && (
            <div className="md:w-1/2 sm:mt-4 md:mt-0">
              <CurrencyField
                id="dividendosDoMes"
                label="Dividendos do Mês"
                placeholder="Entre com o valor exemplo (99,99)"
                defaultValue={state.submittedData?.dividendosDoMes}
                errors={state.errors?.dividendosDoMes}
              />
            </div>
          )}
        </div>

        {/* 4 Container flexivel para valorAplicado e valorResgatado */}
        <div className="flex flex-col md:flex-row md:space-x-4 p-2 md:p-4">
          {/* 4.1 valorAplicado */}
          <div className="md:w-1/2">
            <CurrencyField
              id="valorAplicado"
              label="Valores Aplicados"
              placeholder="Entre com o valor exemplo (99,99)"
              defaultValue={state.submittedData?.valorAplicado}
              errors={state.errors?.valorAplicado}
            />
          </div>

          {/* 4.2 valorResgatado */}
          <div className="md:w-1/2 sm:mt-4 md:mt-0">
            <CurrencyField
              id="valorResgatado"
              label="Valores Resgatados"
              placeholder="Entre com o valor exemplo (99,99)"
              defaultValue={state.submittedData?.valorResgatado}
              errors={state.errors?.valorResgatado}
            />
          </div>
        </div>

        {/* 5 Contaniner flexivel para impostoIncorrido e impostoPrevisto */}
        <div className="flex flex-col md:flex-row md:space-x-4 p-2 md:p-4">
          {/* 5.1 impostoIncorrido */}
          <div className="md:w-1/2">
            <CurrencyField
              id="impostoIncorrido"
              label="Impostos Incorridos"
              placeholder="Entre com o valor exemplo (99,99)"
              defaultValue={state.submittedData?.impostoIncorrido}
              errors={state.errors?.impostoIncorrido}
            />
          </div>

          {/* 5.2 impostoPrevisto */}
          <div className="md:w-1/2 sm:mt-4 md:mt-0">
            <CurrencyField
              id="impostoPrevisto"
              label="Impostos Previstos"
              placeholder="Entre com o valor exemplo (99,99)"
              defaultValue={state.submittedData?.impostoPrevisto}
              errors={state.errors?.impostoPrevisto}
            />
          </div>
        </div>

        {/* 6 Container flexivel para saldoBruto e SaldoLiquido */}
        <div className="flex flex-col md:flex-row md:space-x-4 p-2 md:p-4">
          {/* 6.1 saldoBruto */}
          <div className="md:w-1/2">
            <CurrencyField
              id="saldoBruto"
              label="Saldo Bruto"
              placeholder="Entre com o valor exemplo (99,99)"
              defaultValue={state.submittedData?.saldoBruto}
              errors={state.errors?.saldoBruto}
            />
          </div>

          {/* 6.2 SaldoLiquido */}
          <div className="md:w-1/2 sm:mt-4 md:mt-0">
            <CurrencyField
              id="saldoLiquido"
              label="Saldo Líquido"
              placeholder="Entre com o valor exemplo (99,99)"
              defaultValue={state.submittedData?.saldoLiquido}
              errors={state.errors?.saldoLiquido}
            />
          </div>
        </div>

        {/* Mensagem de erro geral */}
        {state.message && (
          <div
            aria-live="polite"
            aria-atomic="true"
            className="p-2 md:p-4 text-sm text-red-700"
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
