'use client';

import { Card, CardContent } from '@/components/ui/card';
import { createInvestimento, InvestimentoFormState } from '@/lib/actions/investimento-actions';

import InvestmentForm from './form';

import { ClienteField } from '@/lib/types/cliente';
import { BancoField } from '@/lib/types/banco';
import { AtivoField } from '@/lib/types/ativo';
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
