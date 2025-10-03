'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { TagIcon as TagIconOutline } from '@heroicons/react/24/outline';
import { FileText, Check, ChevronsUpDown, TagIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

import { createAtivo, AtivoFormState } from '@/lib/actions/ativo-actions';

import { TipoField } from '@/lib/types/tipo';
import type { CategoriaField } from '@/lib/types/categoria';
import { cn } from '@/lib/utils';

// Botão com estado pendente (loading)
function SubmitAtivoButton() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' aria-disabled={pending} disabled={pending}>
      {pending ? 'Cadastrando Ativo...' : 'Cadastrar Ativo'}
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
export default function Form({
  tipos,
  categorias,
}: {
  tipos: TipoField[];
  categorias: CategoriaField[];
}) {
  const initialState: AtivoFormState = {
    errors: {},
    message: '',
    submittedData: {},
  };

  const [state, formAction] = useActionState(createAtivo, initialState);

  // Estado local para o multi-select de categorias
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>(
    state.submittedData?.categoriaIds ?? []
  );

  const toggleCategoria = (id: string) => {
    setSelectedCategorias(prev => (prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]));
  };
  return (
    <form action={formAction}>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        {/* Ativo Name */}
        <div className='mb-4'>
          <label htmlFor='nome' className='mb-2 block text-sm font-medium'>
            Ativo
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='nome'
                name='nome'
                type='text'
                placeholder='Nome do ativo'
                defaultValue={state.submittedData?.nome}
                aria-describedby='nome-error'
                className={`peer block w-full rounded-md border ${
                  state.errors?.nome?.length ? 'border-red-500' : 'border-gray-200'
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              />
              <FileText className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
            </div>
            <div id='nome-error' aria-live='polite' aria-atomic='true'>
              <InputError errors={state.errors?.nome} />
            </div>
          </div>
        </div>

        {/* Tipo Nome */}
        <div className='mb-4'>
          <label htmlFor='tipoId' className='mb-2 block text-sm font-medium'>
            Tipo
          </label>
          <div className='relative'>
            <select
              id='tipoId'
              name='tipoId'
              defaultValue={state.submittedData?.tipoId ?? ''}
              aria-describedby='tipoId-error'
              className={`peer block w-full cursor-pointer rounded-md border ${
                state.errors?.tipoId?.length ? 'border-red-500' : 'border-gray-200'
              } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
            >
              <option value='' disabled>
                Selecione o tipo
              </option>
              {tipos.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
            <TagIconOutline className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
          </div>
          {/* <p>{state.submittedData?.tipoId}</p> */}

          <div id='tipoId-error' aria-live='polite' aria-atomic='true'>
            <InputError errors={state.errors?.tipoId} />
          </div>
        </div>

        {/* Categoria Nome */}
        <div className='mb-4' aria-describedby='categoriaIds-error'>
          <label className='mb-2 block text-sm font-medium'>Categorias</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                className={cn(
                  'w-full justify-between font-normal',
                  state.errors?.categoriaIds?.length ? 'border-red-500' : ''
                )}
              >
                <div className='flex items-center gap-2'>
                  <TagIcon className='h-4 w-4 text-gray-500' />
                  {selectedCategorias.length > 0
                    ? `${selectedCategorias.length} selecionada(s)`
                    : 'Selecione as categorias'}
                </div>
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
              <Command>
                <CommandList>
                  <CommandGroup>
                    {categorias.map(categoria => (
                      <CommandItem
                        key={categoria.id}
                        value={categoria.id}
                        onSelect={() => toggleCategoria(categoria.id)}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedCategorias.includes(categoria.id) ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {categoria.nome}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div id='categoriaIds-error' aria-live='polite' aria-atomic='true'>
            <InputError errors={state.errors?.categoriaIds} />
          </div>
        </div>

        {/* Hidden inputs para enviar no form */}
        {selectedCategorias.map(id => (
          <input key={id} type='hidden' name='categoriaIds' value={id} />
        ))}

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
          href='/dashboard/ativos'
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancelar
        </Link>
        <SubmitAtivoButton />
      </div>
    </form>
  );
}
