'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { EnvelopeIcon, UserCircleIcon } from '@heroicons/react/24/outline';

import { BancoForm } from '@/lib/types/banco';
import { BancoField } from '@/lib/types/banco';

import { Button } from '@/components/shared/button';
import { updateBanco, UpdateBancoFormState } from '@/modules/bancos/actions/banco-actions';

export default function EditBancoForm({
  banco,
  bancos,
}: {
  banco: BancoForm;
  bancos: BancoField[];
}) {
  const initialState: UpdateBancoFormState = { message: '', errors: {} };
  const updateBancoWithId = updateBanco.bind(null, banco.id);
  const [state, formAction] = useActionState(updateBancoWithId, initialState);

  return (
    <form action={formAction}>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        {/* Banco Name */}
        <div className='mb-4'>
          <label htmlFor='nome' className='mb-2 block text-sm font-medium'>
            Banco
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='nome'
                name='nome'
                type='text'
                defaultValue={banco.nome}
                placeholder='Digite o nome do banco'
                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                aria-describedby='nome-error'
              />
              <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
            </div>
          </div>

          <div id='nome-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.nome &&
              state.errors.nome.map((error: string) => (
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
          href={{ pathname: '/dashboard/bancos' }}
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancelar
        </Link>
        <Button type='submit'>Atualizar Banco</Button>
      </div>
    </form>
  );
}
