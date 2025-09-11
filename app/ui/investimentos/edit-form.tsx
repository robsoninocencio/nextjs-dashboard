"use client";

import { InvestimentoForm } from "@/lib/investimentos/definitions";
import { ClienteField } from "@/lib/clientes/definitions";
import { BancoField } from "@/lib/bancos/definitions";
import { AtivoField } from "@/lib/ativos/definitions";

import {
  updateInvestimento,
  InvestimentoFormState,
} from "@/lib/investimentos/actions";
import { formatDateToMonth, formatDateToYear } from "@/lib/utils";
import { SelectField, CurrencyField } from "@/app/ui/shared/form-fields";

import InvestmentForm from "./form";

export default function EditInvestimentoForm({
  investimento,
  clientes,
  bancos,
  ativos,
  searchParams,
}: {
  investimento: InvestimentoForm;
  clientes: ClienteField[];
  bancos: BancoField[];
  ativos: AtivoField[];
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const initialState: InvestimentoFormState = { message: "", errors: {} };
  const updateInvestimentoWithId = updateInvestimento.bind(
    null,
    investimento.id
  );

  return (
    <InvestmentForm
      clientes={clientes}
      bancos={bancos}
      ativos={ativos}
      action={updateInvestimentoWithId}
      initialState={initialState}
      buttonText="Atualizar Investimento"
      investimento={investimento}
      searchParams={searchParams}
    />
  );
}
