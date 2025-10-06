'use client';

import { useActionState } from 'react';
import { useState } from 'react';

import Link from 'next/link';
import { TagIcon, FileText, Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Ativo } from '@/modules/ativos/types/ativo';
import type { TipoField, CategoriaField } from '@/types';

import { updateAtivo, AtivoFormState } from '@/modules/ativos/actions/ativo-actions';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

function FieldErrors({ errors }: { errors?: string[] }) {
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

export default function EditAtivoForm({
  ativo,
  tipos,
  categorias,
}: {
  ativo: Ativo;
  tipos: TipoField[];
  categorias: CategoriaField[];
}) {
  const initialState: AtivoFormState = { message: '', errors: {} };
  const updateAtivoWithId = updateAtivo.bind(null, ativo.id);

  const [state, formAction] = useActionState(updateAtivoWithId, initialState);

  // Garantir que ativo.tipoId não seja null ou undefined para defaultValue
  const tipoIdValue = ativo.tipoId ?? '';
  const categoriaIdsValue = ativo.ativo_categorias?.map(ac => ac.categoriaId) ?? []; // O `ativo` agora inclui as categorias

  // Estado local para o multi-select
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>(categoriaIdsValue);

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
                defaultValue={ativo.nome}
                placeholder='Digite o nome do ativo'
                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                aria-describedby='nome-error'
              />
              <FileText className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
            </div>
          </div>

          <div id='nome-error' aria-live='polite' aria-atomic='true'>
            <FieldErrors errors={state.errors?.nome} />
          </div>
        </div>

        {/* Tipo Nome */}
        <div className='mb-4'>
          <label htmlFor='tipo' className='mb-2 block text-sm font-medium'>
            Escolha o tipo
          </label>
          <div className='relative'>
            <select
              id='tipo'
              name='tipoId'
              className={`peer block w-full cursor-pointer rounded-md border ${
                state.errors?.tipoId?.length ? 'border-red-500' : 'border-gray-200'
              } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              defaultValue={tipoIdValue}
              aria-describedby='tipoId-error'
            >
              <option value='' disabled>
                Select a tipo
              </option>
              {tipos.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
            <TagIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
          </div>

          <div id='tipoId-error' aria-live='polite' aria-atomic='true'>
            <FieldErrors errors={state.errors?.tipoId} />
          </div>
        </div>

        {/* Categoria Nome */}
        {/* Categorias - MultiSelect */}
        <div className='mb-4'>
          <label className='mb-2 block text-sm font-medium'>Categorias</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                className={cn(
                  'w-full justify-between',
                  state.errors?.categoriaIds?.length ? 'border-red-500' : ''
                )}
              >
                {selectedCategorias.length > 0
                  ? `${selectedCategorias.length} selecionada(s)`
                  : 'Selecione categorias'}
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
                          className={`mr-2 h-4 w-4 ${
                            selectedCategorias.includes(categoria.id) ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        {categoria.nome}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Hidden inputs para enviar no form */}
          {selectedCategorias.map(id => (
            <input key={id} type='hidden' name='categoriaIds' value={id} />
          ))}

          <div id='categoriaIds-error' aria-live='polite' aria-atomic='true'>
            <FieldErrors errors={state.errors?.categoriaIds} />
          </div>
        </div>

        {/* Mensagens Geral de Erro */}
        <div aria-live='polite' aria-atomic='true'>
          {state.message ? <p className='my-6 text-sm text-red-700'>{state.message}</p> : null}
        </div>
      </div>
      <div className='mt-6 flex justify-end gap-4'>
        <Link
          href='/dashboard/ativos'
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancelar
        </Link>
        <Button type='submit'>Atualizar Ativo</Button>
      </div>
    </form>
  );
}
