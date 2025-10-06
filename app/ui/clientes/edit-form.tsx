'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { CheckIcon, ClockIcon, EnvelopeIcon, UserCircleIcon } from '@heroicons/react/24/outline';

import type { Cliente, ClienteField } from '@/types';

import { Button } from '@/components/shared/button';
import { updateCliente, UpdateClienteFormState } from '@/modules/clientes/actions/cliente-actions';

export default function EditClienteForm({
  cliente,
  clientes,
}: {
  cliente: Pick<Cliente, 'id' | 'name' | 'email'>;
  clientes: ClienteField[];
}) {
  const initialState: UpdateClienteFormState = { message: '', errors: {} };
  const updateClienteWithId = updateCliente.bind(null, cliente.id);
  const [state, formAction] = useActionState(updateClienteWithId, initialState);

  return (
    <form action={formAction}>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        {/* Cliente Name */}
        <div className='mb-4'>
          <label htmlFor='name' className='mb-2 block text-sm font-medium'>
            Cliente
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='name'
                name='name'
                type='text'
                defaultValue={cliente.name}
                placeholder='Digite o nome do cliente'
                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                aria-describedby='name-error'
              />
              <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
            </div>
          </div>

          <div id='name-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Invoice Email */}
        <div className='mb-4'>
          <label htmlFor='email' className='mb-2 block text-sm font-medium'>
            Email
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='email'
                name='email'
                type='email'
                defaultValue={cliente.email}
                placeholder='Digite o email'
                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                aria-describedby='email-error'
              />
              <EnvelopeIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
            </div>
          </div>

          <div id='email-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live='polite' aria-atomic='true'>
          {state.message ? <p className='my-6 text-sm text-red-700'>{state.message}</p> : null}
        </div>
      </div>
      <div className='mt-6 flex justify-end gap-4'>
        <Link
          href={{ pathname: '/dashboard/clientes' }}
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancelar
        </Link>
        <Button type='submit'>Atualizar Cliente</Button>
      </div>
    </form>
  );
}
