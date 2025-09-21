'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';

export default function SearchBanco({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (term) {
      params.set('queryBanco', term);
    } else {
      params.delete('queryBanco');
    }

    const queryString = params.toString();
    const href = `${pathname}${queryString ? `?${queryString}` : ''}`;
    replace(href as Parameters<typeof replace>[0]);
  }, 300);

  return (
    <div className='flex flex-1 flex-col'>
      <label htmlFor='searchBanco' className='mb-1 text-sm font-medium text-gray-700'>
        Buscar Banco
      </label>
      <div className='relative flex flex-1 flex-shrink-0'>
        <Input
          id='searchBanco'
          className='peer pl-10'
          placeholder={placeholder}
          onChange={e => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get('queryBanco')?.toString()}
        />
        <MagnifyingGlassIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
      </div>
    </div>
  );
}
