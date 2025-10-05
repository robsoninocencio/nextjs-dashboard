'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import { InvoiceForm } from '@/lib/types/invoice';
import { ClienteField } from '@/lib/types/cliente';

import { Button } from '@/components/shared/button';

// import { updateInvoice, State } from "@/app/lib/invoices/actions";
import { updateInvoice, InvoiceFormState } from '@/lib/actions/invoice-actions';

export default function EditInvoiceForm({
  invoice,
  clientes,
}: {
  invoice: InvoiceForm;
  clientes: ClienteField[];
}) {
  const initialState: InvoiceFormState = { message: '', errors: {} };
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  const [state, formAction] = useActionState(updateInvoiceWithId, initialState);

  return (
    <form action={formAction}>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        {/* Cliente Name */}
        <div className='mb-4'>
          <label htmlFor='cliente' className='mb-2 block text-sm font-medium'>
            Choose cliente
          </label>
          <div className='relative'>
            <select
              id='cliente'
              name='clienteId'
              // className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              className={`peer block w-full cursor-pointer rounded-md border ${
                state.errors?.clienteId?.length ? 'border-red-500' : 'border-gray-200'
              } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              defaultValue={invoice.cliente_id}
              aria-describedby='clienteId-error'
            >
              <option value='' disabled>
                Select a cliente
              </option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
          </div>

          <div id='clienteId-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.clienteId &&
              state.errors.clienteId.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Invoice Amount */}
        <div className='mb-4'>
          <label htmlFor='amount' className='mb-2 block text-sm font-medium'>
            Choose an amount
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='amount'
                name='amount'
                type='number'
                // defaultValue={invoice.amount}
                defaultValue={String(invoice.amount)}
                step='0.01'
                placeholder='Enter USD amount'
                // className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                className={`peer block w-full rounded-md border ${
                  state.errors?.amount?.length ? 'border-red-500' : 'border-gray-200'
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                aria-describedby='amount-error'
              />
              <CurrencyDollarIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>

          <div id='amount-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className='mb-2 block text-sm font-medium'>Set the invoice status</legend>
          <div className='rounded-md border border-gray-200 bg-white px-[14px] py-3'>
            <div className='flex gap-4'>
              <div className='flex items-center'>
                <input
                  id='pendente'
                  name='status'
                  type='radio'
                  value='pendente'
                  defaultChecked={invoice.status === 'pendente'}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2'
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
                  defaultChecked={invoice.status === 'pago'}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2'
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
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>

        <div aria-live='polite' aria-atomic='true'>
          {state.message ? <p className='my-6 text-sm text-red-700'>{state.message}</p> : null}
        </div>
      </div>
      <div className='mt-6 flex justify-end gap-4'>
        <Link
          href='/dashboard/invoices'
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancelar
        </Link>
        <Button type='submit'>Atualizar Fatura</Button>
      </div>
    </form>
  );
}
