'use client';

import { Card, CardContent } from '@/components/ui/card';
import { createInvestimento, InvestimentoFormState } from '@/lib/investimentos/actions';

import InvestmentForm from './form';

import { ClienteField } from '@/lib/clientes/definitions';
import { BancoField } from '@/lib/bancos/definitions';
import { AtivoField } from '@/lib/ativos/definitions';
import { SelectField, CurrencyField } from '@/app/ui/shared/form-fields';

// Interface para props do componente
interface FormProps {
  clientes: ClienteField[];
  bancos: BancoField[];
  ativos: AtivoField[];
}

// Formulário principal de criação do investimento
export default function Form({ clientes, bancos, ativos }: FormProps) {
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
        />
      </CardContent>
    </Card>
  );
}
