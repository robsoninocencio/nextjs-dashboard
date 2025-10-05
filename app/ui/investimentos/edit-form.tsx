'use client';

import { Card, CardContent } from '@/components/ui/card';
import { InvestimentoForm } from '@/modules/investimentos/types/investimento';
import { ClienteField } from '@/lib/types/cliente';
import { BancoField } from '@/lib/types/banco';
import { AtivoField } from '@/modules/ativos/types/ativo';

import {
  updateInvestimento,
  InvestimentoFormState,
} from '@/modules/investimentos/actions/investimento-actions';
import { formatDateToMonth, formatDateToYear } from '@/lib/utils';
import { SelectField, CurrencyField } from '@/components/shared/form-fields';

import InvestmentForm from './form';

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
  const initialState: InvestimentoFormState = { message: '', errors: {} };
  const updateInvestimentoWithId = updateInvestimento.bind(null, investimento.id);

  return (
    <Card>
      <CardContent>
        <InvestmentForm
          clientes={clientes}
          bancos={bancos}
          ativos={ativos}
          action={updateInvestimentoWithId}
          initialState={initialState}
          buttonText='Atualizar Investimento'
          investimento={investimento}
          searchParams={searchParams}
        />
      </CardContent>
    </Card>
  );
}
