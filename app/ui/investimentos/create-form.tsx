'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  createInvestimento,
  InvestimentoFormState,
} from '@/modules/investimentos/actions/investimento-actions';

import InvestmentForm from './form';

import { ClienteField } from '@/lib/types/cliente';
import { BancoField } from '@/lib/types/banco';
import { AtivoField } from '@/modules/ativos/types/ativo';
import { SelectField, CurrencyField } from '@/components/shared/form-fields';

// Interface para props do componente
interface FormProps {
  clientes: ClienteField[];
  bancos: BancoField[];
  ativos: AtivoField[];
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Formulário principal de criação do investimento
export default function Form({ clientes, bancos, ativos, searchParams }: FormProps) {
  const initialState: InvestimentoFormState = { errors: {}, message: null };

  return (
    <Card>
      <CardContent>
        <InvestmentForm
          clientes={clientes}
          bancos={bancos}
          ativos={ativos}
          action={createInvestimento}
          initialState={initialState}
          buttonText='Cadastrar Investimento'
          searchParams={searchParams}
        />
      </CardContent>
    </Card>
  );
}
