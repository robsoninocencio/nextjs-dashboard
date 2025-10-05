'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/shared/button';

import { CategoriaForm } from '@/lib/types/categoria';

import { CategoriaField } from '@/lib/types/categoria';

// import { updateCategoria, State } from "@/app/lib/categorias/actions";
import { updateCategoria, CategoriaFormState } from '@/lib/actions/categoria-actions';

export default function EditCategoriaForm({
  categoria,
  categorias,
}: {
  categoria: CategoriaForm;
  categorias: CategoriaField[];
}) {
  const initialState: CategoriaFormState = { message: '', errors: {} };
  const updateCategoriaWithId = updateCategoria.bind(null, categoria.id);
  const [state, formAction] = useActionState(updateCategoriaWithId, initialState);

  return (
    <form action={formAction}>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        {/* Categoria Nome */}
        <div className='mb-4'>
          <label htmlFor='nome' className='mb-2 block text-sm font-medium'>
            Categoria
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='nome'
                name='nome'
                type='text'
                placeholder='Informe o nome da categoria'
                defaultValue={categoria.nome}
                aria-describedby='nome-error'
                className={`peer block w-full rounded-md border ${
                  state.errors?.nome?.length ? 'border-red-500' : 'border-gray-200'
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              />
              <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
            </div>
          </div>

          <div id='ano-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.nome &&
              state.errors.nome.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Categoria Pai */}
        <div className='mb-4'>
          <label htmlFor='parentId' className='mb-2 block text-sm font-medium'>
            Categoria Pai
          </label>
          <div className='relative'>
            <select
              id='parentId'
              name='parentId'
              defaultValue={categoria.parentId || ''}
              aria-describedby='parentId-error'
              className={`peer block w-full cursor-pointer rounded-md border ${
                state.errors?.parentId?.length ? 'border-red-500' : 'border-gray-200'
              } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
            >
              <option value=''>Nenhuma</option>
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
            <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
          </div>

          <div id='parentId-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.parentId &&
              state.errors.parentId.map((error: string) => (
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
          href='/dashboard/categorias'
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancelar
        </Link>
        <Button type='submit'>Atualizar Categoria</Button>
      </div>
    </form>
  );
}
