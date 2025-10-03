import { TrashIcon } from '@heroicons/react/24/outline';

import { deleteCategoria } from '@/lib/actions/categoria-actions';

export function ButtonLinkDelete({ id }: { id: string }) {
  const Categoria = deleteCategoria.bind(null, id);

  return (
    <form action={Categoria}>
      <button type='submit' className='rounded-md border p-2 hover:bg-gray-100'>
        <span className='sr-only'>Delete</span>
        <TrashIcon className='w-5' />
      </button>
    </form>
  );
}
