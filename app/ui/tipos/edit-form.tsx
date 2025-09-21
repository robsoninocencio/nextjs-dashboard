'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { EnvelopeIcon, UserCircleIcon } from '@heroicons/react/24/outline';

import { TipoForm } from '@/lib/tipos/definitions';
import { TipoField } from '@/lib/tipos/definitions';

import { Button } from '@/app/ui/shared/button';
import { updateTipo, UpdateTipoFormState } from '@/lib/tipos/actions';

export default function EditTipoForm({ tipo, tipos }: { tipo: TipoForm; tipos: TipoField[] }) {
  const initialState: UpdateTipoFormState = { message: '', errors: {} };
  const updateTipoWithId = updateTipo.bind(null, tipo.id);
  const [state, formAction] = useActionState(updateTipoWithId, initialState);

  return (
    <form action={formAction}>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        {/* Tipo Name */}
        <div className='mb-4'>
          <label htmlFor='nome' className='mb-2 block text-sm font-medium'>
            Tipo
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='nome'
                name='nome'
                type='text'
                defaultValue={tipo.nome}
                placeholder='Digite o nome do tipo'
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
          href={{ pathname: '/dashboard/tipos' }}
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancelar
        </Link>
        <Button type='submit'>Atualizar Tipo</Button>
      </div>
    </form>
  );
}
