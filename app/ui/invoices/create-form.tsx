'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/components/shared/button';

import { createInvoice, InvoiceFormState } from '@/lib/actions/invoice-actions';

import { ClienteField } from '@/lib/types/cliente';

// Botão com estado pendente (loading)
function SubmitInvoiceButton() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' aria-disabled={pending} disabled={pending}>
      {pending ? 'Cadastrando Fatura...' : 'Cadastrar Fatura'}
    </Button>
  );
}

function InputError({ errors }: { errors?: string[] }) {
  if (!errors) return null;
  return (
    <>
      {errors.map(error => (
        <p key={error} className='mt-2 text-sm text-red-500'>
          {error}
        </p>
      ))}
    </>
  );
}

// Formulário principal de criação de fatura
export default function Form({ clientes }: { clientes: ClienteField[] }) {
  const initialState: InvoiceFormState = {
    errors: {},
    message: '',
    submittedData: {},
  };

  const [state, formAction] = useActionState(createInvoice, initialState);

  return (
    <form action={formAction}>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        {/* Cliente Name */}
        <div className='mb-4'>
          <label htmlFor='clienteId' className='mb-2 block text-sm font-medium'>
            Cliente
          </label>
          <div className='relative'>
            <select
              id='clienteId'
              name='clienteId'
              defaultValue={state.submittedData?.clienteId ?? ''}
              aria-describedby='clienteId-error'
              className={`peer block w-full cursor-pointer rounded-md border ${
                state.errors?.clienteId?.length ? 'border-red-500' : 'border-gray-200'
              } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
            >
              <option value='' disabled>
                Selecione o cliente
              </option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
          </div>
          {/* <p>{state.submittedData?.clienteId}</p> */}

          <div id='clienteId-error' aria-live='polite' aria-atomic='true'>
            <InputError errors={state.errors?.clienteId} />
          </div>
        </div>

        {/* Invoice Amount */}
        <div className='mb-4'>
          <label htmlFor='amount' className='mb-2 block text-sm font-medium'>
            Valor
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='amount'
                name='amount'
                type='number'
                step='0.01'
                placeholder='Entre com o valor exemplo (99,99)'
                defaultValue={state.submittedData?.amount}
                aria-describedby='amount-error'
                className={`peer block w-full rounded-md border ${
                  state.errors?.amount?.length ? 'border-red-500' : 'border-gray-200'
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              />
              <CurrencyDollarIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>

          <div id='amount-error' aria-live='polite' aria-atomic='true'>
            <InputError errors={state.errors?.amount} />
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className='mb-2 block text-sm font-medium'>Escolha o status da fatura</legend>
          <div className='rounded-md border border-gray-200 bg-white px-[14px] py-3'>
            <div className='flex gap-4'>
              <div className='flex items-center'>
                <input
                  id='pendente'
                  name='status'
                  type='radio'
                  value='pendente'
                  defaultChecked={state.submittedData?.status === 'pendente'}
                  className={`text-white-600 h-4 w-4 cursor-pointer border ${
                    state.errors?.status?.length ? 'border-red-500' : 'border-gray-300'
                  } bg-gray-100 focus:ring-2`}
                  aria-describedby='status-error'
                />
                <label
                  htmlFor='pendente'
                  className='ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600'
                >
                  Pendente <ClockIcon className='h-4 w-4' />
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='pago'
                  name='status'
                  type='radio'
                  value='pago'
                  defaultChecked={state.submittedData?.status === 'pago'}
                  className={`h-4 w-4 cursor-pointer border ${
                    state.errors?.status?.length ? 'border-red-500' : 'border-gray-300'
                  } bg-gray-100 text-gray-600 focus:ring-2`}
                  aria-describedby='status-error'
                />
                <label
                  htmlFor='pago'
                  className='ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white'
                >
                  Pago <CheckIcon className='h-4 w-4' />
                </label>
              </div>
            </div>
          </div>

          <div id='status-error' aria-live='polite' aria-atomic='true'>
            <InputError errors={state.errors?.status} />
          </div>
        </fieldset>

        {/* Mensagem de erro geral */}
        {state.message && (
          <div aria-live='polite' aria-atomic='true' className='mt-6 text-sm text-red-700'>
            {state.message}
          </div>
        )}
      </div>

      {/* Botões */}
      <div className='mt-6 flex justify-end gap-4'>
        <Link
          href='/dashboard/invoices'
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancelar
        </Link>
        <SubmitInvoiceButton />
      </div>
    </form>
  );
}
