'use client';

import { useActionState, useState, ChangeEvent } from 'react';
import Link from 'next/link';
import {
  UserCircleIcon,
  CalendarIcon,
  CalendarDaysIcon,
  BuildingLibraryIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/components/ui/button';
import { SelectField, CurrencyField } from '@/components/shared/form-fields';

import type { InvestimentoForm, ClienteField, BancoField, AtivoField } from '@/types';
import { InvestimentoFormState } from '@/lib/actions/investimentos';
import { formatDateToMonth, formatDateToYear } from '@/lib/utils';
import { Decimal } from '@prisma/client/runtime/library';

// Helper function to convert Decimal to number
const toNumber = (value: string | number | Decimal | undefined): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  return value.toNumber();
};

type InvestmentFormProps = {
  clientes: ClienteField[];
  bancos: BancoField[];
  ativos: AtivoField[];
  action: (prevState: InvestimentoFormState, formData: FormData) => Promise<InvestimentoFormState>;
  initialState: InvestimentoFormState;
  buttonText: string;
  investimento?: InvestimentoForm;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function InvestmentForm({
  clientes,
  bancos,
  ativos,
  action,
  initialState,
  buttonText,
  investimento,
  searchParams,
}: InvestmentFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  const initialAtivo = ativos.find(ativo => ativo.id === (investimento?.ativoId ?? ''));

  const [isRendaVariavel, setIsRendaVariavel] = useState(
    initialAtivo?.tipos?.nome === 'RENDA VARIAVEL'
  );
  const [isCdbAutomatico, setCdbAutomatico] = useState(initialAtivo?.nome === 'CDB AUTOMATICO');

  const handleAtivoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedAtivoId = e.target.value;
    const selectedAtivo = ativos.find(ativo => ativo.id === selectedAtivoId);
    setIsRendaVariavel(selectedAtivo?.tipos?.nome === 'RENDA VARIAVEL');
    setCdbAutomatico(selectedAtivo?.nome === 'CDB AUTOMATICO');
  };

  const years = Array.from({ length: 15 }, (_, i) => ({
    id: (new Date().getFullYear() + 1 - i).toString(),
    name: (new Date().getFullYear() + 1 - i).toString(),
  }));

  const months = [
    { id: '01', name: 'Janeiro' },
    { id: '02', name: 'Fevereiro' },
    { id: '03', name: 'Março' },
    { id: '04', name: 'Abril' },
    { id: '05', name: 'Maio' },
    { id: '06', name: 'Junho' },
    { id: '07', name: 'Julho' },
    { id: '08', name: 'Agosto' },
    { id: '09', name: 'Setembro' },
    { id: '10', name: 'Outubro' },
    { id: '11', name: 'Novembro' },
    { id: '12', name: 'Dezembro' },
  ];

  return (
    <form action={formAction}>
      {/* Hidden inputs to preserve search params on redirect */}
      {searchParams && (
        <input type='hidden' name='searchParams' value={JSON.stringify(searchParams)} />
      )}
      <div className='flex flex-col md:flex-row md:space-x-4 p-2 md:p-4'>
        <div className='flex space-x-4 md:w-1/2'>
          <div className='w-1/2'>
            <SelectField
              id='ano'
              label='Ano'
              options={years}
              defaultValue={
                state.submittedData?.ano ??
                (investimento ? formatDateToYear(investimento.data) : '')
              }
              errors={state.errors?.ano}
              icon={CalendarDaysIcon}
            />
          </div>
          <div className='w-1/2'>
            <SelectField
              id='mes'
              label='Mês'
              options={months}
              defaultValue={
                state.submittedData?.mes ??
                (investimento ? formatDateToMonth(investimento.data) : '')
              }
              errors={state.errors?.mes}
              icon={CalendarIcon}
            />
          </div>
        </div>
        <div className='md:w-1/2 sm:mt-4 md:mt-0'>
          <SelectField
            id='clienteId'
            label='Cliente'
            options={clientes}
            defaultValue={state.submittedData?.clienteId ?? investimento?.clienteId}
            errors={state.errors?.clienteId}
            icon={UserCircleIcon}
          />
        </div>
      </div>

      <div className='flex flex-col md:flex-row md:space-x-4 p-2 md:p-4'>
        <div className='md:w-1/2'>
          <SelectField
            id='bancoId'
            label='Banco'
            options={bancos.map(banco => ({
              id: banco.id,
              name: banco.nome,
            }))}
            defaultValue={state.submittedData?.bancoId ?? investimento?.bancoId}
            errors={state.errors?.bancoId}
            icon={BuildingLibraryIcon}
          />
        </div>
        <div className='md:w-1/2 sm:mt-4 md:mt-0'>
          <SelectField
            id='ativoId'
            label='Ativo'
            options={ativos.map(ativo => ({
              id: ativo.id,
              name: `${ativo.nome}${ativo.tipos ? ` (${ativo.tipos.nome})` : ''}`,
            }))}
            defaultValue={state.submittedData?.ativoId ?? investimento?.ativoId}
            errors={state.errors?.ativoId}
            icon={BriefcaseIcon}
            onChange={handleAtivoChange}
          />
        </div>
      </div>

      <div className='flex flex-col md:flex-row md:space-x-4 p-2 md:p-4'>
        {!isCdbAutomatico && (
          <div className='md:w-1/2'>
            <CurrencyField
              id='rendimentoDoMes'
              label='Rendimento do Mês'
              placeholder='Entre com o valor exemplo (99,99)'
              defaultValue={toNumber(
                state.submittedData?.rendimentoDoMes ?? investimento?.rendimentoDoMes
              )}
              errors={state.errors?.rendimentoDoMes}
            />
          </div>
        )}
        <div className='md:w-1/2'>
          <CurrencyField
            id='saldoAnterior'
            label='Saldo Anterior'
            placeholder='Entre com o saldo anterior (99,99)'
            defaultValue={toNumber(
              state.submittedData?.['saldoAnterior'] ?? investimento?.saldoAnterior
            )}
            errors={state.errors?.['saldoAnterior']}
          />
        </div>
        {isRendaVariavel && (
          <div className='md:w-1/2 sm:mt-4 md:mt-0'>
            <CurrencyField
              id='dividendosDoMes'
              label='Dividendos do Mês'
              placeholder='Entre com o valor exemplo (99,99)'
              defaultValue={toNumber(
                state.submittedData?.dividendosDoMes ?? investimento?.dividendosDoMes
              )}
              errors={state.errors?.dividendosDoMes}
            />
          </div>
        )}
      </div>

      <div className='flex flex-col md:flex-row md:space-x-4 p-2 md:p-4'>
        <div className='md:w-1/2'>
          <CurrencyField
            id='valorAplicado'
            label='Valores Aplicados'
            placeholder='Entre com o valor exemplo (99,99)'
            defaultValue={toNumber(
              state.submittedData?.valorAplicado ?? investimento?.valorAplicado
            )}
            errors={state.errors?.valorAplicado}
          />
        </div>
        <div className='md:w-1/2 sm:mt-4 md:mt-0'>
          <CurrencyField
            id='valorResgatado'
            label='Valores Resgatados'
            placeholder='Entre com o valor exemplo (99,99)'
            defaultValue={toNumber(
              state.submittedData?.valorResgatado ?? investimento?.valorResgatado
            )}
            errors={state.errors?.valorResgatado}
          />
        </div>
      </div>

      <div className='flex flex-col md:flex-row md:space-x-4 p-2 md:p-4'>
        <div className='md:w-1/2'>
          <CurrencyField
            id='impostoIncorrido'
            label='Impostos Incorridos'
            placeholder='Entre com o valor exemplo (99,99)'
            defaultValue={toNumber(
              state.submittedData?.impostoIncorrido ?? investimento?.impostoIncorrido
            )}
            errors={state.errors?.impostoIncorrido}
          />
        </div>
        <div className='md:w-1/2 sm:mt-4 md:mt-0'>
          <CurrencyField
            id='impostoPrevisto'
            label='Impostos Previstos'
            placeholder='Entre com o valor exemplo (99,99)'
            defaultValue={toNumber(
              state.submittedData?.impostoPrevisto ?? investimento?.impostoPrevisto
            )}
            errors={state.errors?.impostoPrevisto}
          />
        </div>
      </div>

      <div className='flex flex-col md:flex-row md:space-x-4 p-2 md:p-4'>
        <div className='md:w-1/2'>
          <CurrencyField
            id='saldoBruto'
            label='Saldo Bruto'
            placeholder='Entre com o valor exemplo (99,99)'
            defaultValue={toNumber(state.submittedData?.saldoBruto ?? investimento?.saldoBruto)}
            errors={state.errors?.saldoBruto}
          />
        </div>
        <div className='md:w-1/2 sm:mt-4 md:mt-0'>
          <CurrencyField
            id='saldoLiquido'
            label='Saldo Líquido'
            placeholder='Entre com o valor exemplo (99,99)'
            defaultValue={toNumber(state.submittedData?.saldoLiquido ?? investimento?.saldoLiquido)}
            errors={state.errors?.saldoLiquido}
          />
        </div>
      </div>

      <div aria-live='polite' aria-atomic='true'>
        {state.message ? <p className='my-6 text-sm text-red-700'>{state.message}</p> : null}
      </div>
      <div className='mt-6 flex justify-end gap-4'>
        <Link
          href={{
            pathname: '/dashboard/investimentos',
            query: searchParams,
          }}
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancelar
        </Link>
        <Button type='submit'>{buttonText}</Button>
      </div>
    </form>
  );
}
