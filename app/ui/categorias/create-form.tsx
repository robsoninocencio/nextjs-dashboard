'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { UserCircleIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/shared/button';

import {
  createCategoria,
  CategoriaFormState,
} from '@/modules/categorias/actions/categoria-actions';

import type { CategoriaField } from '@/types';

// Interface para props do componente
interface FormProps {
  categorias: CategoriaField[];
}

// Botão com estado pendente (loading)
function SubmitCategoriaButton() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' aria-disabled={pending} disabled={pending}>
      {pending ? 'Cadastrando Categoria...' : 'Cadastrar Categoria'}
    </Button>
  );
}

// Componente para erros
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

// Componente para selects
function SelectField({
  id,
  label,
  options,
  defaultValue,
  errors,
  onChange,
}: {
  id: string;
  label: string;
  options: { id: string; name: string }[];
  defaultValue?: string;
  errors?: string[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className='mb-4'>
      <label htmlFor={id} className='mb-2 block text-sm font-medium'>
        {label}
      </label>
      <div className='relative mt-2 rounded-md'>
        <select
          id={id}
          name={id}
          defaultValue={defaultValue ?? ''}
          required
          aria-describedby={`${id}-error`}
          onChange={onChange}
          className={`peer block w-full rounded-md border ${
            errors?.length ? 'border-red-500' : 'border-gray-200'
          } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
        >
          <option value='' disabled>
            Selecione {label.toLowerCase()}
          </option>
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
      </div>
      <div id={`${id}-error`} aria-live='polite' aria-atomic='true'>
        <InputError errors={errors} />
      </div>
    </div>
  );
}

// Formulário principal de criação de fatura
export default function Form({ categorias }: FormProps) {
  const initialState: CategoriaFormState = {
    errors: { nome: [] },
    message: '',
    submittedData: {},
  };

  // console.log("categorias3:", categorias);

  const [state, formAction] = useActionState(createCategoria, initialState);

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
                defaultValue={state.submittedData?.nome}
                aria-describedby='nome-error'
                className={`peer block w-full rounded-md border ${
                  state.errors?.nome?.length ? 'border-red-500' : 'border-gray-200'
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              />
              <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
            </div>
          </div>

          <div id='nome-error' aria-live='polite' aria-atomic='true'>
            <InputError errors={state.errors?.nome} />
          </div>
        </div>
        {/* Categoria Pai */}
        <div className='mb-4 md:mb-0 md:w-1/2'>
          <label htmlFor='parentId' className='mb-2 block text-sm font-medium'>
            Categoria Pai
          </label>
          <div className='relative'>
            <select
              id='parentId'
              name='parentId'
              defaultValue={state.submittedData?.parentId ?? ''}
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
            <InputError errors={state.errors?.parentId} />
          </div>
        </div>
        {/* Mensagem de erro geral */}
        {state.message && (
          <div aria-live='polite' aria-atomic='true' className='mt-6 text-sm text-red-700'>
            {state.message}
          </div>
        )}
      </div>

      <div className='mt-6 flex justify-end gap-4'>
        <Link
          href='/dashboard/categorias'
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancelar
        </Link>
        <SubmitCategoriaButton />
      </div>
    </form>
  );
}
