'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { TagIcon } from '@heroicons/react/24/outline';
import { Route } from 'next';

import type { CategoriaField } from '@/lib/categorias/definitions';

export default function CategoriaFilter({ categorias }: { categorias: CategoriaField[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleFilter(term: string) {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reseta para a primeira página ao filtrar
    if (term) {
      params.set('categoriaId', term);
    } else {
      params.delete('categoriaId');
    }
    replace(`${pathname}?${params.toString()}` as Route);
  }

  return (
    <div className='flex flex-1 flex-col'>
      <label htmlFor='searchCategoria' className='mb-1 text-sm font-medium text-gray-700'>
        Buscar Categorias
      </label>
      <div className='relative flex flex-1 flex-shrink-0'>
        <select
          id='searchCategoria'
          className='peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
          onChange={e => handleFilter(e.target.value)}
          defaultValue={searchParams.get('categoriaId')?.toString() || ''}
        >
          <option value=''>Todas as Categorias</option>
          {categorias.map(categoria => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
        <TagIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
      </div>
    </div>
  );
}
